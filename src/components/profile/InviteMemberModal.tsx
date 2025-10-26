import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Mail, User, Users } from 'lucide-react';
import { useInviteMember } from '@/hooks/useProfile';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['child', 'guest']),
  permissions: z.object({
    can_create_goals: z.boolean(),
    can_edit_goals: z.boolean(),
    can_delete_goals: z.boolean(),
    can_approve_contributions: z.boolean(),
    can_invite_members: z.boolean(),
    can_manage_family: z.boolean(),
  }),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
}

const roleIcons = {
  child: User,
  guest: Users,
};

const roleDescriptions = {
  child: 'Can contribute to goals and view family activities',
  guest: 'Can view and contribute to specific goals when invited',
};

export function InviteMemberModal({ isOpen, onClose, familyId }: InviteMemberModalProps) {
  const [selectedRole, setSelectedRole] = useState<'child' | 'guest'>('child');
  const inviteMember = useInviteMember();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'child',
      permissions: {
        can_create_goals: false,
        can_edit_goals: false,
        can_delete_goals: false,
        can_approve_contributions: false,
        can_invite_members: false,
        can_manage_family: false,
      },
    },
  });

  const handleRoleChange = (role: 'child' | 'guest') => {
    setSelectedRole(role);
    setValue('role', role);
    
    // Set default permissions based on role
    if (role === 'child') {
      setValue('permissions', {
        can_create_goals: false,
        can_edit_goals: false,
        can_delete_goals: false,
        can_approve_contributions: false,
        can_invite_members: false,
        can_manage_family: false,
      });
    } else {
      setValue('permissions', {
        can_create_goals: true,
        can_edit_goals: true,
        can_delete_goals: false,
        can_approve_contributions: false,
        can_invite_members: false,
        can_manage_family: false,
      });
    }
  };

  const onSubmit = async (data: InviteFormData) => {
    try {
      await inviteMember.mutateAsync({
        family_id: familyId,
        email: data.email,
        role: data.role,
        permissions: data.permissions,
      });
      reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-mint-green" />
            <span>Invite Family Member</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-text-primary flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="hover:border-mint-green focus:border-mint-green"
              placeholder="family.member@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-text-primary">Member Role</Label>
            <div className="grid grid-cols-2 gap-4">
              {(['child', 'guest'] as const).map((role) => {
                const Icon = roleIcons[role];
                const isSelected = selectedRole === role;
                
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleChange(role)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-mint-green bg-mint-tint'
                        : 'border-border hover:border-mint-green/50'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`h-6 w-6 ${isSelected ? 'text-mint-green' : 'text-text-secondary'}`} />
                      <span className={`font-medium capitalize ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                        {role}
                      </span>
                      <p className="text-xs text-text-tertiary text-center">
                        {roleDescriptions[role]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-text-primary">Permissions</Label>
            <div className="space-y-3 p-4 bg-pale-lavender-bg rounded-xl">
              {[
                { key: 'can_create_goals', label: 'Create Goals', description: 'Can create new family goals' },
                { key: 'can_edit_goals', label: 'Edit Goals', description: 'Can modify existing goals' },
                { key: 'can_delete_goals', label: 'Delete Goals', description: 'Can remove goals' },
                { key: 'can_approve_contributions', label: 'Approve Contributions', description: 'Can approve monetary contributions' },
                { key: 'can_invite_members', label: 'Invite Members', description: 'Can invite new family members' },
                { key: 'can_manage_family', label: 'Manage Family', description: 'Can manage family settings' },
              ].map((permission) => (
                <div key={permission.key} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-text-primary">
                      {permission.label}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    checked={watch(`permissions.${permission.key}` as any)}
                    onCheckedChange={(checked) => setValue(`permissions.${permission.key}` as any, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}