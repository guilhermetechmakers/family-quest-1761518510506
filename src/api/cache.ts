import { api } from '@/lib/api';
import type { ApiResponse, PaginatedResponse } from '@/lib/api';
import type {
  PerformanceMetrics,
  CacheStats,
  CacheSettings,
  CacheOperation,
  CDNConfig,
  PerformanceDashboard,
  CacheBulkOperation,
  CacheOptimization
} from '@/types/cache';

// Cache Management API
export const cacheApi = {
  // Get cache metadata
  getCacheMetadata: (): Promise<PaginatedResponse<any>> =>
    api.get<PaginatedResponse<any>>('/cache/metadata'),

  // Get cache statistics
  getCacheStats: (): Promise<ApiResponse<CacheStats>> =>
    api.get<ApiResponse<CacheStats>>('/cache/stats'),

  // Get performance metrics
  getPerformanceMetrics: (): Promise<ApiResponse<PerformanceMetrics[]>> =>
    api.get<ApiResponse<PerformanceMetrics[]>>('/cache/performance'),

  // Get performance dashboard data
  getPerformanceDashboard: (): Promise<ApiResponse<PerformanceDashboard>> =>
    api.get<ApiResponse<PerformanceDashboard>>('/cache/dashboard'),

  // Cache operations
  getCacheValue: (key: string): Promise<ApiResponse<any>> =>
    api.get<ApiResponse<any>>(`/cache/${encodeURIComponent(key)}`),

  setCacheValue: (key: string, value: any, ttl?: number): Promise<ApiResponse<void>> =>
    api.post('/cache', { key, value, ttl }),

  deleteCacheValue: (key: string): Promise<ApiResponse<void>> =>
    api.delete(`/cache/${encodeURIComponent(key)}`) as Promise<ApiResponse<void>>,

  clearCache: (pattern?: string): Promise<ApiResponse<void>> =>
    api.post('/cache/clear', { pattern }) as Promise<ApiResponse<void>>,

  invalidateCache: (keys: string[]): Promise<ApiResponse<void>> =>
    api.post('/cache/invalidate', { keys }) as Promise<ApiResponse<void>>,

  // Bulk operations
  bulkCacheOperation: (operation: CacheBulkOperation): Promise<ApiResponse<void>> =>
    api.post('/cache/bulk', operation) as Promise<ApiResponse<void>>,

  // Cache settings
  getCacheSettings: (): Promise<ApiResponse<CacheSettings>> =>
    api.get<ApiResponse<CacheSettings>>('/cache/settings'),

  updateCacheSettings: (settings: Partial<CacheSettings>): Promise<ApiResponse<CacheSettings>> =>
    api.put('/cache/settings', settings) as Promise<ApiResponse<CacheSettings>>,

  // CDN configuration
  getCDNConfig: (): Promise<ApiResponse<CDNConfig>> =>
    api.get<ApiResponse<CDNConfig>>('/cache/cdn'),

  updateCDNConfig: (config: Partial<CDNConfig>): Promise<ApiResponse<CDNConfig>> =>
    api.put('/cache/cdn', config) as Promise<ApiResponse<CDNConfig>>,

  // Performance monitoring
  getSystemHealth: (): Promise<ApiResponse<PerformanceDashboard['system_health']>> =>
    api.get<ApiResponse<PerformanceDashboard['system_health']>>('/cache/health'),

  // Optimization suggestions
  getOptimizationSuggestions: (): Promise<ApiResponse<CacheOptimization[]>> =>
    api.get<ApiResponse<CacheOptimization[]>>('/cache/optimizations'),

  // Cache operations history
  getCacheOperations: (): Promise<ApiResponse<CacheOperation[]>> =>
    api.get<ApiResponse<CacheOperation[]>>('/cache/operations'),

  // Export cache data
  exportCacheData: (format: 'json' | 'csv'): Promise<Blob> =>
    api.get<Blob>(`/cache/export?format=${format}`),

  // Import cache data
  importCacheData: (file: File): Promise<ApiResponse<void>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/cache/import', formData) as Promise<ApiResponse<void>>;
  }
};

// Client-side cache utilities
export class ClientCache {
  private static instance: ClientCache;
  private cache = new Map<string, { value: any; expires: number }>();
  private maxSize = 1000;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ClientCache {
    if (!ClientCache.instance) {
      ClientCache.instance = new ClientCache();
    }
    return ClientCache.instance;
  }

  set(key: string, value: any, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, { value, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // Would need to track hits/misses
    };
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordMetric(metric: Omit<PerformanceMetrics, 'metric_id' | 'timestamp'>): void {
    const newMetric: PerformanceMetrics = {
      ...metric,
      metric_id: crypto.randomUUID(),
      timestamp: new Date()
    };

    this.metrics.push(newMetric);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  getMetrics(timeRange?: { start: Date; end: Date }): PerformanceMetrics[] {
    if (!timeRange) {
      return [...this.metrics];
    }

    return this.metrics.filter(metric => 
      metric.timestamp >= timeRange.start && metric.timestamp <= timeRange.end
    );
  }

  getAverageResponseTime(): number {
    if (this.metrics.length === 0) return 0;
    
    const total = this.metrics.reduce((sum, metric) => sum + metric.response_time, 0);
    return total / this.metrics.length;
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    
    const hits = this.metrics.filter(metric => metric.cache_hit).length;
    return hits / this.metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}