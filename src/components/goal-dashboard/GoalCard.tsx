import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  DollarSign,
  Target
} from 'lucide-react';
import type { Goal } from '@/types/goal';

interface GoalCardProps {
  goal: Goal;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoalCard({ goal, viewMode, onView, onEdit, onDelete }: GoalCardProps) {
  const progress = (goal.current_value / goal.target_value) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-light-mint text-text-primary';
      case 'active':
        return 'bg-mint-green text-text-primary';
      case 'paused':
        return 'bg-pastel-yellow text-text-primary';
      case 'draft':
        return 'bg-gray-200 text-text-primary';
      case 'cancelled':
        return 'bg-light-pink text-text-primary';
      default:
        return 'bg-gray-200 text-text-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vacation':
        return '🏖️';
      case 'purchase':
        return '🛍️';
      case 'home_upgrade':
        return '🏠';
      case 'pet':
        return '🐕';
      case 'education':
        return '🎓';
      default:
        return '🎯';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
    };
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6 bg-white shadow-card hover:shadow-card-hover transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-mint-tint rounded-full flex items-center justify-center">
                <span className="text-2xl">{getTypeIcon(goal.type)}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-text-primary truncate">
                    {goal.title}
                  </h3>
                  <Badge className={`${getStatusColor(goal.status)} text-xs`}>
                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm truncate mb-2">
                  {goal.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-text-tertiary">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(goal.current_value, goal.currency)} / {formatCurrency(goal.target_value, goal.currency)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{goal.contributors?.length || 0} contributors</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(goal.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-bold text-text-primary">
                  {Math.round(progress)}%
                </div>
                <Progress value={progress} className="w-24 h-2 mt-1" />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onView}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-mint-tint rounded-full flex items-center justify-center">
              <span className="text-2xl">{getTypeIcon(goal.type)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {goal.title}
              </h3>
              <Badge className={`${getStatusColor(goal.status)} text-xs`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {goal.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Progress</span>
            <span className="text-sm font-bold text-text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between mt-1 text-xs text-text-tertiary">
            <span>{formatCurrency(goal.current_value, goal.currency)}</span>
            <span>{formatCurrency(goal.target_value, goal.currency)}</span>
          </div>
        </div>

        {/* Contributors */}
        {goal.contributors && goal.contributors.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm text-text-tertiary">
                {goal.contributors.length} contributor{goal.contributors.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex -space-x-2">
              {goal.contributors.slice(0, 3).map((contributor, index) => (
                <Avatar key={index} className="h-8 w-8 border-2 border-white">
                  <AvatarFallback className="bg-mint-green text-text-primary text-xs">
                    {contributor.user.full_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {goal.contributors.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-pale-lavender border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-text-primary">
                    +{goal.contributors.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-4 w-4 text-text-tertiary" />
              <span className="text-sm text-text-tertiary">
                {goal.milestones.length} milestone{goal.milestones.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-1">
              {goal.milestones.slice(0, 2).map((milestone, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary truncate flex-1">
                    {milestone.title}
                  </span>
                  <span className="text-text-primary font-medium ml-2">
                    {formatCurrency(milestone.target_value, goal.currency)}
                  </span>
                </div>
              ))}
              {goal.milestones.length > 2 && (
                <div className="text-xs text-text-tertiary">
                  +{goal.milestones.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-text-tertiary">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(goal.created_at)}</span>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
