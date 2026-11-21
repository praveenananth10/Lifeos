import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';
import type { AuthResult, SignupResult } from './auth-context';
import type { AuthUser } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export { AuthContext } from './auth-context';
export type { AuthContextType } from './auth-context';

const AUTH_STORAGE_KEY = 'lifeos-demo-user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    if (!isSupabaseConfigured) {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
        const defaultDemo: AuthUser = {
          id: 'demo-user-alex',
          name: 'Alex Morgan',
          email: 'alex.morgan@lifeos.io',
          role: 'Student • Builder',
          isAuthenticated: true,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultDemo));
        return defaultDemo;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(() => isSupabaseConfigured);

  // Helper to construct normalized AuthUser from Supabase user object
  const mapSupabaseUser = (sbUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): AuthUser => {
    const meta = sbUser.user_metadata || {};
    const metaName =
      typeof meta.name === 'string'
        ? meta.name
        : typeof meta.full_name === 'string'
        ? meta.full_name
        : '';
    const emailPrefix = sbUser.email ? sbUser.email.split('@')[0] : 'User';
    const formattedPrefix = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    const name = metaName.trim() || formattedPrefix;
    const role = typeof meta.role === 'string' ? meta.role : 'Student • Builder';

    return {
      id: sbUser.id,
      name,
      email: sbUser.email || '',
      role,
      isAuthenticated: true,
    };
  };

  // Initial session recovery and Auth State Change subscription (Supabase)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    // 1. Initial Session / User Check via Supabase Auth
    supabase.auth
      .getUser()
      .then(({ data: { user: sbUser }, error }) => {
        if (!isMounted) return;
        if (error || !sbUser) {
          // Fallback to getSession for cached session
          supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
              if (!isMounted) return;
              if (session?.user) {
                setUser(mapSupabaseUser(session.user));
              } else {
                setUser(null);
              }
              setLoading(false);
            })
            .catch(() => {
              if (isMounted) setLoading(false);
            });
        } else {
          setUser(mapSupabaseUser(sbUser));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.error('Failed to get Supabase session/user:', err);
        if (isMounted) {
          supabase.auth
            .getSession()
            .then(({ data: { session } }) => {
              if (session?.user) {
                setUser(mapSupabaseUser(session.user));
              } else {
                setUser(null);
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
        }
      });

    // 2. Auth State Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Sync demo user to localStorage when unconfigured
  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, [user]);

  // Login
  const login = async (email: string, password?: string): Promise<AuthResult> => {
    if (isSupabaseConfigured) {
      if (!password) {
        return { error: 'Please enter your password to sign in.' };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
      return { error: null };
    }

    // Demo Mode fallback
    await new Promise((resolve) => setTimeout(resolve, 400));
    const prefix = email.split('@')[0] || 'User';
    const formattedName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const demoUser: AuthUser = {
      id: 'demo-user-local',
      name: formattedName,
      email: email.trim(),
      role: 'Student • Builder',
      isAuthenticated: true,
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    return { error: null };
  };

  // Sign up
  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<SignupResult> => {
    if (isSupabaseConfigured) {
      if (!password) {
        return { error: 'Please choose a password with at least 8 characters.' };
      }
      const cleanName = name.trim() || 'LifeOS User';
      const cleanRole = 'Student • Builder';

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: cleanName,
            role: cleanRole,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Check if email confirmation is required (user created without active session)
      if (data.user && !data.session) {
        return { error: null, emailConfirmationRequired: true };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      }
      return { error: null, emailConfirmationRequired: false };
    }

    // Demo Mode fallback
    await new Promise((resolve) => setTimeout(resolve, 400));
    const demoUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'LifeOS User',
      email: email.trim(),
      role: 'Student • Builder',
      isAuthenticated: true,
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    return { error: null, emailConfirmationRequired: false };
  };

  // Google OAuth
  const loginWithGoogle = async (): Promise<AuthResult> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    }

    // Demo Mode Google simulation
    await new Promise((resolve) => setTimeout(resolve, 400));
    const demoUser: AuthUser = {
      id: 'google-demo-user',
      name: 'Alex Morgan',
      email: 'alex.morgan@lifeos.io',
      role: 'Google Verified Builder',
      isAuthenticated: true,
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    return { error: null };
  };

  // Password Reset
  const resetPassword = async (email: string): Promise<AuthResult> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    }

    // Demo mode simulation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { error: null };
  };

  // Sign out
  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        if (import.meta.env.DEV) console.error('Sign out error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Demo Sign-in
  const loginAsDemo = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const demoUser: AuthUser = {
      id: 'demo-user-alex',
      name: 'Alex Morgan',
      email: 'alex.morgan@lifeos.io',
      role: 'Student • Builder',
      isAuthenticated: true,
    };
    setUser(demoUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
  };

  // Profile Update
  const updateProfile = async (updates: {
    name: string;
    email: string;
    role?: string;
  }): Promise<AuthResult> => {
    if (isSupabaseConfigured && user) {
      const cleanName = updates.name.trim();
      const cleanRole = updates.role?.trim() || user.role || 'Student • Builder';

      const { data, error } = await supabase.auth.updateUser({
        email: updates.email.trim() !== user.email ? updates.email.trim() : undefined,
        data: {
          name: cleanName,
          role: cleanRole,
        },
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        setUser(mapSupabaseUser(data.user));
      } else {
        setUser((prev) => (prev ? { ...prev, ...updates } : null));
      }
      return { error: null };
    }

    // Demo Mode
    setUser((prev) => {
      const updated = prev
        ? { ...prev, ...updates }
        : { ...updates, isAuthenticated: true };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user?.isAuthenticated,
        login,
        signup,
        loginWithGoogle,
        resetPassword,
        logout,
        loginAsDemo,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
