import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertOctagon, RotateCcw, Trash2, Home } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Keep error logging clean and non-invasive in production
    if (import.meta.env.DEV) {
      console.error('[LifeOS ErrorBoundary Caught]:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset your local data? This will clear locally cached workspace data and reload fresh.'
      )
    ) {
      try {
        localStorage.removeItem('lifeos-tasks');
        localStorage.removeItem('lifeos-events');
        localStorage.removeItem('lifeos-habits');
        localStorage.removeItem('lifeos-transactions');
        localStorage.removeItem('lifeos-notes');
        localStorage.removeItem('lifeos-goals');
        localStorage.removeItem('lifeos-focus-sessions');
        localStorage.removeItem('lifeos-monthly-budget');
        localStorage.removeItem('lifeos-demo-user');
      } catch {
        // ignore storage errors
      }
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl">
            {/* Warning Icon Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 mb-6">
              <AlertOctagon className="w-7 h-7 stroke-[1.75]" />
            </div>

            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              System Boundary Interruption
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              Something interrupted your session
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
              LifeOS encountered an unexpected runtime state. Your underlying workspace data is safely stored in local storage.
            </p>

            {/* Error Message Details */}
            {this.state.error && (
              <div className="mb-6 text-left">
                <details className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <summary className="cursor-pointer font-medium text-zinc-700 dark:text-zinc-300">
                    Diagnostic details ({this.state.error.name})
                  </summary>
                  <p className="mt-2 font-mono text-[11px] text-rose-500 dark:text-rose-400 break-words whitespace-pre-wrap">
                    {this.state.error.message}
                  </p>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                className="w-full justify-center"
                leftIcon={<RotateCcw className="w-4 h-4" />}
                onClick={this.handleReload}
              >
                Reload Workspace
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex-1 justify-center text-xs"
                  leftIcon={<Home className="w-3.5 h-3.5" />}
                  onClick={() => {
                    window.location.href = '/dashboard';
                  }}
                >
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="flex-1 justify-center text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={this.handleResetData}
                >
                  Reset Local Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
