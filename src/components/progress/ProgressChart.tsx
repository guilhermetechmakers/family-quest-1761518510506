import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressChartProps {
  data: {
    date: string;
    value: number;
    percentage: number;
  }[];
  currency: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressChart({ 
  data, 
  currency, 
  showPercentage = false,
  className 
}: ProgressChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatValue = (value: number) => {
    return `${currency} ${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm text-text-secondary mb-1">
            {formatDate(data.date)}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-primary">
              Value: {formatValue(data.value)}
            </p>
            {showPercentage && (
              <p className="text-sm text-text-secondary">
                Progress: {formatPercentage(data.percentage)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className={cn('card p-8 text-center', className)}>
        <TrendingUp className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Progress Data</h3>
        <p className="text-text-secondary">
          Start contributing to see your progress chart here.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('card p-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-mint-green" />
          <h3 className="text-lg font-semibold text-text-primary">Progress Trend</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{data.length} days</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatValue(data[data.length - 1]?.value || 0)}</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B9F5D0" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#B9F5D0" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#717171' }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tickFormatter={formatValue}
              tick={{ fontSize: 12, fill: '#717171' }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={showPercentage ? "percentage" : "value"}
              stroke="#B9F5D0"
              strokeWidth={3}
              fill="url(#progressGradient)"
              dot={{ fill: '#B9F5D0', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#B9F5D0', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-mint-green">
            {formatValue(data[data.length - 1]?.value || 0)}
          </p>
          <p className="text-sm text-text-secondary">Current Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-pale-lavender">
            {formatValue((data[data.length - 1]?.value || 0) - (data[0]?.value || 0))}
          </p>
          <p className="text-sm text-text-secondary">Total Growth</p>
        </div>
      </div>
    </motion.div>
  );
}