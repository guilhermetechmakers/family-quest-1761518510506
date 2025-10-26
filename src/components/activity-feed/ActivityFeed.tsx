import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatRelativeTime } from '@/lib/utils';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  MoreHorizontal,
  Target,
  DollarSign,
  Users,
  Star,
  CheckCircle,
} from 'lucide-react';
import type { Activity } from '@/types/activity';

interface ActivityFeedProps {
  activities: Activity[];
  onAddComment?: (activityId: string, content: string) => void;
  onAddReaction?: (activityId: string, emoji: string) => void;
  onFlagActivity?: (activityId: string) => void;
  className?: string;
}

const activityIcons = {
  contribution: DollarSign,
  milestone: Star,
  goal_created: Target,
  goal_completed: CheckCircle,
  member_joined: Users,
  member_left: Users,
  comment: MessageCircle,
  reaction: Heart,
};

const activityColors = {
  contribution: 'text-mint-green',
  milestone: 'text-pastel-yellow',
  goal_created: 'text-pale-lavender',
  goal_completed: 'text-mint-green',
  member_joined: 'text-light-pink',
  member_left: 'text-gray-500',
  comment: 'text-text-tertiary',
  reaction: 'text-light-pink',
};

const reactionEmojis = ['👍', '❤️', '🎉', '👏', '🔥', '💪'];

export function ActivityFeed({
  activities,
  onAddComment,
  onAddReaction,
  onFlagActivity,
  className,
}: ActivityFeedProps) {
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showReactions, setShowReactions] = useState<string | null>(null);

  const handleAddComment = (activityId: string) => {
    const content = newComment[activityId];
    if (content?.trim()) {
      onAddComment?.(activityId, content);
      setNewComment(prev => ({ ...prev, [activityId]: '' }));
    }
  };

  const handleAddReaction = (activityId: string, emoji: string) => {
    onAddReaction?.(activityId, emoji);
    setShowReactions(null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity) => {
        const ActivityIcon = activityIcons[activity.type];
        const iconColor = activityColors[activity.type];

        return (
          <Card key={activity.id} className="p-6 hover:shadow-card-hover transition-all duration-300">
            {/* Activity Header */}
            <div className="flex items-start space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.user.avatar_url} />
                <AvatarFallback className="bg-mint-green text-text-primary">
                  {activity.user.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-text-primary">
                    {activity.user.full_name}
                  </span>
                  <ActivityIcon className={`h-4 w-4 ${iconColor}`} />
                  <span className="text-sm text-text-tertiary">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {activity.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {activity.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(showReactions === activity.id ? null : activity.id)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFlagActivity?.(activity.id)}
                >
                  <Flag className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Goal Reference */}
            {activity.goal && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-mint-green" />
                  <span className="text-sm font-medium text-text-primary">
                    {activity.goal.title}
                  </span>
                </div>
                {activity.goal.image_url && (
                  <img
                    src={activity.goal.image_url}
                    alt={activity.goal.title}
                    className="w-16 h-16 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            )}

            {/* Reactions */}
            {activity.reactions && activity.reactions.length > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex -space-x-1">
                  {activity.reactions.slice(0, 5).map((reaction, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-xs"
                    >
                      {reaction.emoji}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-text-tertiary">
                  {activity.reactions.length} reactions
                </span>
              </div>
            )}

            {/* Comments */}
            {activity.comments && activity.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {activity.comments.slice(0, 3).map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={comment.user.avatar_url} />
                      <AvatarFallback className="bg-pale-lavender text-text-primary text-xs">
                        {comment.user.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-text-primary">
                            {comment.user.full_name}
                          </span>
                          <span className="text-xs text-text-tertiary">
                            {formatRelativeTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {activity.comments.length > 3 && (
                  <Button variant="ghost" size="sm" className="text-mint-green">
                    View {activity.comments.length - 3} more comments
                  </Button>
                )}
              </div>
            )}

            {/* Add Comment */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-mint-green text-text-primary text-sm">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment[activity.id] || ''}
                  onChange={(e) => setNewComment(prev => ({ ...prev, [activity.id]: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleAddComment(activity.id)}
                  disabled={!newComment[activity.id]?.trim()}
                >
                  Post
                </Button>
              </div>
            </div>

            {/* Reaction Picker */}
            {showReactions === activity.id && (
              <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Add reaction:</span>
                  {reactionEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddReaction(activity.id, emoji)}
                      className="text-lg hover:bg-gray-100"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Load More */}
      <div className="text-center pt-4">
        <Button variant="outline">
          Load More Activities
        </Button>
      </div>
    </div>
  );
}