import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { usersApi } from '@/api/users';
import type { User } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string; remember_me?: boolean }) => Promise<void>;
  signUp: (credentials: { full_name: string; email: string; password: string; invite_code?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initiateOAuth: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  completeOAuth: (provider: 'google' | 'apple' | 'facebook', code: string, state?: string) => Promise<void>;
  validateInviteCode: (inviteCode: string) => Promise<{ valid: boolean; family_id?: string; family_name?: string; inviter_name?: string }>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  // Check if user is authenticated on mount
  const isAuthenticated = authApi.isAuthenticated();

  // Get current user query
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: usersApi.getCurrent,
    enabled: isAuthenticated && isInitialized,
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Initialize auth state
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Handle auth errors
  useEffect(() => {
    if (userError && isAuthenticated) {
      // Token might be invalid, clear auth data
      authApi.clearAuthData();
      queryClient.clear();
    }
  }, [userError, isAuthenticated, queryClient]);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Welcome back!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Sign in failed';
      toast.error(message);
      throw error;
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Sign up failed';
      toast.error(message);
      throw error;
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Signed out successfully');
    },
    onError: (error: any) => {
      // Even if server request fails, clear local data
      queryClient.clear();
      authApi.clearAuthData();
      console.warn('Sign out error:', error);
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
    },
    onError: () => {
      // Refresh failed, clear auth data
      authApi.clearAuthData();
      queryClient.clear();
    },
  });

  // OAuth initiation mutation
  const initiateOAuthMutation = useMutation({
    mutationFn: authApi.initiateOAuth,
    onSuccess: (data) => {
      // Redirect to OAuth provider
      window.location.href = data.url;
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'OAuth initiation failed';
      toast.error(message);
      throw error;
    },
  });

  // OAuth completion mutation
  const completeOAuthMutation = useMutation({
    mutationFn: ({ provider, code, state }: { provider: 'google' | 'apple' | 'facebook'; code: string; state?: string }) =>
      authApi.completeOAuth(provider, code, state),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data.user);
      toast.success('Signed in successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'OAuth authentication failed';
      toast.error(message);
      throw error;
    },
  });

  // Validate invite code mutation
  const validateInviteMutation = useMutation({
    mutationFn: authApi.validateInviteCode,
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Invalid invite code';
      toast.error(message);
      throw error;
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      toast.success('Password reset email sent! Check your inbox.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      toast.error(message);
      throw error;
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.updatePassword(token, password),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Password update failed';
      toast.error(message);
      throw error;
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!');
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Email verification failed';
      toast.error(message);
      throw error;
    },
  });

  // Resend verification email mutation
  const resendVerificationMutation = useMutation({
    mutationFn: authApi.resendVerificationEmail,
    onSuccess: () => {
      toast.success('Verification email sent!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || error.message || 'Failed to send verification email';
      toast.error(message);
      throw error;
    },
  });

  // Context value
  const value: AuthContextType = {
    user: user || null,
    isAuthenticated: isAuthenticated && !!user,
    isLoading: userLoading || !isInitialized,
    signIn: async (credentials) => {
      await signInMutation.mutateAsync(credentials);
    },
    signUp: async (credentials) => {
      await signUpMutation.mutateAsync(credentials);
    },
    signOut: async () => {
      await signOutMutation.mutateAsync();
    },
    refreshToken: async () => {
      await refreshTokenMutation.mutateAsync();
    },
    initiateOAuth: async (provider) => {
      await initiateOAuthMutation.mutateAsync(provider);
    },
    completeOAuth: async (provider, code, state) => {
      await completeOAuthMutation.mutateAsync({ provider, code, state });
    },
    validateInviteCode: async (inviteCode) => {
      const result = await validateInviteMutation.mutateAsync(inviteCode);
      return result;
    },
    resetPassword: async (email) => {
      await resetPasswordMutation.mutateAsync(email);
    },
    updatePassword: async (token, newPassword) => {
      await updatePasswordMutation.mutateAsync({ token, password: newPassword });
    },
    verifyEmail: async (token) => {
      await verifyEmailMutation.mutateAsync(token);
    },
    resendVerificationEmail: async (email) => {
      await resendVerificationMutation.mutateAsync(email);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}