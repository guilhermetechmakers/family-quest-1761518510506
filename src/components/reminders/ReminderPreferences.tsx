import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Mail, 
  Smartphone, 
  Bell, 
  Settings as SettingsIcon
} from 'lucide-react';
import { useReminderPreferences, useUpdateReminderPreferences } from '@/hooks/useReminders';
import type { ReminderChannel } from '@/types/reminder';

const reminderPreferencesSchema = z.object({
  default_channel: z.enum(['push', 'email', 'in_app'] as const),
  advance_notice_minutes: z.number().min(1).max(1440), // 1 minute to 24 hours
  max_reminders_per_day: z.number().min(1).max(50),
  quiet_hours_enabled: z.boolean(),
  quiet_hours_start: z.string(),
  quiet_hours_end: z.string(),
});

type ReminderPreferencesFormData = z.infer<typeof reminderPreferencesSchema>;

const channelOptions = [
  { value: 'push' as const, label: 'Push Notification', icon: Smartphone },
  { value: 'email' as const, label: 'Email', icon: Mail },
  { value: 'in_app' as const, label: 'In-App', icon: Bell },
];

const advanceNoticeOptions = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 480, label: '8 hours' },
  { value: 1440, label: '24 hours' },
];

const maxRemindersOptions = [
  { value: 5, label: '5 reminders' },
  { value: 10, label: '10 reminders' },
  { value: 20, label: '20 reminders' },
  { value: 30, label: '30 reminders' },
  { value: 50, label: '50 reminders' },
];

export function ReminderPreferences() {
  const { data: preferences, isLoading } = useReminderPreferences();
  const updatePreferencesMutation = useUpdateReminderPreferences();

  const form = useForm<ReminderPreferencesFormData>({
    resolver: zodResolver(reminderPreferencesSchema),
    defaultValues: {
      default_channel: 'push',
      advance_notice_minutes: 15,
      max_reminders_per_day: 10,
      quiet_hours_enabled: false,
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
    },
  });

  // Update form when preferences load
  useState(() => {
    if (preferences) {
      form.reset({
        default_channel: preferences.default_channel,
        advance_notice_minutes: preferences.advance_notice_minutes,
        max_reminders_per_day: preferences.max_reminders_per_day,
        quiet_hours_enabled: preferences.quiet_hours_enabled,
        quiet_hours_start: preferences.quiet_hours_start,
        quiet_hours_end: preferences.quiet_hours_end,
      });
    }
  });

  const onSubmit = async (data: ReminderPreferencesFormData) => {
    try {
      await updatePreferencesMutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-10 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Default Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-mint-green rounded-lg">
                <SettingsIcon className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Default Reminder Settings</CardTitle>
                <CardDescription>
                  Configure your default reminder preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Default Channel */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Default Notification Channel</Label>
                <p className="text-sm text-text-secondary">
                  Choose your preferred method for receiving reminders
                </p>
                <Select
                  value={form.watch('default_channel')}
                  onValueChange={(value) => form.setValue('default_channel', value as ReminderChannel)}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {channelOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Advance Notice */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Advance Notice</Label>
                <p className="text-sm text-text-secondary">
                  How far in advance should reminders be sent
                </p>
                <Select
                  value={form.watch('advance_notice_minutes').toString()}
                  onValueChange={(value) => form.setValue('advance_notice_minutes', parseInt(value))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {advanceNoticeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Max Reminders Per Day */}
              <div className="space-y-2">
                <Label className="text-base font-medium">Maximum Reminders Per Day</Label>
                <p className="text-sm text-text-secondary">
                  Limit the number of reminders you receive daily
                </p>
                <Select
                  value={form.watch('max_reminders_per_day').toString()}
                  onValueChange={(value) => form.setValue('max_reminders_per_day', parseInt(value))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {maxRemindersOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferencesMutation.isPending}
                  className="btn-primary"
                >
                  {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quiet Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pastel-yellow rounded-lg">
                <Clock className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Quiet Hours</CardTitle>
                <CardDescription>
                  Set times when you don't want to receive reminders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Enable Quiet Hours */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Enable Quiet Hours</Label>
                  <p className="text-sm text-text-secondary">
                    Pause reminders during specific times
                  </p>
                </div>
                <Switch 
                  checked={form.watch('quiet_hours_enabled')}
                  onCheckedChange={(checked) => form.setValue('quiet_hours_enabled', checked)}
                />
              </div>

              {/* Quiet Hours Times */}
              {form.watch('quiet_hours_enabled') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        {...form.register('quiet_hours_start')}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        {...form.register('quiet_hours_end')}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="p-3 bg-mint-tint rounded-xl">
                    <p className="text-sm text-text-secondary">
                      <strong>Note:</strong> Quiet hours will prevent reminders from being sent during the specified time period. 
                      Reminders scheduled during quiet hours will be sent after the quiet period ends.
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updatePreferencesMutation.isPending}
                  className="btn-primary"
                >
                  {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Quiet Hours'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reminder Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-light-purple rounded-lg">
                <Bell className="h-5 w-5 text-text-primary" />
              </div>
              <div>
                <CardTitle>Reminder Types</CardTitle>
                <CardDescription>
                  Choose which types of reminders you want to receive
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-mint-tint rounded-xl">
                <p className="text-sm text-text-secondary">
                  <strong>Coming Soon:</strong> You'll be able to customize which types of reminders 
                  you receive (goal deadlines, contribution reminders, milestone celebrations, etc.)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}