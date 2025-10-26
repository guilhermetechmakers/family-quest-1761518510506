export interface Family {
  id: string;
  name: string;
  currency: string;
  created_at: string;
  updated_at: string;
  members: FamilyMember[];
  settings: FamilySettings;
}

export interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  role: 'parent' | 'child' | 'guest';
  permissions: FamilyPermissions;
  joined_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
  };
}

export interface FamilyPermissions {
  can_create_goals: boolean;
  can_edit_goals: boolean;
  can_delete_goals: boolean;
  can_approve_contributions: boolean;
  can_invite_members: boolean;
  can_manage_family: boolean;
}

export interface FamilySettings {
  allow_guest_contributions: boolean;
  require_approval_for_contributions: boolean;
  default_contribution_approval: boolean;
  privacy_level: 'private' | 'family_only' | 'public';
}

export interface CreateFamilyInput {
  name: string;
  currency: string;
  settings?: Partial<FamilySettings>;
}

export interface UpdateFamilyInput {
  id: string;
  name?: string;
  currency?: string;
  settings?: Partial<FamilySettings>;
}
