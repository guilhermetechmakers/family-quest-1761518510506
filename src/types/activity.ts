export type ActivityType = 'contribution' | 'milestone' | 'goal_created' | 'goal_completed' | 'member_joined' | 'member_left' | 'comment' | 'reaction';

export interface Activity {
  id: string;
  family_id: string;
  goal_id?: string;
  user_id: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  goal?: {
    id: string;
    title: string;
    image_url?: string;
  };
  comments: ActivityComment[];
  reactions: ActivityReaction[];
}

export interface ActivityComment {
  id: string;
  activity_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface ActivityReaction {
  id: string;
  activity_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface CreateActivityInput {
  family_id: string;
  goal_id?: string;
  type: ActivityType;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface CreateCommentInput {
  activity_id: string;
  content: string;
}

export interface CreateReactionInput {
  activity_id: string;
  emoji: string;
}

// Filter and search types for activity feed
export interface ActivityFilters {
  goal_id?: string;
  user_id?: string;
  type?: ActivityType;
  date_from?: string;
  date_to?: string;
}

export interface ActivityFeedQuery {
  family_id: string;
  filters?: ActivityFilters;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}

export interface ActivityFeedResponse {
  activities: Activity[];
  total: number;
  page: number;
  has_more: boolean;
}

// Post composer types
export interface PostComposerData {
  content: string;
  goal_id?: string;
  type: 'general' | 'milestone' | 'celebration';
  media_urls?: string[];
  tags?: string[];
}

// Child-friendly post composer
export interface ChildPostData {
  content: string;
  emoji: string;
  goal_id?: string;
  photo_url?: string;
}