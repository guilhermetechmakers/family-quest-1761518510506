import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import type { Goal } from '@/types/goal';

interface MilestonesWidgetProps {
  goals: Goal[];
  isLoading: boolean;
}

export function MilestonesWidget({ goals, isLoading }: MilestonesWidgetProps) {
  // Get upcoming milestones from all goals
  const upcomingMilestones = goals
    .filter(goal => goal.status === 'active' && goal.milestones.length > 0)
    .flatMap(goal => 
      goal.milestones
        .filter(milestone => !milestone.achieved_at)
        .map(milestone => ({
          ...milestone,
          goalTitle: goal.title,
          goalId: goal.id,
          currentValue: goal.current_value,
          targetValue: goal.target_value,
          progress: (goal.current_value / goal.target_value) * 100
        }))
    )
    .sort((a, b) => a.target_value - b.target_value)
    .slice(0, 5);

  const getDaysUntilMilestone = (milestone: any) => {
    const currentProgress = milestone.progress;
    const milestoneProgress = (milestone.target_value / milestone.targetValue) * 100;
    const remainingProgress = milestoneProgress - currentProgress;
    
    if (remainingProgress <= 0) return 0;
    
    // Estimate days based on current progress rate
    const estimatedDays = Math.ceil(remainingProgress / 10); // Rough estimate
    return Math.max(1, estimatedDays);
  };

  const getMilestoneStatus = (milestone: any) => {
    const currentProgress = milestone.progress;
    const milestoneProgress = (milestone.target_value / milestone.targetValue) * 100;
    
    if (currentProgress >= milestoneProgress) {
      return 'achieved';
    } else if (currentProgress >= milestoneProgress * 0.8) {
      return 'close';
    } else if (currentProgress >= milestoneProgress * 0.5) {
      return 'halfway';
    } else {
      return 'upcoming';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-mint-green';
      case 'close':
        return 'bg-pastel-yellow';
      case 'halfway':
        return 'bg-light-pink';
      default:
        return 'bg-pale-lavender';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'Achieved!';
      case 'close':
        return 'Almost there!';
      case 'halfway':
        return 'Halfway there';
      default:
        return 'Upcoming';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="p-6 border-0 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Upcoming Milestones</h3>
          <div className="w-8 h-8 bg-mint-tint rounded-full flex items-center justify-center">
            <Target className="h-4 w-4 text-mint-green" />
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : upcomingMilestones.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-mint-tint rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-mint-green" />
              </div>
              <p className="text-text-secondary text-sm mb-2">
                No upcoming milestones
              </p>
              <p className="text-text-tertiary text-xs">
                Create goals with milestones to track progress
              </p>
            </div>
          ) : (
            upcomingMilestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone);
              const daysUntil = getDaysUntilMilestone(milestone);
              
              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="group hover:bg-mint-tint hover:bg-opacity-30 p-3 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary truncate">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">
                        {milestone.goalTitle}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} text-text-primary`}>
                      {getStatusText(status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-text-tertiary mb-2">
                    <span className="font-medium">
                      {formatCurrency(milestone.target_value)}
                    </span>
                    {status !== 'achieved' && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {daysUntil}d left
                      </span>
                    )}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full ${getStatusColor(status)}`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((milestone.currentValue / milestone.target_value) * 100, 100)}%` 
                      }}
                      transition={{ 
                        duration: 0.8, 
                        delay: index * 0.1 + 0.2,
                        ease: "easeOut"
                      }}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {upcomingMilestones.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full text-mint-green hover:text-text-primary hover:bg-mint-tint transition-colors duration-200"
            >
              View All Milestones
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}