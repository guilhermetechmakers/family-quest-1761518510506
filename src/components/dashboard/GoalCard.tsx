import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  ArrowRight,
  Target,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, calculateProgress } from '@/lib/utils';
import type { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
  index: number;
  onQuickContribute: (goalId: string) => void;
}

export function GoalCard({ goal, index, onQuickContribute }: GoalCardProps) {
  const progress = calculateProgress(goal.current_value, goal.target_value);
  const isActive = goal.status === 'active';

  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed':
        return 'status-completed';
      case 'active':
        return 'status-in-progress';
      case 'paused':
        return 'status-upcoming';
      default:
        return 'status-upcoming';
    }
  };

  const getStatusText = () => {
    switch (goal.status) {
      case 'completed':
        return 'Completed';
      case 'active':
        return 'In Progress';
      case 'paused':
        return 'Paused';
      default:
        return 'Upcoming';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="p-6 hover:shadow-card-hover transition-all duration-300 border-0 shadow-card">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-text-primary">
                {goal.title}
              </h4>
              <span className={`status-tag ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <p className="text-text-secondary text-sm mb-3 line-clamp-2">
              {goal.description}
            </p>
            
            {/* Goal Type Badge */}
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-text-tertiary" />
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                {goal.type.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span className="font-medium">
              {progress.toFixed(1)}% complete
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {goal.contributors?.length || 0} contributors
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div 
              className="bg-gradient-to-r from-mint-green to-light-mint h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1 + 0.2,
                ease: "easeOut"
              }}
            />
          </div>
        </div>

        {/* Financial Info */}
        <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium">
              {formatCurrency(goal.current_value)} / {formatCurrency(goal.target_value)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {goal.estimated_completion 
                ? new Date(goal.estimated_completion).toLocaleDateString()
                : 'No deadline'
              }
            </span>
          </div>
        </div>

        {/* Contributors */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {goal.contributors?.slice(0, 3).map((contributor, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3 + idx * 0.1,
                    duration: 0.3
                  }}
                  className="w-8 h-8 bg-pale-lavender rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-text-primary shadow-sm"
                >
                  {contributor.user?.full_name?.charAt(0) || 'U'}
                </motion.div>
              ))}
            </div>
            {goal.contributors && goal.contributors.length > 3 && (
              <span className="text-sm text-text-tertiary font-medium">
                +{goal.contributors.length - 3} more
              </span>
            )}
          </div>

          {/* Quick Contribute Button */}
          {isActive && (
            <Button
              size="sm"
              className="bg-mint-green hover:bg-light-mint text-text-primary font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105"
              onClick={() => onQuickContribute(goal.id)}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Contribute
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-2">
          <Link to={`/progress/${goal.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-pale-lavender text-pale-lavender hover:bg-pale-lavender hover:text-text-primary transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Progress
            </Button>
          </Link>
          <Link to={`/goals/${goal.id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-mint-green text-mint-green hover:bg-mint-green hover:text-text-primary transition-all duration-200"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}