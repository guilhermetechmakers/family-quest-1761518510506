import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { TermsCheckbox } from '@/components/auth/TermsAcknowledgement';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const signupSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  invite_code: z.string().optional(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type SignupForm = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
  defaultInviteCode?: string;
}

export function SignupForm({ 
  onSuccess, 
  onSwitchToLogin, 
  className,
  defaultInviteCode = ''
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, isLoading, validateInviteCode } = useAuth();
  const [inviteValidation, setInviteValidation] = useState<{
    isValid: boolean | null;
    familyName?: string;
    inviterName?: string;
  }>({ isValid: null });

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      invite_code: defaultInviteCode,
      terms: false,
    },
  });

  const password = form.watch('password', '');
  const inviteCode = form.watch('invite_code', '');

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

  // Validate invite code when it changes
  useEffect(() => {
    if (inviteCode && inviteCode.length > 5) {
      validateInviteCode(inviteCode)
        .then((result) => {
          setInviteValidation({
            isValid: result.valid,
            familyName: result.family_name,
            inviterName: result.inviter_name,
          });
        })
        .catch(() => {
          setInviteValidation({ isValid: false });
        });
    } else {
      setInviteValidation({ isValid: null });
    }
  }, [inviteCode, validateInviteCode]);

  const onSubmit = async (data: SignupForm) => {
    try {
      await signUp({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        invite_code: data.invite_code,
      });
      onSuccess?.();
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signUp({ full_name: '', email: '', password: '' }); // This will be replaced with OAuth
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleAppleAuth = async () => {
    try {
      await signUp({ full_name: '', email: '', password: '' }); // This will be replaced with OAuth
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleFacebookAuth = async () => {
    try {
      await signUp({ full_name: '', email: '', password: '' }); // This will be replaced with OAuth
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Join Family Quest</h2>
        <p className="text-text-secondary mt-2">
          Start your family's journey to achieving dreams together
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium text-text-primary mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              className="pl-10 auth-input"
              {...form.register('full_name')}
            />
          </div>
          {form.formState.errors.full_name && (
            <p className="form-error">
              {form.formState.errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="signup-email"
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

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-text-primary mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
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
          <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-text-primary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
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

        <div>
          <label htmlFor="invite-code" className="block text-sm font-medium text-text-primary mb-2">
            Family Invite Code (Optional)
          </label>
          <div className="relative">
            <Input
              id="invite-code"
              type="text"
              placeholder="Enter family invite code"
              className="auth-input pr-10"
              {...form.register('invite_code')}
            />
            {inviteCode && inviteCode.length > 5 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {inviteValidation.isValid === true ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : inviteValidation.isValid === false ? (
                  <XCircle className="h-5 w-5 text-error" />
                ) : (
                  <div className="loading-spinner h-5 w-5" />
                )}
              </div>
            )}
          </div>
          {inviteValidation.isValid === true && (
            <p className="form-success">
              Valid invite code! You'll join {inviteValidation.familyName} family.
            </p>
          )}
          {inviteValidation.isValid === false && (
            <p className="form-error">
              Invalid invite code. Please check and try again.
            </p>
          )}
          <p className="text-xs text-text-tertiary mt-1">
            Have a family invite code? Enter it here to join an existing family.
          </p>
        </div>

        <TermsCheckbox
          accepted={form.watch('terms')}
          onAccept={(accepted) => form.setValue('terms', accepted)}
        />
        {form.formState.errors.terms && (
          <p className="form-error">
            {form.formState.errors.terms.message}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {/* Social OAuth Section */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-auth-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-auth-card text-text-tertiary">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="button"
              variant="outline"
              className="social-button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                className="social-button"
                onClick={handleAppleAuth}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-2.415-3.038 0-1.937 1.467-3.005 2.415-3.005.953 0 2.415 1.068 2.415 3.005 0 1.96-1.462 3.038-2.415 3.038zM12.152 7.38c2.906 0 5.258 2.353 5.258 5.258 0 2.905-2.352 5.258-5.258 5.258-2.905 0-5.258-2.353-5.258-5.258 0-2.905 2.353-5.258 5.258-5.258z"/>
                </svg>
                Apple
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                className="social-button"
                onClick={handleFacebookAuth}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Switch to login */}
      <div className="text-center mt-6">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-mint-green hover:text-light-mint font-medium transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </motion.div>
  );
}