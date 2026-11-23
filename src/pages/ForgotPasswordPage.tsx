import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setError('Unable to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resetPassword(email);
      if (result.error) {
        setError(result.error);
      } else {
        setResendMessage(true);
        setTimeout(() => setResendMessage(false), 3500);
      }
    } catch {
      setError('Failed to resend instructions.');
    } finally {
      setIsResending(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check your inbox"
        description={
          isSupabaseConfigured
            ? "We've dispatched a recovery email to reset your LifeOS credentials."
            : "We've simulated sending a recovery email to reset your LifeOS credentials."
        }
        icon={<MailCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
        footerContent={
          <div className="flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <Link
              to="/login"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:underline"
            >
              Return to Sign In
            </Link>
          </div>
        }
      >
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-xl border border-orange-200/80 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20 space-y-2">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              A password reset link has been dispatched to:
            </p>
            <p className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 inline-block">
              {email}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Click the link inside the email to choose a new password. If you don't see it within a few minutes, check your spam folder.
            </p>
          </div>

          {resendMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSupabaseConfigured ? 'Password reset link sent!' : 'Simulated reset link re-sent!'}</span>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full text-xs h-9"
              onClick={handleResend}
              isLoading={isResending}
            >
              Resend Reset Link
            </Button>
            <Link to="/login" className="block w-full">
              <Button variant="ghost" className="w-full text-xs h-9 text-zinc-500">
                Cancel and return
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your account email and we'll send you an instant reset link."
      icon={<KeyRound className="h-5 w-5" />}
      footerContent={
        <div className="flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Remember your password?</span>
          <Link
            to="/login"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:underline ml-1"
          >
            Log in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Input
          label="Registered Email Address"
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(undefined);
          }}
          error={error}
          autoComplete="email"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full text-xs font-semibold h-10 shadow-xs"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
        >
          Send Reset Instructions
        </Button>
      </form>
    </AuthLayout>
  );
};
