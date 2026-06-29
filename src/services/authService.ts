// Auth service using backend API (VITE_API_BASE_URL) instead of Supabase

export interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserProfile {
  id?: string | number;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  picture?: string;
  role?: string;
  is_vip?: boolean;
  vip_expires_at?: string | null;
  email_verified?: boolean;
  date_joined?: string;
  last_login?: string | null;
}

export interface ProfileData {
  id: string | number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_vip: boolean;
  vip_expires_at: string | null;
  email_verified: boolean;
  date_joined: string;
  last_login: string | null;
  picture?: string;
  target_score?: number;
  target_date?: string;
  email_notifications?: boolean;
  two_factor_enabled?: boolean;
  skills?: { listening: number; reading: number; writing: number; speaking: number; };
  weak_skills?: string[];
  strong_skills?: string[];
  daily_study_hours?: number;
  vocab_learned_count?: number;
  writing_evaluation_count?: number;
  speaking_mock_count?: number;
  reading_attempt_count?: number;
  listening_attempt_count?: number;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  role?: string;
  user?: UserProfile;
  message?: string;
  tokens?: { access: string; refresh: string; };
}

const API = () => import.meta.env.VITE_API_BASE_URL || 'https://api.ieltsfy.uz';

const apiPost = async (path: string, body: unknown) => {
  const res = await fetch(`${API()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || 'An error occurred');
  }
  return res.json();
};

export const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  try { return await apiPost('/accounts/google/', { id_token: idToken }); }
  catch (e: unknown) { throw new Error(e instanceof Error ? e.message : 'Google autentifikatsiya xatosi.'); }
};

export const registerUser = async (d: RegisterData): Promise<AuthResponse> => {
  try { return await apiPost('/accounts/register/', d); }
  catch (e: unknown) { throw new Error(e instanceof Error ? e.message : "Ro'yxatdan o'tishda xatolik"); }
};

export const loginUser = async (d: LoginData): Promise<AuthResponse> => {
  try { return await apiPost('/token/', d); }
  catch (e: unknown) { throw new Error(e instanceof Error ? e.message : 'Kirishda xatolik'); }
};

export const saveAuthTokens = (a: string, r: string) => {
  localStorage.setItem('access_token', a);
  localStorage.setItem('refresh_token', r);
};

export const getAccessToken = (): string | null => localStorage.getItem('access_token');
export const getRefreshToken = (): string | null => localStorage.getItem('refresh_token');

export const clearAuthTokens = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
};

export const saveUserProfile = (u: UserProfile) => localStorage.setItem('user_profile', JSON.stringify(u));
export const getUserProfile = (): UserProfile | null => {
  const p = localStorage.getItem('user_profile');
  return p ? JSON.parse(p) : null;
};

export const isAuthenticated = (): boolean => !!getAccessToken();

export const authenticatedFetch = async (url: string, opts: RequestInit = {}): Promise<Response> => {
  const token = getAccessToken();
  if (!token) throw new Error('Foydalanuvchi tizimga kirmagan');

  const full = url.startsWith('http') ? url : `${API()}${url}`;
  const doFetch = (t: string) => {
    const headers = new Headers(opts.headers);
    headers.set('Authorization', `Bearer ${t}`);
    // Don't force JSON content-type on FormData (breaks multipart boundary)
    if (!(opts.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return fetch(full, { ...opts, headers });
  };

  let res = await doFetch(token);

  // Access token expired -> try one silent refresh, then retry once.
  if (res.status === 401) {
    try {
      const fresh = await refreshAccessToken();
      res = await doFetch(fresh);
    } catch {
      await clearAuthTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
      throw new Error('Sessiya tugadi. Iltimos qayta kiring.');
    }
  }

  return res;
};

export const refreshAccessToken = async (): Promise<string> => {
  const rt = getRefreshToken();
  if (!rt) throw new Error('Refresh token not found');
  try {
    const data = await apiPost('/token/refresh/', { refresh: rt });
    const na = data.access || data.access_token;
    const nr = data.refresh || data.refresh_token;
    if (na) { saveAuthTokens(na, nr || rt); return na; }
    throw new Error('Token refresh failed');
  } catch { await clearAuthTokens(); throw new Error('Token refresh failed'); }
};

export const fetchUserProfile = async (): Promise<ProfileData> => {
  const r = await authenticatedFetch('/accounts/profile/');
  if (!r.ok) throw new Error("Profil ma'lumotlarini yuklashda xatolik");
  const result = await r.json();
  return (result.data?.user_info || result) as ProfileData;
};

export const updateUserProfile = async (d: Partial<ProfileData>): Promise<ProfileData> => {
  const r = await authenticatedFetch('/accounts/profile/', { method: 'PATCH', body: JSON.stringify(d) });
  if (!r.ok) throw new Error('Failed to update profile');
  return r.json() as Promise<ProfileData>;
};

export const changePassword = async (newPassword: string): Promise<{ message: string }> => {
  const r = await authenticatedFetch('/accounts/change-password/', {
    method: 'POST', body: JSON.stringify({ new_password: newPassword }),
  });
  if (!r.ok) throw new Error("Failed to change password");
  return { message: "Password changed successfully" };
};
