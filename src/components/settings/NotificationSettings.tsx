import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  CheckCircle,
  XCircle,
  Settings as SettingsIcon
} from 'lucide-react';
import { useUpdateNotificationPreferences } from '@/hooks/useSettings';

const notificationSchema = z.object({
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  in_app_notifications: z.boolean(),
  digest_frequency: z.enum(['daily', 'weekly', 'never']),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const notificationTypes = [
  {
    id: 'goal_milestones',
    title: 'Goal Milestones',
    description: 'When family goals reach important milestones',
    icon: CheckCircle,
    enabled: true,
  },
  {
    id: 'contributions',
    title: 'New Contributions',
    description: 'When family members make contributions',
    icon: CheckCircle,
    enabled: true,
  },
  {
    id: 'approvals',
    title: 'Approval Requests',
    description: 'When contributions need your approval',
    icon: SettingsIcon,
    enabled: true,
  },
  {
    id: 'invites',
    title: 'Family Invites',
    description: 'When you receive family invitations',
    icon: CheckCircle,
    enabled: true,
  },
  {
    id: 'reminders',
    title: 'Goal Reminders',
    description: 'Gentle reminders about active goals',
    icon: Clock,
    enabled: false,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Celebrate family achievements and streaks',
    icon: CheckCircle,
    enabled: true,
  },
];

export function NotificationSettings() {
  const [notificationStates, setNotificationStates] = useState(
    notificationTypes.reduce((acc, type) => {
      acc[type.id] = type.enabled;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const updateNotificationPreferences = useUpdateNotificationPreferences();

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      email_notifications: true,
      push_notifications: true,
      in_app_notifications: true,
      digest_frequency: 'daily',
    },
  });

  const onSubmit = (data: NotificationFormData) => {
    updateNotificationPreferences.mutate(data);
  };

  const toggleNotificationType = (typeId: string) => {
    setNotificationStates(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-pink rounded-lg">
                <Bell className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-mint-green rounded-lg">
                      <Mail className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-text-secondary">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={form.watch('email_notifications')}
                    onCheckedChange={(checked) => form.setValue('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pale-lavender rounded-lg">
                      <Smartphone className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-text-secondary">
                        Receive push notifications on your device
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={form.watch('push_notifications')}
                    onCheckedChange={(checked) => form.setValue('push_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pastel-yellow rounded-lg">
                      <Bell className="h-5 w-5 text-text-primary" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">In-App Notifications</Label>
                      <p className="text-sm text-text-secondary">
                        Show notifications within the app
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={form.watch('in_app_notifications')}
                    onCheckedChange={(checked) => form.setValue('in_app_notifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-base font-medium">Digest Frequency</Label>
                <p className="text-sm text-text-secondary mb-3">
                  How often to receive summary emails
                </p>
                <Select
                  value={form.watch('digest_frequency')}
                  onValueChange={(value) => form.setValue('digest_frequency', value as any)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateNotificationPreferences.isPending}
                  className="btn-primary"
                >
                  {updateNotificationPreferences.isPending ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-purple rounded-lg">
                <SettingsIcon className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Notification Types</CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationTypes.map((type, index) => {
                const Icon = type.icon;
                const isEnabled = notificationStates[type.id];
                
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-mint-tint rounded-xl hover:bg-mint-green/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-mint-green' : 'bg-text-tertiary/20'}`}>
                        <Icon className={`h-5 w-5 ${isEnabled ? 'text-text-primary' : 'text-text-tertiary'}`} />
                      </div>
                      <div>
                        <Label className="text-base font-medium cursor-pointer">
                          {type.title}
                        </Label>
                        <p className="text-sm text-text-secondary">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isEnabled ? (
                        <CheckCircle className="h-5 w-5 text-mint-green" />
                      ) : (
                        <XCircle className="h-5 w-5 text-text-tertiary" />
                      )}
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={() => toggleNotificationType(type.id)}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cream-yellow rounded-lg">
                <Clock className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>
                  Set times when you don't want to receive notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable Quiet Hours</Label>
                  <p className="text-sm text-text-secondary">
                    Pause notifications during specific times
                  </p>
                </div>
                <Switch defaultChecked={false} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <input
                    type="time"
                    defaultValue="22:00"
                    className="w-full p-3 border border-border rounded-xl bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="w-full p-3 border border-border rounded-xl bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="btn-primary">
                  Save Quiet Hours
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}