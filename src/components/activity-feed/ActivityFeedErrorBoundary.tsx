import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ActivityFeedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    console.error('ActivityFeed Error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Something went wrong
              </h2>
              <p className="text-text-secondary mb-6">
                We're sorry, but something unexpected happened while loading the activity feed. 
                Don't worry, your data is safe.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-mint-green hover:bg-light-mint text-text-primary"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleReload}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/dashboard'}
                className="w-full text-text-tertiary hover:text-text-primary"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            {/* Error Details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-primary">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-xs font-mono text-text-secondary overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-text-tertiary">
                If this problem persists, please contact support or try again later.
              </p>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    console.error('Activity Feed Error:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      // You could send error to monitoring service here
      console.error('Error caught by useErrorHandler:', error);
    }
  }, [error]);

  return {
    error,
    handleError,
    resetError,
  };
}

// Error fallback component for specific error types
export function ActivityFeedErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void;
}) {
  const getErrorMessage = (error: Error) => {
    if (error.message.includes('Network')) {
      return {
        title: 'Connection Problem',
        description: 'Please check your internet connection and try again.',
        icon: 'wifi-off',
      };
    }
    
    if (error.message.includes('404')) {
      return {
        title: 'Content Not Found',
        description: 'The activity feed could not be loaded. It may have been moved or deleted.',
        icon: 'search',
      };
    }
    
    if (error.message.includes('403')) {
      return {
        title: 'Access Denied',
        description: 'You don\'t have permission to view this content.',
        icon: 'lock',
      };
    }
    
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      icon: 'alert-triangle',
    };
  };

  const errorInfo = getErrorMessage(error);

  return (
    <Card className="p-6 text-center">
      <div className="max-w-sm mx-auto">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          {errorInfo.title}
        </h3>
        
        <p className="text-text-secondary mb-4 text-sm">
          {errorInfo.description}
        </p>
        
        <Button
          onClick={resetError}
          size="sm"
          className="bg-mint-green hover:bg-light-mint text-text-primary"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </Card>
  );
}