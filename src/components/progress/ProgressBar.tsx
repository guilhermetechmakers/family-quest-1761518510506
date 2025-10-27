import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { GoalProgressDetails } from '@/types/progress';

interface ProgressBarProps {
  progress: GoalProgressDetails;
  showPercentage?: boolean;
  showETA?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  showPercentage = true, 
  showETA = true, 
  size = 'md',
  animated = true,
  className 
}: ProgressBarProps) {
  const { percentage, current_value, target_value, currency, estimated_completion_date, days_remaining } = progress;
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-mint-green';
    if (percentage >= 75) return 'bg-light-mint';
    if (percentage >= 50) return 'bg-pastel-yellow';
    if (percentage >= 25) return 'bg-light-pink';
    return 'bg-pale-lavender';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return 'Completed';
    if (percentage >= 75) return 'Almost there!';
    if (percentage >= 50) return 'Halfway there';
    if (percentage >= 25) return 'Getting started';
    return 'Just beginning';
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="relative">
        <div className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizeClasses[size]
        )}>
          <motion.div
            className={cn(
              'h-full rounded-full transition-all duration-500 relative overflow-hidden',
              getStatusColor(percentage)
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ 
              duration: animated ? 1.5 : 0,
              ease: "easeOut"
            }}
          >
            {/* Shimmer effect for active progress */}
            {animated && percentage > 0 && percentage < 100 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </motion.div>
        </div>
        
        {/* Progress percentage overlay */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              'font-semibold text-text-primary',
              textSizeClasses[size]
            )}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress details */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-text-secondary">
            {currency} {current_value.toLocaleString()} / {target_value.toLocaleString()}
          </span>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            percentage >= 100 ? 'bg-mint-green text-text-primary' :
            percentage >= 75 ? 'bg-light-mint text-text-primary' :
            percentage >= 50 ? 'bg-pastel-yellow text-text-primary' :
            percentage >= 25 ? 'bg-light-pink text-text-primary' :
            'bg-pale-lavender text-text-primary'
          )}>
            {getStatusText(percentage)}
          </span>
        </div>

        {/* ETA */}
        {showETA && estimated_completion_date && (
          <div className="text-text-tertiary">
            {days_remaining && days_remaining > 0 ? (
              <span>{days_remaining} days left</span>
            ) : (
              <span>Completed!</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}