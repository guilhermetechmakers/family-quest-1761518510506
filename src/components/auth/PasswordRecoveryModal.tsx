import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePasswordReset } from '@/hooks/useAuth';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ResetForm = z.infer<typeof resetSchema>;

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordRecoveryModal({ isOpen, onClose }: PasswordRecoveryModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resetPassword = usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await resetPassword.mutateAsync(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6">
              <CardHeader className="text-center pb-4">
                <button
                  onClick={handleClose}
                  className="absolute left-4 top-4 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <CardTitle className="text-xl">
                  {isSubmitted ? 'Check Your Email' : 'Reset Password'}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    className="text-center space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Password Reset Email Sent
                      </h3>
                      <p className="text-text-secondary">
                        We've sent a password reset link to your email address. 
                        Please check your inbox and follow the instructions to reset your password.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button onClick={handleClose} className="w-full">
                        Got it
                      </Button>
                      <p className="text-sm text-text-tertiary">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="text-mint-green hover:text-light-mint font-medium"
                        >
                          try again
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-text-secondary text-center">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            className="pl-10"
                            {...register('email')}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={resetPassword.isPending}
                          className="flex-1"
                        >
                          {resetPassword.isPending ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                      </div>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-text-tertiary">
                        Remember your password?{' '}
                        <button
                          onClick={handleClose}
                          className="text-mint-green hover:text-light-mint font-medium"
                        >
                          Sign in
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}