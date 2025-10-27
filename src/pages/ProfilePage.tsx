import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Users, CreditCard, Settings, Shield, Sparkles } from 'lucide-react';
import { useUserProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { FamilyMembers } from '@/components/profile/FamilyMembers';
import { PaymentMethods } from '@/components/profile/PaymentMethods';
import { Preferences } from '@/components/profile/Preferences';
import { Security } from '@/components/profile/Security';

export function ProfilePage() {
  const { data: user, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('profile');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded w-80 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 bg-pale-lavender-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-text-tertiary" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Profile Not Found
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Unable to load your profile information. Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200">
              <a href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </a>
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <Button 
            variant="ghost" 
            className="mb-8 hover:bg-mint-green/10 transition-all duration-200 group"
            asChild
          >
            <a href="/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Dashboard</span>
            </a>
          </Button>
          
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
              <div className="p-3 bg-mint-green/20 rounded-xl">
                <Sparkles className="h-8 w-8 text-mint-green" />
              </div>
              <h1 className="text-4xl font-bold text-text-primary">
                Profile Settings
              </h1>
            </div>
            <p className="text-text-secondary text-xl max-w-2xl">
              Manage your personal profile and family membership settings. Customize your experience and keep your account secure.
            </p>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 bg-pale-lavender-bg p-2 rounded-2xl shadow-lg">
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200 rounded-xl py-3"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Profile</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="family" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200 rounded-xl py-3"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Family</span>
            </TabsTrigger>
            
            {(user.role === 'parent' || user.role === 'admin') && (
              <TabsTrigger 
                value="payments" 
                className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200 rounded-xl py-3"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">Payments</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="preferences" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200 rounded-xl py-3"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Preferences</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200 rounded-xl py-3"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <TabsContent value="profile" className="space-y-8">
              <ProfileCard />
            </TabsContent>

            <TabsContent value="family" className="space-y-8">
              <FamilyMembers currentUserRole={user.role} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-8">
              <PaymentMethods currentUserRole={user.role} />
            </TabsContent>

            <TabsContent value="preferences" className="space-y-8">
              <Preferences />
            </TabsContent>

            <TabsContent value="security" className="space-y-8">
              <Security />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}