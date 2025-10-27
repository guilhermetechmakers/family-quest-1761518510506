import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Shield, Crown, Users, Calendar, Mail, CheckCircle } from 'lucide-react';
import { useUserProfile } from '@/hooks/useProfile';
import { ProfileEditModal } from './ProfileEditModal';
import { cn } from '@/lib/utils';

const roleIcons = {
  parent: Crown,
  child: Users,
  guest: User,
  admin: Shield,
};

const roleColors = {
  parent: 'bg-mint-green text-text-primary',
  child: 'bg-pastel-yellow text-text-primary',
  guest: 'bg-light-pink text-text-primary',
  admin: 'bg-light-purple text-text-primary',
};

export function ProfileCard() {
  const { data: user, isLoading } = useUserProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="p-8 animate-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto sm:mx-0"></div>
          <div className="space-y-3 flex-1 text-center sm:text-left">
            <div className="h-7 bg-gray-200 rounded w-56 mx-auto sm:mx-0"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto sm:mx-0"></div>
            <div className="h-3 bg-gray-200 rounded w-48 mx-auto sm:mx-0"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  const RoleIcon = roleIcons[user.role] || User;

  return (
    <>
      <Card className="p-8 hover:shadow-card-hover transition-all duration-300 group">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Avatar Section */}
          <div className="relative mx-auto sm:mx-0">
            <Avatar className="h-20 w-20 ring-4 ring-mint-green/20 group-hover:ring-mint-green/40 transition-all duration-300">
              <AvatarImage src={user.avatar_url} alt={user.full_name} />
              <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary text-xl font-bold">
                {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.is_verified && (
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-mint-green rounded-full shadow-lg">
                <CheckCircle className="h-4 w-4 text-text-primary" />
              </div>
            )}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
              <h2 className="text-3xl font-bold text-text-primary group-hover:text-mint-green transition-colors duration-300">
                {user.full_name}
              </h2>
              <Badge 
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 mx-auto sm:mx-0',
                  roleColors[user.role],
                  'group-hover:scale-105 transition-transform duration-200'
                )}
              >
                <RoleIcon className="h-4 w-4" />
                <span className="capitalize">{user.role}</span>
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-text-secondary">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-text-tertiary">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {user.is_verified && (
                <div className="flex items-center space-x-1 px-3 py-1 bg-mint-tint rounded-full">
                  <Shield className="h-3 w-3 text-mint-green" />
                  <span className="text-xs font-medium text-text-primary">Verified Account</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1 px-3 py-1 bg-pale-lavender-bg rounded-full">
                <User className="h-3 w-3 text-light-purple" />
                <span className="text-xs font-medium text-text-primary">Active Member</span>
              </div>
            </div>
          </div>
          
          {/* Action Button */}
          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsEditModalOpen(true)}
              className="w-full sm:w-auto hover:bg-mint-green hover:text-text-primary hover:border-mint-green transition-all duration-200 hover:scale-105 group-hover:shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </>
  );
}