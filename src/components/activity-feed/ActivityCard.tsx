import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Flag,
  Calendar,
  Target,
  Trophy,
  DollarSign,
  CheckCircle,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types/activity';
import { formatDistanceToNow } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
  onComment: (activityId: string) => void;
  onReact: (activityId: string, emoji: string) => void;
  onDelete?: (activityId: string) => void;
  onFlag?: (activityId: string) => void;
  isChild?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'contribution':
      return <DollarSign className="h-4 w-4" />;
    case 'milestone':
      return <Trophy className="h-4 w-4" />;
    case 'goal_created':
      return <Target className="h-4 w-4" />;
    case 'goal_completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'member_joined':
      return <Users className="h-4 w-4" />;
    case 'member_left':
      return <Users className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'contribution':
      return 'bg-mint-green text-text-primary';
    case 'milestone':
      return 'bg-pastel-yellow text-text-primary';
    case 'goal_created':
      return 'bg-light-pink text-text-primary';
    case 'goal_completed':
      return 'bg-mint-green text-text-primary';
    case 'member_joined':
      return 'bg-pale-lavender text-text-primary';
    case 'member_left':
      return 'bg-light-purple text-text-primary';
    default:
      return 'bg-light-pink text-text-primary';
  }
};

export function ActivityCard({ 
  activity, 
  onComment, 
  onReact, 
  onDelete, 
  onFlag
}: ActivityCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  const handleReaction = (emoji: string) => {
    if (userReaction === emoji) {
      setUserReaction(null);
    } else {
      setUserReaction(emoji);
      onReact(activity.id, emoji);
    }
    setShowReactions(false);
  };

  const reactionEmojis = ['❤️', '🎉', '👍', '👏', '🔥', '💪'];

  return (
    <Card className="p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <Avatar className="h-12 w-12">
          <AvatarImage src={activity.user.avatar_url} />
          <AvatarFallback className="bg-mint-green text-text-primary font-semibold">
            {activity.user.full_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-text-primary">
                {activity.user.full_name}
              </h3>
              <Badge className={cn('text-xs', getActivityColor(activity.type))}>
                <span className="flex items-center space-x-1">
                  {getActivityIcon(activity.type)}
                  <span className="capitalize">{activity.type.replace('_', ' ')}</span>
                </span>
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-text-tertiary">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onFlag?.(activity.id)}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Goal reference */}
          {activity.goal && (
            <div className="mb-3 p-3 bg-pale-lavender-bg rounded-lg">
              <div className="flex items-center space-x-2">
                {activity.goal.image_url ? (
                  <img 
                    src={activity.goal.image_url} 
                    alt={activity.goal.title}
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 bg-mint-tint rounded-lg flex items-center justify-center">
                    <Target className="h-4 w-4 text-mint-green" />
                  </div>
                )}
                <span className="text-sm font-medium text-text-primary">
                  {activity.goal.title}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mb-4">
            <h4 className="font-semibold text-text-primary mb-2">
              {activity.title}
            </h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Media preview */}
          {activity.metadata?.media_urls && activity.metadata.media_urls.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2">
                {activity.metadata.media_urls.slice(0, 4).map((url: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Reactions */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setShowReactions(!showReactions)}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {activity.reactions.length}
                </Button>
                
                {showReactions && (
                  <div className="absolute top-full left-0 mt-2 p-2 bg-card border rounded-lg shadow-lg z-10">
                    <div className="flex space-x-1">
                      {reactionEmojis.map((emoji) => (
                        <Button
                          key={emoji}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-lg hover:scale-110 transition-transform"
                          onClick={() => handleReaction(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comments */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3"
                onClick={() => onComment(activity.id)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                {activity.comments.length}
              </Button>
            </div>

            {/* Delete button for own activities */}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-text-tertiary hover:text-red-500"
                onClick={() => onDelete(activity.id)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Current reactions display */}
          {activity.reactions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {activity.reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  className="text-sm bg-mint-tint px-2 py-1 rounded-full"
                >
                  {reaction.emoji} {reaction.user.full_name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}