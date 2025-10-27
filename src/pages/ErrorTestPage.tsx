import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { errorHandler, type ApiError } from '@/lib/errorHandler';

export function ErrorTestPage() {
  const [isLoading, setIsLoading] = useState(false);

  const simulateServerError = () => {
    const error: ApiError = new Error('Simulated server error for testing');
    error.status = 500;
    errorHandler.handleServerError(error, 'This is a test server error');
  };

  const simulateApiError = async () => {
    setIsLoading(true);
    try {
      // Simulate API call that fails
      await new Promise((_, reject) => {
        setTimeout(() => {
          const error: ApiError = new Error('API request failed');
          error.status = 500;
          reject(error);
        }, 1000);
      });
    } catch (error) {
      await errorHandler.handleApiError(error as ApiError, undefined, 3);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateRetryableError = async () => {
    setIsLoading(true);
    try {
      // Simulate API call that fails but can be retried
      await new Promise((_, reject) => {
        setTimeout(() => {
          const error: ApiError = new Error('Temporary server issue');
          error.status = 503;
          reject(error);
        }, 1000);
      });
    } catch (error) {
      // This will attempt retry
      await errorHandler.handleApiError(
        error as ApiError, 
        async () => {
          // Simulate successful retry
          await new Promise(resolve => setTimeout(resolve, 500));
          return { success: true };
        },
        3
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrorQueue = () => {
    errorHandler.clearErrorQueue();
    toast.success('Error queue cleared');
  };

  return (
    <div className="min-h-screen bg-primary-bg p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bug className="h-6 w-6 text-red-500" />
              <span>Error Testing Page</span>
            </CardTitle>
            <CardDescription>
              Test different error scenarios to see how the 500 error page handles them.
              This page is for development and testing purposes only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">Server Error</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Simulate a 500 server error that will redirect to the error page.
                </p>
                <Button 
                  onClick={simulateServerError}
                  variant="destructive"
                  className="w-full"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Trigger Server Error
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">API Error</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Simulate an API error that will show retry options.
                </p>
                <Button 
                  onClick={simulateApiError}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Testing...' : 'Trigger API Error'}
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">Retryable Error</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Simulate an error that can be retried successfully.
                </p>
                <Button 
                  onClick={simulateRetryableError}
                  disabled={isLoading}
                  variant="secondary"
                  className="w-full"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Retrying...' : 'Test Retry Logic'}
                </Button>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-text-primary mb-2">Clear Error Queue</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Clear the error queue and reset retry counters.
                </p>
                <Button 
                  onClick={clearErrorQueue}
                  variant="ghost"
                  className="w-full"
                >
                  Clear Queue
                </Button>
              </Card>
            </div>

            <div className="bg-mint-tint rounded-xl p-4 border border-mint-green/20">
              <h4 className="font-semibold text-text-primary mb-2">Error Queue Status</h4>
              <p className="text-sm text-text-secondary mb-2">
                Current retry count: {errorHandler.getRetryCount()}
              </p>
              <p className="text-sm text-text-secondary mb-2">
                Can retry: {errorHandler.shouldShowRetry() ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-text-secondary">
                Queue size: {errorHandler.getErrorQueue().length}
              </p>
            </div>

            <div className="bg-pastel-yellow/20 rounded-xl p-4 border border-pastel-yellow/40">
              <h4 className="font-semibold text-text-primary mb-2">Testing Notes</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Server errors will redirect to /500 with error details</li>
                <li>• API errors will show retry options if applicable</li>
                <li>• Retry attempts are tracked and limited to 3</li>
                <li>• Error details are logged to console for debugging</li>
                <li>• Support email includes trace ID and error context</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}