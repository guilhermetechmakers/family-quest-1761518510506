import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PasswordStrengthMeter } from '@/components/ui/PasswordStrengthMeter';
import { securityApi } from '@/api/security';

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ 
  onSuccess,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('new_password', '');

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      await securityApi.changePassword(data);
      setIsSuccess(true);
      toast.success('Password changed successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    reset();
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        <Card className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
          
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Password Changed Successfully!
          </h3>
          
          <p className="text-text-secondary mb-4">
            Your password has been updated. You'll need to log in again with your new password.
          </p>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="btn-outline"
          >
            Change Another Password
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Change Password
          </h3>
          <p className="text-sm text-text-secondary">
            Update your password to keep your account secure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="current_password" className="text-sm font-medium text-text-primary">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <Input
                id="current_password"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                className="pl-10 pr-10"
                {...register('current_password')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.current_password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.current_password.message}
              </motion.p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="new_password" className="text-sm font-medium text-text-primary">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <Input
                id="new_password"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                className="pl-10 pr-10"
                {...register('new_password')}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.new_password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.new_password.message}
              </motion.p>
            )}
          </div>

          {/* Password Strength Meter */}
          {newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <PasswordStrengthMeter password={newPassword} />
            </motion.div>
          )}

          <div className="space-y-2">
            <label htmlFor="confirm_password" className="text-sm font-medium text-text-primary">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <Input
                id="confirm_password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                className="pl-10 pr-10"
                {...register('confirm_password')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirm_password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {errors.confirm_password.message}
              </motion.p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
              ) : (
                'Change Password'
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="btn-outline"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 bg-pastel-yellow/20 border border-pastel-yellow/40 rounded-lg"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2">
            🔒 Password Security Tips
          </h4>
          <ul className="text-xs text-text-secondary space-y-1">
            <li>• Use a unique password for this account</li>
            <li>• Include a mix of letters, numbers, and symbols</li>
            <li>• Avoid using personal information</li>
            <li>• Consider using a password manager</li>
          </ul>
        </motion.div>
      </Card>
    </motion.div>
  );
};