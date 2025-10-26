import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, User } from 'lucide-react';
import { useUpdateMemberPermissions } from '@/hooks/useProfile';
import type { FamilyMember } from '@/types/family';

interface MemberPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  familyId: string;
}

export function MemberPermissionsModal({ isOpen, onClose, member, familyId }: MemberPermissionsModalProps) {
  const [permissions, setPermissions] = useState(member.permissions);
  const updatePermissions = useUpdateMemberPermissions();

  const handlePermissionChange = (key: keyof typeof permissions, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updatePermissions.mutateAsync({
        familyId,
        userId: member.user_id,
        permissions,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const permissionOptions = [
    { key: 'can_create_goals', label: 'Create Goals', description: 'Can create new family goals' },
    { key: 'can_edit_goals', label: 'Edit Goals', description: 'Can modify existing goals' },
    { key: 'can_delete_goals', label: 'Delete Goals', description: 'Can remove goals' },
    { key: 'can_approve_contributions', label: 'Approve Contributions', description: 'Can approve monetary contributions' },
    { key: 'can_invite_members', label: 'Invite Members', description: 'Can invite new family members' },
    { key: 'can_manage_family', label: 'Manage Family', description: 'Can manage family settings' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <Settings className="h-5 w-5 text-mint-green" />
            <span>Manage Permissions</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Member Info */}
          <div className="flex items-center space-x-3 p-4 bg-pale-lavender-bg rounded-xl">
            <User className="h-8 w-8 text-mint-green" />
            <div>
              <h3 className="font-semibold text-text-primary">{member.user.full_name}</h3>
              <p className="text-sm text-text-secondary">{member.user.email}</p>
              <p className="text-xs text-text-tertiary capitalize">{member.role}</p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Permissions</h4>
            <div className="space-y-3">
              {permissionOptions.map((permission) => (
                <div key={permission.key} className="flex items-center justify-between p-3 bg-pale-lavender-bg rounded-lg">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-text-primary">
                      {permission.label}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    checked={permissions[permission.key as keyof typeof permissions]}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(permission.key as keyof typeof permissions, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updatePermissions.isPending}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              {updatePermissions.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}