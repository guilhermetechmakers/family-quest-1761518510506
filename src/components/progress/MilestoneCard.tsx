import { motion } from 'framer-motion';
import { CheckCircle, Clock, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MilestoneProgress } from '@/types/progress';

interface MilestoneCardProps {
  milestone: MilestoneProgress;
  onAchieve?: (milestoneId: string) => void;
  onShare?: (milestoneId: string) => void;
  className?: string;
}

export function MilestoneCard({ 
  milestone, 
  onAchieve, 
  onShare, 
  className 
}: MilestoneCardProps) {
  const { 
    milestone_id, 
    title, 
    target_value, 
    current_value, 
    percentage, 
    is_achieved, 
    achieved_at, 
    days_to_achievement,
    estimated_achievement_date,
    reward 
  } = milestone;

  const isNearAchievement = percentage >= 90 && !is_achieved;
  const isOverdue = days_to_achievement && days_to_achievement < 0 && !is_achieved;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'card p-4 space-y-3 transition-all duration-300 hover:shadow-card-hover',
        is_achieved && 'bg-mint-tint border-2 border-mint-green',
        isNearAchievement && 'bg-pastel-yellow/20 border-2 border-pastel-yellow',
        isOverdue && 'bg-light-pink/20 border-2 border-light-pink',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {is_achieved ? (
            <CheckCircle className="h-5 w-5 text-mint-green" />
          ) : isNearAchievement ? (
            <Star className="h-5 w-5 text-pastel-yellow" />
          ) : (
            <Clock className="h-5 w-5 text-text-tertiary" />
          )}
          <h4 className="font-semibold text-text-primary">{title}</h4>
        </div>
        
        {is_achieved && achieved_at && (
          <span className="text-xs text-text-secondary">
            {new Date(achieved_at).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            ${current_value.toLocaleString()} / ${target_value.toLocaleString()}
          </span>
          <span className="font-medium text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              is_achieved ? 'bg-mint-green' :
              isNearAchievement ? 'bg-pastel-yellow' :
              'bg-pale-lavender'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status and timing */}
      <div className="flex items-center justify-between text-sm">
        {is_achieved ? (
          <span className="text-mint-green font-medium flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Achieved!</span>
          </span>
        ) : days_to_achievement ? (
          <span className={cn(
            'font-medium',
            isOverdue ? 'text-light-pink' : 'text-text-secondary'
          )}>
            {isOverdue ? 'Overdue' : `${days_to_achievement} days left`}
          </span>
        ) : (
          <span className="text-text-tertiary">In progress</span>
        )}

        {estimated_achievement_date && !is_achieved && (
          <span className="text-text-tertiary text-xs">
            Est. {new Date(estimated_achievement_date).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Reward */}
      {reward && (
        <div className="flex items-center space-x-2 p-2 bg-cream-yellow rounded-lg">
          <Gift className="h-4 w-4 text-pastel-yellow" />
          <span className="text-sm text-text-primary font-medium">{reward}</span>
        </div>
      )}

      {/* Actions */}
      {!is_achieved && (
        <div className="flex space-x-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAchieve?.(milestone_id)}
            className="flex-1 bg-mint-green text-text-primary px-3 py-2 rounded-full text-sm font-medium hover:bg-light-mint transition-colors"
          >
            Mark Complete
          </motion.button>
          
          {isNearAchievement && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onShare?.(milestone_id)}
              className="px-3 py-2 border border-pale-lavender text-text-primary rounded-full text-sm font-medium hover:bg-pale-lavender transition-colors"
            >
              Share
            </motion.button>
          )}
        </div>
      )}

      {/* Achievement celebration */}
      {is_achieved && onShare && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onShare(milestone_id)}
          className="w-full bg-gradient-to-r from-mint-green to-light-mint text-text-primary px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300"
        >
          🎉 Share Achievement
        </motion.button>
      )}
    </motion.div>
  );
}