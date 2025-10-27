import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationState {
  status: 'pending' | 'verifying' | 'success' | 'error' | 'expired';
  message: string;
  canResend: boolean;
  cooldownTime: number;
}

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail } = useAuth();
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'pending',
    message: 'Please check your email and click the verification link to activate your account.',
    canResend: true,
    cooldownTime: 0,
  });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Cooldown timer
  const startCooldownTimer = () => {
    const interval = setInterval(() => {
      setVerificationState(prev => {
        if (prev.cooldownTime <= 1) {
          clearInterval(interval);
          return {
            ...prev,
            canResend: true,
            cooldownTime: 0,
          };
        }
        return {
          ...prev,
          cooldownTime: prev.cooldownTime - 1,
        };
      });
    }, 1000);
  };

  // Handle token verification on mount
  useEffect(() => {
    if (token) {
      setVerificationState(prev => ({
        ...prev,
        status: 'verifying',
        message: 'Verifying your email...',
      }));
      
      verifyEmail(token)
        .then(() => {
          setVerificationState({
            status: 'success',
            message: 'Your email has been successfully verified! You can now access all features.',
            canResend: false,
            cooldownTime: 0,
          });
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        })
        .catch((error) => {
          const errorMessage = error?.response?.data?.message || 'Verification failed. Please try again.';
          setVerificationState({
            status: 'error',
            message: errorMessage,
            canResend: true,
            cooldownTime: 0,
          });
        });
    }
  }, [token, verifyEmail, navigate]);

  const handleResendEmail = async () => {
    if (email) {
      try {
        await resendVerificationEmail(email);
        setVerificationState(prev => ({
          ...prev,
          status: 'pending',
          message: 'A new verification email has been sent. Please check your inbox.',
          canResend: false,
          cooldownTime: 60, // 60 seconds cooldown
        }));
        startCooldownTimer();
      } catch (error) {
        // Error is handled by the auth context
      }
    }
  };

  const getStatusIcon = () => {
    switch (verificationState.status) {
      case 'verifying':
        return <RefreshCw className="h-16 w-16 text-mint-green animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-mint-green" />;
      case 'error':
      case 'expired':
        return <AlertCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-mint-green" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationState.status) {
      case 'success':
        return 'bg-mint-tint border-mint-green';
      case 'error':
      case 'expired':
        return 'bg-red-50 border-red-200';
      case 'verifying':
        return 'bg-pale-lavender-bg border-pale-lavender';
      default:
        return 'bg-pale-lavender-bg border-pale-lavender';
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-text-secondary hover:text-text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            Email Verification
          </h1>
          <p className="text-text-secondary">
            {email && `We sent a verification link to ${email}`}
          </p>
        </div>

        {/* Main Card */}
        <Card className={`p-8 text-center ${getStatusColor()} border-2 transition-all duration-300`}>
          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-text-primary mb-3">
              {verificationState.status === 'verifying' && 'Verifying...'}
              {verificationState.status === 'success' && 'Email Verified!'}
              {verificationState.status === 'error' && 'Verification Failed'}
              {verificationState.status === 'expired' && 'Link Expired'}
              {verificationState.status === 'pending' && 'Check Your Email'}
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {verificationState.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {verificationState.status === 'success' && (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">
                  Redirecting to dashboard...
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-mint-green hover:bg-light-mint text-text-primary font-medium py-3 rounded-full transition-all duration-200 hover:scale-105"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {(verificationState.status === 'pending' || verificationState.status === 'error' || verificationState.status === 'expired') && (
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={!verificationState.canResend}
                  className="w-full bg-mint-green hover:bg-light-mint text-text-primary font-medium py-3 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {verificationState.canResend ? (
                    'Resend Verification Email'
                  ) : (
                    `Resend in ${verificationState.cooldownTime}s`
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full border-2 border-pale-lavender text-text-primary hover:bg-pale-lavender font-medium py-3 rounded-full transition-all duration-200"
                >
                  Back to Login
                </Button>
              </div>
            )}

            {verificationState.status === 'verifying' && (
              <div className="space-y-3">
                <p className="text-sm text-text-secondary">
                  Please wait while we verify your email...
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full border-2 border-pale-lavender text-text-primary hover:bg-pale-lavender font-medium py-3 rounded-full transition-all duration-200"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-center mb-3">
              <HelpCircle className="h-5 w-5 text-text-secondary mr-2" />
              <h3 className="font-medium text-text-primary">Need Help?</h3>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              If you're having trouble verifying your email, we're here to help.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:support@familyquest.app"
                className="block text-sm text-mint-green hover:text-light-mint transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/help"
                className="block text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 text-center">
          <div className="bg-mint-tint rounded-2xl p-4">
            <h4 className="font-medium text-text-primary mb-2 text-sm">Security Tips</h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure you're using the correct email address</li>
              <li>• Verification links expire after 24 hours</li>
              <li>• Never share verification links with others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}