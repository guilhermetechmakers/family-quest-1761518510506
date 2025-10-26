export type ContributionType = 'monetary' | 'manual' | 'chore' | 'milestone';
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Contribution {
  id: string;
  goal_id: string;
  contributor_id: string;
  type: ContributionType;
  amount: number;
  currency: string;
  description: string;
  status: ContributionStatus;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
  contributor: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
  goal: {
    id: string;
    title: string;
    image_url?: string;
  };
}

export interface CreateContributionInput {
  goal_id: string;
  type: ContributionType;
  amount: number;
  currency: string;
  description: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
}

export interface UpdateContributionInput {
  id: string;
  status?: ContributionStatus;
  description?: string;
  receipt_url?: string;
  metadata?: Record<string, any>;
}

export interface ContributionStats {
  total_contributions: number;
  total_amount: number;
  average_contribution: number;
  contributions_by_type: Record<ContributionType, number>;
  contributions_by_user: Array<{
    user_id: string;
    user_name: string;
    count: number;
    total_amount: number;
  }>;
}