import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Smile,
  ThumbsUp,
  PartyPopper,
  Hand,
  Flame,
  Dumbbell,
  Edit,
  Trash2,
  Eye,
  Send,
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

const reactionEmojis = [
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '🎉', icon: PartyPopper, label: 'Celebrate' },
  { emoji: '👏', icon: Hand, label: 'Clap' },
  { emoji: '🔥', icon: Flame, label: 'Fire' },
  { emoji: '💪', icon: Dumbbell, label: 'Strong' },
  { emoji: '😊', icon: Smile, label: 'Happy' },
];

export function ActivityFeed({
  activities,
  onAddComment,
  onAddReaction,
  onFlagActivity,
  className,
}: ActivityFeedProps) {
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [showAllComments, setShowAllComments] = useState<{ [key: string]: boolean }>({});

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

  const toggleComments = (activityId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const toggleAllComments = (activityId: string) => {
    setShowAllComments(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {activities.map((activity, index) => {
        const ActivityIcon = activityIcons[activity.type];
        const iconColor = activityColors[activity.type];
        const isCommentsExpanded = expandedComments.has(activity.id);
        const showAll = showAllComments[activity.id] || false;
        const displayComments = showAll ? activity.comments : activity.comments.slice(0, 3);

        return (
          <Card 
            key={activity.id} 
            className="group p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Activity Header */}
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="h-12 w-12 ring-2 ring-mint-green/20 hover:ring-mint-green/40 transition-all duration-200">
                <AvatarImage src={activity.user.avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary font-semibold">
                  {activity.user.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="font-semibold text-text-primary text-lg">
                    {activity.user.full_name}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`${iconColor} bg-opacity-20 text-xs px-2 py-1 rounded-full`}
                  >
                    <ActivityIcon className="h-3 w-3 mr-1" />
                    {activity.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-text-tertiary">
                    {formatRelativeTime(activity.created_at)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {activity.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {activity.description}
                </p>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReactions(showReactions === activity.id ? null : activity.id)}
                  className="hover:bg-mint-tint hover:text-mint-green transition-colors"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleComments(activity.id)}
                  className="hover:bg-pale-lavender/20 hover:text-pale-lavender transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  {activity.comments.length > 0 && (
                    <span className="ml-1 text-xs bg-pale-lavender text-text-primary rounded-full px-1.5 py-0.5">
                      {activity.comments.length}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:bg-light-pink/20 hover:text-light-pink transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onFlagActivity?.(activity.id)}>
                      <Flag className="h-4 w-4 mr-2" />
                      Report content
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Hide activity
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit post
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Goal Reference */}
            {activity.goal && (
              <div className="mb-6 p-4 bg-gradient-to-r from-mint-tint to-pale-lavender/20 rounded-xl border border-mint-green/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-mint-green/20 rounded-lg">
                    <Target className="h-5 w-5 text-mint-green" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-text-primary">
                      Related to: {activity.goal.title}
                    </span>
                    <p className="text-xs text-text-secondary mt-1">
                      Click to view goal details
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-mint-green hover:bg-mint-green/10">
                    View Goal
                  </Button>
                </div>
                {activity.goal.image_url && (
                  <div className="mt-3">
                    <img
                      src={activity.goal.image_url}
                      alt={activity.goal.title}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Reactions */}
            {activity.reactions && activity.reactions.length > 0 && (
              <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50/50 rounded-lg">
                <div className="flex -space-x-1">
                  {activity.reactions.slice(0, 6).map((reaction) => (
                    <div
                      key={reaction.id}
                      className="w-7 h-7 bg-white border-2 border-white rounded-full flex items-center justify-center text-sm shadow-sm hover:scale-110 transition-transform duration-200"
                      title={`${reaction.user.full_name} reacted with ${reaction.emoji}`}
                    >
                      {reaction.emoji}
                    </div>
                  ))}
                  {activity.reactions.length > 6 && (
                    <div className="w-7 h-7 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center text-xs font-semibold text-text-secondary">
                      +{activity.reactions.length - 6}
                    </div>
                  )}
                </div>
                <span className="text-sm text-text-secondary">
                  {activity.reactions.length} reaction{activity.reactions.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            {/* Comments */}
            {isCommentsExpanded && activity.comments && activity.comments.length > 0 && (
              <div className="space-y-4 mb-6 animate-fade-in-down">
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-pale-lavender" />
                    Comments ({activity.comments.length})
                  </h4>
                  
                  <div className="space-y-4">
                    {displayComments.map((comment, index) => (
                      <div 
                        key={comment.id} 
                        className="flex items-start space-x-3 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Avatar className="h-8 w-8 ring-2 ring-pale-lavender/20">
                          <AvatarImage src={comment.user.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-br from-pale-lavender to-light-purple text-text-primary text-sm font-semibold">
                            {comment.user.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gradient-to-r from-gray-50 to-pale-lavender/10 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-semibold text-text-primary">
                                {comment.user.full_name}
                              </span>
                              <span className="text-xs text-text-tertiary">
                                {formatRelativeTime(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {activity.comments.length > 3 && !showAll && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleAllComments(activity.id)}
                        className="text-mint-green hover:bg-mint-tint w-full"
                      >
                        View {activity.comments.length - 3} more comments
                      </Button>
                    )}
                    
                    {showAll && activity.comments.length > 3 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleAllComments(activity.id)}
                        className="text-text-tertiary hover:bg-gray-100 w-full"
                      >
                        Show fewer comments
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Add Comment */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-mint-green/20">
                  <AvatarFallback className="bg-gradient-to-br from-mint-green to-light-mint text-text-primary text-sm font-semibold">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Write a comment..."
                      value={newComment[activity.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [activity.id]: e.target.value }))}
                      className="flex-1 bg-gray-50 border-gray-200 focus:border-mint-green focus:ring-mint-green rounded-xl"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(activity.id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(activity.id)}
                      disabled={!newComment[activity.id]?.trim()}
                      className="bg-mint-green hover:bg-light-mint text-text-primary rounded-xl px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                    <span>Press Enter to post</span>
                    <span>•</span>
                    <span>Be kind and respectful</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reaction Picker */}
            {showReactions === activity.id && (
              <div className="mt-4 p-4 bg-gradient-to-r from-mint-tint to-pale-lavender/20 border border-mint-green/20 rounded-xl shadow-lg animate-fade-in-down">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-text-primary">Add reaction:</span>
                  <div className="flex space-x-1">
                    {reactionEmojis.map((reaction) => (
                      <Button
                        key={reaction.emoji}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddReaction(activity.id, reaction.emoji)}
                        className="h-10 w-10 p-0 text-lg hover:bg-white/50 hover:scale-110 transition-all duration-200 rounded-full"
                        title={reaction.label}
                      >
                        {reaction.emoji}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Load More */}
      <div className="text-center pt-8">
        <Button 
          variant="outline" 
          className="bg-white hover:bg-mint-tint border-mint-green text-mint-green hover:text-text-primary px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:scale-105"
        >
          Load More Activities
        </Button>
      </div>
    </div>
  );
}