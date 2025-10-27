import { toast } from 'sonner';

export interface ServerError {
  message: string;
  traceId: string;
  statusCode: number;
  timestamp: string;
  url?: string;
}

export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ServerError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Generate a unique trace ID for error tracking
   */
  public generateTraceId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 6);
    return `ERR-${timestamp}-${random.toUpperCase()}`;
  }

  /**
   * Handle server errors and redirect to 500 page
   */
  public handleServerError(error: ApiError | Error, customMessage?: string): ServerError {
    const traceId = this.generateTraceId();
    const serverError: ServerError = {
      message: customMessage || error.message || 'An unexpected server error occurred',
      traceId,
      statusCode: (error as ApiError).status || (error as ApiError).statusCode || 500,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Log error for analytics
    console.error('Server Error:', serverError);
    
    // Add to error queue for potential retry
    this.errorQueue.push(serverError);

    // Show error toast
    toast.error('Server error occurred. Redirecting to error page...');

    // Redirect to 500 page after a short delay
    setTimeout(() => {
      this.redirectToErrorPage(serverError);
    }, 1000);

    return serverError;
  }

  /**
   * Handle API errors with retry logic
   */
  public async handleApiError(
    error: ApiError | Error, 
    retryFunction?: () => Promise<any>,
    maxRetries: number = 3
  ): Promise<ServerError> {
    const traceId = this.generateTraceId();
    const serverError: ServerError = {
      message: error.message || 'API request failed',
      traceId,
      statusCode: (error as ApiError).status || (error as ApiError).statusCode || 500,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.error('API Error:', serverError);

    // If it's a 500 error and we have a retry function, attempt retry
    if (serverError.statusCode >= 500 && retryFunction && this.errorQueue.length < maxRetries) {
      try {
        toast.loading('Retrying request...', { id: 'api-retry' });
        await retryFunction();
        toast.success('Request successful!', { id: 'api-retry' });
        return serverError;
      } catch (retryError) {
        toast.error('Retry failed. Please try again.', { id: 'api-retry' });
      }
    }

    // If retry failed or not applicable, handle as server error
    return this.handleServerError(error, serverError.message);
  }

  /**
   * Redirect to 500 error page with error details
   */
  private redirectToErrorPage(error: ServerError): void {
    const params = new URLSearchParams({
      traceId: error.traceId,
      message: error.message,
      statusCode: error.statusCode.toString()
    });
    
    window.location.href = `/500?${params.toString()}`;
  }

  /**
   * Get error details from URL parameters
   */
  public getErrorFromUrl(): Partial<ServerError> | null {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (!urlParams.has('traceId')) {
      return null;
    }

    return {
      traceId: urlParams.get('traceId') || undefined,
      message: urlParams.get('message') || undefined,
      statusCode: parseInt(urlParams.get('statusCode') || '500'),
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
  }

  /**
   * Clear error queue
   */
  public clearErrorQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get error queue for debugging
   */
  public getErrorQueue(): ServerError[] {
    return [...this.errorQueue];
  }

  /**
   * Check if we should show retry option
   */
  public shouldShowRetry(): boolean {
    return this.errorQueue.length < 3;
  }

  /**
   * Get retry count
   */
  public getRetryCount(): number {
    return this.errorQueue.length;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility function for easy error handling
export const handleServerError = (error: ApiError | Error, customMessage?: string): ServerError => {
  return errorHandler.handleServerError(error, customMessage);
};

// Utility function for API error handling
export const handleApiError = async (
  error: ApiError | Error, 
  retryFunction?: () => Promise<any>,
  maxRetries?: number
): Promise<ServerError> => {
  return errorHandler.handleApiError(error, retryFunction, maxRetries);
};