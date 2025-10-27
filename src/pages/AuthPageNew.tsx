import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { 
  ArrowLeft, 
  Target,
  Gift,
  Users,
  Heart
} from 'lucide-react';

export function AuthPageNew() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [searchParams] = useSearchParams();
  const location = useLocation();

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

  return (
    <div className="auth-container">
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
            <Card className="auth-card">
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
                  <LoginForm
                    onSwitchToSignup={() => setActiveTab('signup')}
                  />
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-6">
                  <SignupForm
                    onSwitchToLogin={() => setActiveTab('login')}
                    defaultInviteCode={inviteCode || ''}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}