import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Settings } from 'lucide-react';
import { 
  NotificationFilters, 
  NotificationList, 
  NotificationDetailsModal 
} from '@/components/notifications';
import { 
  useGroupedNotifications, 
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useMarkMultipleAsRead,
  useDeleteNotification,
  useDeleteMultipleNotifications,
  useClearAllNotifications
} from '@/hooks/useNotifications';
import type { Notification, NotificationFilters as NotificationFiltersType, NotificationSearchParams } from '@/types/notification';

export function NotificationsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<NotificationFiltersType>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Search params for API calls
  const searchParams: NotificationSearchParams = useMemo(() => ({
    query: searchQuery || undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    limit: 50
  }), [searchQuery, filters]);

  // Data fetching
  const { data: groupedNotifications, isLoading } = useGroupedNotifications(searchParams);
  const { data: unreadCount = 0 } = useUnreadCount();

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const markMultipleAsReadMutation = useMarkMultipleAsRead();
  const deleteNotificationMutation = useDeleteNotification();
  const deleteMultipleNotificationsMutation = useDeleteMultipleNotifications();
  const clearAllNotificationsMutation = useClearAllNotifications();

  // Flatten grouped notifications for easier handling
  const allNotifications = useMemo(() => {
    if (!groupedNotifications) return [];
    return groupedNotifications.flatMap(group => group.notifications);
  }, [groupedNotifications]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: NotificationFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotificationMutation.mutateAsync(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleMarkSelectedAsRead = async (ids: string[]) => {
    await markMultipleAsReadMutation.mutateAsync(ids);
  };

  const handleDeleteSelected = async (ids: string[]) => {
    await deleteMultipleNotificationsMutation.mutateAsync(ids);
  };

  const handleClearAll = async () => {
    await clearAllNotificationsMutation.mutateAsync();
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailsModalOpen(true);
  };

  const handleNavigateToEntity = (notification: Notification) => {
    if (notification.related_entity_type && notification.related_entity_id) {
      switch (notification.related_entity_type) {
        case 'goal':
          navigate(`/goals/${notification.related_entity_id}`);
          break;
        case 'contribution':
          navigate(`/contributions/${notification.related_entity_id}`);
          break;
        case 'activity':
          navigate(`/activities/${notification.related_entity_id}`);
          break;
        case 'family':
          navigate('/settings');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedNotification(null);
  };

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGoToSettings}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-mint-green" />
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Notifications</h1>
              <p className="text-text-secondary">
                Stay updated with your family's progress and activities
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <NotificationFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onClearFilters={handleClearFilters}
          unreadCount={unreadCount}
          totalCount={allNotifications.length}
        />

        {/* Notifications List */}
        <NotificationList
          notifications={allNotifications}
          groupedNotifications={groupedNotifications}
          isLoading={isLoading}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
          onMarkSelectedAsRead={handleMarkSelectedAsRead}
          onDeleteSelected={handleDeleteSelected}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          showBulkActions={true}
        />

        {/* Details Modal */}
        <NotificationDetailsModal
          notification={selectedNotification}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
          onNavigateToEntity={handleNavigateToEntity}
        />
      </div>
    </div>
  );
}