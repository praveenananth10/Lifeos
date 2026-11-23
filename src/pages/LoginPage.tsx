import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('alex.morgan@lifeos.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      const result = await login(email, password);
      if (result.error) {
        setErrors({ general: result.error });
      } else {
        navigate('/dashboard');
      }
    } catch {
      setErrors({ general: 'Authentication failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrors((prev) => ({ ...prev, general: undefined }));
    try {
      const result = await loginWithGoogle();
      if (result.error) {
        setErrors({ general: result.error });
      } else if (!isSupabaseConfigured) {
        navigate('/dashboard');
      }
    } catch {
      setErrors({ general: 'Google authentication could not be initiated.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email credentials to access your LifeOS workspace."
      icon={<Lock className="h-5 w-5" />}
      footerContent={
        <div>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            Create an account
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
        />

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`w-full h-9 rounded-lg pl-9 pr-10 text-sm transition-all duration-150 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border ${
                errors.password
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-zinc-200/90 dark:border-zinc-800 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20'
              }`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
        </div>

        {/* Remember me option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 text-orange-600 focus:ring-orange-500/30 dark:bg-zinc-900 h-4 w-4"
            />
            <span>Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full text-xs font-semibold h-10 shadow-xs"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Sign In to Workspace
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
          <span className="bg-white dark:bg-zinc-900 px-2 text-zinc-400 dark:text-zinc-500">
            Or quick access
          </span>
        </div>
      </div>

      {/* Demo Account Button & Google Preview Button */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="secondary"
          className="w-full text-xs font-medium h-9 border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 hover:bg-orange-50/50 dark:hover:bg-orange-950/30"
          onClick={handleDemoLogin}
          isLoading={isDemoLoading}
          leftIcon={<UserCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
        >
          Continue with Demo Account (Instant Access)
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full text-xs font-normal h-9 text-zinc-600 dark:text-zinc-300 opacity-80 hover:opacity-100"
          onClick={handleGoogleLogin}
          isLoading={isGoogleLoading}
          leftIcon={
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          }
        >
          {isSupabaseConfigured ? 'Continue with Google' : 'Continue with Google (Preview)'}
        </Button>
      </div>
    </AuthLayout>
  );
};

