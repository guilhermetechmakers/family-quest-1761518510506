import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, User, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUpdateUserRole, useSuspendUser, useUnsuspendUser } from '@/hooks/useAdmin';
import type { AdminUser } from '@/types/admin';
import { toast } from 'sonner';

interface UserRoleManagementModalProps {
  user: AdminUser | null;
  onClose: () => void;
}

export function UserRoleManagementModal({ user, onClose }: UserRoleManagementModalProps) {
  const [role, setRole] = useState(user?.role?.name || '');
  const [status, setStatus] = useState(user?.status || '');
  const [suspensionReason, setSuspensionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateRoleMutation = useUpdateUserRole();
  const suspendUserMutation = useSuspendUser();
  const unsuspendUserMutation = useUnsuspendUser();

  if (!user) return null;

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update role if changed
      if (role !== user.role.name) {
        await updateRoleMutation.mutateAsync({
          id: user.id,
          role: role as any,
        });
      }

      // Update status if changed
      if (status !== user.status) {
        if (status === 'suspended' && user.status !== 'suspended') {
          await suspendUserMutation.mutateAsync({
            id: user.id,
            reason: suspensionReason || 'Admin action',
          });
        } else if (user.status === 'suspended' && status !== 'suspended') {
          await unsuspendUserMutation.mutateAsync(user.id);
        }
      }

      toast.success('User updated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDescription = (role: string) => {
    const descriptions = {
      admin: 'Full access to all platform features and admin tools',
      parent: 'Can create and manage goals, invite family members, make payments',
      child: 'Can contribute to goals and view family activity (limited permissions)',
      guest: 'Can view and contribute to specific goals (invitation-based)',
    };
    return descriptions[role as keyof typeof descriptions] || '';
  };

  const getStatusDescription = (status: string) => {
    const descriptions = {
      active: 'User can access all features according to their role',
      suspended: 'User account is temporarily disabled',
      pending: 'User account is awaiting verification or approval',
    };
    return descriptions[status as keyof typeof descriptions] || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-card-hover max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-mint-green flex items-center justify-center">
              <User className="h-5 w-5 text-text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Manage User</h2>
              <p className="text-sm text-text-secondary">{user.full_name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <Card className="p-4 bg-pale-lavender-bg">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-mint-green flex items-center justify-center">
                <User className="h-6 w-6 text-text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">{user.full_name}</h3>
                <p className="text-sm text-text-secondary">{user.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{user.role.name}</Badge>
                  <Badge 
                    className={
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : user.status === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Role Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Role Management</h3>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                User Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="parent">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Parent
                    </div>
                  </SelectItem>
                  <SelectItem value="child">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Child
                    </div>
                  </SelectItem>
                  <SelectItem value="guest">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Guest
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary mt-1">
                {getRoleDescription(role)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Account Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="suspended">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      Suspended
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      Pending
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-secondary mt-1">
                {getStatusDescription(status)}
              </p>
            </div>

            {status === 'suspended' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Suspension Reason
                </label>
                <Textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* User Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">User Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-mint-tint rounded-lg">
                <div className="text-2xl font-bold text-text-primary">{user.family_count}</div>
                <div className="text-xs text-text-secondary">Families</div>
              </div>
              <div className="text-center p-3 bg-pale-lavender-bg rounded-lg">
                <div className="text-2xl font-bold text-text-primary">{user.goal_count}</div>
                <div className="text-xs text-text-secondary">Goals</div>
              </div>
              <div className="text-center p-3 bg-light-pink rounded-lg">
                <div className="text-2xl font-bold text-text-primary">{user.contribution_count}</div>
                <div className="text-xs text-text-secondary">Contributions</div>
              </div>
              <div className="text-center p-3 bg-pastel-yellow rounded-lg">
                <div className="text-2xl font-bold text-text-primary">
                  {new Date(user.last_login).toLocaleDateString()}
                </div>
                <div className="text-xs text-text-secondary">Last Login</div>
              </div>
            </div>
          </div>

          {/* Audit Log Preview */}
          {user.audit_logs && user.audit_logs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {user.audit_logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-2 bg-pale-lavender-bg rounded-lg">
                    <AlertCircle className="h-4 w-4 text-text-secondary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary">{log.action}</div>
                      <div className="text-xs text-text-secondary">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-mint-green hover:bg-mint-green/90 text-text-primary"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}