import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';

interface AuthSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
  icon?: React.ReactNode;
}

export function AuthSuccessModal({
  isOpen,
  onClose,
  title,
  message,
  actionText = 'Continue',
  onAction,
  showAction = true,
  icon = <CheckCircle className="h-6 w-6 text-success" />,
}: AuthSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="auth-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </DialogTitle>
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
            {showAction && onAction && (
              <Button
                onClick={onAction}
                className="flex-1 auth-button"
              >
                {actionText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Specific success modals for common scenarios
export function SignupSuccessModal({
  isOpen,
  onClose,
  onContinue,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  email?: string;
}) {
  return (
    <AuthSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Created!"
      message={
        email
          ? `We've sent a verification email to ${email}. Please check your inbox and click the verification link to complete your account setup.`
          : "Your account has been created successfully! Please check your email for verification instructions."
      }
      actionText="Check Email"
      onAction={onContinue}
      icon={<Mail className="h-6 w-6 text-info" />}
    />
  );
}

export function LoginSuccessModal({
  isOpen,
  onClose,
  onContinue,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}) {
  return (
    <AuthSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back!"
      message="You've been signed in successfully. Welcome back to Family Quest!"
      actionText="Go to Dashboard"
      onAction={onContinue}
    />
  );
}

export function PasswordResetSuccessModal({
  isOpen,
  onClose,
  onContinue,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
  email?: string;
}) {
  return (
    <AuthSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Email Sent!"
      message={
        email
          ? `We've sent password reset instructions to ${email}. Please check your inbox and follow the link to reset your password.`
          : "We've sent password reset instructions to your email. Please check your inbox and follow the link to reset your password."
      }
      actionText="Check Email"
      onAction={onContinue}
      icon={<Mail className="h-6 w-6 text-info" />}
    />
  );
}

export function EmailVerificationSuccessModal({
  isOpen,
  onClose,
  onContinue,
}: {
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}) {
  return (
    <AuthSuccessModal
      isOpen={isOpen}
      onClose={onClose}
      title="Email Verified!"
      message="Your email has been verified successfully. You can now access all features of Family Quest."
      actionText="Continue"
      onAction={onContinue}
    />
  );
}