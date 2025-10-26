import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Users, CreditCard, Settings, Shield } from 'lucide-react';
import { useUserProfile } from '@/hooks/useProfile';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { FamilyMembers } from '@/components/profile/FamilyMembers';
import { PaymentMethods } from '@/components/profile/PaymentMethods';
import { Preferences } from '@/components/profile/Preferences';
import { Security } from '@/components/profile/Security';

export function ProfilePage() {
  const { data: user, isLoading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('profile');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Profile Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            Unable to load your profile information.
          </p>
          <Button asChild>
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-mint-green/10 transition-colors duration-200"
            asChild
          >
            <a href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
          
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Profile Settings
            </h1>
            <p className="text-text-secondary text-lg">
              Manage your personal profile and family membership settings.
            </p>
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 bg-pale-lavender-bg p-1 rounded-xl">
            <TabsTrigger 
              value="profile" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="family" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Family</span>
            </TabsTrigger>
            
            {(user.role === 'parent' || user.role === 'admin') && (
              <TabsTrigger 
                value="payments" 
                className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger 
              value="preferences" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="flex items-center space-x-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary hover:bg-mint-green/20 transition-all duration-200"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileCard />
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <FamilyMembers currentUserRole={user.role} />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentMethods currentUserRole={user.role} />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Preferences />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Security />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}