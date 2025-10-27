// Search and Filter Types for Family Quest

export type SearchEntityType = 'goal' | 'activity' | 'transaction' | 'member';

export interface SearchFilters {
  entity_types?: SearchEntityType[];
  date_from?: string;
  date_to?: string;
  goal_id?: string;
  user_id?: string;
  status?: string;
  type?: string;
  amount_min?: number;
  amount_max?: number;
  currency?: string;
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sort?: 'relevance' | 'date_newest' | 'date_oldest' | 'amount_high' | 'amount_low';
}

export interface SearchResult {
  id: string;
  entity_type: SearchEntityType;
  title: string;
  description: string;
  relevance_score: number;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
  // Entity-specific data
  goal?: {
    id: string;
    title: string;
    description: string;
    status: string;
    current_value: number;
    target_value: number;
    currency: string;
    image_url?: string;
    owner: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  };
  activity?: {
    id: string;
    type: string;
    title: string;
    description: string;
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
  };
  transaction?: {
    id: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    description?: string;
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
  };
  member?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    avatar_url?: string;
    joined_at: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
  facets: SearchFacets;
  query_time_ms: number;
}

export interface SearchFacets {
  entity_types: Array<{
    type: SearchEntityType;
    count: number;
  }>;
  statuses: Array<{
    status: string;
    count: number;
  }>;
  types: Array<{
    type: string;
    count: number;
  }>;
  contributors: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  goals: Array<{
    id: string;
    title: string;
    count: number;
  }>;
  date_ranges: Array<{
    range: string;
    count: number;
  }>;
}

export interface AutocompleteSuggestion {
  id: string;
  text: string;
  type: SearchEntityType;
  entity_id: string;
  metadata?: Record<string, any>;
}

export interface AutocompleteResponse {
  suggestions: AutocompleteSuggestion[];
  query: string;
  total: number;
}

// Search history and saved searches
export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: SearchFilters;
  created_at: string;
  result_count: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  created_at: string;
  updated_at: string;
  is_shared: boolean;
  shared_with?: string[];
}

// Search analytics
export interface SearchAnalytics {
  total_searches: number;
  popular_queries: Array<{
    query: string;
    count: number;
  }>;
  search_success_rate: number;
  average_query_time_ms: number;
  most_clicked_results: Array<{
    result_id: string;
    title: string;
    click_count: number;
  }>;
}

// Quick search types for header search bar
export interface QuickSearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchEntityType;
  icon: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface QuickSearchResponse {
  results: QuickSearchResult[];
  query: string;
  total: number;
}