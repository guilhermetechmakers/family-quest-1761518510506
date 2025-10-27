import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  Clock,
  Mail,
  Smartphone,
  Bell
} from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import type { ReminderSearchParams, ReminderStatus, ReminderChannel } from '@/types/reminder';

interface ReminderFiltersProps {
  filters: ReminderSearchParams;
  onFiltersChange: (filters: ReminderSearchParams) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onClearFilters: () => void;
  totalCount: number;
  scheduledCount?: number;
  sentCount?: number;
  cancelledCount?: number;
}

const statusOptions: { value: ReminderStatus; label: string; icon: any }[] = [
  { value: 'scheduled', label: 'Scheduled', icon: Clock },
  { value: 'sent', label: 'Sent', icon: Calendar },
  { value: 'cancelled', label: 'Cancelled', icon: X },
  { value: 'failed', label: 'Failed', icon: X },
];

const channelOptions: { value: ReminderChannel; label: string; icon: any }[] = [
  { value: 'push', label: 'Push', icon: Smartphone },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'in_app', label: 'In-App', icon: Bell },
];

const quickDateRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last 30 Days', value: 'last30days' },
];

export function ReminderFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  onClearFilters,
  totalCount,
  scheduledCount = 0,
  sentCount = 0,
  cancelledCount = 0,
}: ReminderFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: '',
  });

  const handleStatusChange = (status: ReminderStatus | 'all') => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : status,
    });
  };

  const handleChannelChange = (channel: ReminderChannel | 'all') => {
    onFiltersChange({
      ...filters,
      channel: channel === 'all' ? undefined : channel,
    });
  };

  const handleQuickDateRange = (range: string) => {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (range) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'tomorrow':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
        break;
      case 'week':
        start = subDays(now, 7);
        break;
      case 'month':
        start = subMonths(now, 1);
        break;
      case 'last7days':
        start = subDays(now, 7);
        break;
      case 'last30days':
        start = subDays(now, 30);
        break;
      default:
        return;
    }

    onFiltersChange({
      ...filters,
      date_range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  };

  const handleCustomDateRange = () => {
    if (customDateRange.start && customDateRange.end) {
      onFiltersChange({
        ...filters,
        date_range: {
          start: new Date(customDateRange.start).toISOString(),
          end: new Date(customDateRange.end).toISOString(),
        },
      });
    }
  };

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      date_range: undefined,
    });
    setCustomDateRange({ start: '', end: '' });
  };

  const hasActiveFilters = filters.status || filters.channel || filters.date_range;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2">
            {/* Status filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-secondary">Status:</span>
              <Button
                variant={!filters.status ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange('all')}
                className="rounded-full"
              >
                All ({totalCount})
              </Button>
              {statusOptions.map((option) => {
                const count = option.value === 'scheduled' ? scheduledCount :
                             option.value === 'sent' ? sentCount :
                             option.value === 'cancelled' ? cancelledCount : 0;
                
                return (
                  <Button
                    key={option.value}
                    variant={filters.status === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(option.value)}
                    className="rounded-full"
                  >
                    <option.icon className="h-3 w-3 mr-1" />
                    {option.label} ({count})
                  </Button>
                );
              })}
            </div>

            {/* Channel filters */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-text-secondary">Channel:</span>
              <Button
                variant={!filters.channel ? "default" : "outline"}
                size="sm"
                onClick={() => handleChannelChange('all')}
                className="rounded-full"
              >
                All
              </Button>
              {channelOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.channel === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChannelChange(option.value)}
                  className="rounded-full"
                >
                  <option.icon className="h-3 w-3 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced filters toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-text-secondary hover:text-text-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Advanced filters */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-border"
            >
              {/* Quick date ranges */}
              <div>
                <Label className="text-sm font-medium text-text-primary mb-2 block">
                  Quick Date Ranges
                </Label>
                <div className="flex flex-wrap gap-2">
                  {quickDateRanges.map((range) => (
                    <Button
                      key={range.value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickDateRange(range.value)}
                      className="rounded-full"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom date range */}
              <div>
                <Label className="text-sm font-medium text-text-primary mb-2 block">
                  Custom Date Range
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="rounded-xl"
                  />
                  <span className="text-text-secondary">to</span>
                  <Input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleCustomDateRange}
                    size="sm"
                    className="btn-primary"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={clearDateRange}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm font-medium text-text-secondary">Active filters:</span>
              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {statusOptions.find(s => s.value === filters.status)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleStatusChange('all')}
                  />
                </Badge>
              )}
              {filters.channel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Channel: {channelOptions.find(c => c.value === filters.channel)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleChannelChange('all')}
                  />
                </Badge>
              )}
              {filters.date_range && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Date: {format(new Date(filters.date_range.start), 'MMM d')} - {format(new Date(filters.date_range.end), 'MMM d')}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={clearDateRange}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}