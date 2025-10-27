import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Filter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useTransactionGoals, useTransactionContributors } from '@/hooks/useTransactions';
import type { TransactionHistoryFilters, TransactionType, TransactionStatus } from '@/types/transaction';

const filterSchema = z.object({
  search: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  goal_id: z.string().optional(),
  contributor_id: z.string().optional(),
  type: z.enum(['contribution', 'refund', 'adjustment', 'payment', 'manual']).optional(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled', 'disputed']).optional(),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface TransactionFiltersComponentProps {
  filters: TransactionHistoryFilters;
  onFiltersChange: (filters: TransactionHistoryFilters) => void;
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersComponentProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const { data: goals = [] } = useTransactionGoals();
  const { data: contributors = [] } = useTransactionContributors();

  const { register, handleSubmit, watch, reset, setValue } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: filters.search || '',
      date_from: filters.date_from || '',
      date_to: filters.date_to || '',
      goal_id: filters.goal_id || '',
      contributor_id: filters.contributor_id || '',
      type: filters.type || undefined,
      status: filters.status || undefined,
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: FilterFormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== undefined)
    ) as TransactionHistoryFilters;
    onFiltersChange(cleanData);
  };

  const handleClearFilters = () => {
    reset();
    onClearFilters();
  };

  const hasActiveFilters = Object.values(watchedValues).some(value => value !== '' && value !== undefined);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filter Transactions</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('search')}
              placeholder="Search transactions..."
              className="pl-10"
            />
          </div>

          {/* Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('date_from')}
              type="date"
              className="pl-10"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              {...register('date_to')}
              type="date"
              className="pl-10"
            />
          </div>

          {/* Goal Filter */}
          <Select
            value={watchedValues.goal_id || ''}
            onValueChange={(value) => setValue('goal_id', value === '' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Goals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Goals</SelectItem>
              {goals.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Contributor Filter */}
          <Select
            value={watchedValues.contributor_id || ''}
            onValueChange={(value) => setValue('contributor_id', value === '' ? undefined : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Contributors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Contributors</SelectItem>
              {contributors.map((contributor) => (
                <SelectItem key={contributor.id} value={contributor.id}>
                  {contributor.full_name} ({contributor.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={watchedValues.type || ''}
            onValueChange={(value) => setValue('type', value === '' ? undefined : value as TransactionType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="contribution">Contribution</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={watchedValues.status || ''}
            onValueChange={(value) => setValue('status', value === '' ? undefined : value as TransactionStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="btn-primary">
            Apply Filters
          </Button>
        </div>
      </form>
    </Card>
  );
};