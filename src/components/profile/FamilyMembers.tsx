import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Crown, 
  User,
  Trash2,
  Settings
} from 'lucide-react';
import { useFamily, useRemoveMember } from '@/hooks/useProfile';
import { InviteMemberModal } from './InviteMemberModal';
import { MemberPermissionsModal } from './MemberPermissionsModal';
import { cn } from '@/lib/utils';
import type { FamilyMember } from '@/types/family';

const roleIcons = {
  parent: Crown,
  child: User,
  guest: Users,
};

const roleColors = {
  parent: 'bg-mint-green text-text-primary',
  child: 'bg-pastel-yellow text-text-primary',
  guest: 'bg-light-pink text-text-primary',
};

interface FamilyMembersProps {
  currentUserRole: string;
}

export function FamilyMembers({ currentUserRole }: FamilyMembersProps) {
  const { data: family, isLoading } = useFamily();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const removeMember = useRemoveMember();

  const canInvite = currentUserRole === 'parent' || currentUserRole === 'admin';
  const canManage = currentUserRole === 'parent' || currentUserRole === 'admin';

  const handleRemoveMember = (member: FamilyMember) => {
    if (window.confirm(`Are you sure you want to remove ${member.user.full_name} from the family?`)) {
      removeMember.mutate({
        familyId: family!.id,
        userId: member.user_id
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!family) {
    return null;
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-mint-green" />
            <h3 className="text-xl font-semibold text-text-primary">
              Family Members ({family.members.length})
            </h3>
          </div>
          
          {canInvite && (
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {family.members.map((member) => {
            const RoleIcon = roleIcons[member.role] || User;
            const isCurrentUser = member.user_id === family.members.find(m => m.role === 'parent')?.user_id;
            
            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-xl hover:bg-mint-tint transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-mint-green/20">
                    <AvatarImage src={member.user.avatar_url} alt={member.user.full_name} />
                    <AvatarFallback className="bg-mint-green text-text-primary font-semibold">
                      {member.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-text-primary">
                        {member.user.full_name}
                      </h4>
                      <Badge 
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1',
                          roleColors[member.role]
                        )}
                      >
                        <RoleIcon className="h-3 w-3" />
                        <span className="capitalize">{member.role}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-text-secondary">
                      {member.user.email}
                    </p>
                    
                    <p className="text-xs text-text-tertiary">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {canManage && !isCurrentUser && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMember(member);
                        setIsPermissionsModalOpen(true);
                      }}
                      className="hover:bg-mint-green hover:text-text-primary"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      className="hover:bg-red-100 hover:text-red-600"
                      disabled={removeMember.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {family.members.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <p className="text-text-secondary mb-4">No family members yet</p>
              {canInvite && (
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Your First Member
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        familyId={family.id}
      />

      {selectedMember && (
        <MemberPermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          familyId={family.id}
        />
      )}
    </>
  );
}