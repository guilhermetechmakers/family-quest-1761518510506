import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Mail, 
  Smartphone, 
  Bell, 
  Edit, 
  Trash2, 
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import type { Reminder } from '@/types/reminder';

interface ReminderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: Reminder | null;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
}

const channelIcons = {
  push: Smartphone,
  email: Mail,
  in_app: Bell,
};

const channelColors = {
  push: 'bg-pale-lavender text-text-primary',
  email: 'bg-mint-green text-text-primary',
  in_app: 'bg-light-pink text-text-primary',
};

const channelLabels = {
  push: 'Push Notification',
  email: 'Email',
  in_app: 'In-App Notification',
};

const statusColors = {
  scheduled: 'bg-pastel-yellow text-text-primary',
  sent: 'bg-mint-green text-text-primary',
  cancelled: 'bg-text-tertiary text-white',
  failed: 'bg-red-500 text-white',
};

const statusIcons = {
  scheduled: Clock,
  sent: CheckCircle,
  cancelled: X,
  failed: AlertCircle,
};

const statusLabels = {
  scheduled: 'Scheduled',
  sent: 'Sent',
  cancelled: 'Cancelled',
  failed: 'Failed',
};

export function ReminderDetailsModal({
  isOpen,
  onClose,
  reminder,
  onEdit,
  onDelete,
  onCancel,
}: ReminderDetailsModalProps) {
  if (!reminder) return null;

  const scheduledDate = new Date(reminder.scheduled_time);
  const createdDate = new Date(reminder.created_at);
  const sentDate = reminder.sent_at ? new Date(reminder.sent_at) : null;
  
  const ChannelIcon = channelIcons[reminder.channel];
  const StatusIcon = statusIcons[reminder.status];
  
  const canEdit = reminder.status === 'scheduled';
  const canCancel = reminder.status === 'scheduled';

  const formatDateTime = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'EEEE, MMMM d, yyyy h:mm a');
    }
  };

  const handleEdit = () => {
    onEdit(reminder);
    onClose();
  };

  const handleDelete = () => {
    onDelete(reminder.id);
    onClose();
  };

  const handleCancel = () => {
    onCancel(reminder.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-green" />
            Reminder Details
          </DialogTitle>
          <DialogDescription>
            View and manage your reminder details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Channel */}
          <div className="flex items-center gap-3">
            <Badge className={`${statusColors[reminder.status]} flex items-center gap-1`}>
              <StatusIcon className="h-3 w-3" />
              {statusLabels[reminder.status]}
            </Badge>
            <Badge className={`${channelColors[reminder.channel]} flex items-center gap-1`}>
              <ChannelIcon className="h-3 w-3" />
              {channelLabels[reminder.channel]}
            </Badge>
          </div>

          {/* Title and Message */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {reminder.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {reminder.message}
              </p>
            </div>
          </div>

          {/* Timing Information */}
          <div className="space-y-3">
            <h4 className="font-medium text-text-primary flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Timing
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-mint-tint rounded-xl">
                <div className="text-sm font-medium text-text-primary">Scheduled For</div>
                <div className="text-sm text-text-secondary">
                  {formatDateTime(scheduledDate)}
                </div>
              </div>
              
              <div className="p-3 bg-pale-lavender/20 rounded-xl">
                <div className="text-sm font-medium text-text-primary">Created</div>
                <div className="text-sm text-text-secondary">
                  {format(createdDate, 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              
              {sentDate && (
                <div className="p-3 bg-light-pink/20 rounded-xl">
                  <div className="text-sm font-medium text-text-primary">Sent</div>
                  <div className="text-sm text-text-secondary">
                    {formatDateTime(sentDate)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Entity */}
          {reminder.related_entity_type && reminder.related_entity_id && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Related Item
              </h4>
              
              <div className="p-3 bg-pastel-yellow/20 rounded-xl">
                <div className="text-sm font-medium text-text-primary capitalize">
                  {reminder.related_entity_type}
                </div>
                <div className="text-sm text-text-secondary">
                  ID: {reminder.related_entity_id}
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {reminder.metadata && Object.keys(reminder.metadata).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-text-primary">Additional Information</h4>
              <div className="p-3 bg-muted/20 rounded-xl">
                <pre className="text-sm text-text-secondary whitespace-pre-wrap">
                  {JSON.stringify(reminder.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            {canEdit && (
              <Button
                onClick={handleEdit}
                className="btn-primary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            
            {canCancel && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}