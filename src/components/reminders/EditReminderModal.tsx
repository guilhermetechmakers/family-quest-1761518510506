import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Clock, 
  Mail, 
  Smartphone, 
  Bell, 
  Save,
  TestTube
} from 'lucide-react';
import { useUpdateReminder, useTestReminder } from '@/hooks/useReminders';
import type { Reminder, ReminderChannel } from '@/types/reminder';

const editReminderSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  scheduled_time: z.string().min(1, 'Scheduled time is required'),
  channel: z.enum(['push', 'email', 'in_app'] as const),
});

type EditReminderFormData = z.infer<typeof editReminderSchema>;

interface EditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reminder: Reminder | null;
}

const channelOptions = [
  { value: 'push' as const, label: 'Push Notification', icon: Smartphone, description: 'Send to your device' },
  { value: 'email' as const, label: 'Email', icon: Mail, description: 'Send to your email' },
  { value: 'in_app' as const, label: 'In-App', icon: Bell, description: 'Show in the app' },
];

export function EditReminderModal({
  isOpen,
  onClose,
  onSuccess,
  reminder,
}: EditReminderModalProps) {
  const [isTestMode, setIsTestMode] = useState(false);
  
  const updateReminderMutation = useUpdateReminder();
  const testReminderMutation = useTestReminder();

  const form = useForm<EditReminderFormData>({
    resolver: zodResolver(editReminderSchema),
    defaultValues: {
      title: '',
      message: '',
      scheduled_time: '',
      channel: 'push',
    },
  });

  // Update form when reminder changes
  useEffect(() => {
    if (reminder) {
      const scheduledTime = new Date(reminder.scheduled_time);
      const localDateTime = new Date(scheduledTime.getTime() - scheduledTime.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      form.reset({
        title: reminder.title,
        message: reminder.message,
        scheduled_time: localDateTime,
        channel: reminder.channel,
      });
    }
  }, [reminder, form]);

  const onSubmit = async (data: EditReminderFormData) => {
    if (!reminder) return;

    try {
      if (isTestMode) {
        await testReminderMutation.mutateAsync({
          title: data.title,
          message: data.message,
          channel: data.channel,
          related_entity_type: reminder.related_entity_type,
          related_entity_id: reminder.related_entity_id,
        });
      } else {
        await updateReminderMutation.mutateAsync({
          id: reminder.id,
          data: {
            title: data.title,
            message: data.message,
            scheduled_time: new Date(data.scheduled_time).toISOString(),
            channel: data.channel,
          },
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    form.reset();
    setIsTestMode(false);
    onClose();
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now.toISOString().slice(0, 16);
  };

  const isLoading = updateReminderMutation.isPending || testReminderMutation.isPending;
  const canEdit = reminder?.status === 'scheduled';

  if (!reminder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-green" />
            {isTestMode ? 'Test Reminder' : 'Edit Reminder'}
          </DialogTitle>
          <DialogDescription>
            {isTestMode 
              ? 'Send a test reminder immediately to verify your changes'
              : 'Update your reminder details and schedule'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Status info */}
          <div className="p-3 bg-mint-tint rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Status</p>
                <p className="text-xs text-text-secondary capitalize">{reminder.status}</p>
              </div>
              <div className="text-xs text-text-secondary">
                Created {new Date(reminder.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Test mode toggle */}
          <div className="flex items-center justify-between p-3 bg-mint-tint rounded-xl">
            <div>
              <Label className="text-sm font-medium text-text-primary">
                Test Mode
              </Label>
              <p className="text-xs text-text-secondary">
                Send immediately for testing
              </p>
            </div>
            <Switch
              checked={isTestMode}
              onCheckedChange={setIsTestMode}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Enter reminder title"
              className="rounded-xl"
              disabled={!canEdit && !isTestMode}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              {...form.register('message')}
              placeholder="Enter reminder message"
              rows={3}
              className="rounded-xl resize-none"
              disabled={!canEdit && !isTestMode}
            />
            {form.formState.errors.message && (
              <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
            )}
          </div>

          {/* Scheduled time (only show if not in test mode) */}
          {!isTestMode && (
            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Scheduled Time *</Label>
              <Input
                id="scheduled_time"
                type="datetime-local"
                {...form.register('scheduled_time')}
                min={getMinDateTime()}
                className="rounded-xl"
                disabled={!canEdit}
              />
              {form.formState.errors.scheduled_time && (
                <p className="text-sm text-red-600">{form.formState.errors.scheduled_time.message}</p>
              )}
            </div>
          )}

          {/* Channel */}
          <div className="space-y-2">
            <Label>Notification Channel *</Label>
            <Select
              value={form.watch('channel')}
              onValueChange={(value) => form.setValue('channel', value as ReminderChannel)}
              disabled={!canEdit && !isTestMode}
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
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-text-secondary">{option.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Related entity info */}
          {reminder.related_entity_type && reminder.related_entity_id && (
            <div className="p-3 bg-pale-lavender/20 rounded-xl">
              <p className="text-sm text-text-secondary">
                This reminder is linked to: <span className="font-medium capitalize">{reminder.related_entity_type}</span>
              </p>
            </div>
          )}

          {/* Warning for non-editable reminders */}
          {!canEdit && !isTestMode && (
            <div className="p-3 bg-pastel-yellow/20 rounded-xl">
              <p className="text-sm text-text-secondary">
                This reminder cannot be edited because it has already been sent or cancelled.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (!canEdit && !isTestMode)}
              className="btn-primary"
            >
              {isLoading ? (
                'Saving...'
              ) : isTestMode ? (
                <>
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}