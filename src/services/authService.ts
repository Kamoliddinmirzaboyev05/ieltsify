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
  id?: number;
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
    console.log('🔑 ID Token (first 50 chars):', idToken.substring(0, 50) + '...');
    console.log('🔑 ID Token length:', idToken.length);
    console.log('🌐 API URL:', `${API_BASE_URL}/accounts/google/`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}/accounts/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_token: idToken,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log('📥 Backend response status:', response.status);
    console.log('📥 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Backend error response:', JSON.stringify(error, null, 2));
      
      // Handle specific error messages
      if (error.detail) {
        throw new Error(error.detail);
      }
      if (error.error) {
        throw new Error(error.error);
      }
      if (error.message) {
        throw new Error(error.message);
      }
      if (error.id_token) {
        const msg = Array.isArray(error.id_token) ? error.id_token[0] : error.id_token;
        throw new Error(`Google token xatosi: ${msg}`);
      }
      
      // Generic error
      throw new Error('Google autentifikatsiya xatosi. Iltimos, qaytadan urinib ko\'ring.');
    }

    const data = await response.json();
    console.log('✅ Backend response data:', {
      hasTokens: !!(data.tokens || data.access || data.access_token),
      hasUser: !!data.user,
      message: data.message
    });
    
    return data;
  } catch (error: unknown) {
    console.error('❌ Google Auth Error:', error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Server javob bermadi. Iltimos, qaytadan urinib ko\'ring.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Serverga ulanib bo\'lmadi. Internet aloqangizni tekshiring.');
      }
      throw error;
    }
    
    throw new Error('Google autentifikatsiya xatosi: ' + String(error));
  }
};

// Email/Password Register
export const registerUser = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('📤 Sending registration request to:', `${API_BASE_URL}/accounts/register/`);
    console.log('📝 Registration data:', { ...registerData, password: '***' });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
        console.error('❌ Backend error:', JSON.stringify(error, null, 2));
      } catch {
        console.error('❌ Failed to parse error response');
        throw new Error('Serverdan noto\'g\'ri javob keldi');
      }
      
      // Handle validation errors
      if (error.username) {
        const msg = Array.isArray(error.username) ? error.username[0] : error.username;
        throw new Error(`Username: ${msg}`);
      }
      if (error.email) {
        const msg = Array.isArray(error.email) ? error.email[0] : error.email;
        throw new Error(`Email: ${msg}`);
      }
      if (error.password) {
        const msg = Array.isArray(error.password) ? error.password[0] : error.password;
        throw new Error(`Parol: ${msg}`);
      }
      if (error.first_name) {
        const msg = Array.isArray(error.first_name) ? error.first_name[0] : error.first_name;
        throw new Error(`Ism: ${msg}`);
      }
      if (error.last_name) {
        const msg = Array.isArray(error.last_name) ? error.last_name[0] : error.last_name;
        throw new Error(`Familiya: ${msg}`);
      }
      if (error.detail) {
        throw new Error(error.detail);
      }
      if (error.non_field_errors) {
        const msg = Array.isArray(error.non_field_errors) ? error.non_field_errors[0] : error.non_field_errors;
        throw new Error(msg);
      }
      
      // If we have any error object, stringify it
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    console.log('✅ Registration successful:', data);
    return data;
  } catch (error: unknown) {
    console.error('❌ Register Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Server javob bermadi. Iltimos, qaytadan urinib ko\'ring.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Serverga ulanib bo\'lmadi. Internet aloqangizni tekshiring yoki keyinroq urinib ko\'ring.');
      }
      throw error;
    }
    
    throw new Error('Noma\'lum xatolik yuz berdi');
  }
};

// Email/Password Login
export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    console.log('📤 Sending login request to:', `${API_BASE_URL}/token/`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Backend error:', error);
      
      if (error.detail) {
        throw new Error(error.detail);
      }
      if (error.non_field_errors) {
        throw new Error(error.non_field_errors[0]);
      }
      throw new Error('Kirishda xatolik');
    }

    const data = await response.json();
    console.log('✅ Login successful');
    return data;
  } catch (error: unknown) {
    console.error('❌ Login Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Server javob bermadi. Iltimos, qaytadan urinib ko\'ring.');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Serverga ulanib bo\'lmadi. Internet aloqangizni tekshiring yoki keyinroq urinib ko\'ring.');
      }
      throw error;
    }
    
    throw new Error('Noma\'lum xatolik yuz berdi');
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
