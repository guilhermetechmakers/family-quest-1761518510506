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
  Settings,
  Calendar,
  Mail,
  Shield,
  CheckCircle
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
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);

  const removeMember = useRemoveMember();

  const canInvite = currentUserRole === 'parent' || currentUserRole === 'admin';
  const canManage = currentUserRole === 'parent' || currentUserRole === 'admin';

  const handleRemoveMember = (member: FamilyMember) => {
    if (window.confirm(`Are you sure you want to remove ${member.user.full_name} from the family? This action cannot be undone.`)) {
      removeMember.mutate({
        familyId: family!.id,
        userId: member.user_id
      });
    }
  };

  const getMemberStatus = (member: FamilyMember) => {
    const joinedDate = new Date(member.joined_at);
    const daysSinceJoined = Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceJoined < 7) return 'new';
    if (member.role === 'parent') return 'admin';
    return 'active';
  };

  if (isLoading) {
    return (
      <Card className="p-8 animate-pulse">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-7 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
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
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-mint-green/20 rounded-lg">
              <Users className="h-6 w-6 text-mint-green" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-text-primary">
                Family Members
              </h3>
              <p className="text-sm text-text-secondary">
                {family.members.length} member{family.members.length !== 1 ? 's' : ''} in your family
              </p>
            </div>
          </div>
          
          {canInvite && (
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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
            const memberStatus = getMemberStatus(member);
            const isHovered = hoveredMember === member.id;
            
            return (
              <div
                key={member.id}
                className="group relative p-6 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-3 ring-mint-green/20 group-hover:ring-mint-green/40 transition-all duration-300">
                        <AvatarImage src={member.user.avatar_url} alt={member.user.full_name} />
                        <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary text-lg font-bold">
                          {member.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {memberStatus === 'new' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-pastel-yellow rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-text-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-text-primary group-hover:text-mint-green transition-colors duration-200">
                          {member.user.full_name}
                        </h4>
                        <Badge 
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 group-hover:scale-105 transition-transform duration-200',
                            roleColors[member.role]
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          <span className="capitalize">{member.role}</span>
                        </Badge>
                        {memberStatus === 'admin' && (
                          <Badge className="px-2 py-1 rounded-full text-xs font-semibold bg-light-purple text-text-primary flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>Admin</span>
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Mail className="h-3 w-3" />
                          <span>{member.user.email}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {canManage && !isCurrentUser && (
                    <div className={cn(
                      "flex items-center space-x-2 transition-all duration-200",
                      isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                    )}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setIsPermissionsModalOpen(true);
                        }}
                        className="hover:bg-mint-green hover:text-text-primary transition-colors duration-200"
                        title="Manage permissions"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member)}
                        className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        disabled={removeMember.isPending}
                        title="Remove member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isCurrentUser && (
                    <div className="flex items-center space-x-2 text-sm text-text-tertiary">
                      <CheckCircle className="h-4 w-4 text-mint-green" />
                      <span>You</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {family.members.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-pale-lavender-bg rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-text-tertiary" />
              </div>
              <h4 className="text-lg font-semibold text-text-primary mb-2">
                No family members yet
              </h4>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                Start building your family by inviting members to join your family quest journey.
              </p>
              {canInvite && (
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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