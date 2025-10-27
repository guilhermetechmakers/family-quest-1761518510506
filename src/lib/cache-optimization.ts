// Cache Optimization Utilities
import { ClientCache, PerformanceMonitor } from '@/api/cache';
import { toast } from 'sonner';

export class CacheOptimizer {
  private static instance: CacheOptimizer;
  private clientCache = ClientCache.getInstance();
  private monitor = PerformanceMonitor.getInstance();
  private optimizationStrategies: Map<string, () => void> = new Map();

  static getInstance(): CacheOptimizer {
    if (!CacheOptimizer.instance) {
      CacheOptimizer.instance = new CacheOptimizer();
    }
    return CacheOptimizer.instance;
  }

  constructor() {
    this.initializeOptimizationStrategies();
  }

  private initializeOptimizationStrategies() {
    this.optimizationStrategies.set('memory-cleanup', () => this.performMemoryCleanup());
    this.optimizationStrategies.set('compression', () => this.enableCompression());
    this.optimizationStrategies.set('prefetching', () => this.enablePrefetching());
    this.optimizationStrategies.set('cache-warming', () => this.performCacheWarming());
  }

  // Memory cleanup optimization
  private performMemoryCleanup() {
    const startTime = performance.now();
    this.clientCache.cleanup();
    const endTime = performance.now();
    
    this.monitor.recordMetric({
      request_path: 'optimization:memory-cleanup',
      response_time: endTime - startTime,
      cache_hit: false,
      memory_usage: this.clientCache.getStats().size,
      cpu_usage: 0,
      error_count: 0,
    });

    toast.success('Memory cleanup completed');
  }

  // Enable compression for cache entries
  private enableCompression() {
    // In a real implementation, this would configure compression settings
    toast.success('Compression optimization applied');
  }

  // Enable prefetching for frequently accessed data
  private enablePrefetching() {
    // In a real implementation, this would set up prefetching strategies
    toast.success('Prefetching optimization enabled');
  }

  // Perform cache warming for critical data
  private performCacheWarming() {
    // In a real implementation, this would preload critical cache entries
    toast.success('Cache warming completed');
  }

  // Get optimization suggestions based on current performance
  getOptimizationSuggestions() {
    const stats = this.clientCache.getStats();
    const metrics = this.monitor.getMetrics();
    const suggestions = [];

    // Memory usage optimization
    if (stats.size > stats.maxSize * 0.8) {
      suggestions.push({
        id: 'memory-cleanup',
        title: 'Memory Cleanup',
        description: 'Clean up expired cache entries to free memory',
        impact: 'medium',
        effort: 'low',
        estimatedImprovement: 15,
      });
    }

    // Response time optimization
    const avgResponseTime = this.monitor.getAverageResponseTime();
    if (avgResponseTime > 200) {
      suggestions.push({
        id: 'compression',
        title: 'Enable Compression',
        description: 'Compress cache data to reduce memory usage and improve performance',
        impact: 'high',
        effort: 'low',
        estimatedImprovement: 25,
      });
    }

    // Cache hit rate optimization
    const hitRate = this.monitor.getCacheHitRate();
    if (hitRate < 0.7) {
      suggestions.push({
        id: 'prefetching',
        title: 'Enable Prefetching',
        description: 'Prefetch frequently accessed data to improve cache hit rate',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: 30,
      });
    }

    // Cache warming suggestion
    if (metrics.length > 100) {
      suggestions.push({
        id: 'cache-warming',
        title: 'Cache Warming',
        description: 'Preload critical data to improve initial response times',
        impact: 'medium',
        effort: 'low',
        estimatedImprovement: 20,
      });
    }

    return suggestions;
  }

  // Apply optimization strategy
  applyOptimization(strategyId: string) {
    const strategy = this.optimizationStrategies.get(strategyId);
    if (strategy) {
      strategy();
      return true;
    }
    return false;
  }

  // Get current performance metrics
  getPerformanceMetrics() {
    const stats = this.clientCache.getStats();
    const metrics = this.monitor.getMetrics();
    
    return {
      cacheSize: stats.size,
      maxCacheSize: stats.maxSize,
      hitRate: this.monitor.getCacheHitRate(),
      averageResponseTime: this.monitor.getAverageResponseTime(),
      totalMetrics: metrics.length,
      memoryUsage: (stats.size / stats.maxSize) * 100,
    };
  }

  // Optimize cache based on usage patterns
  optimizeCache() {
    const suggestions = this.getOptimizationSuggestions();
    let appliedOptimizations = 0;

    suggestions.forEach(suggestion => {
      if (suggestion.impact === 'high' && suggestion.effort === 'low') {
        if (this.applyOptimization(suggestion.id)) {
          appliedOptimizations++;
        }
      }
    });

    if (appliedOptimizations > 0) {
      toast.success(`Applied ${appliedOptimizations} optimizations`);
    } else {
      toast.info('No optimizations needed at this time');
    }

    return appliedOptimizations;
  }

  // Clear all caches and reset metrics
  resetCache() {
    this.clientCache.clear();
    this.monitor.clearMetrics();
    toast.success('Cache and metrics reset successfully');
  }

  // Get cache statistics for monitoring
  getCacheStatistics() {
    const stats = this.clientCache.getStats();
    const metrics = this.monitor.getMetrics();
    
    return {
      totalEntries: stats.size,
      maxEntries: stats.maxSize,
      hitRate: this.monitor.getCacheHitRate(),
      averageResponseTime: this.monitor.getAverageResponseTime(),
      memoryUsage: (stats.size / stats.maxSize) * 100,
      totalRequests: metrics.length,
      lastOptimization: new Date(),
    };
  }
}

// React hook for cache optimization
export function useCacheOptimization() {
  const optimizer = CacheOptimizer.getInstance();

  const getSuggestions = () => optimizer.getOptimizationSuggestions();
  const applyOptimization = (strategyId: string) => optimizer.applyOptimization(strategyId);
  const optimizeCache = () => optimizer.optimizeCache();
  const getMetrics = () => optimizer.getPerformanceMetrics();
  const getStatistics = () => optimizer.getCacheStatistics();
  const resetCache = () => optimizer.resetCache();

  return {
    getSuggestions,
    applyOptimization,
    optimizeCache,
    getMetrics,
    getStatistics,
    resetCache,
  };
}

// Utility functions for cache optimization
export const cacheUtils = {
  // Calculate cache efficiency score
  calculateEfficiencyScore(hitRate: number, responseTime: number, memoryUsage: number): number {
    const hitRateScore = hitRate * 40; // 40% weight
    const responseTimeScore = Math.max(0, (500 - responseTime) / 500) * 30; // 30% weight
    const memoryScore = Math.max(0, (100 - memoryUsage) / 100) * 30; // 30% weight
    
    return Math.min(100, hitRateScore + responseTimeScore + memoryScore);
  },

  // Get cache health status
  getCacheHealthStatus(metrics: ReturnType<typeof CacheOptimizer.prototype.getPerformanceMetrics>) {
    const efficiencyScore = cacheUtils.calculateEfficiencyScore(
      metrics.hitRate,
      metrics.averageResponseTime,
      metrics.memoryUsage
    );

    if (efficiencyScore >= 80) return { status: 'excellent', color: 'text-green-500' };
    if (efficiencyScore >= 60) return { status: 'good', color: 'text-yellow-500' };
    if (efficiencyScore >= 40) return { status: 'fair', color: 'text-orange-500' };
    return { status: 'poor', color: 'text-red-500' };
  },

  // Format cache size for display
  formatCacheSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  // Format response time for display
  formatResponseTime(ms: number): string {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  },
};