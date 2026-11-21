import { createContext } from 'react';
import type { AuthUser } from '../types';

export interface AuthResult {
  error: string | null;
}

export interface SignupResult extends AuthResult {
  emailConfirmationRequired?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password?: string) => Promise<SignupResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
  updateProfile: (updates: { name: string; email: string; role?: string }) => Promise<AuthResult>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
