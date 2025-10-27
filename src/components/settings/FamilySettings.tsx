import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Crown, 
  UserCheck,
  Copy,
  Trash2,
  Shield,
  Globe,
  Lock
} from 'lucide-react';
import { useFamily, useUpdateFamilySettings, useGenerateInviteLink } from '@/hooks/useSettings';
import { toast } from 'sonner';

const familySchema = z.object({
  name: z.string().min(2, 'Family name must be at least 2 characters'),
  currency: z.string().min(1, 'Currency is required'),
});

type FamilyFormData = z.infer<typeof familySchema>;

const currencies = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
];

export function FamilySettings() {
  const [inviteLink, setInviteLink] = useState<string>('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const { data: family, isLoading } = useFamily();
  const updateFamilySettings = useUpdateFamilySettings();
  const generateInviteLink = useGenerateInviteLink();

  const familyForm = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      name: family?.name || '',
      currency: family?.currency || 'USD',
    },
  });

  const onFamilySubmit = (data: FamilyFormData) => {
    if (family) {
      updateFamilySettings.mutate({
        familyId: family.id,
        settings: data,
      });
    }
  };

  const handleGenerateInviteLink = (role: 'child' | 'guest') => {
    if (family) {
      generateInviteLink.mutate(
        { familyId: family.id, role },
        {
          onSuccess: (data) => {
            setInviteLink(data.invite_link);
            setShowInviteDialog(true);
          },
        }
      );
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard');
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
      {/* Family Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pale-lavender rounded-lg">
                <Users className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Family Information</CardTitle>
                <CardDescription>
                  Manage your family name and currency preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={familyForm.handleSubmit(onFamilySubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Family Name</Label>
                  <Input
                    id="name"
                    {...familyForm.register('name')}
                    placeholder="Enter family name"
                    className="rounded-xl"
                  />
                  {familyForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {familyForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={familyForm.watch('currency')}
                    onValueChange={(value) => familyForm.setValue('currency', value)}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.symbol}</span>
                            <span>{currency.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {familyForm.formState.errors.currency && (
                    <p className="text-sm text-red-500">
                      {familyForm.formState.errors.currency.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateFamilySettings.isPending}
                  className="btn-primary"
                >
                  {updateFamilySettings.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Family Members */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-light-pink rounded-lg">
                  <UserCheck className="h-5 w-5 text-text-primary" />
                </div>
                <div>
                  <CardTitle>Family Members</CardTitle>
                  <CardDescription>
                    Manage family members and their permissions
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={() => handleGenerateInviteLink('child')}
                className="btn-primary"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {family?.members?.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-mint-tint rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.user.avatar_url} />
                      <AvatarFallback className="bg-mint-green text-text-primary">
                        {member.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-text-primary">
                          {member.user.full_name}
                        </span>
                        {member.role === 'parent' && (
                          <Crown className="h-4 w-4 text-pastel-yellow" />
                        )}
                        <Badge 
                          variant={member.role === 'parent' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {member.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    {member.role !== 'parent' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Family Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove {member.user.full_name} from the family? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Family Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-purple rounded-lg">
                <Shield className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Privacy & Permissions</CardTitle>
                <CardDescription>
                  Control who can contribute and view family goals
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Allow Guest Contributions</Label>
                  <p className="text-sm text-text-secondary">
                    Let guests contribute to family goals
                  </p>
                </div>
                <Switch defaultChecked={family?.settings?.allow_guest_contributions} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Require Approval for Contributions</Label>
                  <p className="text-sm text-text-secondary">
                    All contributions need parent approval
                  </p>
                </div>
                <Switch defaultChecked={family?.settings?.require_approval_for_contributions} />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Privacy Level</Label>
                <Select defaultValue={family?.settings?.privacy_level || 'family_only'}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Private - Family only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="family_only">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Family & Guests</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Public - Shareable</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="btn-primary">
                Save Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invite Link Dialog */}
      <AlertDialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite Link Generated</AlertDialogTitle>
            <AlertDialogDescription>
              Share this link with family members to invite them to join your family.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-mint-tint rounded-lg">
              <code className="text-sm break-all">{inviteLink}</code>
            </div>
            <Button onClick={copyInviteLink} className="w-full btn-primary">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowInviteDialog(false)}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}