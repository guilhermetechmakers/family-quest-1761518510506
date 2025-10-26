import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useChangePassword } from '@/hooks/useProfile';

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength <= 2) return 'text-red-500';
    if (strength <= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Medium';
    return 'Strong';
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword.mutateAsync({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      reset();
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: newPassword.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(newPassword) },
    { text: 'One number', met: /[0-9]/.test(newPassword) },
    { text: 'One special character', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center space-x-2">
            <Key className="h-5 w-5 text-mint-green" />
            <span>Change Password</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current_password" className="text-sm font-medium text-text-primary">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPasswords.current ? 'text' : 'password'}
                {...register('current_password')}
                className="hover:border-mint-green focus:border-mint-green pr-10"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-sm text-red-500">{errors.current_password.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new_password" className="text-sm font-medium text-text-primary">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPasswords.new ? 'text' : 'password'}
                {...register('new_password')}
                className="hover:border-mint-green focus:border-mint-green pr-10"
                placeholder="Enter your new password"
                onChange={(e) => {
                  setPasswordStrength(calculatePasswordStrength(e.target.value));
                  register('new_password').onChange(e);
                }}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-sm text-red-500">{errors.new_password.message}</p>
            )}

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 2 ? 'bg-red-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${getPasswordStrengthColor(passwordStrength)}`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="space-y-2 p-3 bg-pale-lavender-bg rounded-lg">
              <p className="text-sm font-medium text-text-primary">Password Requirements:</p>
              <div className="space-y-1">
                {passwordRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {requirement.met ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={requirement.met ? 'text-green-700' : 'text-red-700'}>
                      {requirement.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-sm font-medium text-text-primary">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirm_password')}
                className="hover:border-mint-green focus:border-mint-green pr-10"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
            )}
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
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}