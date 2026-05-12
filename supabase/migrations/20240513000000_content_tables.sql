-- Migration: add_content_tables
-- Created: 2026-05-12

-- 1. Vocabulary Topics
create table if not exists public.vocabulary_topics (
  id text primary key,
  title text not null,
  created_at timestamp with time zone default now()
);

-- 2. Vocabulary Words
create table if not exists public.vocabulary (
  id uuid default gen_random_uuid() primary key,
  word text not null,
  definition text not null,
  trans text, -- Translation for local support
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  audio_url text,
  mastery_level int default 0,
  examples text[],
  synonyms text[],
  added_date timestamp with time zone default now(),
  last_reviewed timestamp with time zone,
  review_count int default 0,
  topic_id text references public.vocabulary_topics(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade
);

-- 3. Articles
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  html_content text not null,
  category text check (category in ('reading', 'general')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  upload_date timestamp with time zone default now(),
  tags text[]
);

-- 4. Listening Resources
create table if not exists public.listening (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  youtube_url text not null,
  category text check (category in ('academic', 'general', 'podcast', 'lecture')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  duration text,
  upload_date timestamp with time zone default now(),
  notes text
);

-- 5. User Notes
create table if not exists public.notes (
  id uuid default gen_random_uuid() primary key,
  resource_id text not null,
  resource_type text check (resource_type in ('article', 'listening', 'vocabulary')),
  content text not null,
  timestamp timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

-- 6. Writing Tasks
create table if not exists public.writing_tasks (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  task1_question text,
  task1_image_url text,
  task2_question text,
  upload_date timestamp with time zone default now()
);

-- 7. Writing Submissions
create table if not exists public.writing_submissions (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.writing_tasks(id) on delete set null,
  task1_content text,
  task1_word_count int,
  task2_content text,
  task2_word_count int,
  total_time_spent int,
  submitted_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade,
  ai_feedback jsonb
);

-- 8. Writing Drafts
create table if not exists public.writing_drafts (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.writing_tasks(id) on delete set null,
  content text,
  word_count int,
  time_spent int,
  last_saved timestamp with time zone default now(),
  submitted boolean default false,
  user_id uuid references auth.users(id) on delete cascade
);

-- 9. Reading Passages
create table if not exists public.reading_passages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  html_content text not null,
  upload_date timestamp with time zone default now(),
  image_url text
);

-- 10. Listening Tests
create table if not exists public.listening_tests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  html_content text not null,
  upload_date timestamp with time zone default now(),
  image_url text
);

-- 11. Speaking Tests
create table if not exists public.speaking_tests (
  id text primary key,
  title text not null,
  description text,
  part1_topics jsonb,
  part2 jsonb,
  part3 jsonb,
  created_at timestamp with time zone default now()
);

-- RLS Enablement
alter table public.vocabulary_topics enable row level security;
alter table public.vocabulary enable row level security;
alter table public.articles enable row level security;
alter table public.listening enable row level security;
alter table public.notes enable row level security;
alter table public.writing_tasks enable row level security;
alter table public.writing_submissions enable row level security;
alter table public.writing_drafts enable row level security;
alter table public.reading_passages enable row level security;
alter table public.listening_tests enable row level security;
alter table public.speaking_tests enable row level security;

-- Policies
create policy "Everyone can view content" on public.vocabulary_topics for select using (true);
create policy "Everyone can view articles" on public.articles for select using (true);
create policy "Everyone can view listening" on public.listening for select using (true);
create policy "Everyone can view writing_tasks" on public.writing_tasks for select using (true);
create policy "Everyone can view reading_passages" on public.reading_passages for select using (true);
create policy "Everyone can view listening_tests" on public.listening_tests for select using (true);
create policy "Everyone can view speaking_tests" on public.speaking_tests for select using (true);

create policy "Users can manage own vocabulary" on public.vocabulary for all using (auth.uid() = user_id);
create policy "Users can manage own notes" on public.notes for all using (auth.uid() = user_id);
create policy "Users can manage own writing_submissions" on public.writing_submissions for all using (auth.uid() = user_id);
create policy "Users can manage own writing_drafts" on public.writing_drafts for all using (auth.uid() = user_id);
