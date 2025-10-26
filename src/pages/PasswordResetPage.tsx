import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { usePasswordReset, useUpdatePassword } from '@/hooks/useAuth';
import { ArrowLeft, Mail, Lock, CheckCircle, Shield } from 'lucide-react';

// Request reset form schema
const requestResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Reset password form schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RequestResetForm = z.infer<typeof requestResetSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;


export function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'confirm' | 'reset'>('request');
  const [email, setEmail] = useState('');
  
  const token = searchParams.get('token');
  const isResetMode = token && step === 'reset';

  const passwordReset = usePasswordReset();
  const updatePassword = useUpdatePassword();

  // Request reset form
  const requestForm = useForm<RequestResetForm>({
    resolver: zodResolver(requestResetSchema),
  });

  // Reset password form
  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onRequestReset = async (data: RequestResetForm) => {
    try {
      await passwordReset.mutateAsync(data.email);
      setEmail(data.email);
      setStep('confirm');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    if (!token) return;
    
    try {
      await updatePassword.mutateAsync({ token, password: data.password });
      navigate('/login?message=password-reset-success');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // If we have a token, show reset form
  if (token && step === 'request') {
    setStep('reset');
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login */}
        <div className="text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center text-text-secondary hover:text-mint-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary">
            {isResetMode ? 'Reset Your Password' : 'Forgot Password?'}
          </h1>
          <p className="mt-2 text-text-secondary">
            {isResetMode 
              ? 'Enter your new password below'
              : 'No worries! Enter your email and we\'ll send you reset instructions.'
            }
          </p>
        </div>

        {/* Request Reset Form */}
        {step === 'request' && (
          <Card className="p-8 animate-fade-in">
            <form onSubmit={requestForm.handleSubmit(onRequestReset)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    {...requestForm.register('email')}
                  />
                </div>
                {requestForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {requestForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={passwordReset.isPending}
              >
                {passwordReset.isPending ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          </Card>
        )}

        {/* Confirmation Message */}
        {step === 'confirm' && (
          <Card className="p-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-mint-green rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                Check Your Email
              </h2>
              <p className="text-text-secondary">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-text-tertiary">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setStep('request')}
                  className="text-mint-green hover:text-light-mint font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </Card>
        )}

        {/* Reset Password Form */}
        {step === 'reset' && (
          <Card className="p-8 animate-fade-in">
            <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="pl-10"
                    {...resetForm.register('password')}
                  />
                </div>
                <PasswordStrengthMeter password={resetForm.watch('password') || ''} />
                {resetForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="pl-10"
                    {...resetForm.register('confirmPassword')}
                  />
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updatePassword.isPending}
              >
                {updatePassword.isPending ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          </Card>
        )}

        {/* Security Tips */}
        <Card className="p-6 bg-mint-tint border-l-4 border-mint-green">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-mint-green mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-text-primary">
                Security Tips
              </h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Use a unique password for this account</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid using personal information</li>
                <li>• Consider using a password manager</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-mint-green hover:text-light-mint font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}