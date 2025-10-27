import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Key, 
  Eye,
  Clock,
  Download,
  X,
  Plus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminUsers, useSuspendUser, useUnsuspendUser, useResetUserPassword, useBulkUpdateUsers } from '@/hooks/useAdmin';
import { UserRoleManagementModal } from './UserRoleManagementModal';
import type { AdminUser, UserSearchFilters } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EnhancedUserManagementProps {
  onUserSelect?: (user: AdminUser) => void;
}

export function EnhancedUserManagement({ }: EnhancedUserManagementProps) {
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data: users, isLoading } = useAdminUsers(filters);
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const resetPassword = useResetUserPassword();
  const bulkUpdateMutation = useBulkUpdateUsers();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleFilterChange = (key: keyof UserSearchFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers(prev => 
      selected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(users?.map(u => u.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkStatusUpdate = (status: AdminUser['status']) => {
    if (selectedUsers.length === 0) return;
    
    bulkUpdateMutation.mutate({
      userIds: selectedUsers,
      updates: { status },
    });
    setSelectedUsers([]);
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await suspendUser.mutateAsync({ id: userId, reason: 'Admin action' });
      toast.success('User suspended successfully');
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    try {
      await unsuspendUser.mutateAsync(userId);
      toast.success('User unsuspended successfully');
    } catch (error) {
      toast.error('Failed to unsuspend user');
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const result = await resetPassword.mutateAsync(userId);
      toast.success(`Password reset. Temporary password: ${result.temporary_password}`);
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const getStatusIcon = (status: AdminUser['status']) => {
    switch (status) {
      case 'active':
        return <UserCheck className="h-4 w-4" />;
      case 'suspended':
        return <UserX className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: AdminUser['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'parent':
        return 'bg-blue-100 text-blue-800';
      case 'child':
        return 'bg-green-100 text-green-800';
      case 'guest':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
          <p className="text-text-secondary">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-mint-green hover:bg-mint-green/90 text-text-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Role</label>
              <Select value={filters.role} onValueChange={(value) => handleFilterChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date From</label>
              <Input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date To</label>
              <Input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Search and Quick Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search users by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <Card className="p-4 bg-mint-tint border-mint-green">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <Select onValueChange={handleBulkStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-lavender-bg border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedUsers.length === users?.length && users.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">User</th>
                <th className="p-4 text-left font-semibold text-text-primary">Role</th>
                <th className="p-4 text-left font-semibold text-text-primary">Status</th>
                <th className="p-4 text-left font-semibold text-text-primary">Last Login</th>
                <th className="p-4 text-left font-semibold text-text-primary">Stats</th>
                <th className="p-4 text-left font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    Loading users...
                  </td>
                </tr>
              ) : users?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No users found
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-pale-lavender-bg/50 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback className="bg-mint-green text-text-primary">
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-text-primary">{user.full_name}</div>
                          <div className="text-sm text-text-secondary">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("text-white", getRoleColor(user.role.name))}>
                        {user.role.name}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(user.status))}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary">
                        {new Date(user.last_login).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 text-xs text-text-secondary">
                        <span>{user.family_count} families</span>
                        <span>•</span>
                        <span>{user.goal_count} goals</span>
                        <span>•</span>
                        <span>{user.contribution_count} contributions</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={() => handleSuspendUser(user.id)}
                                className="text-red-600"
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleUnsuspendUser(user.id)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Unsuspend User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Role Management Modal */}
      {selectedUser && (
        <UserRoleManagementModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}