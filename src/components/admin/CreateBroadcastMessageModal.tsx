import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateBroadcastMessage } from '@/hooks/useAdmin';
import type { CreateBroadcastMessageInput } from '@/types/admin';
import { toast } from 'sonner';

interface CreateBroadcastMessageModalProps {
  onClose: () => void;
}

export function CreateBroadcastMessageModal({ onClose }: CreateBroadcastMessageModalProps) {
  const [formData, setFormData] = useState<CreateBroadcastMessageInput>({
    title: '',
    content: '',
    target_audience: 'all',
    target_family_ids: [],
    scheduled_at: undefined,
  });
  const [isScheduled, setIsScheduled] = useState(false);

  const createMessageMutation = useCreateBroadcastMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...formData,
      scheduled_at: isScheduled ? formData.scheduled_at : undefined,
    };

    createMessageMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success('Broadcast message created successfully');
        onClose();
      },
    });
  };

  const handleFamilyIdsChange = (value: string) => {
    const ids = value.split(',').map(id => id.trim()).filter(id => id);
    setFormData(prev => ({
      ...prev,
      target_family_ids: ids,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-card-hover max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-mint-green">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Create Broadcast Message</h2>
              <p className="text-sm text-text-secondary">Send announcements to users</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Message Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter message title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Message Content *
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your message content..."
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Audience *
            </label>
            <Select
              value={formData.target_audience}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, target_audience: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    All Users
                  </div>
                </SelectItem>
                <SelectItem value="parents">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Parents Only
                  </div>
                </SelectItem>
                <SelectItem value="children">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Children Only
                  </div>
                </SelectItem>
                <SelectItem value="guests">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Guests Only
                  </div>
                </SelectItem>
                <SelectItem value="specific_families">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Specific Families
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.target_audience === 'specific_families' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Family IDs
              </label>
              <Input
                value={formData.target_family_ids?.join(', ') || ''}
                onChange={(e) => handleFamilyIdsChange(e.target.value)}
                placeholder="Enter family IDs separated by commas"
              />
              <p className="text-xs text-text-secondary mt-1">
                Enter family IDs separated by commas (e.g., 123, 456, 789)
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="schedule-message"
                checked={isScheduled}
                onCheckedChange={(checked) => setIsScheduled(checked as boolean)}
              />
              <label htmlFor="schedule-message" className="text-sm font-medium text-text-primary">
                Schedule message for later
              </label>
            </div>

            {isScheduled && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Scheduled Date & Time
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.content.trim() || createMessageMutation.isPending}
              className="bg-mint-green hover:bg-mint-green/90 text-text-primary"
            >
              {createMessageMutation.isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : isScheduled ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Message
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}