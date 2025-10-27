import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Calendar,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransactionStats } from '@/hooks/useTransactions';
import type { TransactionHistoryFilters } from '@/types/transaction';

interface TransactionStatsProps {
  filters?: TransactionHistoryFilters;
}

export const TransactionStats: React.FC<TransactionStatsProps> = ({ filters }) => {
  const { data: stats, isLoading } = useTransactionStats(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTopContributor = () => {
    if (stats.transactions_by_contributor.length === 0) return null;
    return stats.transactions_by_contributor.reduce((prev, current) => 
      prev.total_amount > current.total_amount ? prev : current
    );
  };

  const topContributor = getTopContributor();

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-mint-green/20 to-mint-green/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.total_amount)}
              </p>
            </div>
            <div className="h-12 w-12 bg-mint-green/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-mint-green" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pale-lavender/20 to-pale-lavender/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold text-foreground">
                {formatNumber(stats.total_transactions)}
              </p>
            </div>
            <div className="h-12 w-12 bg-pale-lavender/20 rounded-full flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-pale-lavender" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-light-pink/20 to-light-pink/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.average_transaction)}
              </p>
            </div>
            <div className="h-12 w-12 bg-light-pink/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-light-pink" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-pastel-yellow/20 to-pastel-yellow/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Contributor</p>
              <p className="text-lg font-bold text-foreground">
                {topContributor ? formatCurrency(topContributor.total_amount) : 'N/A'}
              </p>
              {topContributor && (
                <p className="text-xs text-muted-foreground">
                  {topContributor.contributor_name}
                </p>
              )}
            </div>
            <div className="h-12 w-12 bg-pastel-yellow/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-pastel-yellow" />
            </div>
          </div>
        </Card>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Types */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-mint-green" />
            <h3 className="text-lg font-semibold">By Type</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.transactions_by_type).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="status-tag bg-mint-green/20 text-mint-green">
                    {type}
                  </Badge>
                </div>
                <span className="font-semibold">{formatNumber(count)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Transaction Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-pale-lavender" />
            <h3 className="text-lg font-semibold">By Status</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(stats.transactions_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`status-tag ${
                    status === 'completed' ? 'status-completed' :
                    status === 'pending' ? 'status-upcoming' :
                    status === 'failed' ? 'bg-red-100 text-red-800' :
                    status === 'disputed' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status}
                  </Badge>
                </div>
                <span className="font-semibold">{formatNumber(count)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      {stats.monthly_breakdown.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-light-purple" />
            <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
          </div>
          <div className="space-y-3">
            {stats.monthly_breakdown.slice(0, 6).map((month) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium">{month.month}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(month.count)} transactions
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(month.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};