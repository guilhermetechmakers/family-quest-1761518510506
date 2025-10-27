import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Trash2, 
  Bell,
  Calendar
} from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import type { Notification, NotificationGroup } from '@/types/notification';

interface NotificationListProps {
  notifications: Notification[];
  groupedNotifications?: NotificationGroup[];
  isLoading?: boolean;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (notification: Notification) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
  onMarkSelectedAsRead?: (ids: string[]) => void;
  onDeleteSelected?: (ids: string[]) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  showBulkActions?: boolean;
}

export function NotificationList({
  notifications,
  groupedNotifications,
  isLoading = false,
  onMarkAsRead,
  onDelete,
  onViewDetails,
  onMarkAllAsRead,
  onClearAll,
  onMarkSelectedAsRead,
  onDeleteSelected,
  selectedIds = [],
  onSelectionChange,
  showBulkActions = true
}: NotificationListProps) {

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      onSelectionChange?.([]);
    } else {
      onSelectionChange?.(notifications.map(n => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  const handleBulkMarkAsRead = () => {
    if (onMarkSelectedAsRead && selectedIds.length > 0) {
      onMarkSelectedAsRead(selectedIds);
      onSelectionChange?.([]);
    }
  };

  const handleBulkDelete = () => {
    if (onDeleteSelected && selectedIds.length > 0) {
      onDeleteSelected(selectedIds);
      onSelectionChange?.([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Bell className="h-16 w-16 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No notifications yet
        </h3>
        <p className="text-text-secondary mb-6">
          You'll see notifications about your family goals, contributions, and milestones here.
        </p>
        <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      </Card>
    );
  }

  // Use grouped notifications if available, otherwise group by date
  const displayData = groupedNotifications || (() => {
    const grouped = notifications.reduce((acc, notification) => {
      const date = new Date(notification.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);

    return Object.entries(grouped).map(([date, notifications]) => ({
      date,
      notifications
    }));
  })();

  return (
    <div className="space-y-6">
      {/* Header with bulk actions */}
      {showBulkActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedIds.length === notifications.length && notifications.length > 0}
                onChange={handleSelectAll}
                className="rounded border-border"
              />
              <span className="text-sm text-text-secondary">
                {selectedIds.length > 0 
                  ? `${selectedIds.length} selected`
                  : `${notifications.length} notifications`
                }
              </span>
            </div>
            
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center gap-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <Button
                variant="outline"
                size="sm"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Mark all read
              </Button>
            )}
            
            {onClearAll && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="flex items-center gap-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Notifications grouped by date */}
      <div className="space-y-6">
        {displayData.map((group) => (
          <div key={group.date} className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-tertiary" />
              <h3 className="text-sm font-semibold text-text-primary">
                {formatDate(group.date)}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {group.notifications.length}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {group.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3">
                  {showBulkActions && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-2 rounded border-border"
                    />
                  )}
                  <div className="flex-1">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDelete={onDelete}
                      onViewDetails={onViewDetails}
                      showActions={!showBulkActions || selectedIds.length === 0}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
