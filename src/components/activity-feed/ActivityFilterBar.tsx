import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Filter, 
  X, 
  Calendar,
  User,
  Target,
  Activity as ActivityIcon
} from 'lucide-react';
import type { ActivityFilters, ActivityType } from '@/types/activity';

interface ActivityFilterBarProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  goals: Array<{ id: string; title: string }>;
  members: Array<{ id: string; full_name: string; role: string }>;
  onClearFilters: () => void;
}

const activityTypes: { value: ActivityType; label: string; icon: React.ReactNode }[] = [
  { value: 'contribution', label: 'Contributions', icon: <Target className="h-4 w-4" /> },
  { value: 'milestone', label: 'Milestones', icon: <ActivityIcon className="h-4 w-4" /> },
  { value: 'goal_created', label: 'Goal Created', icon: <Target className="h-4 w-4" /> },
  { value: 'goal_completed', label: 'Goal Completed', icon: <ActivityIcon className="h-4 w-4" /> },
  { value: 'member_joined', label: 'Member Joined', icon: <User className="h-4 w-4" /> },
  { value: 'member_left', label: 'Member Left', icon: <User className="h-4 w-4" /> },
  { value: 'comment', label: 'Comments', icon: <ActivityIcon className="h-4 w-4" /> },
  { value: 'reaction', label: 'Reactions', icon: <ActivityIcon className="h-4 w-4" /> },
];

export function ActivityFilterBar({ 
  filters, 
  onFiltersChange, 
  goals, 
  members, 
  onClearFilters 
}: ActivityFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const handleFilterChange = (key: keyof ActivityFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleDateChange = (key: 'date_from' | 'date_to', value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearAllFilters = () => {
    onClearFilters();
    setSearchTerm('');
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-text-secondary" />
          <h3 className="font-semibold text-text-primary">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-mint-green text-text-primary">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-text-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-text-secondary hover:text-text-primary"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="space-y-4 animate-fade-in-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Goal Filter */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Goal
              </label>
              <Select
                value={filters.goal_id || ''}
                onValueChange={(value) => handleFilterChange('goal_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All goals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All goals</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Member Filter */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Member
              </label>
              <Select
                value={filters.user_id || ''}
                onValueChange={(value) => handleFilterChange('user_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All members</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center space-x-2">
                        <span>{member.full_name}</span>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {member.role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity Type Filter */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Type
              </label>
              <Select
                value={filters.type || ''}
                onValueChange={(value) => handleFilterChange('type', value as ActivityType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Date Range
              </label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={filters.date_from || ''}
                  onChange={(e) => handleDateChange('date_from', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={filters.date_to || ''}
                  onChange={(e) => handleDateChange('date_to', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.goal_id && (
                  <Badge 
                    variant="secondary" 
                    className="bg-mint-tint text-text-primary"
                  >
                    Goal: {goals.find(g => g.id === filters.goal_id)?.title}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      onClick={() => handleFilterChange('goal_id', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filters.user_id && (
                  <Badge 
                    variant="secondary" 
                    className="bg-pale-lavender text-text-primary"
                  >
                    Member: {members.find(m => m.id === filters.user_id)?.full_name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      onClick={() => handleFilterChange('user_id', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {filters.type && (
                  <Badge 
                    variant="secondary" 
                    className="bg-light-pink text-text-primary"
                  >
                    Type: {activityTypes.find(t => t.value === filters.type)?.label}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      onClick={() => handleFilterChange('type', undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                
                {(filters.date_from || filters.date_to) && (
                  <Badge 
                    variant="secondary" 
                    className="bg-pastel-yellow text-text-primary"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Date Range
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                      onClick={() => {
                        handleFilterChange('date_from', undefined);
                        handleFilterChange('date_to', undefined);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}