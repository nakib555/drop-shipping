import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Unexpected rendering error occurred.',
    };
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-6 flex-1 flex flex-col items-center justify-center text-center bg-app-bg space-y-4 min-h-[360px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-[280px]">
            <h2 className="text-sm font-bold text-content-primary">
              Something went wrong on this screen
            </h2>
            <p className="text-xs text-content-secondary leading-relaxed">
              Your cart, saved addresses, and orders are safely preserved.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="h-10 px-4 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Screen</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
