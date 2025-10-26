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