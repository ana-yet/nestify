import { Component } from 'react';
import Link from 'next/link';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-lg bg-surface rounded-xl border border-border-subtle shadow-ambient p-8">
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-error">error_outline</span>
            </div>
            <h1 className="text-2xl font-bold text-text-main">Something went wrong</h1>
            <p className="text-text-muted mt-2 mb-6">
              An unexpected error occurred. You can refresh the page or return home.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="btn btn-primary-nestify"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <Link href="/" className="btn btn-outline" onClick={this.handleReset}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
