import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
  X,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface NotificationDetailsModalProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onNavigateToEntity?: (notification: Notification) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'milestone_achieved':
      return <Target className="h-6 w-6 text-mint-green" />;
    case 'contribution_approved':
      return <CheckCircle className="h-6 w-6 text-mint-green" />;
    case 'contribution_pending':
      return <Clock className="h-6 w-6 text-pastel-yellow" />;
    case 'goal_completed':
      return <Target className="h-6 w-6 text-mint-green" />;
    case 'member_invited':
      return <Users className="h-6 w-6 text-pale-lavender" />;
    case 'member_joined':
      return <Users className="h-6 w-6 text-mint-green" />;
    case 'comment_added':
      return <MessageCircle className="h-6 w-6 text-light-purple" />;
    case 'reaction_added':
      return <Heart className="h-6 w-6 text-light-pink" />;
    case 'reminder':
      return <Bell className="h-6 w-6 text-pastel-yellow" />;
    case 'payment_received':
      return <CreditCard className="h-6 w-6 text-mint-green" />;
    case 'goal_created':
      return <Target className="h-6 w-6 text-light-purple" />;
    case 'family_invite':
      return <Home className="h-6 w-6 text-pale-lavender" />;
    default:
      return <AlertCircle className="h-6 w-6 text-text-secondary" />;
  }
};

const getNotificationTypeLabel = (type: string) => {
  switch (type) {
    case 'milestone_achieved':
      return 'Milestone Achieved';
    case 'contribution_approved':
      return 'Contribution Approved';
    case 'contribution_pending':
      return 'Contribution Pending';
    case 'goal_completed':
      return 'Goal Completed';
    case 'member_invited':
      return 'Member Invited';
    case 'member_joined':
      return 'Member Joined';
    case 'comment_added':
      return 'Comment Added';
    case 'reaction_added':
      return 'Reaction Added';
    case 'reminder':
      return 'Reminder';
    case 'payment_received':
      return 'Payment Received';
    case 'goal_created':
      return 'Goal Created';
    case 'family_invite':
      return 'Family Invite';
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

export function NotificationDetailsModal({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
  onDelete,
  onNavigateToEntity
}: NotificationDetailsModalProps) {
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!notification) return null;

  const handleMarkAsRead = async () => {
    if (!notification.is_read && onMarkAsRead) {
      setIsMarkingAsRead(true);
      try {
        await onMarkAsRead(notification.id);
      } finally {
        setIsMarkingAsRead(false);
      }
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete(notification.id);
        onClose();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleNavigateToEntity = () => {
    if (onNavigateToEntity) {
      onNavigateToEntity(notification);
      onClose();
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-text-primary">
              Notification Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {notification.title}
                </h3>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-sm px-3 py-1 rounded-full",
                    getNotificationTypeColor(notification.type)
                  )}
                >
                  {getNotificationTypeLabel(notification.type)}
                </Badge>
                {!notification.is_read && (
                  <div className="w-2 h-2 bg-mint-green rounded-full flex-shrink-0" />
                )}
              </div>
              
              <div className="text-sm text-text-tertiary">
                {formatTimeAgo(notification.created_at)} • {formatDateTime(notification.created_at)}
              </div>
            </div>
          </div>

          {/* Message */}
          <Card className="p-4 bg-mint-tint/20">
            <p className="text-text-primary leading-relaxed">
              {notification.message}
            </p>
          </Card>

          {/* Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-xs text-text-tertiary uppercase tracking-wide">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="text-sm text-text-primary font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Entity */}
          {notification.related_entity_type && notification.related_entity_id && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-text-primary">Related {notification.related_entity_type}</h4>
              <Card className="p-3 bg-pale-lavender/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-text-secondary" />
                    <span className="text-sm text-text-primary capitalize">
                      {notification.related_entity_type} #{notification.related_entity_id}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNavigateToEntity}
                    className="text-xs"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {!notification.is_read && onMarkAsRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isMarkingAsRead}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  {isMarkingAsRead ? 'Marking...' : 'Mark as Read'}
                </Button>
              )}
              
              {onNavigateToEntity && notification.related_entity_type && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNavigateToEntity}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Go to {notification.related_entity_type}
                </Button>
              )}
            </div>

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
