import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cacheApi, ClientCache, PerformanceMonitor } from '@/api/cache';
import type {
  PerformanceMetrics,
  CacheSettings,
  CDNConfig,
  CacheBulkOperation
} from '@/types/cache';

// Query keys for cache management
export const cacheKeys = {
  all: ['cache'] as const,
  metadata: () => [...cacheKeys.all, 'metadata'] as const,
  stats: () => [...cacheKeys.all, 'stats'] as const,
  performance: () => [...cacheKeys.all, 'performance'] as const,
  dashboard: () => [...cacheKeys.all, 'dashboard'] as const,
  settings: () => [...cacheKeys.all, 'settings'] as const,
  cdn: () => [...cacheKeys.all, 'cdn'] as const,
  health: () => [...cacheKeys.all, 'health'] as const,
  optimizations: () => [...cacheKeys.all, 'optimizations'] as const,
  operations: () => [...cacheKeys.all, 'operations'] as const,
} as const;

// Cache metadata hook
export function useCacheMetadata() {
  return useQuery({
    queryKey: cacheKeys.metadata(),
    queryFn: () => cacheApi.getCacheMetadata(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Cache statistics hook
export function useCacheStats() {
  return useQuery({
    queryKey: cacheKeys.stats(),
    queryFn: () => cacheApi.getCacheStats(),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Performance metrics hook
export function usePerformanceMetrics() {
  return useQuery({
    queryKey: cacheKeys.performance(),
    queryFn: () => cacheApi.getPerformanceMetrics(),
    staleTime: 15 * 1000, // 15 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Performance dashboard hook
export function usePerformanceDashboard() {
  return useQuery({
    queryKey: cacheKeys.dashboard(),
    queryFn: () => cacheApi.getPerformanceDashboard(),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Cache settings hook
export function useCacheSettings() {
  return useQuery({
    queryKey: cacheKeys.settings(),
    queryFn: () => cacheApi.getCacheSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// CDN configuration hook
export function useCDNConfig() {
  return useQuery({
    queryKey: cacheKeys.cdn(),
    queryFn: () => cacheApi.getCDNConfig(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// System health hook
export function useSystemHealth() {
  return useQuery({
    queryKey: cacheKeys.health(),
    queryFn: () => cacheApi.getSystemHealth(),
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Optimization suggestions hook
export function useOptimizationSuggestions() {
  return useQuery({
    queryKey: cacheKeys.optimizations(),
    queryFn: () => cacheApi.getOptimizationSuggestions(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Cache operations history hook
export function useCacheOperations() {
  return useQuery({
    queryKey: cacheKeys.operations(),
    queryFn: () => cacheApi.getCacheOperations(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Cache value operations
export function useCacheValue(key: string) {
  return useQuery({
    queryKey: [...cacheKeys.all, 'value', key],
    queryFn: () => cacheApi.getCacheValue(key),
    enabled: !!key,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Cache mutations
export function useSetCacheValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value, ttl }: { key: string; value: any; ttl?: number }) =>
      cacheApi.setCacheValue(key, value, ttl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.all });
      toast.success('Cache value set successfully');
    },
    onError: (error) => {
      toast.error(`Failed to set cache value: ${error.message}`);
    },
  });
}

export function useDeleteCacheValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) => cacheApi.deleteCacheValue(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.all });
      toast.success('Cache value deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete cache value: ${error.message}`);
    },
  });
}

export function useClearCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pattern?: string) => cacheApi.clearCache(pattern),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.all });
      toast.success('Cache cleared successfully');
    },
    onError: (error) => {
      toast.error(`Failed to clear cache: ${error.message}`);
    },
  });
}

export function useInvalidateCache() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keys: string[]) => cacheApi.invalidateCache(keys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.all });
      toast.success('Cache invalidated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to invalidate cache: ${error.message}`);
    },
  });
}

export function useBulkCacheOperation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (operation: CacheBulkOperation) => cacheApi.bulkCacheOperation(operation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.all });
      toast.success('Bulk operation completed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to perform bulk operation: ${error.message}`);
    },
  });
}

// Settings mutations
export function useUpdateCacheSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<CacheSettings>) => cacheApi.updateCacheSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.settings() });
      toast.success('Cache settings updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update cache settings: ${error.message}`);
    },
  });
}

export function useUpdateCDNConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: Partial<CDNConfig>) => cacheApi.updateCDNConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.cdn() });
      toast.success('CDN configuration updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update CDN configuration: ${error.message}`);
    },
  });
}

// Client-side cache hook
export function useClientCache() {
  const cache = ClientCache.getInstance();
  const monitor = PerformanceMonitor.getInstance();

  const setValue = (key: string, value: any, ttl?: number) => {
    const startTime = performance.now();
    cache.set(key, value, ttl);
    const endTime = performance.now();
    
    monitor.recordMetric({
      request_path: `cache:set:${key}`,
      response_time: endTime - startTime,
      cache_hit: false,
      memory_usage: cache.getStats().size,
      cpu_usage: 0,
      error_count: 0,
    });
  };

  const getValue = (key: string) => {
    const startTime = performance.now();
    const value = cache.get(key);
    const endTime = performance.now();
    
    monitor.recordMetric({
      request_path: `cache:get:${key}`,
      response_time: endTime - startTime,
      cache_hit: value !== null,
      memory_usage: cache.getStats().size,
      cpu_usage: 0,
      error_count: 0,
    });

    return value;
  };

  const deleteValue = (key: string) => {
    const startTime = performance.now();
    const success = cache.delete(key);
    const endTime = performance.now();
    
    monitor.recordMetric({
      request_path: `cache:delete:${key}`,
      response_time: endTime - startTime,
      cache_hit: success,
      memory_usage: cache.getStats().size,
      cpu_usage: 0,
      error_count: success ? 0 : 1,
    });

    return success;
  };

  const clearCache = () => {
    const startTime = performance.now();
    cache.clear();
    const endTime = performance.now();
    
    monitor.recordMetric({
      request_path: 'cache:clear',
      response_time: endTime - startTime,
      cache_hit: false,
      memory_usage: 0,
      cpu_usage: 0,
      error_count: 0,
    });
  };

  const getStats = () => cache.getStats();
  const cleanup = () => cache.cleanup();

  return {
    setValue,
    getValue,
    deleteValue,
    clearCache,
    getStats,
    cleanup,
  };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  const monitor = PerformanceMonitor.getInstance();

  const recordMetric = (metric: Omit<PerformanceMetrics, 'metric_id' | 'timestamp'>) => {
    monitor.recordMetric(metric);
  };

  const getMetrics = (timeRange?: { start: Date; end: Date }) => {
    return monitor.getMetrics(timeRange);
  };

  const getAverageResponseTime = () => {
    return monitor.getAverageResponseTime();
  };

  const getCacheHitRate = () => {
    return monitor.getCacheHitRate();
  };

  const clearMetrics = () => {
    monitor.clearMetrics();
  };

  return {
    recordMetric,
    getMetrics,
    getAverageResponseTime,
    getCacheHitRate,
    clearMetrics,
  };
}