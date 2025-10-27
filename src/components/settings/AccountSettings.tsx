import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Smartphone, 
  AlertTriangle
} from 'lucide-react';
import { useProfile, useUpdateProfile, use2FA } from '@/hooks/useSettings';
import { PasswordChangeForm } from '@/components/PasswordChangeForm';
import { TwoFactorSetup } from '@/components/TwoFactorSetup';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});


type ProfileFormData = z.infer<typeof profileSchema>;

export function AccountSettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [is2FAEnabled] = useState(false);

  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { disable2FA } = use2FA();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfile.mutate(data);
  };

  const handleEnable2FA = () => {
    setShow2FASetup(true);
  };

  const handleDisable2FA = (code: string) => {
    disable2FA.mutate(code);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-mint-tint rounded-lg mb-4"></div>
          <div className="h-32 bg-mint-tint rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mint-green rounded-lg">
                <User className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and profile details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    {...profileForm.register('full_name')}
                    placeholder="Enter your full name"
                    className="rounded-xl"
                  />
                  {profileForm.formState.errors.full_name && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      placeholder="Enter your email"
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending}
                  className="btn-primary"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pale-lavender rounded-lg">
                <Shield className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and two-factor authentication
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-text-primary flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Change Password
                </h4>
                {!showPasswordForm && (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    className="btn-outline"
                  >
                    Change Password
                  </Button>
                )}
              </div>
              
              {showPasswordForm && (
                <PasswordChangeForm
                  onSuccess={() => setShowPasswordForm(false)}
                  className="mb-6"
                />
              )}
            </div>

            <Separator />

            {/* Two-Factor Authentication */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-text-primary" />
                  <h4 className="text-lg font-medium text-text-primary">Two-Factor Authentication</h4>
                </div>
                <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <p className="text-text-secondary mb-4">
                Add an extra layer of security to your account with two-factor authentication.
              </p>

              {!show2FASetup ? (
                <div className="flex gap-3">
                  {!is2FAEnabled ? (
                    <Button onClick={handleEnable2FA} className="btn-primary">
                      Enable 2FA
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                          Disable 2FA
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Disable Two-Factor Authentication
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to disable two-factor authentication? This will make your account less secure.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDisable2FA('')}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Disable 2FA
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ) : (
                <TwoFactorSetup
                  onSuccess={() => setShow2FASetup(false)}
                  onCancel={() => setShow2FASetup(false)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}