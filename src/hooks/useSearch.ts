import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchApi } from '@/api/search';
import type {
  SearchQuery,
  SavedSearch,
} from '@/types/search';
import { toast } from 'sonner';

// Main search hook
export function useSearch(query: SearchQuery, enabled = true) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApi.search(query),
    enabled: enabled && query.query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Autocomplete hook
export function useAutocomplete(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', 'autocomplete', query],
    queryFn: () => searchApi.autocomplete(query),
    enabled: enabled && query.length > 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Quick search hook for header
export function useQuickSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', 'quick', query],
    queryFn: () => searchApi.quickSearch(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Search history hooks
export function useSearchHistory(limit = 20) {
  return useQuery({
    queryKey: ['search', 'history'],
    queryFn: () => searchApi.getSearchHistory(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useClearSearchHistory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: searchApi.clearSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'history'] });
      toast.success('Search history cleared');
    },
    onError: (error) => {
      toast.error('Failed to clear search history');
      console.error('Clear search history error:', error);
    },
  });
}

// Saved searches hooks
export function useSavedSearches() {
  return useQuery({
    queryKey: ['search', 'saved'],
    queryFn: searchApi.getSavedSearches,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useSaveSearch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: searchApi.saveSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'saved'] });
      toast.success('Search saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save search');
      console.error('Save search error:', error);
    },
  });
}

export function useUpdateSavedSearch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SavedSearch> }) =>
      searchApi.updateSavedSearch(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'saved'] });
      toast.success('Search updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update search');
      console.error('Update saved search error:', error);
    },
  });
}

export function useDeleteSavedSearch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: searchApi.deleteSavedSearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search', 'saved'] });
      toast.success('Search deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete search');
      console.error('Delete saved search error:', error);
    },
  });
}

// Search analytics hook (admin only)
export function useSearchAnalytics(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['search', 'analytics', dateFrom, dateTo],
    queryFn: () => searchApi.getSearchAnalytics(dateFrom, dateTo),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Track search result click
export function useTrackClick() {
  return useMutation({
    mutationFn: ({ resultId, query, position }: { resultId: string; query: string; position: number }) =>
      searchApi.trackClick(resultId, query, position),
    onError: (error) => {
      console.error('Track click error:', error);
    },
  });
}

// Popular queries hook
export function usePopularQueries(limit = 10) {
  return useQuery({
    queryKey: ['search', 'popular', limit],
    queryFn: () => searchApi.getPopularQueries(limit),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Trending searches hook
export function useTrendingSearches(limit = 10) {
  return useQuery({
    queryKey: ['search', 'trending', limit],
    queryFn: () => searchApi.getTrendingSearches(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Debounced search hook for real-time search
export function useDebouncedSearch(query: SearchQuery, delay = 300) {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [query, delay]);
  
  return useSearch(debouncedQuery, query.query.length > 0);
}

// Search suggestions hook that combines autocomplete and popular queries
export function useSearchSuggestions(query: string) {
  const { data: autocompleteData, isLoading: autocompleteLoading } = useAutocomplete(query);
  const { data: popularData, isLoading: popularLoading } = usePopularQueries(5);
  
  const suggestions = React.useMemo(() => {
    if (query.length > 2 && autocompleteData?.suggestions) {
      return autocompleteData.suggestions.map(s => s.text);
    }
    if (query.length === 0 && popularData) {
      return popularData;
    }
    return [];
  }, [query, autocompleteData, popularData]);
  
  return {
    suggestions,
    isLoading: autocompleteLoading || popularLoading,
  };
}