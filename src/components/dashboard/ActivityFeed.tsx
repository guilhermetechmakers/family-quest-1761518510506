import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  DollarSign,
  Target,
  Users,
  Star,
  MessageCircle,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { Activity } from '@/types/activity';

interface ActivityFeedProps {
  activities: Activity[];
  isLoading: boolean;
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return DollarSign;
      case 'milestone':
        return Target;
      case 'goal_created':
        return Target;
      case 'goal_completed':
        return Star;
      case 'member_joined':
        return Users;
      case 'member_left':
        return Users;
      case 'comment':
        return MessageCircle;
      case 'reaction':
        return Heart;
      default:
        return Target;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'bg-mint-green';
      case 'milestone':
        return 'bg-pastel-yellow';
      case 'goal_created':
        return 'bg-pale-lavender';
      case 'goal_completed':
        return 'bg-light-pink';
      case 'member_joined':
        return 'bg-light-mint';
      case 'member_left':
        return 'bg-gray-400';
      case 'comment':
        return 'bg-light-purple';
      case 'reaction':
        return 'bg-light-pink';
      default:
        return 'bg-mint-green';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="p-6 border-0 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
          <Link to="/activity">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-mint-green hover:text-text-primary hover:bg-mint-tint transition-colors duration-200"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-mint-tint rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-mint-green" />
              </div>
              <p className="text-text-secondary text-sm">
                No recent activity yet. Start contributing to see updates here!
              </p>
            </div>
          ) : (
            activities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              const iconColor = getActivityColor(activity.type);
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="flex items-start space-x-3 group hover:bg-mint-tint hover:bg-opacity-30 p-2 rounded-lg transition-colors duration-200"
                >
                  <div className={`w-8 h-8 ${iconColor} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary leading-relaxed">
                      <span className="font-semibold text-text-primary">
                        {activity.user.full_name}
                      </span>{' '}
                      <span className="text-text-secondary">
                        {activity.title}
                      </span>
                      {activity.goal && (
                        <>
                          {' '}
                          <span className="font-medium text-text-primary">
                            {activity.goal.title}
                          </span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                    
                    {/* Comments and Reactions */}
                    {(activity.comments.length > 0 || activity.reactions.length > 0) && (
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-tertiary">
                        {activity.comments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {activity.comments.length}
                          </span>
                        )}
                        {activity.reactions.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {activity.reactions.length}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </Card>
    </motion.div>
  );
}