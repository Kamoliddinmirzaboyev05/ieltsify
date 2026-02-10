const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ieltsify.pythonanywhere.com';

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
  user_info: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  email_verified: boolean;
  created_at: string;
}

export interface ProfileData {
  id: number;
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
  access_token?: string; // Google OAuth (old format)
  refresh_token?: string; // Google OAuth (old format)
  access?: string; // Email/Password login
  refresh?: string; // Email/Password login
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
    console.log('📤 Sending Google OAuth request to backend...');
    
    const response = await fetch(`${API_BASE_URL}/accounts/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
    });

    console.log('📥 Backend response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Backend error:', error);
      throw new Error(error.detail || 'Google authentication failed');
    }

    const data = await response.json();
    console.log('✅ Backend response data:', data);
    
    return data;
  } catch (error: unknown) {
    console.error('❌ Google Auth Error:', error);
    throw error;
  }
};

// Email/Password Register
export const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const error = await response.json();
      // Handle validation errors
      if (error.username) {
        throw new Error(`Username: ${error.username[0]}`);
      }
      if (error.email) {
        throw new Error(`Email: ${error.email[0]}`);
      }
      if (error.password) {
        throw new Error(`Password: ${error.password[0]}`);
      }
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error('Register Error:', error);
    throw error;
  }
};

// Email/Password Login
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const error = await response.json();
      if (error.detail) {
        throw new Error(error.detail);
      }
      if (error.non_field_errors) {
        throw new Error(error.non_field_errors[0]);
      }
      throw new Error('Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Save tokens to localStorage
export const saveAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  console.log('✅ Tokens saved to localStorage');
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
export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
};

// Save user profile
export const saveUserProfile = (user: UserProfile) => {
  localStorage.setItem('user_profile', JSON.stringify(user));
  console.log('✅ User profile saved to localStorage:', user);
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
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      clearAuthTokens();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    saveAuthTokens(data.access, refreshToken);
    return data.access;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
};

// API request with auth
export const authenticatedFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      
      // Retry request with new token
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      clearAuthTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  return response;
};

// Get user profile from backend
export const fetchUserProfile = async (): Promise<ProfileData> => {
  try {
    const response = await authenticatedFetch('/accounts/profile/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const result: ProfileResponse = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to fetch profile');
    }

    return result.data.user_info;
  } catch (error) {
    console.error('Fetch Profile Error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData: Partial<ProfileData>): Promise<ProfileData> => {
  try {
    const response = await authenticatedFetch('/accounts/profile/', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    const result: ProfileResponse = await response.json();
    
    if (!result.success) {
      throw new Error('Failed to update profile');
    }

    return result.data.user_info;
  } catch (error) {
    console.error('Update Profile Error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string
): Promise<{ message: string }> => {
  try {
    const response = await authenticatedFetch('/accounts/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      if (error.current_password) {
        throw new Error(`Joriy parol: ${error.current_password[0]}`);
      }
      if (error.new_password) {
        throw new Error(`Yangi parol: ${error.new_password[0]}`);
      }
      if (error.new_password_confirm) {
        throw new Error(`Parol tasdiqlash: ${error.new_password_confirm[0]}`);
      }
      throw new Error(error.detail || 'Parolni o\'zgartirishda xatolik');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Change Password Error:', error);
    throw error;
  }
};
