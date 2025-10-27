import React, { useState } from 'react';
import { X, Filter, Calendar, DollarSign, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { SearchFilters, SearchEntityType } from '@/types/search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClose?: () => void;
  className?: string;
}

const entityTypeOptions: Array<{ value: SearchEntityType; label: string; icon: React.ReactNode }> = [
  { value: 'goal', label: 'Goals', icon: <Target className="h-4 w-4" /> },
  { value: 'activity', label: 'Activities', icon: <Users className="h-4 w-4" /> },
  { value: 'transaction', label: 'Transactions', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'member', label: 'Members', icon: <Users className="h-4 w-4" /> },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'draft', label: 'Draft' },
];

const typeOptions = [
  { value: 'contribution', label: 'Contribution' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'goal_created', label: 'Goal Created' },
  { value: 'goal_completed', label: 'Goal Completed' },
  { value: 'member_joined', label: 'Member Joined' },
  { value: 'comment', label: 'Comment' },
  { value: 'reaction', label: 'Reaction' },
];

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
];

export function FilterPanel({ filters, onFiltersChange, onClose, className }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEntityTypeToggle = (entityType: SearchEntityType) => {
    const currentTypes = localFilters.entity_types || [];
    const newTypes = currentTypes.includes(entityType)
      ? currentTypes.filter(t => t !== entityType)
      : [...currentTypes, entityType];
    
    handleFilterChange('entity_types', newTypes.length > 0 ? newTypes : undefined);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.entity_types?.length) count += localFilters.entity_types.length;
    if (localFilters.date_from) count++;
    if (localFilters.date_to) count++;
    if (localFilters.status) count++;
    if (localFilters.type) count++;
    if (localFilters.amount_min !== undefined) count++;
    if (localFilters.amount_max !== undefined) count++;
    if (localFilters.currency) count++;
    return count;
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="w-full"
          >
            Clear all filters
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Entity Types */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Search in</Label>
          <div className="space-y-2">
            {entityTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`entity-${option.value}`}
                  checked={localFilters.entity_types?.includes(option.value) || false}
                  onCheckedChange={() => handleEntityTypeToggle(option.value)}
                />
                <Label
                  htmlFor={`entity-${option.value}`}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date-from" className="text-xs text-text-secondary">
                From
              </Label>
              <Input
                id="date-from"
                type="date"
                value={localFilters.date_from || ''}
                onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date-to" className="text-xs text-text-secondary">
                To
              </Label>
              <Input
                id="date-to"
                type="date"
                value={localFilters.date_to || ''}
                onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Status Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Status</Label>
          <Select
            value={localFilters.status || ''}
            onValueChange={(value) => handleFilterChange('status', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Type</Label>
          <Select
            value={localFilters.type || ''}
            onValueChange={(value) => handleFilterChange('type', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Amount Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Amount Range</span>
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount-min" className="text-xs text-text-secondary">
                Min
              </Label>
              <Input
                id="amount-min"
                type="number"
                placeholder="0"
                value={localFilters.amount_min || ''}
                onChange={(e) => handleFilterChange('amount_min', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount-max" className="text-xs text-text-secondary">
                Max
              </Label>
              <Input
                id="amount-max"
                type="number"
                placeholder="1000"
                value={localFilters.amount_max || ''}
                onChange={(e) => handleFilterChange('amount_max', e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Currency */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Currency</Label>
          <Select
            value={localFilters.currency || ''}
            onValueChange={(value) => handleFilterChange('currency', value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All currencies</SelectItem>
              {currencyOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}