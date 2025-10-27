import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  ChevronRight,
  Calendar,
  Mail,
  Smartphone,
  Bell
} from 'lucide-react';
import { useUpcomingReminders } from '@/hooks/useReminders';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';

interface UpcomingRemindersProps {
  onViewAll?: () => void;
  onCreateNew?: () => void;
  maxItems?: number;
  showActions?: boolean;
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
  push: 'Push',
  email: 'Email',
  in_app: 'In-App',
};

export function UpcomingReminders({
  onViewAll,
  onCreateNew,
  maxItems = 5,
  showActions = true,
}: UpcomingRemindersProps) {
  const { data: upcomingReminders = [], isLoading } = useUpcomingReminders();

  const displayReminders = upcomingReminders.slice(0, maxItems);

  const formatReminderTime = (scheduledTime: string) => {
    const date = new Date(scheduledTime);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-green" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingReminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-green" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="p-4 bg-mint-tint rounded-full w-fit mx-auto mb-4">
              <Clock className="h-8 w-8 text-mint-green" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              No upcoming reminders
            </h3>
            <p className="text-text-secondary mb-4">
              You don't have any reminders scheduled for the next 7 days
            </p>
            {showActions && onCreateNew && (
              <Button onClick={onCreateNew} className="btn-primary">
                Create Reminder
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-mint-green" />
            Upcoming Reminders
            <Badge variant="secondary" className="ml-2">
              {upcomingReminders.length}
            </Badge>
          </CardTitle>
          {showActions && onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-text-secondary hover:text-text-primary"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayReminders.map((reminder, index) => {
            const ChannelIcon = channelIcons[reminder.channel];
            
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-3 p-3 bg-mint-tint rounded-xl hover:bg-mint-green/20 transition-colors"
              >
                {/* Channel icon */}
                <div className={`p-2 rounded-lg ${channelColors[reminder.channel]}`}>
                  <ChannelIcon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary truncate">
                    {reminder.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3 w-3 text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      {formatReminderTime(reminder.scheduled_time)}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {channelLabels[reminder.channel]}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Show more indicator */}
        {upcomingReminders.length > maxItems && (
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-sm text-text-secondary text-center">
              +{upcomingReminders.length - maxItems} more reminders
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex gap-2">
            {onCreateNew && (
              <Button onClick={onCreateNew} size="sm" className="btn-primary flex-1">
                Create New Reminder
              </Button>
            )}
            {onViewAll && (
              <Button onClick={onViewAll} variant="outline" size="sm" className="flex-1">
                View All Reminders
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}