import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useContributionsByUser } from '@/hooks/useContributions';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface NotificationItem {
  id: string;
  type: 'contribution_approved' | 'contribution_rejected' | 'contribution_pending' | 'milestone_reached' | 'payment_failed';
  title: string;
  message: string;
  timestamp: string;
  contribution_id?: string;
  goal_id?: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export function ContributionNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showAll, setShowAll] = useState(false);
  
  const { data: contributions = [] } = useContributionsByUser();

  // Generate notifications based on contributions
  useEffect(() => {
    const generatedNotifications: NotificationItem[] = [];
    
    contributions.forEach((contribution) => {
      
      // Pending approval notification
      if (contribution.status === 'pending') {
        generatedNotifications.push({
          id: `pending-${contribution.id}`,
          type: 'contribution_pending',
          title: 'Contribution Pending Approval',
          message: `Your ${contribution.type} contribution of $${contribution.amount} for "${contribution.goal.title}" is waiting for approval.`,
          timestamp: contribution.created_at,
          contribution_id: contribution.id,
          goal_id: contribution.goal_id,
          is_read: false,
          priority: 'medium',
        });
      }
      
      // Approved notification
      if (contribution.status === 'approved' && contribution.approved_at) {
        generatedNotifications.push({
          id: `approved-${contribution.id}`,
          type: 'contribution_approved',
          title: 'Contribution Approved!',
          message: `Your ${contribution.type} contribution of $${contribution.amount} for "${contribution.goal.title}" has been approved.`,
          timestamp: contribution.approved_at,
          contribution_id: contribution.id,
          goal_id: contribution.goal_id,
          is_read: false,
          priority: 'high',
        });
      }
      
      // Rejected notification
      if (contribution.status === 'rejected') {
        generatedNotifications.push({
          id: `rejected-${contribution.id}`,
          type: 'contribution_rejected',
          title: 'Contribution Rejected',
          message: `Your ${contribution.type} contribution of $${contribution.amount} for "${contribution.goal.title}" was rejected.`,
          timestamp: contribution.updated_at,
          contribution_id: contribution.id,
          goal_id: contribution.goal_id,
          is_read: false,
          priority: 'high',
        });
      }
    });

    // Sort by timestamp (newest first)
    generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setNotifications(generatedNotifications);
  }, [contributions]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contribution_approved':
        return <CheckCircle className="h-5 w-5 text-mint-green" />;
      case 'contribution_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'contribution_pending':
        return <Clock className="h-5 w-5 text-pastel-yellow" />;
      case 'milestone_reached':
        return <Target className="h-5 w-5 text-light-purple" />;
      case 'payment_failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-text-tertiary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-pastel-yellow text-text-primary';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE \'at\' h:mm a');
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  return (
    <Card className="p-6 bg-white shadow-card border-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mint-tint rounded-full">
            <Bell className="h-5 w-5 text-mint-green" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Contribution Notifications
            </h2>
            <p className="text-text-secondary text-sm">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="text-mint-green border-mint-green hover:bg-mint-tint"
          >
            Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {displayedNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Notifications
              </h3>
              <p className="text-text-secondary">
                You're all caught up! New notifications will appear here.
              </p>
            </motion.div>
          ) : (
            displayedNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  notification.is_read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-mint-tint border-mint-green'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text-primary text-sm">
                        {notification.title}
                      </h3>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-mint-green rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {notifications.length > 5 && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="outline"
            className="text-mint-green border-mint-green hover:bg-mint-tint"
          >
            {showAll ? 'Show Less' : `Show All ${notifications.length} Notifications`}
          </Button>
        </div>
      )}
    </Card>
  );
}