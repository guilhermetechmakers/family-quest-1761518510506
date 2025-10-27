import { useState } from 'react';
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
  Calendar,
  User,
  Target,
  DollarSign,
  Star,
  Users,
  CheckCircle,
  MessageCircle,
  Heart,
} from 'lucide-react';
import type { ActivityFilters, ActivityType } from '@/types/activity';

interface ActivityFilterBarProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  className?: string;
}

const activityTypes: { value: ActivityType; label: string; icon: any; color: string }[] = [
  { value: 'contribution', label: 'Contributions', icon: DollarSign, color: 'text-mint-green' },
  { value: 'milestone', label: 'Milestones', icon: Star, color: 'text-pastel-yellow' },
  { value: 'goal_created', label: 'New Goals', icon: Target, color: 'text-pale-lavender' },
  { value: 'goal_completed', label: 'Completed Goals', icon: CheckCircle, color: 'text-mint-green' },
  { value: 'member_joined', label: 'New Members', icon: Users, color: 'text-light-pink' },
  { value: 'member_left', label: 'Left Members', icon: Users, color: 'text-gray-500' },
  { value: 'comment', label: 'Comments', icon: MessageCircle, color: 'text-text-tertiary' },
  { value: 'reaction', label: 'Reactions', icon: Heart, color: 'text-light-pink' },
];

const timeRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export function ActivityFilterBar({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery,
  className,
}: ActivityFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleTypeFilter = (type: ActivityType | '') => {
    onFiltersChange({ ...filters, type: type || undefined });
  };

  const handleUserFilter = (userId: string) => {
    onFiltersChange({ ...filters, user_id: userId || undefined });
  };

  const handleTimeRange = (range: string) => {
    const now = new Date();
    let dateFrom: string | undefined;
    let dateTo: string | undefined;

    switch (range) {
      case 'today':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        break;
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        dateFrom = weekAgo.toISOString();
        break;
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        dateFrom = monthAgo.toISOString();
        break;
      default:
        dateFrom = undefined;
        dateTo = undefined;
    }

    onFiltersChange({ ...filters, date_from: dateFrom, date_to: dateTo });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <Input
          placeholder="Search activities, comments, or family members..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 bg-white border-gray-200 focus:border-mint-green focus:ring-mint-green rounded-xl"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {activityTypes.map((type) => {
          const IconComponent = type.icon;
          const isActive = filters.type === type.value;
          
          return (
            <Button
              key={type.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeFilter(isActive ? '' : type.value)}
              className={`rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-mint-green text-text-primary hover:bg-light-mint' 
                  : 'hover:bg-mint-tint hover:border-mint-green'
              }`}
            >
              <IconComponent className={`h-4 w-4 mr-2 ${isActive ? 'text-text-primary' : type.color}`} />
              {type.label}
            </Button>
          );
        })}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-text-secondary hover:text-text-primary"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-mint-green text-text-primary">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-text-tertiary hover:text-text-primary"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl animate-fade-in-down">
          {/* Time Range Filter */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Time Range
            </label>
            <Select onValueChange={handleTimeRange}>
              <SelectTrigger className="bg-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Filter */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Family Member
            </label>
            <Select onValueChange={handleUserFilter}>
              <SelectTrigger className="bg-white">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Members</SelectItem>
                <SelectItem value="user-1">Sarah Johnson</SelectItem>
                <SelectItem value="user-2">Mike Johnson</SelectItem>
                <SelectItem value="user-3">Emma Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Sort Order
            </label>
            <Select onValueChange={() => onFiltersChange({ ...filters })}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Newest first" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="bg-mint-green text-text-primary">
              Type: {activityTypes.find(t => t.value === filters.type)?.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                onClick={() => handleTypeFilter('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.user_id && (
            <Badge variant="secondary" className="bg-pale-lavender text-text-primary">
              User: {filters.user_id}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                onClick={() => handleUserFilter('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.date_from && (
            <Badge variant="secondary" className="bg-light-pink text-text-primary">
              Date Range
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                onClick={() => onFiltersChange({ ...filters, date_from: undefined, date_to: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}