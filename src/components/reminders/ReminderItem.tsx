import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Mail, 
  Smartphone, 
  Bell, 
  MoreVertical, 
  Edit, 
  Trash2, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import type { Reminder } from '@/types/reminder';

interface ReminderItemProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onViewDetails: (reminder: Reminder) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  showSelection?: boolean;
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

export function ReminderItem({
  reminder,
  onEdit,
  onDelete,
  onCancel,
  onViewDetails,
  isSelected = false,
  onSelect,
  showSelection = false,
}: ReminderItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const scheduledDate = new Date(reminder.scheduled_time);
  const ChannelIcon = channelIcons[reminder.channel];
  const StatusIcon = statusIcons[reminder.status];

  const formatScheduledTime = () => {
    if (isToday(scheduledDate)) {
      return `Today at ${format(scheduledDate, 'h:mm a')}`;
    } else if (isTomorrow(scheduledDate)) {
      return `Tomorrow at ${format(scheduledDate, 'h:mm a')}`;
    } else if (isYesterday(scheduledDate)) {
      return `Yesterday at ${format(scheduledDate, 'h:mm a')}`;
    } else {
      return format(scheduledDate, 'MMM d, yyyy h:mm a');
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        onEdit(reminder);
        break;
      case 'delete':
        onDelete(reminder.id);
        break;
      case 'cancel':
        onCancel(reminder.id);
        break;
      case 'reschedule':
        // For now, just open edit modal
        onEdit(reminder);
        break;
      case 'view':
        onViewDetails(reminder);
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-mint-green' : ''
        } ${
          isHovered ? 'shadow-lg -translate-y-1' : 'shadow-sm'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onViewDetails(reminder)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Selection checkbox */}
            {showSelection && onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(reminder.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="mt-1 h-4 w-4 text-mint-green rounded border-border focus:ring-mint-green"
              />
            )}

            {/* Channel icon */}
            <div className={`p-2 rounded-lg ${channelColors[reminder.channel]}`}>
              <ChannelIcon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary truncate">
                    {reminder.title}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {reminder.message}
                  </p>
                </div>

                {/* Status badge */}
                <Badge className={`${statusColors[reminder.status]} flex items-center gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {reminder.status}
                </Badge>
              </div>

              {/* Time and actions */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="h-4 w-4" />
                  <span>{formatScheduledTime()}</span>
                </div>

                {/* Actions dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 p-0 hover:bg-mint-green/20"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction('view')}>
                      View Details
                    </DropdownMenuItem>
                    {reminder.status === 'scheduled' && (
                      <>
                        <DropdownMenuItem onClick={() => handleAction('edit')}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('cancel')}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleAction('delete')}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}