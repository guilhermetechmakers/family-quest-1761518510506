import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Activity as ActivityIcon, 
  Search, 
  Filter, 
  Plus,
  RefreshCw,
  Target,
  MessageCircle,
  Heart,
  Smile,
} from 'lucide-react';
import { ActivityFeed } from '@/components/activity-feed/ActivityFeed';
import { PostComposer } from '@/components/activity-feed/PostComposer';
import { ActivityFeedErrorBoundary } from '@/components/activity-feed/ActivityFeedErrorBoundary';
import { activitiesApi } from '@/api/activities';
import { goalsApi } from '@/api/goals';
import { useFamilyRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import type { ActivityFilters, PostComposerData, ChildPostData } from '@/types/activity';
import type { Activity } from '@/types/activity';

export function ActivityFeedPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ActivityFilters>({});
  const [showComposer, setShowComposer] = useState(false);
  const [isChildMode, setIsChildMode] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Mock family ID - in real app this would come from auth context
  const familyId = 'family-123';

  // Real-time updates
  const { isConnected } = useFamilyRealtimeUpdates(familyId, true);

  // Fetch activities with pagination and filters
  const {
    data: activitiesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['activities', 'feed', familyId, filters, page],
    queryFn: () => activitiesApi.getFeed({
      family_id: familyId,
      filters,
      page,
      limit: 10,
      sort: 'newest'
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch goals for post composer
  const { data: goals = [] } = useQuery({
    queryKey: ['goals', familyId],
    queryFn: () => goalsApi.getAll(),
    select: (goals) => goals.map((goal: any) => ({ id: goal.id, title: goal.title }))
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: PostComposerData) => activitiesApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
      setShowComposer(false);
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      toast.error('Failed to create post. Please try again.');
      console.error('Create post error:', error);
    }
  });

  // Create child post mutation
  const createChildPostMutation = useMutation({
    mutationFn: (data: ChildPostData) => activitiesApi.createChildPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
      setShowComposer(false);
      toast.success('Post shared successfully!');
    },
    onError: (error) => {
      toast.error('Failed to share post. Please try again.');
      console.error('Create child post error:', error);
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: ({ activityId, content }: { activityId: string; content: string }) =>
      activitiesApi.addComment(activityId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
      toast.success('Comment added!');
    },
    onError: () => {
      toast.error('Failed to add comment. Please try again.');
    }
  });

  // Add reaction mutation
  const addReactionMutation = useMutation({
    mutationFn: ({ activityId, emoji }: { activityId: string; emoji: string }) =>
      activitiesApi.addReaction(activityId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', 'feed'] });
    },
    onError: () => {
      toast.error('Failed to add reaction. Please try again.');
    }
  });

  // Flag activity mutation
  const flagActivityMutation = useMutation({
    mutationFn: (_activityId: string) => {
      // In a real app, this would call a flag API
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success('Content reported. Thank you for keeping our community safe!');
    },
    onError: () => {
      toast.error('Failed to report content. Please try again.');
    }
  });

  // Handle infinite scroll
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger a search API call
    // For now, we'll just filter client-side
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: ActivityFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Handle post creation
  const handleCreatePost = useCallback((data: PostComposerData) => {
    createPostMutation.mutate(data);
  }, [createPostMutation]);

  // Handle child post creation
  const handleCreateChildPost = useCallback((data: ChildPostData) => {
    createChildPostMutation.mutate(data);
  }, [createChildPostMutation]);

  // Handle comment addition
  const handleAddComment = useCallback((activityId: string, content: string) => {
    addCommentMutation.mutate({ activityId, content });
  }, [addCommentMutation]);

  // Handle reaction addition
  const handleAddReaction = useCallback((activityId: string, emoji: string) => {
    addReactionMutation.mutate({ activityId, emoji });
  }, [addReactionMutation]);

  // Handle activity flagging
  const handleFlagActivity = useCallback((activityId: string) => {
    flagActivityMutation.mutate(activityId);
  }, [flagActivityMutation]);

  // Update hasMore based on response
  useEffect(() => {
    if (activitiesData) {
      setHasMore(activitiesData.has_more);
    }
  }, [activitiesData]);

  // Mock activities for demonstration
  const mockActivities: Activity[] = [
    {
      id: '1',
      family_id: familyId,
      user_id: 'user-1',
      type: 'milestone',
      title: '🎉 Milestone Reached!',
      description: 'We just hit 75% of our vacation fund goal! Only $500 more to go!',
      created_at: new Date().toISOString(),
      user: {
        id: 'user-1',
        full_name: 'Sarah Johnson',
        avatar_url: undefined
      },
      goal: {
        id: 'goal-1',
        title: 'Family Vacation to Hawaii',
        image_url: undefined
      },
      comments: [
        {
          id: 'comment-1',
          activity_id: '1',
          user_id: 'user-2',
          content: 'Amazing progress! Can\'t wait for our trip! 🏝️',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          user: {
            id: 'user-2',
            full_name: 'Mike Johnson',
            avatar_url: undefined
          }
        }
      ],
      reactions: [
        {
          id: 'reaction-1',
          activity_id: '1',
          user_id: 'user-2',
          emoji: '🎉',
          created_at: new Date().toISOString(),
          user: {
            id: 'user-2',
            full_name: 'Mike Johnson',
            avatar_url: undefined
          }
        },
        {
          id: 'reaction-2',
          activity_id: '1',
          user_id: 'user-3',
          emoji: '❤️',
          created_at: new Date().toISOString(),
          user: {
            id: 'user-3',
            full_name: 'Emma Johnson',
            avatar_url: undefined
          }
        }
      ]
    },
    {
      id: '2',
      family_id: familyId,
      user_id: 'user-3',
      type: 'contribution',
      title: 'Weekly Chores Completed!',
      description: 'I finished all my chores this week and earned $25 for our vacation fund!',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: {
        id: 'user-3',
        full_name: 'Emma Johnson',
        avatar_url: undefined
      },
      goal: {
        id: 'goal-1',
        title: 'Family Vacation to Hawaii',
        image_url: undefined
      },
      comments: [],
      reactions: [
        {
          id: 'reaction-3',
          activity_id: '2',
          user_id: 'user-1',
          emoji: '👏',
          created_at: new Date().toISOString(),
          user: {
            id: 'user-1',
            full_name: 'Sarah Johnson',
            avatar_url: undefined
          }
        }
      ]
    }
  ];

  const activities = activitiesData?.activities || mockActivities;

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hover:bg-mint-tint">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Family Activity Feed</h1>
                <p className="text-text-secondary mt-1">
                  Stay connected with your family's progress and celebrations
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-text-tertiary">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setIsChildMode(!isChildMode)}
                className={isChildMode ? "bg-mint-green text-text-primary" : ""}
              >
                <Smile className="h-4 w-4 mr-2" />
                {isChildMode ? 'Adult Mode' : 'Kid Mode'}
              </Button>
              <Button
                onClick={() => setShowComposer(!showComposer)}
                className="bg-mint-green hover:bg-light-mint text-text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                <Input
                  placeholder="Search activities, comments, or family members..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-mint-green focus:ring-mint-green"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Select value={filters.type || ''} onValueChange={(value) => handleFilterChange({ ...filters, type: value as any })}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="contribution">Contributions</SelectItem>
                  <SelectItem value="milestone">Milestones</SelectItem>
                  <SelectItem value="goal_created">New Goals</SelectItem>
                  <SelectItem value="goal_completed">Completed Goals</SelectItem>
                  <SelectItem value="member_joined">New Members</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
                className="hover:bg-mint-tint"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-r from-mint-green to-light-mint">
              <div className="flex items-center space-x-3">
                <ActivityIcon className="h-8 w-8 text-text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Total Activities</p>
                  <p className="text-2xl font-bold text-text-primary">{activities.length}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-pale-lavender to-light-purple">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-8 w-8 text-text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Comments</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {activities.reduce((sum, activity) => sum + activity.comments.length, 0)}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-light-pink to-pastel-yellow">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Reactions</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {activities.reduce((sum, activity) => sum + activity.reactions.length, 0)}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-r from-pastel-yellow to-cream-yellow">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Active Goals</p>
                  <p className="text-2xl font-bold text-text-primary">{goals.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Post Composer */}
        {showComposer && (
          <PostComposer
            onSubmit={handleCreatePost}
            onChildSubmit={handleCreateChildPost}
            goals={goals}
            isChild={isChildMode}
            isLoading={createPostMutation.isPending || createChildPostMutation.isPending}
          />
        )}

        {/* Activity Feed */}
        <ActivityFeedErrorBoundary>
          <div className="space-y-6">
            {isLoading && activities.length === 0 ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card className="p-8 text-center">
                <div className="text-red-500 mb-4">
                  <ActivityIcon className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Failed to load activities</h3>
                  <p className="text-text-secondary mb-4">
                    There was an error loading the activity feed. Please try again.
                  </p>
                  <Button onClick={() => refetch()} className="bg-mint-green hover:bg-light-mint">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </Card>
            ) : activities.length === 0 ? (
              <Card className="p-8 text-center">
                <ActivityIcon className="h-16 w-16 text-mint-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  No activities yet
                </h3>
                <p className="text-text-secondary mb-6">
                  Be the first to share an update with your family!
                </p>
                <Button
                  onClick={() => setShowComposer(true)}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </Card>
            ) : (
              <>
                <ActivityFeed
                  activities={activities}
                  onAddComment={handleAddComment}
                  onAddReaction={handleAddReaction}
                  onFlagActivity={handleFlagActivity}
                />
                
                {hasMore && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="hover:bg-mint-tint"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Activities'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ActivityFeedErrorBoundary>
      </div>
    </div>
  );
}