import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Settings, Plus } from 'lucide-react';
import { 
  ReminderList,
  ReminderFilters,
  CreateReminderModal,
  EditReminderModal,
  ReminderDetailsModal,
  UpcomingReminders
} from '@/components/reminders';
import { 
  useGroupedReminders, 
  useDeleteReminder,
  useDeleteMultipleReminders,
  useCancelReminder
} from '@/hooks/useReminders';
import type { Reminder, ReminderSearchParams } from '@/types/reminder';

export function RemindersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ReminderSearchParams>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Search params for API calls
  const searchParams: ReminderSearchParams = useMemo(() => ({
    query: searchQuery || undefined,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
    limit: 50
  }), [searchQuery, filters]);

  // Data fetching
  const { data: groupedReminders, isLoading } = useGroupedReminders(searchParams);

  // Mutations
  const deleteReminderMutation = useDeleteReminder();
  const deleteMultipleRemindersMutation = useDeleteMultipleReminders();
  const cancelReminderMutation = useCancelReminder();

  // Flatten grouped reminders for easier handling
  const allReminders = useMemo(() => {
    if (!groupedReminders) return [];
    return groupedReminders.flatMap(group => group.reminders);
  }, [groupedReminders]);

  // Get status counts
  const statusCounts = useMemo(() => {
    return allReminders.reduce((acc, reminder) => {
      acc[reminder.status] = (acc[reminder.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [allReminders]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters: ReminderSearchParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const handleCreateReminder = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteReminder = async (id: string) => {
    await deleteReminderMutation.mutateAsync(id);
  };

  const handleCancelReminder = async (id: string) => {
    await cancelReminderMutation.mutateAsync(id);
  };


  const handleDeleteSelected = async (ids: string[]) => {
    await deleteMultipleRemindersMutation.mutateAsync(ids);
    setSelectedIds([]);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedReminder(null);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedReminder(null);
  };

  const handleGoToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 hover:bg-mint-green/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={handleGoToSettings}
              className="flex items-center gap-2 hover:bg-mint-green/10"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-mint-green rounded-xl">
              <Clock className="h-8 w-8 text-text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Reminders</h1>
              <p className="text-text-secondary">
                Stay on track with your family goals and important tasks
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <ReminderFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onClearFilters={handleClearFilters}
                totalCount={allReminders.length}
                scheduledCount={statusCounts.scheduled || 0}
                sentCount={statusCounts.sent || 0}
                cancelledCount={statusCounts.cancelled || 0}
              />
            </motion.div>

            {/* Reminders List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
            <ReminderList
              reminders={allReminders}
              groupedReminders={groupedReminders}
              isLoading={isLoading}
              onEdit={handleEditReminder}
              onDelete={handleDeleteReminder}
              onCancel={handleCancelReminder}
              onViewDetails={handleViewDetails}
              onDeleteSelected={handleDeleteSelected}
              onCreateNew={handleCreateReminder}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              showBulkActions={true}
              showGrouped={true}
            />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Reminders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <UpcomingReminders
                onViewAll={() => navigate('/reminders')}
                onCreateNew={handleCreateReminder}
                maxItems={5}
                showActions={true}
              />
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="space-y-3">
                <Button
                  onClick={handleCreateReminder}
                  className="w-full btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/settings')}
                  className="w-full"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Reminder Settings
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <CreateReminderModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
          onSuccess={handleCreateSuccess}
        />

        <EditReminderModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSuccess={handleEditSuccess}
          reminder={selectedReminder}
        />

        <ReminderDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseModals}
          reminder={selectedReminder}
          onEdit={handleEditReminder}
          onDelete={handleDeleteReminder}
          onCancel={handleCancelReminder}
        />
      </div>
    </div>
  );
}