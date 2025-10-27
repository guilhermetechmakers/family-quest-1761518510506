import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const newPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type NewPasswordForm = z.infer<typeof newPasswordSchema>;

interface NewPasswordFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function NewPasswordForm({ onSuccess, className }: NewPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const { updatePassword, isLoading } = useAuth();

  const token = searchParams.get('token');

  const form = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
  });

  const password = form.watch('password', '');

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: NewPasswordForm) => {
    if (!token) {
      form.setError('root', { message: 'Invalid reset token' });
      return;
    }

    try {
      await updatePassword(token, data.password);
      setIsSubmitted(true);
      onSuccess?.();
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
            Password Updated!
          </h2>
          <p className="text-text-secondary mb-6">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center auth-button"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!token) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Invalid Reset Link
          </h2>
          <p className="text-text-secondary mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="space-y-3">
            <Link
              to="/forgot-password"
              className="inline-flex items-center auth-button"
            >
              Request New Reset Link
            </Link>
            <Link
              to="/auth"
              className="block text-mint-green hover:text-light-mint transition-colors"
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
        <h2 className="text-2xl font-bold text-text-primary">Set New Password</h2>
        <p className="text-text-secondary mt-2">
          Enter your new password below. Make sure it's secure and easy to remember.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              className="pl-10 pr-10 auth-input"
              {...form.register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-text-tertiary" />
              ) : (
                <Eye className="h-5 w-5 text-text-tertiary" />
              )}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1 w-full rounded-full ${
                      level <= passwordStrength
                        ? passwordStrength <= 2
                          ? 'password-strength-weak'
                          : passwordStrength <= 3
                          ? 'password-strength-medium'
                          : 'password-strength-strong'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-text-tertiary mt-1">
                Password strength: {
                  passwordStrength <= 2 ? 'Weak' :
                  passwordStrength <= 3 ? 'Medium' : 'Strong'
                }
              </p>
            </div>
          )}
          {form.formState.errors.password && (
            <p className="form-error">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              className="pl-10 pr-10 auth-input"
              {...form.register('confirm_password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-text-tertiary" />
              ) : (
                <Eye className="h-5 w-5 text-text-tertiary" />
              )}
            </button>
          </div>
          {form.formState.errors.confirm_password && (
            <p className="form-error">
              {form.formState.errors.confirm_password.message}
            </p>
          )}
        </div>

        {form.formState.errors.root && (
          <p className="form-error">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full auth-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </Button>
      </form>
    </motion.div>
  );
}