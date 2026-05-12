-- ==========================================
-- 1. EXTENSIONS & FUNCTIONS
-- ==========================================
create extension if not exists "uuid-ossp";

-- Updated_at trigger funksiyasi
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ==========================================
-- 2. TABLES DEFINITION
-- ==========================================

-- [USER_PROFILES] - Foydalanuvchi asosiy ma'lumotlari
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  first_name text,
  last_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'teacher', 'admin')),
  target_score float check (target_score >= 0 and target_score <= 9),
  target_date date,
  bio text,
  is_vip boolean default false,
  vip_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- [USER_COINS] - Foydalanuvchi balansini saqlash
create table if not exists public.user_coins (
  user_id uuid references public.user_profiles(id) on delete cascade not null primary key,
  balance int default 0 check (balance >= 0),
  total_earned int default 0,
  total_spent int default 0,
  updated_at timestamp with time zone default now()
);

-- [COIN_TRANSACTIONS] - Balans o'zgarishlari tarixi
create table if not exists public.coin_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  amount int not null, -- musbat (kirim) yoki manfiy (chiqim)
  type text not null check (type in ('purchase', 'bonus', 'referral', 'speaking_test', 'writing_check', 'refund')),
  description text,
  created_at timestamp with time zone default now()
);

-- [USER_SUBSCRIPTIONS] - Obunalar (Premium planlar)
create table if not exists public.user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  plan_type text not null check (plan_type in ('basic', 'standard', 'premium')),
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  starts_at timestamp with time zone default now(),
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- [PAYMENT_REQUESTS] - To'lov so'rovlari (Click, Payme, etc.)
create table if not exists public.payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null,
  amount decimal(12, 2) not null,
  currency text default 'UZS',
  provider text check (provider in ('click', 'payme', 'uzum', 'admin')),
  status text default 'pending' check (status in ('pending', 'completed', 'failed')),
  external_tx_id text, -- To'lov tizimidagi ID
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- [REFERRAL_LINKS] - Foydalanuvchi referral linklari
create table if not exists public.referral_links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.user_profiles(id) on delete cascade not null unique,
  code text unique not null,
  clicks_count int default 0,
  created_at timestamp with time zone default now()
);

-- [REFERRAL_HISTORY] - Kim kimni taklif qildi
create table if not exists public.referral_history (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.user_profiles(id) on delete cascade not null, -- Taklif qilgan
  referee_id uuid references public.user_profiles(id) on delete cascade not null unique, -- Taklif qilingan (yangi user)
  bonus_given boolean default false,
  created_at timestamp with time zone default now()
);

-- ==========================================
-- 3. AUTOMATION (TRIGGERS & FUNCTIONS)
-- ==========================================

-- Yangi user signup bo'lganda avtomatik profile va coin yaratish
create or replace function public.handle_new_user_signup()
returns trigger as $$
declare
  referral_code text;
begin
  -- 1. Profile yaratish
  insert into public.user_profiles (id, username, first_name, last_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  -- 2. User Coins yaratish (150 bonus bilan)
  insert into public.user_coins (user_id, balance, total_earned)
  values (new.id, 150, 150);

  -- 3. Coin transaction tarixiga bonusni yozish
  insert into public.coin_transactions (user_id, amount, type, description)
  values (new.id, 150, 'bonus', 'Signup welcome bonus');

  -- 4. Referral link yaratish (tasodifiy kod bilan)
  referral_code := lower(substring(md5(random()::text) from 1 for 8));
  insert into public.referral_links (user_id, code)
  values (new.id, referral_code);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger signup (faqat mavjud bo'lmasa yaratamiz)
do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user_signup();
  end if;
end $$;

-- Coin qo'shish va tarixga yozish funksiyasi
create or replace function public.add_coins_and_log(
  p_user_id uuid,
  p_amount int,
  p_type text,
  p_description text
)
returns void as $$
begin
  -- 1. Balansni yangilash
  update public.user_coins
  set 
    balance = balance + p_amount,
    total_earned = total_earned + p_amount,
    updated_at = now()
  where user_id = p_user_id;

  -- 2. Transaction tarixiga yozish
  insert into public.coin_transactions (user_id, amount, type, description)
  values (p_user_id, p_amount, p_type, p_description);
end;
$$ language plpgsql security definer;

-- Coin ayirish va tarixga yozish funksiyasi
create or replace function public.deduct_coins_and_log(
  p_user_id uuid,
  p_amount int,
  p_type text,
  p_description text
)
returns void as $$
begin
  -- 1. Balansni tekshirish
  if not exists (
    select 1 from public.user_coins 
    where user_id = p_user_id and balance >= p_amount
  ) then
    raise exception 'Insufficient balance';
  end if;

  -- 2. Balansni yangilash
  update public.user_coins
  set 
    balance = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = now()
  where user_id = p_user_id;

  -- 3. Transaction tarixiga yozish
  insert into public.coin_transactions (user_id, amount, type, description)
  values (p_user_id, -p_amount, p_type, p_description);
end;
$$ language plpgsql security definer;

-- Updated_at triggerlarini bog'lash
create or replace trigger set_profiles_updated_at before update on public.user_profiles for each row execute procedure handle_updated_at();
create or replace trigger set_coins_updated_at before update on public.user_coins for each row execute procedure handle_updated_at();

-- ==========================================
-- 4. RLS POLICIES (SECURITY)
-- ==========================================

-- Barcha jadvalarda RLS yoqish
alter table public.user_profiles enable row level security;
alter table public.user_coins enable row level security;
alter table public.coin_transactions enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.payment_requests enable row level security;
alter table public.referral_links enable row level security;
alter table public.referral_history enable row level security;

-- user_profiles policies
drop policy if exists "Public profiles are viewable by everyone" on public.user_profiles;
create policy "Public profiles are viewable by everyone" on public.user_profiles for select using (true);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile" on public.user_profiles for insert with check (true);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);

drop policy if exists "Users can upsert own profile" on public.user_profiles;
create policy "Users can upsert own profile" on public.user_profiles for all using (auth.uid() = id);

-- user_coins policies
drop policy if exists "Users can view own coins" on public.user_coins;
create policy "Users can view own coins" on public.user_coins for select using (auth.uid() = user_id);

-- coin_transactions policies
drop policy if exists "Users can view own transactions" on public.coin_transactions;
create policy "Users can view own transactions" on public.coin_transactions for select using (auth.uid() = user_id);

-- referral_links policies
drop policy if exists "Users can view own referral link" on public.referral_links;
create policy "Users can view own referral link" on public.referral_links for select using (auth.uid() = user_id);

-- ==========================================
-- 5. INDEXES FOR PERFORMANCE
-- ==========================================
create index if not exists idx_user_profiles_username on public.user_profiles(username);
create index if not exists idx_coin_transactions_user_id on public.coin_transactions(user_id);
create index if not exists idx_referral_history_referrer on public.referral_history(referrer_id);
create index if not exists idx_payment_requests_status on public.payment_requests(status);
