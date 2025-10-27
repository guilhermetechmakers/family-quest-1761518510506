import { api } from '@/lib/api';
import type {
  SearchQuery,
  SearchResponse,
  AutocompleteResponse,
  SearchHistoryItem,
  SavedSearch,
  SearchAnalytics,
  QuickSearchResponse,
} from '@/types/search';

// Search API functions
export const searchApi = {
  // Main search function
  search: async (query: SearchQuery): Promise<SearchResponse> => {
    const params = new URLSearchParams();
    params.append('q', query.query);
    
    if (query.filters) {
      if (query.filters.entity_types?.length) {
        params.append('entity_types', query.filters.entity_types.join(','));
      }
      if (query.filters.date_from) {
        params.append('date_from', query.filters.date_from);
      }
      if (query.filters.date_to) {
        params.append('date_to', query.filters.date_to);
      }
      if (query.filters.goal_id) {
        params.append('goal_id', query.filters.goal_id);
      }
      if (query.filters.user_id) {
        params.append('user_id', query.filters.user_id);
      }
      if (query.filters.status) {
        params.append('status', query.filters.status);
      }
      if (query.filters.type) {
        params.append('type', query.filters.type);
      }
      if (query.filters.amount_min !== undefined) {
        params.append('amount_min', query.filters.amount_min.toString());
      }
      if (query.filters.amount_max !== undefined) {
        params.append('amount_max', query.filters.amount_max.toString());
      }
      if (query.filters.currency) {
        params.append('currency', query.filters.currency);
      }
    }
    
    if (query.page) {
      params.append('page', query.page.toString());
    }
    if (query.limit) {
      params.append('limit', query.limit.toString());
    }
    if (query.sort) {
      params.append('sort', query.sort);
    }

    return api.get<SearchResponse>(`/search?${params.toString()}`);
  },

  // Autocomplete suggestions
  autocomplete: async (query: string, limit = 10): Promise<AutocompleteResponse> => {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', limit.toString());

    return api.get<AutocompleteResponse>(`/search/autocomplete?${params.toString()}`);
  },

  // Quick search for header
  quickSearch: async (query: string, limit = 5): Promise<QuickSearchResponse> => {
    const params = new URLSearchParams();
    params.append('q', query);
    params.append('limit', limit.toString());

    return api.get<QuickSearchResponse>(`/search/quick?${params.toString()}`);
  },

  // Search history
  getSearchHistory: async (limit = 20): Promise<SearchHistoryItem[]> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    return api.get<SearchHistoryItem[]>(`/search/history?${params.toString()}`);
  },

  // Save search
  saveSearch: async (search: Omit<SavedSearch, 'id' | 'created_at' | 'updated_at'>): Promise<SavedSearch> => {
    return api.post<SavedSearch>('/search/saved', search);
  },

  // Get saved searches
  getSavedSearches: async (): Promise<SavedSearch[]> => {
    return api.get<SavedSearch[]>('/search/saved');
  },

  // Update saved search
  updateSavedSearch: async (id: string, updates: Partial<SavedSearch>): Promise<SavedSearch> => {
    return api.patch<SavedSearch>(`/search/saved/${id}`, updates);
  },

  // Delete saved search
  deleteSavedSearch: async (id: string): Promise<void> => {
    await api.delete(`/search/saved/${id}`);
  },

  // Clear search history
  clearSearchHistory: async (): Promise<void> => {
    await api.delete('/search/history');
  },

  // Get search analytics (admin only)
  getSearchAnalytics: async (dateFrom?: string, dateTo?: string): Promise<SearchAnalytics> => {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);

    return api.get<SearchAnalytics>(`/search/analytics?${params.toString()}`);
  },

  // Track search result click
  trackClick: async (resultId: string, query: string, position: number): Promise<void> => {
    return api.post('/search/track-click', {
      result_id: resultId,
      query,
      position,
    });
  },

  // Get search suggestions based on popular queries
  getPopularQueries: async (limit = 10): Promise<string[]> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    return api.get<string[]>(`/search/popular?${params.toString()}`);
  },

  // Get trending searches
  getTrendingSearches: async (limit = 10): Promise<Array<{ query: string; count: number }>> => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());

    return api.get<Array<{ query: string; count: number }>>(`/search/trending?${params.toString()}`);
  },
};