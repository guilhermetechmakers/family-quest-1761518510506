import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function AuthErrorModal({
  isOpen,
  onClose,
  title = 'Authentication Error',
  message,
  onRetry,
  showRetry = false,
}: AuthErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="auth-card max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-text-primary flex items-center">
              <AlertCircle className="h-5 w-5 text-error mr-2" />
              {title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <p className="text-text-secondary">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 auth-button-secondary"
            >
              Close
            </Button>
            {showRetry && onRetry && (
              <Button
                onClick={onRetry}
                className="flex-1 auth-button"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Specific error modals for common scenarios
export function LoginErrorModal({
  isOpen,
  onClose,
  onRetry,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}) {
  return (
    <AuthErrorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In Failed"
      message="We couldn't sign you in. Please check your email and password, then try again."
      onRetry={onRetry}
      showRetry={true}
    />
  );
}

export function SignupErrorModal({
  isOpen,
  onClose,
  onRetry,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}) {
  return (
    <AuthErrorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Creation Failed"
      message="We couldn't create your account. Please check your information and try again."
      onRetry={onRetry}
      showRetry={true}
    />
  );
}

export function NetworkErrorModal({
  isOpen,
  onClose,
  onRetry,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}) {
  return (
    <AuthErrorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Connection Error"
      message="We're having trouble connecting to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
      showRetry={true}
    />
  );
}

export function OAuthErrorModal({
  isOpen,
  onClose,
  onRetry,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}) {
  return (
    <AuthErrorModal
      isOpen={isOpen}
      onClose={onClose}
      title="Social Sign-In Failed"
      message="We couldn't complete your social sign-in. Please try again or use email and password instead."
      onRetry={onRetry}
      showRetry={true}
    />
  );
}