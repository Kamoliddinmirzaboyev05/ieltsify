import { supabase } from '../lib/supabase';

export interface GoogleAuthData {
  id_token: string;
}

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
  skills?: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user_info: ProfileData;
    email_verified: boolean;
    created_at: string;
  };
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  access?: string;
  refresh?: string;
  role?: string;
  user?: UserProfile;
  message?: string;
  tokens?: {
    access: string;
    refresh: string;
  };
}

// Google OAuth Login/Register
export const googleAuth = async (idToken: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;

    const userProfile: UserProfile = {
      id: data.user?.id,
      email: data.user?.email || '',
      name: data.user?.user_metadata?.full_name,
      picture: data.user?.user_metadata?.avatar_url,
      email_verified: !!data.user?.email_confirmed_at,
    };

    return {
      access: data.session?.access_token,
      refresh: data.session?.refresh_token,
      user: userProfile,
    };
  } catch (error: any) {
    console.error('❌ Google Auth Error:', error);
    throw new Error(error.message || 'Google autentifikatsiya xatosi.');
  }
};

// Email/Password Register
export const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          username: registerData.username,
          first_name: registerData.first_name,
          last_name: registerData.last_name,
          full_name: `${registerData.first_name} ${registerData.last_name}`,
        },
      },
    });

    if (error) throw error;

    // After signup, we might need to create a profile in a 'profiles' table
    // But for now, we'll return the basic user info
    const userProfile: UserProfile = {
      id: data.user?.id,
      email: data.user?.email || '',
      username: registerData.username,
      first_name: registerData.first_name,
      last_name: registerData.last_name,
      email_verified: !!data.user?.email_confirmed_at,
    };

    return {
      access: data.session?.access_token,
      refresh: data.session?.refresh_token,
      user: userProfile,
    };
  } catch (error: any) {
    console.error('❌ Register Error:', error);
    throw new Error(error.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
  }
};

// Email/Password Login
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.username, // Assuming username is email for Supabase login
      password: loginData.password,
    });

    if (error) throw error;

    const userProfile: UserProfile = {
      id: data.user?.id,
      email: data.user?.email || '',
      username: data.user?.user_metadata?.username,
      first_name: data.user?.user_metadata?.first_name,
      last_name: data.user?.user_metadata?.last_name,
      email_verified: !!data.user?.email_confirmed_at,
    };

    return {
      access: data.session?.access_token,
      refresh: data.session?.refresh_token,
      user: userProfile,
    };
  } catch (error: any) {
    console.error('❌ Login Error:', error);
    throw new Error(error.message || 'Kirishda xatolik');
  }
};

// Save tokens to localStorage
export const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

// Get access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Get refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

// Clear tokens (logout)
export const clearAuthTokens = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
};

// Save user profile
export const saveUserProfile = (user: UserProfile) => {
  localStorage.setItem('user_profile', JSON.stringify(user));
};

// Get user profile
export const getUserProfile = (): UserProfile | null => {
  const profile = localStorage.getItem('user_profile');
  return profile ? JSON.parse(profile) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string> => {
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error || !data.session) {
    await clearAuthTokens();
    throw new Error('Token refresh failed');
  }

  saveAuthTokens(data.session.access_token, data.session.refresh_token);
  return data.session.access_token;
};

// Get user profile from backend
export const fetchUserProfile = async (): Promise<ProfileData> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not found');

    // Try to get profile from 'user_profiles' table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
       console.error('Profile fetch error:', profileError);
    }

    const profileData: ProfileData = {
      id: user.id,
      email: user.email || '',
      username: profile?.username || user.user_metadata?.username || '',
      first_name: profile?.first_name || user.user_metadata?.first_name || '',
      last_name: profile?.last_name || user.user_metadata?.last_name || '',
      role: profile?.role || 'user',
      is_vip: profile?.is_vip || false,
      vip_expires_at: profile?.vip_expires_at || null,
      email_verified: !!user.email_confirmed_at,
      date_joined: user.created_at,
      last_login: user.last_sign_in_at || null,
      picture: profile?.picture || user.user_metadata?.avatar_url,
      target_score: profile?.target_score,
      target_date: profile?.target_date,
      email_notifications: profile?.email_notifications,
      two_factor_enabled: profile?.two_factor_enabled,
      skills: profile?.skills || {
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
      },
    };

    return profileData;
  } catch (error: any) {
    console.error('Fetch Profile Error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return data as ProfileData;
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    throw new Error(error.message || 'Profilni yangilashda xatolik');
  }
};

// Change password
export const changePassword = async (
  _currentPassword: string,
  newPassword: string,
  _newPasswordConfirm: string
): Promise<{ message: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    return { message: 'Parol muvaffaqiyatli o\'zgartirildi' };
  } catch (error: any) {
    console.error('Change Password Error:', error);
    throw new Error(error.message || 'Parolni o\'zgartirishda xatolik');
  }
};
