import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Mail, 
  ArrowLeft, 
  HelpCircle,
  Activity,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { errorHandler, type ServerError, type ApiError } from '@/lib/errorHandler';

interface ServerErrorPageProps {
  traceId?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export function ServerErrorPage({ 
  traceId, 
  errorMessage = "We're experiencing some technical difficulties on our end.",
  onRetry 
}: ServerErrorPageProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();

  // Get error details from URL parameters or props
  const urlError = errorHandler.getErrorFromUrl();
  const generatedTraceId = traceId || urlError?.traceId || errorHandler.generateTraceId();
  const finalErrorMessage = errorMessage || urlError?.message || "We're experiencing some technical difficulties on our end.";
  const retryCount = errorHandler.getRetryCount();

  // Log error for analytics
  useEffect(() => {
    const errorDetails: ServerError = {
      message: finalErrorMessage,
      traceId: generatedTraceId,
      statusCode: urlError?.statusCode || 500,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    console.error('500 Server Error:', errorDetails);
  }, [generatedTraceId, finalErrorMessage, urlError]);

  const handleRetry = async () => {
    if (isRetrying) return;
    
    setIsRetrying(true);
    
    try {
      // Show loading toast
      toast.loading('Retrying...', { id: 'retry' });
      
      // Simulate retry attempt
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (onRetry) {
        onRetry();
      } else {
        // Default retry behavior - reload the page
        window.location.reload();
      }
      
      toast.success('Retry successful!', { id: 'retry' });
    } catch (error) {
      // Handle retry failure
      errorHandler.handleServerError(error as ApiError, 'Retry attempt failed');
      toast.error('Retry failed. Please try again or contact support.', { id: 'retry' });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Server Error - Trace ID: ${generatedTraceId}`);
    const body = encodeURIComponent(
      `Hi Family Quest Support Team,\n\n` +
      `I encountered a server error with the following details:\n\n` +
      `Trace ID: ${generatedTraceId}\n` +
      `Error Message: ${finalErrorMessage}\n` +
      `URL: ${window.location.href}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `User Agent: ${navigator.userAgent}\n` +
      `Retry Count: ${retryCount}\n\n` +
      `Please help me resolve this issue.\n\n` +
      `Thank you!`
    );
    
    const mailtoLink = `mailto:support@familyquest.app?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    toast.success('Support email opened with error details');
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Main Error Card */}
        <Card className="p-8 md:p-12 text-center mb-8 animate-fade-in-up" role="main" aria-labelledby="error-title">
          {/* Error Icon and Number */}
          <div className="relative mb-6" aria-hidden="true">
            <div className="text-8xl md:text-9xl font-bold text-red-500 mb-2 animate-bounce-in">
              500
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          {/* Error Message */}
          <CardHeader className="pb-4">
            <CardTitle id="error-title" className="text-3xl md:text-4xl font-bold text-text-primary mb-4 animate-fade-in-up">
              Server Error
            </CardTitle>
            <CardDescription className="text-lg text-text-secondary mb-6 max-w-lg mx-auto animate-fade-in-up">
              {finalErrorMessage} Our team has been notified and is working to fix this issue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Trace ID Display */}
            <div className="bg-mint-tint rounded-xl p-4 border border-mint-green/20 animate-fade-in-up">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Activity className="h-5 w-5 text-mint-green" />
                <span className="text-sm font-medium text-text-primary">Trace ID for Support</span>
              </div>
              <div className="font-mono text-sm text-text-secondary bg-white/50 rounded-lg px-3 py-2 break-all">
                {generatedTraceId}
              </div>
              <p className="text-xs text-text-tertiary mt-2">
                Please include this ID when contacting support
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 animate-fade-in-up" role="navigation" aria-label="Error recovery actions">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleRetry}
                  disabled={isRetrying}
                  size="lg" 
                  className="w-full sm:w-auto"
                  aria-label="Retry the failed operation"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleGoBack}
                  size="lg" 
                  className="w-full sm:w-auto"
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Go Back
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  onClick={handleContactSupport}
                  size="lg" 
                  className="w-full sm:w-auto"
                  aria-label="Contact support team"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Support
                </Button>
                
                <Button 
                  variant="ghost" 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto"
                  aria-label="Return to family dashboard"
                >
                  <Link to="/dashboard">
                    <Home className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              </div>
            </div>

            {/* Retry Count Warning */}
            {retryCount > 0 && (
              <div className="bg-pastel-yellow/20 border border-pastel-yellow/40 rounded-xl p-4 animate-fade-in-up">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-pastel-yellow" />
                  <span className="text-sm font-medium text-text-primary">
                    Retry Attempt #{retryCount}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  {retryCount >= 3 
                    ? "Multiple retry attempts failed. Please contact support for assistance."
                    : "If the problem persists, please contact our support team."
                  }
                </p>
              </div>
            )}

            {/* Retry Limit Warning */}
            {!errorHandler.shouldShowRetry() && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-up">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700">
                    Maximum Retry Attempts Reached
                  </span>
                </div>
                <p className="text-sm text-red-600">
                  Please contact support for assistance with this issue.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" role="complementary" aria-label="Help and support options">
          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">System Status</h3>
            <p className="text-sm text-text-secondary mb-4">Check if we're experiencing widespread issues</p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/status" aria-label="Check system status">
                Check Status
              </Link>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <HelpCircle className="h-6 w-6 text-mint-green" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Get Help</h3>
            <p className="text-sm text-text-secondary mb-4">Find answers in our help center</p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/help" aria-label="Get help and support">
                Help Center
              </Link>
            </Button>
          </Card>

          <Card className="p-6 text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-pale-lavender/20 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Mail className="h-6 w-6 text-pale-lavender" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Report Issue</h3>
            <p className="text-sm text-text-secondary mb-4">Send us detailed error information</p>
            <Button variant="ghost" size="sm" onClick={handleContactSupport}>
              Report Now
            </Button>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-text-tertiary text-sm">
            We apologize for the inconvenience. Our team is working to resolve this issue as quickly as possible.
            <br />
            <span className="text-mint-green font-medium">
              Trace ID: {generatedTraceId}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}