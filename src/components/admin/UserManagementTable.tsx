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
  Mail,
  Calendar,
  Shield,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAdminUsers, useSuspendUser, useUnsuspendUser, useResetUserPassword } from '@/hooks/useAdmin';
import type { AdminUser, UserSearchFilters } from '@/types/admin';
import { toast } from 'sonner';

interface UserManagementTableProps {
  onUserSelect?: (user: AdminUser) => void;
}

export function UserManagementTable({ onUserSelect }: UserManagementTableProps) {
  const [filters, setFilters] = useState<UserSearchFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, isLoading } = useAdminUsers(filters);
  const suspendUser = useSuspendUser();
  const unsuspendUser = useUnsuspendUser();
  const resetPassword = useResetUserPassword();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters(prev => ({ 
      ...prev, 
      role: role === 'all' ? undefined : role as any 
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status as any 
    }));
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

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-mint-green text-text-primary',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-pastel-yellow text-text-primary',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100'}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-purple-100 text-purple-800',
      parent: 'bg-blue-100 text-blue-800',
      child: 'bg-green-100 text-green-800',
      guest: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={variants[role as keyof typeof variants] || 'bg-gray-100'}>
        {role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl font-semibold text-text-primary">User Management</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Role
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleRoleFilter('all')}>
                    All Roles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter('admin')}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter('parent')}>
                    Parent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter('child')}>
                    Child
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRoleFilter('guest')}>
                    Guest
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('suspended')}>
                    Suspended
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-3">
          {users?.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-mint-green text-text-primary">
                    {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-text-primary truncate">{user.full_name}</h3>
                    {getStatusBadge(user.status)}
                    {getRoleBadge(user.role)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>Last login: {new Date(user.last_login).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUserSelect?.(user)}
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
                    <DropdownMenuItem onClick={() => onUserSelect?.(user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                      <Key className="h-4 w-4 mr-2" />
                      Reset Password
                    </DropdownMenuItem>
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
            </motion.div>
          ))}
        </div>

        {users?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No users found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}