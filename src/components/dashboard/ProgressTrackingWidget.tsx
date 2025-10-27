import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFamilyProgressSummary } from '@/hooks/useProgress';
import { formatCurrency } from '@/lib/utils';

interface ProgressTrackingWidgetProps {
  familyId: string;
  isLoading?: boolean;
}

export function ProgressTrackingWidget({ familyId, isLoading }: ProgressTrackingWidgetProps) {
  const { data: progressSummary, isLoading: summaryLoading } = useFamilyProgressSummary(familyId);

  if (isLoading || summaryLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!progressSummary) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Progress Data</h3>
        <p className="text-text-secondary text-sm mb-4">
          Start creating goals to see progress tracking here.
        </p>
        <Link to="/goals/create">
          <Button className="bg-mint-green hover:bg-light-mint text-text-primary">
            Create Goal
          </Button>
        </Link>
      </Card>
    );
  }

  const { 
    total_goals, 
    active_goals, 
    completed_goals, 
    total_value, 
    total_contributions,
    average_completion_rate,
    upcoming_milestones,
    recent_achievements 
  } = progressSummary;

  const completionRate = Math.round(average_completion_rate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-mint-green" />
            <h3 className="text-lg font-semibold text-text-primary">Progress Tracking</h3>
          </div>
          <Link to="/progress">
            <Button variant="ghost" size="sm" className="text-mint-green hover:bg-mint-tint">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-mint-tint rounded-lg">
            <p className="text-2xl font-bold text-mint-green">{active_goals}</p>
            <p className="text-xs text-text-secondary">Active Goals</p>
          </div>
          <div className="text-center p-3 bg-pastel-yellow/20 rounded-lg">
            <p className="text-2xl font-bold text-pastel-yellow">{completionRate}%</p>
            <p className="text-xs text-text-secondary">Avg. Completion</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Total Raised</span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(total_value)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Contributions</span>
            <span className="font-semibold text-text-primary">
              {total_contributions}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Completed Goals</span>
            <span className="font-semibold text-text-primary">
              {completed_goals} / {total_goals}
            </span>
          </div>
        </div>

        {/* Upcoming Milestones */}
        {upcoming_milestones && upcoming_milestones.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
              <Target className="h-4 w-4 mr-1" />
              Upcoming Milestones
            </h4>
            <div className="space-y-2">
              {upcoming_milestones.slice(0, 3).map((milestone, index) => (
                <motion.div
                  key={milestone.goal_id + milestone.milestone_title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {milestone.milestone_title}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {milestone.goal_title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-text-tertiary" />
                    <span className="text-xs text-text-secondary">
                      {milestone.days_until_achievement}d
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {recent_achievements && recent_achievements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {recent_achievements.slice(0, 2).map((achievement, index) => (
                <motion.div
                  key={achievement.milestone_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 p-2 bg-mint-tint rounded-lg"
                >
                  <div className="w-6 h-6 bg-mint-green rounded-full flex items-center justify-center">
                    <span className="text-xs">🎉</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link to="/progress" className="block">
            <Button className="w-full bg-mint-green hover:bg-light-mint text-text-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Progress Dashboard
            </Button>
          </Link>
          <Link to="/goals/create" className="block">
            <Button variant="outline" className="w-full border-pale-lavender text-pale-lavender hover:bg-pale-lavender">
              <Target className="h-4 w-4 mr-2" />
              Create New Goal
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}