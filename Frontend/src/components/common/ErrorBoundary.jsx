import { Component } from 'react';
import { HiExclamationCircle, HiRefresh } from 'react-icons/hi';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-danger/10 animate-pulse">
              <HiExclamationCircle className="text-danger" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-dark-text-light mb-6">
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              <HiRefresh size={20} />
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-danger font-medium mb-2">Error Details (Development)</summary>
                <pre className="bg-dark-card border border-dark-border rounded-lg p-4 text-xs text-dark-text-light overflow-auto max-h-64">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
