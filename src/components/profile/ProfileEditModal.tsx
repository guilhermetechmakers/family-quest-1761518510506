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
import { Camera, User, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfile';
import type { User as UserType } from '@/types/user';

const profileSchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  avatar_url: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val || val === '') return true;
      return val.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null;
    }, 'Avatar must be a valid image URL (jpg, jpeg, png, gif, webp)'),
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
  const [isValidatingAvatar, setIsValidatingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      full_name: user.full_name,
      avatar_url: user.avatar_url || '',
      role: user.role,
    },
  });

  const watchedAvatarUrl = watch('avatar_url');

  const handleAvatarUrlChange = async (value: string) => {
    setValue('avatar_url', value);
    setAvatarPreview(value);
    setAvatarError(null);
    
    if (value && value !== '') {
      setIsValidatingAvatar(true);
      try {
        // Validate image URL by trying to load it
        const img = new Image();
        img.onload = () => {
          setIsValidatingAvatar(false);
          setAvatarError(null);
        };
        img.onerror = () => {
          setIsValidatingAvatar(false);
          setAvatarError('Invalid image URL');
        };
        img.src = value;
      } catch {
        setIsValidatingAvatar(false);
        setAvatarError('Invalid image URL');
      }
    }
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-primary flex items-center space-x-2">
            <User className="h-6 w-6 text-mint-green" />
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-4 ring-mint-green/20 group-hover:ring-mint-green/40 transition-all duration-300">
                <AvatarImage 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary text-2xl font-bold">
                  {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 p-2 bg-mint-green rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Camera className="h-4 w-4 text-text-primary" />
              </div>
              {isValidatingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-text-primary">
                Profile Picture
              </p>
              <p className="text-xs text-text-secondary">
                Enter a URL to your image (JPG, PNG, GIF, WebP)
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="full_name" className="text-sm font-semibold text-text-primary flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </Label>
              <Input
                id="full_name"
                {...register('full_name')}
                className="hover:border-mint-green focus:border-mint-green transition-colors duration-200"
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <div className="flex items-center space-x-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.full_name.message}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="avatar_url" className="text-sm font-semibold text-text-primary flex items-center space-x-2">
                <Camera className="h-4 w-4" />
                <span>Avatar URL</span>
              </Label>
              <div className="relative">
                <Input
                  id="avatar_url"
                  value={watchedAvatarUrl}
                  onChange={(e) => handleAvatarUrlChange(e.target.value)}
                  className="hover:border-mint-green focus:border-mint-green transition-colors duration-200 pr-10"
                  placeholder="https://example.com/avatar.jpg"
                />
                {watchedAvatarUrl && !isValidatingAvatar && !avatarError && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-4 w-4 text-mint-green" />
                  </div>
                )}
              </div>
              {(errors.avatar_url || avatarError) && (
                <div className="flex items-center space-x-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.avatar_url?.message || avatarError}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="role" className="text-sm font-semibold text-text-primary flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Role</span>
              </Label>
              <Select
                value={user.role}
                onValueChange={(value) => setValue('role', value as any)}
                disabled
              >
                <SelectTrigger className="hover:border-mint-green focus:border-mint-green bg-gray-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-start space-x-2 p-3 bg-pale-lavender-bg rounded-lg">
                <AlertCircle className="h-4 w-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-text-tertiary">
                  Role cannot be changed. Contact support if you need to modify your role.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 hover:bg-gray-100 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || isValidatingAvatar}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}