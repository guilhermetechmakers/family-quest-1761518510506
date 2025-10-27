import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Users,
  BarChart3,
  Mail
} from 'lucide-react';
import { useExportData, useDeleteAccount, useUpdateDataSharingPreferences } from '@/hooks/useSettings';

const dataSharingSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
  third_party: z.boolean(),
});

type DataSharingFormData = z.infer<typeof dataSharingSchema>;

const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
});

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;

export function PrivacySettings() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();
  const updateDataSharing = useUpdateDataSharingPreferences();

  const dataSharingForm = useForm<DataSharingFormData>({
    resolver: zodResolver(dataSharingSchema),
    defaultValues: {
      analytics: true,
      marketing: false,
      third_party: false,
    },
  });

  const deleteForm = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
  });

  const onDataSharingSubmit = (data: DataSharingFormData) => {
    updateDataSharing.mutate(data);
  };

  const onDeleteSubmit = (data: DeleteAccountFormData) => {
    deleteAccount.mutate({ password: data.password });
  };

  const handleExportData = () => {
    exportData.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Data Sharing Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-purple rounded-lg">
                <Shield className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Data Sharing Preferences</CardTitle>
                <CardDescription>
                  Control how your data is used to improve the app
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={dataSharingForm.handleSubmit(onDataSharingSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-mint-green rounded-lg">
                      <BarChart3 className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Analytics & Usage Data</Label>
                      <p className="text-sm text-text-secondary">
                        Help us improve the app by sharing anonymous usage data
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={dataSharingForm.watch('analytics')}
                    onCheckedChange={(checked) => dataSharingForm.setValue('analytics', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pastel-yellow rounded-lg">
                      <Mail className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Marketing Communications</Label>
                      <p className="text-sm text-text-secondary">
                        Receive updates about new features and family tips
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={dataSharingForm.watch('marketing')}
                    onCheckedChange={(checked) => dataSharingForm.setValue('marketing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-light-pink rounded-lg">
                      <Globe className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Third-Party Sharing</Label>
                      <p className="text-sm text-text-secondary">
                        Allow sharing of anonymized data with trusted partners
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={dataSharingForm.watch('third_party')}
                    onCheckedChange={(checked) => dataSharingForm.setValue('third_party', checked)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateDataSharing.isPending}
                  className="btn-primary"
                >
                  {updateDataSharing.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pale-lavender rounded-lg">
                <Lock className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Privacy Level</CardTitle>
                <CardDescription>
                  Control who can see your family's goals and activities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-mint-tint rounded-xl border-2 border-mint-green">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-mint-green" />
                    <span className="font-semibold text-text-primary">Private</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Only family members can see goals and activities
                  </p>
                </div>

                <div className="p-4 bg-mint-tint rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">Family & Guests</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Family members and invited guests can participate
                  </p>
                </div>

                <div className="p-4 bg-mint-tint rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-text-primary" />
                    <span className="font-semibold text-text-primary">Public</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Goals can be shared publicly and discovered by others
                  </p>
                </div>
              </div>

              <div className="p-4 bg-pastel-yellow rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-text-primary mb-1">Current Setting: Private</h4>
                    <p className="text-sm text-text-secondary">
                      Your family's goals and activities are only visible to family members. 
                      This is the most secure option for families with children.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-pink rounded-lg">
                <Download className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Export Your Data</CardTitle>
                <CardDescription>
                  Download a copy of all your family's data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-text-secondary">
                You can download a complete copy of your family's data, including goals, 
                contributions, and activity history. This data will be provided in a 
                machine-readable format.
              </p>

              <div className="p-4 bg-mint-tint rounded-xl">
                <h4 className="font-medium text-text-primary mb-2">What's included in your export:</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• All family goals and milestones</li>
                  <li>• Contribution history and transactions</li>
                  <li>• Activity feed and comments</li>
                  <li>• Family member information</li>
                  <li>• Settings and preferences</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleExportData}
                  disabled={exportData.isPending}
                  className="btn-primary"
                >
                  {exportData.isPending ? 'Preparing...' : 'Export Data'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-red-600">Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">This action cannot be undone</h4>
                    <p className="text-sm text-red-700">
                      Deleting your account will permanently remove all your family's goals, 
                      contributions, and data. This action cannot be reversed.
                    </p>
                  </div>
                </div>
              </div>

              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Delete Account
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your account and all associated data. 
                      Please enter your password to confirm.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          {...deleteForm.register('password')}
                          placeholder="Enter your password"
                          className="rounded-xl pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {deleteForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {deleteForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                  </form>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteForm.handleSubmit(onDeleteSubmit)}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={deleteAccount.isPending}
                    >
                      {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}