import { api } from '../lib/api';
import type { AuthResponse, SignInInput, SignUpInput } from '@/types/user';

// OAuth provider types
export type OAuthProvider = 'google' | 'apple' | 'facebook';

export interface OAuthResponse {
  provider: OAuthProvider;
  code: string;
  state?: string;
}

export interface InviteValidationResponse {
  valid: boolean;
  family_id?: string;
  family_name?: string;
  inviter_name?: string;
  expires_at?: string;
}

export const authApi = {
  // Sign in with email and password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store auth tokens
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    
    // Store auth tokens on signup
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await api.post('/auth/logout', {});
    } catch (error) {
      // Continue with local cleanup even if server request fails
      console.warn('Server logout failed, continuing with local cleanup');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Reset password - send reset email
  resetPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  // Update password with reset token
  updatePassword: async (token: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password: newPassword });
  },

  // Refresh auth token
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>('/auth/refresh', { 
      refresh_token: refreshToken 
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<void> => {
    await api.post('/auth/verify-email', { token });
  },

  // Resend verification email
  resendVerificationEmail: async (email: string): Promise<void> => {
    await api.post('/auth/resend-verification', { email });
  },

  // OAuth authentication
  initiateOAuth: async (provider: OAuthProvider): Promise<{ url: string }> => {
    const response = await api.post<{ url: string }>(`/auth/oauth/${provider}/initiate`, {});
    return response;
  },

  // Complete OAuth authentication
  completeOAuth: async (provider: OAuthProvider, code: string, state?: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/auth/oauth/${provider}/callback`, {
      code,
      state
    });
    
    // Store auth tokens
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  },

  // Validate invite code
  validateInviteCode: async (inviteCode: string): Promise<InviteValidationResponse> => {
    const response = await api.post<InviteValidationResponse>('/auth/validate-invite', {
      invite_code: inviteCode
    });
    return response;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      // Basic JWT token validation (check if not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },

  // Get stored auth token
  getAuthToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // Get stored refresh token
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  // Clear all auth data
  clearAuthData: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  },
};