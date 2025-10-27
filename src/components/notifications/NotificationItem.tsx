import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Users, 
  MessageCircle, 
  Heart, 
  Bell, 
  AlertCircle,
  CreditCard,
  Home,
  MoreVertical,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (notification: Notification) => void;
  showActions?: boolean;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'milestone_achieved':
      return <Target className="h-5 w-5 text-mint-green" />;
    case 'contribution_approved':
      return <CheckCircle className="h-5 w-5 text-mint-green" />;
    case 'contribution_pending':
      return <Clock className="h-5 w-5 text-pastel-yellow" />;
    case 'goal_completed':
      return <Target className="h-5 w-5 text-mint-green" />;
    case 'member_invited':
      return <Users className="h-5 w-5 text-pale-lavender" />;
    case 'member_joined':
      return <Users className="h-5 w-5 text-mint-green" />;
    case 'comment_added':
      return <MessageCircle className="h-5 w-5 text-light-purple" />;
    case 'reaction_added':
      return <Heart className="h-5 w-5 text-light-pink" />;
    case 'reminder':
      return <Bell className="h-5 w-5 text-pastel-yellow" />;
    case 'payment_received':
      return <CreditCard className="h-5 w-5 text-mint-green" />;
    case 'goal_created':
      return <Target className="h-5 w-5 text-light-purple" />;
    case 'family_invite':
      return <Home className="h-5 w-5 text-pale-lavender" />;
    default:
      return <AlertCircle className="h-5 w-5 text-text-secondary" />;
  }
};

const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case 'milestone_achieved':
      return 'Milestone';
    case 'contribution_approved':
      return 'Approved';
    case 'contribution_pending':
      return 'Pending';
    case 'goal_completed':
      return 'Completed';
    case 'member_invited':
      return 'Invite';
    case 'member_joined':
      return 'Joined';
    case 'comment_added':
      return 'Comment';
    case 'reaction_added':
      return 'Reaction';
    case 'reminder':
      return 'Reminder';
    case 'payment_received':
      return 'Payment';
    case 'goal_created':
      return 'Created';
    case 'family_invite':
      return 'Family';
    default:
      return 'Notification';
  }
};

const getNotificationTypeColor = (type: string) => {
  switch (type) {
    case 'milestone_achieved':
    case 'contribution_approved':
    case 'goal_completed':
    case 'member_joined':
    case 'payment_received':
      return 'bg-mint-green text-text-primary';
    case 'contribution_pending':
    case 'reminder':
      return 'bg-pastel-yellow text-text-primary';
    case 'member_invited':
    case 'family_invite':
      return 'bg-pale-lavender text-text-primary';
    case 'comment_added':
    case 'reaction_added':
    case 'goal_created':
      return 'bg-light-purple text-text-primary';
    default:
      return 'bg-text-tertiary text-text-primary';
  }
};

export function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onViewDetails,
  showActions = true 
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMarkAsRead = () => {
    if (!notification.is_read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(notification);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 group",
        !notification.is_read && "bg-mint-tint/30 border-l-4 border-l-mint-green",
        isHovered && "shadow-card-hover -translate-y-0.5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-text-primary truncate">
                  {notification.title}
                </h4>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    getNotificationTypeColor(notification.type)
                  )}
                >
                  {getNotificationTypeLabel(notification.type)}
                </Badge>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-mint-green rounded-full flex-shrink-0" />
                )}
              </div>
              
              <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                {notification.message}
              </p>
              
              <div className="flex items-center gap-2 text-xs text-text-tertiary">
                <span>{formatTimeAgo(notification.created_at)}</span>
                {notification.related_entity_type && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{notification.related_entity_type}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAsRead}
                    className="h-8 w-8 p-0 hover:bg-mint-green/20"
                    title="Mark as read"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewDetails}
                  className="h-8 w-8 p-0 hover:bg-pale-lavender/20"
                  title="View details"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 hover:bg-light-pink/20 text-text-tertiary hover:text-red-500"
                  title="Delete"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
