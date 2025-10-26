export type GoalType = 'vacation' | 'purchase' | 'home_upgrade' | 'pet' | 'education' | 'other';
export type GoalStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  target_value: number;
  current_value: number;
  currency: string;
  status: GoalStatus;
  owner_id: string;
  family_id: string;
  image_url?: string;
  milestones: Milestone[];
  contributors: GoalContributor[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
  estimated_completion?: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  target_value: number;
  reward?: string;
  achieved_at?: string;
  order: number;
}

export interface GoalContributor {
  id: string;
  goal_id: string;
  user_id: string;
  permissions: GoalPermissions;
  joined_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface GoalPermissions {
  can_contribute: boolean;
  can_edit: boolean;
  can_approve_contributions: boolean;
  can_invite_contributors: boolean;
}

export interface CreateGoalInput {
  title: string;
  description: string;
  type: GoalType;
  target_value: number;
  currency: string;
  family_id: string;
  image_url?: string;
  milestones?: Omit<Milestone, 'id' | 'goal_id' | 'achieved_at'>[];
  contributors?: Omit<GoalContributor, 'id' | 'goal_id' | 'joined_at' | 'user'>[];
}

export interface UpdateGoalInput {
  id: string;
  title?: string;
  description?: string;
  type?: GoalType;
  target_value?: number;
  currency?: string;
  image_url?: string;
  status?: GoalStatus;
  milestones?: Milestone[];
}

export interface GoalProgress {
  goal_id: string;
  current_value: number;
  target_value: number;
  percentage: number;
  estimated_completion?: string;
  recent_contributions: any[]; // Will be properly typed when Contribution type is available
}