import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSignIn, useSignUp } from '@/hooks/useAuth';
import { TermsCheckbox } from '@/components/auth/TermsAcknowledgement';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Gift,
  Users,
  Target,
  Heart
} from 'lucide-react';

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember_me: z.boolean().optional(),
});

// Signup form schema
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

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const signIn = useSignIn();
  const signUp = useSignUp();

  // Check for invite code in URL
  const inviteCode = searchParams.get('invite');

  // Set initial tab based on route
  useEffect(() => {
    if (location.pathname === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember_me: false,
    },
  });

  // Signup form
  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      invite_code: inviteCode || '',
      terms: false,
    },
  });

  const password = signupForm.watch('password', '');

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

  // Form submission handlers
  const onLoginSubmit = async (data: LoginForm) => {
    try {
      await signIn.mutateAsync(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      await signUp.mutateAsync({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        invite_code: data.invite_code,
      });
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  // Social OAuth handlers
  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth');
  };

  const handleAppleAuth = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple OAuth');
  };

  const handleFacebookAuth = () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook OAuth');
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-text-primary mb-4">
                  Welcome to Family Quest
                </h1>
                <p className="text-xl text-text-secondary mb-8">
                  Turn your family's dreams into collaborative missions with visible progress, 
                  milestones, and shared achievements.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-mint-green rounded-2xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Goal Tracking</h3>
                    <p className="text-text-secondary">Set and track family goals together</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-pale-lavender rounded-2xl flex items-center justify-center">
                    <Gift className="h-6 w-6 text-text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Milestones & Rewards</h3>
                    <p className="text-text-secondary">Celebrate progress with meaningful rewards</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-light-pink rounded-2xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Family Collaboration</h3>
                    <p className="text-text-secondary">Work together towards common goals</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-12 h-12 bg-pastel-yellow rounded-2xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">Share & Celebrate</h3>
                    <p className="text-text-secondary">Share achievements with extended family</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Hero - Show on small screens */}
          <motion.div 
            className="lg:hidden text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Welcome to Family Quest
            </h1>
            <p className="text-lg text-text-secondary">
              Turn your family's dreams into collaborative missions
            </p>
          </motion.div>

          {/* Right side - Auth form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 max-w-md mx-auto">
              {/* Back to Home */}
              <div className="mb-6">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-text-secondary hover:text-mint-green transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </div>

              {/* Auth Tabs */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')}>
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50">
                  <TabsTrigger 
                    value="login" 
                    className="rounded-full data-[state=active]:bg-mint-green data-[state=active]:text-text-primary transition-all duration-200"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-full data-[state=active]:bg-mint-green data-[state=active]:text-text-primary transition-all duration-200"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-6">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
                    <p className="text-text-secondary mt-2">
                      Sign in to continue your family quest
                    </p>
                  </motion.div>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                    <div>
                      <label htmlFor="login-email" className="block text-sm font-medium text-text-primary mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          {...loginForm.register('email')}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="login-password" className="block text-sm font-medium text-text-primary mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...loginForm.register('password')}
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
                      {loginForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember_me"
                          type="checkbox"
                          className="h-4 w-4 text-mint-green focus:ring-mint-green border-gray-300 rounded"
                          {...loginForm.register('remember_me')}
                        />
                        <label htmlFor="remember_me" className="ml-2 block text-sm text-text-secondary">
                          Remember me
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-mint-green hover:text-light-mint transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={signIn.isPending}
                    >
                      {signIn.isPending ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-6">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-text-primary">Join Family Quest</h2>
                    <p className="text-text-secondary mt-2">
                      Start your family's journey to achieving dreams together
                    </p>
                  </motion.div>

                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
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
                          className="pl-10"
                          {...signupForm.register('full_name')}
                        />
                      </div>
                      {signupForm.formState.errors.full_name && (
                        <p className="mt-1 text-sm text-red-500">
                          {signupForm.formState.errors.full_name.message}
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
                          className="pl-10"
                          {...signupForm.register('email')}
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {signupForm.formState.errors.email.message}
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
                          className="pl-10 pr-10"
                          {...signupForm.register('password')}
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
                                      ? 'bg-red-500'
                                      : passwordStrength <= 3
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
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
                      {signupForm.formState.errors.password && (
                        <p className="mt-1 text-sm text-red-500">
                          {signupForm.formState.errors.password.message}
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
                          className="pl-10 pr-10"
                          {...signupForm.register('confirm_password')}
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
                      {signupForm.formState.errors.confirm_password && (
                        <p className="mt-1 text-sm text-red-500">
                          {signupForm.formState.errors.confirm_password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="invite-code" className="block text-sm font-medium text-text-primary mb-2">
                        Family Invite Code (Optional)
                      </label>
                      <Input
                        id="invite-code"
                        type="text"
                        placeholder="Enter family invite code"
                        {...signupForm.register('invite_code')}
                      />
                      <p className="text-xs text-text-tertiary mt-1">
                        Have a family invite code? Enter it here to join an existing family.
                      </p>
                    </div>

                    <TermsCheckbox
                      accepted={signupForm.watch('terms')}
                      onAccept={(accepted) => signupForm.setValue('terms', accepted)}
                    />
                    {signupForm.formState.errors.terms && (
                      <p className="mt-1 text-sm text-red-500">
                        {signupForm.formState.errors.terms.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={signUp.isPending}
                    >
                      {signUp.isPending ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Social OAuth Section */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-text-tertiary">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-gray-50 transition-colors"
                      onClick={handleGoogleAuth}
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
                        variant="outline" 
                        className="w-full hover:bg-gray-50 transition-colors"
                        onClick={handleAppleAuth}
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
                        variant="outline" 
                        className="w-full hover:bg-gray-50 transition-colors"
                        onClick={handleFacebookAuth}
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

              {/* Switch between login/signup */}
              <div className="text-center mt-6">
                <p className="text-sm text-text-secondary">
                  {activeTab === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-mint-green hover:text-light-mint font-medium transition-colors"
                      >
                        Sign up here
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-mint-green hover:text-light-mint font-medium transition-colors"
                      >
                        Sign in here
                      </button>
                    </>
                  )}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

    </div>
  );
}