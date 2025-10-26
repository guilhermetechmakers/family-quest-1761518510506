export type UserRole = 'parent' | 'child' | 'guest' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  family_id?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    in_app: boolean;
  };
  language: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  family_id?: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  id: string;
  full_name?: string;
  avatar_url?: string;
  preferences?: Partial<UserPreferences>;
}

export interface SignInInput {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignUpInput {
  email: string;
  password: string;
  full_name: string;
  family_id?: string;
  invite_code?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}