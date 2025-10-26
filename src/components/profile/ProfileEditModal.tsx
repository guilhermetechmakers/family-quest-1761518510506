import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfile';
import type { User as UserType } from '@/types/user';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  avatar_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  role: z.enum(['parent', 'child', 'guest', 'admin']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

export function ProfileEditModal({ isOpen, onClose, user }: ProfileEditModalProps) {
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url || '');
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user.full_name,
      avatar_url: user.avatar_url || '',
      role: user.role,
    },
  });

  const watchedAvatarUrl = watch('avatar_url');

  const handleAvatarUrlChange = (value: string) => {
    setValue('avatar_url', value);
    setAvatarPreview(value);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        id: user.id,
        full_name: data.full_name,
        avatar_url: data.avatar_url || undefined,
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-mint-green/20">
                <AvatarImage src={avatarPreview} alt="Profile" />
                <AvatarFallback className="bg-mint-green text-text-primary text-2xl font-semibold">
                  {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-mint-green rounded-full">
                <Camera className="h-3 w-3 text-text-primary" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Click to change your profile picture
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-text-primary">
                Full Name
              </Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className="hover:border-mint-green focus:border-mint-green"
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="text-sm text-red-500">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url" className="text-sm font-medium text-text-primary">
                Avatar URL
              </Label>
              <Input
                id="avatar_url"
                value={watchedAvatarUrl}
                onChange={(e) => handleAvatarUrlChange(e.target.value)}
                className="hover:border-mint-green focus:border-mint-green"
                placeholder="https://example.com/avatar.jpg"
              />
              {errors.avatar_url && (
                <p className="text-sm text-red-500">{errors.avatar_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-text-primary">
                Role
              </Label>
              <Select
                value={user.role}
                onValueChange={(value) => setValue('role', value as any)}
                disabled
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-tertiary">
                Role cannot be changed. Contact support if needed.
              </p>
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}