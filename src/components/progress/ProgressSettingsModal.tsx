import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Bell, Calendar, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProgressSettings } from '@/hooks/useProgress';
import type { ProgressSettings } from '@/types/progress';

const settingsSchema = z.object({
  auto_calculate_eta: z.boolean(),
  milestone_notifications: z.boolean(),
  progress_reminders: z.boolean(),
  reminder_frequency: z.enum(['daily', 'weekly', 'monthly']),
  share_achievements: z.boolean(),
  celebration_animations: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface ProgressSettingsModalProps {
  goalId: string;
  goalTitle: string;
  settings: ProgressSettings;
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressSettingsModal({
  goalId,
  goalTitle,
  settings,
  isOpen,
  onClose
}: ProgressSettingsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateSettings = useUpdateProgressSettings();

  const {
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      auto_calculate_eta: settings.auto_calculate_eta,
      milestone_notifications: settings.milestone_notifications,
      progress_reminders: settings.progress_reminders,
      reminder_frequency: settings.reminder_frequency,
      share_achievements: settings.share_achievements,
      celebration_animations: settings.celebration_animations,
    }
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      await updateSettings.mutateAsync({
        goalId,
        settings: {
          goal_id: goalId,
          ...data
        }
      });
      onClose();
    } catch (error) {
      // Error is handled by the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-mint-green" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Progress Settings</h2>
              <p className="text-sm text-text-secondary">{goalTitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ETA Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-pale-lavender" />
              <span>Completion Estimates</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">
                    Auto-calculate ETA
                  </label>
                  <p className="text-xs text-text-secondary">
                    Automatically estimate completion date based on progress
                  </p>
                </div>
                <Switch
                  checked={watch('auto_calculate_eta')}
                  onCheckedChange={(checked) => setValue('auto_calculate_eta', checked)}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center space-x-2">
              <Bell className="h-5 w-5 text-pastel-yellow" />
              <span>Notifications</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">
                    Milestone notifications
                  </label>
                  <p className="text-xs text-text-secondary">
                    Get notified when milestones are achieved
                  </p>
                </div>
                <Switch
                  checked={watch('milestone_notifications')}
                  onCheckedChange={(checked) => setValue('milestone_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">
                    Progress reminders
                  </label>
                  <p className="text-xs text-text-secondary">
                    Regular reminders to contribute to the goal
                  </p>
                </div>
                <Switch
                  checked={watch('progress_reminders')}
                  onCheckedChange={(checked) => setValue('progress_reminders', checked)}
                />
              </div>

              {watch('progress_reminders') && (
                <div className="ml-4 space-y-2">
                  <label className="text-sm font-medium text-text-primary">
                    Reminder frequency
                  </label>
                  <Select
                    value={watch('reminder_frequency')}
                    onValueChange={(value) => setValue('reminder_frequency', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Sharing Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-light-pink" />
              <span>Sharing & Celebrations</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">
                    Share achievements
                  </label>
                  <p className="text-xs text-text-secondary">
                    Automatically generate shareable cards for milestones
                  </p>
                </div>
                <Switch
                  checked={watch('share_achievements')}
                  onCheckedChange={(checked) => setValue('share_achievements', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-text-primary">
                    Celebration animations
                  </label>
                  <p className="text-xs text-text-secondary">
                    Show animations when milestones are achieved
                  </p>
                </div>
                <Switch
                  checked={watch('celebration_animations')}
                  onCheckedChange={(checked) => setValue('celebration_animations', checked)}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}