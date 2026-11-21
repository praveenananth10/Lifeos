import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isSupabaseConfigured } from '../../lib/supabase';

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 tracking-wide">
            {isSupabaseConfigured ? 'Verifying Supabase session...' : 'Loading LifeOS workspace...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated visitors to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
