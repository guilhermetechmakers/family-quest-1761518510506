import { api } from '../lib/api';
import type { AuthResponse, SignInInput, SignUpInput } from '@/types/user';

export const authApi = {
  // Sign in with email and password
  signIn: async (credentials: SignInInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // Store auth token
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  // Sign up with email and password
  signUp: async (credentials: SignUpInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    
    // Optionally store token on signup
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  // Sign out
  signOut: async (): Promise<void> => {
    await api.post('/auth/logout', {});
    localStorage.removeItem('auth_token');
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
    const response = await api.post<AuthResponse>('/auth/refresh', {});
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
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
};