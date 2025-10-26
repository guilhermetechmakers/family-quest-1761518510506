import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRelativeTime } from '@/lib/utils';
import { 
  Bell, 
  Check, 
  Trash2, 
  Settings,
  Target,
  DollarSign,
  Users,
  Star,
  MessageCircle,
  Heart
} from 'lucide-react';
import type { Notification } from '@/types/notification';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
  onDeleteAll?: () => void;
  className?: string;
}

const notificationIcons = {
  milestone_achieved: Star,
  contribution_approved: Check,
  contribution_pending: DollarSign,
  goal_completed: Target,
  member_invited: Users,
  member_joined: Users,
  comment_added: MessageCircle,
  reaction_added: Heart,
};

const notificationColors = {
  milestone_achieved: 'text-pastel-yellow',
  contribution_approved: 'text-mint-green',
  contribution_pending: 'text-yellow-500',
  goal_completed: 'text-mint-green',
  member_invited: 'text-pale-lavender',
  member_joined: 'text-light-pink',
  comment_added: 'text-text-tertiary',
  reaction_added: 'text-light-pink',
};

export function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.is_read;
    if (filter === 'read') return notification.is_read;
    return true;
  });

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const readNotifications = notifications.filter(n => n.is_read);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="bg-mint-green text-text-primary">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
            >
              <Check className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="read">
            Read ({readNotifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-6">
          <NotificationList
            notifications={unreadNotifications}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </TabsContent>

        <TabsContent value="read" className="mt-6">
          <NotificationList
            notifications={readNotifications}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <Card className="p-8 text-center">
          <Bell className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-text-secondary">
            {filter === 'unread' 
              ? 'You\'re all caught up!'
              : 'You\'ll see notifications about your family goals and activities here.'
            }
          </p>
        </Card>
      )}
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function NotificationList({ notifications, onMarkAsRead, onDelete }: NotificationListProps) {
  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type];
        const iconColor = notificationColors[notification.type];

        return (
          <Card
            key={notification.id}
            className={`p-4 hover:shadow-card-hover transition-all duration-300 ${
              !notification.is_read ? 'bg-mint-green bg-opacity-5 border-mint-green' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${iconColor} bg-opacity-20`}>
                <Icon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-semibold ${!notification.is_read ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-text-secondary text-sm mt-1">
                      {notification.message}
                    </p>
                    <p className="text-text-tertiary text-xs mt-2">
                      {formatRelativeTime(notification.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead?.(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                {notification.related_entity_id && (
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {notification.type === 'contribution_pending' && (
                      <Button size="sm">
                        Approve
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}