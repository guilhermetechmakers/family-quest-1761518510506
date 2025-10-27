import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressUpdateNotificationProps {
  isVisible: boolean;
  type: 'increase' | 'decrease' | 'milestone' | 'goal_completed';
  amount?: number;
  currency?: string;
  message: string;
  onClose: () => void;
  className?: string;
}

export function ProgressUpdateNotification({
  isVisible,
  type,
  amount,
  currency = '$',
  message,
  onClose,
  className
}: ProgressUpdateNotificationProps) {
  const getIcon = () => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-5 w-5 text-mint-green" />;
      case 'decrease':
        return <TrendingDown className="h-5 w-5 text-light-pink" />;
      case 'milestone':
        return <Target className="h-5 w-5 text-pastel-yellow" />;
      case 'goal_completed':
        return <Target className="h-5 w-5 text-mint-green" />;
      default:
        return <Minus className="h-5 w-5 text-text-tertiary" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'increase':
        return 'bg-mint-tint border-mint-green';
      case 'decrease':
        return 'bg-light-pink/20 border-light-pink';
      case 'milestone':
        return 'bg-pastel-yellow/20 border-pastel-yellow';
      case 'goal_completed':
        return 'bg-mint-tint border-mint-green';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'increase':
        return 'text-mint-green';
      case 'decrease':
        return 'text-light-pink';
      case 'milestone':
        return 'text-pastel-yellow';
      case 'goal_completed':
        return 'text-mint-green';
      default:
        return 'text-text-primary';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          className={cn(
            'fixed top-4 right-4 z-50 max-w-sm',
            className
          )}
        >
          <motion.div
            className={cn(
              'p-4 rounded-xl border-2 shadow-lg backdrop-blur-sm',
              getBackgroundColor()
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
              >
                {getIcon()}
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={cn('text-sm font-semibold', getTextColor())}>
                    {type === 'increase' && 'Progress Updated!'}
                    {type === 'decrease' && 'Progress Adjusted'}
                    {type === 'milestone' && 'Milestone Achieved!'}
                    {type === 'goal_completed' && 'Goal Completed!'}
                  </h4>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                </div>

                <p className="text-sm text-text-secondary mb-2">
                  {message}
                </p>

                {amount !== undefined && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-text-tertiary" />
                    <span className={cn('text-lg font-bold', getTextColor())}>
                      {type === 'decrease' && '-'}
                      {currency}{Math.abs(amount).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  type === 'increase' || type === 'goal_completed' ? 'bg-mint-green' :
                  type === 'decrease' ? 'bg-light-pink' :
                  'bg-pastel-yellow'
                )}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: "linear" }}
                onAnimationComplete={onClose}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}