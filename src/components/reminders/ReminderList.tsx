import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ReminderItem } from './ReminderItem';
import { format, isToday, isTomorrow, isYesterday } from 'date-fns';
import type { Reminder, ReminderGroup } from '@/types/reminder';

interface ReminderListProps {
  reminders: Reminder[];
  groupedReminders?: ReminderGroup[];
  isLoading?: boolean;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onViewDetails: (reminder: Reminder) => void;
  onDeleteSelected?: (ids: string[]) => void;
  onCreateNew?: () => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  showBulkActions?: boolean;
  showGrouped?: boolean;
}

export function ReminderList({
  reminders,
  groupedReminders,
  isLoading = false,
  onEdit,
  onDelete,
  onCancel,
  onViewDetails,
  onDeleteSelected,
  onCreateNew,
  selectedIds = [],
  onSelectionChange,
  showBulkActions = false,
  showGrouped = true,
}: ReminderListProps) {
  const [selectAll, setSelectAll] = useState(false);

  // Flatten grouped reminders for easier handling
  const allReminders = useMemo(() => {
    if (showGrouped && groupedReminders) {
      return groupedReminders.flatMap(group => group.reminders);
    }
    return reminders;
  }, [reminders, groupedReminders, showGrouped]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange?.(allReminders.map(r => r.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      onDeleteSelected?.(selectedIds);
      setSelectAll(false);
    }
  };

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  const getStatusCounts = () => {
    const counts = allReminders.reduce((acc, reminder) => {
      acc[reminder.status] = (acc[reminder.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (allReminders.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-mint-tint rounded-full">
              <Clock className="h-8 w-8 text-mint-green" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No reminders yet
              </h3>
              <p className="text-text-secondary mb-4">
                Create your first reminder to stay on track with your family goals
              </p>
              {onCreateNew && (
                <Button onClick={onCreateNew} className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Reminder
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats and actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mint-green" />
                Reminders
                <span className="text-sm font-normal text-text-secondary">
                  ({allReminders.length} total)
                </span>
              </CardTitle>
            </div>
            
            <div className="flex items-center gap-2">
              {onCreateNew && (
                <Button onClick={onCreateNew} size="sm" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Reminder
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {/* Status counts */}
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-sm">
            {statusCounts.scheduled > 0 && (
              <div className="flex items-center gap-1 text-pastel-yellow">
                <Clock className="h-4 w-4" />
                {statusCounts.scheduled} scheduled
              </div>
            )}
            {statusCounts.sent > 0 && (
              <div className="flex items-center gap-1 text-mint-green">
                <CheckCircle className="h-4 w-4" />
                {statusCounts.sent} sent
              </div>
            )}
            {statusCounts.cancelled > 0 && (
              <div className="flex items-center gap-1 text-text-tertiary">
                <AlertCircle className="h-4 w-4" />
                {statusCounts.cancelled} cancelled
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {showBulkActions && selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-mint-tint rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-primary">
                {selectedIds.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onDeleteSelected && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Select all checkbox */}
      {showBulkActions && allReminders.length > 0 && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium text-text-primary">
            Select all reminders
          </label>
        </div>
      )}

      {/* Reminders list */}
      {showGrouped && groupedReminders ? (
        <div className="space-y-6">
          {groupedReminders.map((group, groupIndex) => (
            <motion.div
              key={group.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {formatGroupDate(group.date)}
                </h3>
                <div className="mt-2 h-px bg-border" />
              </div>
              
              <div className="space-y-3">
                {group.reminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ReminderItem
                      reminder={reminder}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onCancel={onCancel}
                      onViewDetails={onViewDetails}
                      isSelected={selectedIds.includes(reminder.id)}
                      onSelect={handleSelectItem}
                      showSelection={showBulkActions}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {allReminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <ReminderItem
                reminder={reminder}
                onEdit={onEdit}
                onDelete={onDelete}
                onCancel={onCancel}
                onViewDetails={onViewDetails}
                isSelected={selectedIds.includes(reminder.id)}
                onSelect={handleSelectItem}
                showSelection={showBulkActions}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}