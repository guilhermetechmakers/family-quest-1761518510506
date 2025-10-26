import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Shield, Crown, Users } from 'lucide-react';
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
      <Card className="p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
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
      <Card className="p-6 hover:shadow-card-hover transition-all duration-300">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-4 ring-mint-green/20">
            <AvatarImage src={user.avatar_url} alt={user.full_name} />
            <AvatarFallback className="bg-mint-green text-text-primary text-lg font-semibold">
              {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-semibold text-text-primary">
                {user.full_name}
              </h2>
              <Badge 
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1',
                  roleColors[user.role]
                )}
              >
                <RoleIcon className="h-3 w-3" />
                <span className="capitalize">{user.role}</span>
              </Badge>
            </div>
            
            <p className="text-text-secondary text-sm mb-1">
              {user.email}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-text-tertiary">
              <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
              {user.is_verified && (
                <span className="flex items-center space-x-1 text-mint-green">
                  <Shield className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="hover:bg-mint-green hover:text-text-primary transition-all duration-200 hover:scale-105"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
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