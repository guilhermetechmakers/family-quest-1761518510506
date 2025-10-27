import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mail, 
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface PasswordResetFormProps {
  onSuccess?: (email: string) => void;
  className?: string;
}

export function PasswordResetForm({ onSuccess, className }: PasswordResetFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { resetPassword, isLoading } = useAuth();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      await resetPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      onSuccess?.(data.email);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Reset Email Sent!
          </h2>
          <p className="text-text-secondary mb-6">
            We've sent password reset instructions to{' '}
            <span className="font-medium text-text-primary">{submittedEmail}</span>.
            Please check your inbox and follow the link to reset your password.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              className="w-full auth-button"
            >
              Send Another Email
            </Button>
            <Link
              to="/auth"
              className="block text-center text-mint-green hover:text-light-mint transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <Link 
          to="/auth" 
          className="inline-flex items-center text-text-secondary hover:text-mint-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Reset Password</h2>
        <p className="text-text-secondary mt-2">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              className="pl-10 auth-input"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className="form-error">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full auth-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending Reset Email...
            </>
          ) : (
            'Send Reset Email'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-text-secondary">
          Remember your password?{' '}
          <Link
            to="/auth"
            className="text-mint-green hover:text-light-mint font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </motion.div>
  );
}