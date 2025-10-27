import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ETADisplayProps {
  estimatedCompletionDate?: string;
  daysRemaining?: number;
  confidence: number;
  dailyAverage?: number;
  status: 'on_track' | 'behind' | 'ahead' | 'at_risk' | 'completed';
  className?: string;
}

export function ETADisplay({ 
  estimatedCompletionDate, 
  daysRemaining, 
  confidence, 
  dailyAverage,
  status,
  className 
}: ETADisplayProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-mint-green';
      case 'ahead':
        return 'text-light-mint';
      case 'on_track':
        return 'text-pastel-yellow';
      case 'behind':
        return 'text-light-pink';
      case 'at_risk':
        return 'text-red-500';
      default:
        return 'text-text-tertiary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '🎉';
      case 'ahead':
        return '🚀';
      case 'on_track':
        return '✅';
      case 'behind':
        return '⏰';
      case 'at_risk':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Goal Completed!';
      case 'ahead':
        return 'Ahead of Schedule';
      case 'on_track':
        return 'On Track';
      case 'behind':
        return 'Behind Schedule';
      case 'at_risk':
        return 'At Risk';
      default:
        return 'Calculating...';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'card p-4 space-y-3',
        status === 'completed' && 'bg-mint-tint border-2 border-mint-green',
        status === 'at_risk' && 'bg-red-50 border-2 border-red-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{getStatusIcon(status)}</span>
        <h3 className="font-semibold text-text-primary">Completion Estimate</h3>
      </div>

      {/* Main ETA */}
      <div className="space-y-2">
        {status === 'completed' ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-mint-green font-semibold text-lg">Goal Completed!</p>
            <p className="text-text-secondary text-sm">
              Congratulations on reaching your target!
            </p>
          </div>
        ) : estimatedCompletionDate ? (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-text-secondary" />
              <span className="text-lg font-semibold text-text-primary">
                {formatDate(estimatedCompletionDate)}
              </span>
            </div>
            
            {daysRemaining !== undefined && (
              <p className={cn('text-sm font-medium', getStatusColor(status))}>
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Clock className="h-8 w-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-text-tertiary">Calculating completion date...</p>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-center">
        <span className={cn(
          'px-3 py-1 rounded-full text-sm font-medium',
          status === 'completed' ? 'bg-mint-green text-text-primary' :
          status === 'ahead' ? 'bg-light-mint text-text-primary' :
          status === 'on_track' ? 'bg-pastel-yellow text-text-primary' :
          status === 'behind' ? 'bg-light-pink text-text-primary' :
          status === 'at_risk' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-text-secondary'
        )}>
          {getStatusText(status)}
        </span>
      </div>

      {/* Additional info */}
      <div className="space-y-2 text-sm text-text-secondary">
        {/* Confidence level */}
        <div className="flex items-center justify-between">
          <span>Confidence</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pale-lavender h-2 rounded-full transition-all duration-500"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="font-medium">{confidence}%</span>
          </div>
        </div>

        {/* Daily average */}
        {dailyAverage && (
          <div className="flex items-center justify-between">
            <span>Daily Average</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">${dailyAverage.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Risk warning */}
        {status === 'at_risk' && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-700 text-xs">
              Goal may not be completed on time. Consider increasing contributions.
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}