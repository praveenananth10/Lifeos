import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  MailCheck,
} from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginAsDemo, loginWithGoogle } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  // Dynamic checks
  const hasMinLength = password.length >= 8;
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!hasMinLength) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms to proceed.';
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
      const result = await signup(name, email, password);
      if (result.error) {
        setErrors({ general: result.error });
      } else if (result.emailConfirmationRequired) {
        setEmailConfirmationSent(true);
      } else {
        navigate('/dashboard');
      }
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
      setErrors({ general: 'Google sign-up could not be initiated.' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (emailConfirmationSent) {
    return (
      <AuthLayout
        title="Check your email"
        description="We've sent a verification link to confirm your LifeOS account."
        icon={<MailCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
        footerContent={
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <Link
              to="/login"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              Go to Sign In
            </Link>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-xl border border-orange-200/80 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20 space-y-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              A verification link was dispatched to:
            </p>
            <p className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 inline-block">
              {email}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Click the link inside the email to confirm your account and activate your workspace.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/login" className="block w-full">
              <Button variant="primary" className="w-full text-xs h-9">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start organizing your tasks, habits, and time in a unified workspace."
      icon={<Sparkles className="h-5 w-5" />}
      footerContent={
        <div>
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
          >
            Log in
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

        {/* Full Name */}
        <Input
          label="Full Name"
          type="text"
          placeholder="Alex Morgan"
          leftIcon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          error={errors.name}
          autoComplete="name"
        />

        {/* Email Address */}
        <Input
          label="Email Address"
          type="email"
          placeholder="alex@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={errors.email}
          autoComplete="email"
        />

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
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
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center pointer-events-none text-zinc-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className={`w-full h-9 rounded-lg pl-9 pr-10 text-sm transition-all duration-150 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border ${
                errors.confirmPassword
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-zinc-200/90 dark:border-zinc-800 focus:outline-none focus:border-orange-500 dark:focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 dark:focus:ring-orange-400/20'
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-rose-500">{errors.confirmPassword}</p>}
        </div>

        {/* Live Password Requirements Hint */}
        <div className="rounded-lg p-2.5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-3.5 w-3.5 rounded-full flex items-center justify-center transition-colors ${
                hasMinLength ? 'bg-emerald-500 text-white' : 'border border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {hasMinLength && <Check className="h-2.5 w-2.5 stroke-[3]" />}
            </span>
            <span className={hasMinLength ? 'text-zinc-700 dark:text-zinc-200 font-medium' : 'text-zinc-400'}>
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`h-3.5 w-3.5 rounded-full flex items-center justify-center transition-colors ${
                passwordsMatch ? 'bg-emerald-500 text-white' : 'border border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {passwordsMatch && <Check className="h-2.5 w-2.5 stroke-[3]" />}
            </span>
            <span className={passwordsMatch ? 'text-zinc-700 dark:text-zinc-200 font-medium' : 'text-zinc-400'}>
              Passwords match
            </span>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-600 dark:text-zinc-400 leading-snug">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="mt-0.5 rounded border-zinc-300 dark:border-zinc-700 text-orange-600 focus:ring-orange-500/30 dark:bg-zinc-900 h-4 w-4"
            />
            <span>
              I agree to the <span className="text-zinc-900 dark:text-zinc-200 underline">Terms of Service</span> and{' '}
              <span className="text-zinc-900 dark:text-zinc-200 underline">Privacy Policy</span>.
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.terms}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="w-full text-xs font-semibold h-10 shadow-xs"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Create Free Workspace
        </Button>
      </form>

      {/* Quick Option */}
      <div className="pt-2 space-y-2">
        <Button
          type="button"
          variant="outline"
          className="w-full text-xs font-normal h-9 text-zinc-600 dark:text-zinc-300 opacity-80 hover:opacity-100"
          onClick={handleGoogleSignup}
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
          {isSupabaseConfigured ? 'Sign Up with Google' : 'Sign Up with Google (Preview)'}
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full text-xs font-normal h-9 text-zinc-600 dark:text-zinc-300"
          onClick={() => {
            loginAsDemo().then(() => navigate('/dashboard'));
          }}
        >
          Quick Tour with Demo Account
        </Button>
      </div>
    </AuthLayout>
  );
};
