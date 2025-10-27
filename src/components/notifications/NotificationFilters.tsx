import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  CheckCircle,
  Clock
} from 'lucide-react';
import type { NotificationFilters, NotificationType } from '@/types/notification';

interface NotificationFiltersProps {
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClearFilters: () => void;
  unreadCount?: number;
  totalCount?: number;
}

const notificationTypes: { value: NotificationType; label: string }[] = [
  { value: 'milestone_achieved', label: 'Milestone Achieved' },
  { value: 'contribution_approved', label: 'Contribution Approved' },
  { value: 'contribution_pending', label: 'Contribution Pending' },
  { value: 'goal_completed', label: 'Goal Completed' },
  { value: 'member_invited', label: 'Member Invited' },
  { value: 'member_joined', label: 'Member Joined' },
  { value: 'comment_added', label: 'Comment Added' },
  { value: 'reaction_added', label: 'Reaction Added' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'payment_received', label: 'Payment Received' },
  { value: 'goal_created', label: 'Goal Created' },
  { value: 'family_invite', label: 'Family Invite' },
];

export function NotificationFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  onClearFilters,
  unreadCount = 0,
  totalCount = 0
}: NotificationFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTypeChange = (type: string) => {
    if (type === 'all') {
      const { type: _, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, type: type as NotificationType });
    }
  };

  const handleReadStatusChange = (status: string) => {
    if (status === 'all') {
      const { is_read: _, ...rest } = filters;
      onFiltersChange(rest);
    } else {
      onFiltersChange({ ...filters, is_read: status === 'unread' });
    }
  };

  const hasActiveFilters = filters.type || filters.is_read !== undefined;

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        {/* Search and Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {Object.keys(filters).length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-mint-green" />
            <span>{totalCount - unreadCount} read</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-pastel-yellow" />
            <span>{unreadCount} unread</span>
          </div>
          <div className="text-text-tertiary">
            {totalCount} total
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Notification Type
                </label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Read Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">
                  Read Status
                </label>
                <Select
                  value={filters.is_read === undefined ? 'all' : filters.is_read ? 'read' : 'unread'}
                  onValueChange={handleReadStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-text-secondary">Active filters:</span>
                {filters.type && (
                  <Badge 
                    variant="secondary" 
                    className="bg-mint-green/20 text-text-primary"
                  >
                    {notificationTypes.find(t => t.value === filters.type)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTypeChange('all')}
                      className="h-4 w-4 p-0 ml-1 hover:bg-mint-green/30"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.is_read !== undefined && (
                  <Badge 
                    variant="secondary" 
                    className="bg-pastel-yellow/20 text-text-primary"
                  >
                    {filters.is_read ? 'Read' : 'Unread'}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReadStatusChange('all')}
                      className="h-4 w-4 p-0 ml-1 hover:bg-pastel-yellow/30"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
