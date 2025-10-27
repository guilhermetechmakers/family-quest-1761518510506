import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface GoalFiltersProps {
  onFilterChange: (filters: any) => void;
}

export function GoalFilters({ onFilterChange }: GoalFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    targetRange: [0, 100000] as [number, number],
    progressRange: [0, 100] as [number, number],
    hasMilestones: undefined as boolean | undefined,
    hasContributors: undefined as boolean | undefined,
    ownerId: '',
    currency: '',
  });

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: { from: undefined, to: undefined },
      targetRange: [0, 100000] as [number, number],
      progressRange: [0, 100] as [number, number],
      hasMilestones: undefined,
      hasContributors: undefined,
      ownerId: '',
      currency: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const currencies = [
    { value: 'USD', label: 'US Dollar' },
    { value: 'EUR', label: 'Euro' },
    { value: 'GBP', label: 'British Pound' },
    { value: 'CAD', label: 'Canadian Dollar' },
    { value: 'AUD', label: 'Australian Dollar' },
    { value: 'JPY', label: 'Japanese Yen' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-text-tertiary hover:text-text-primary"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">Created Date</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? format(filters.dateRange.from, 'MMM dd') : 'From'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date: Date | undefined) => handleFilterChange('dateRange', { ...filters.dateRange, from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to ? format(filters.dateRange.to, 'MMM dd') : 'To'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date: Date | undefined) => handleFilterChange('dateRange', { ...filters.dateRange, to: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Target Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">
            Target Amount: ${filters.targetRange[0].toLocaleString()} - ${filters.targetRange[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.targetRange}
            onValueChange={(value: number[]) => handleFilterChange('targetRange', value)}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Progress Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">
            Progress: {filters.progressRange[0]}% - {filters.progressRange[1]}%
          </Label>
          <Slider
            value={filters.progressRange}
            onValueChange={(value: number[]) => handleFilterChange('progressRange', value)}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">Currency</Label>
          <Select value={filters.currency} onValueChange={(value: string) => handleFilterChange('currency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All currencies</SelectItem>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Owner */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">Owner</Label>
          <Input
            placeholder="Search by owner name or email"
            value={filters.ownerId}
            onChange={(e) => handleFilterChange('ownerId', e.target.value)}
          />
        </div>

        {/* Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-text-primary">Features</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasMilestones"
                checked={filters.hasMilestones === true}
                onCheckedChange={(checked) => 
                  handleFilterChange('hasMilestones', checked ? true : undefined)
                }
              />
              <Label htmlFor="hasMilestones" className="text-sm text-text-secondary">
                Has milestones
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasContributors"
                checked={filters.hasContributors === true}
                onCheckedChange={(checked) => 
                  handleFilterChange('hasContributors', checked ? true : undefined)
                }
              />
              <Label htmlFor="hasContributors" className="text-sm text-text-secondary">
                Has contributors
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
