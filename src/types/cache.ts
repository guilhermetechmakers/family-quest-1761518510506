// Cache Management Types
export interface CacheMetadata {
  cache_key: string;
  expiration_time: Date;
  last_accessed: Date;
  data_size: number;
  hit_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface PerformanceMetrics {
  metric_id: string;
  timestamp: Date;
  response_time: number;
  request_path: string;
  user_id?: string;
  cache_hit: boolean;
  memory_usage: number;
  cpu_usage: number;
  error_count: number;
}

export interface CacheStats {
  total_entries: number;
  total_size: number;
  hit_rate: number;
  miss_rate: number;
  average_response_time: number;
  memory_usage: number;
  last_cleared: Date;
}

export interface CacheSettings {
  max_size: number;
  default_ttl: number;
  enable_compression: boolean;
  enable_cdn: boolean;
  cdn_provider: 'cloudflare' | 'aws' | 'azure' | 'custom';
  compression_level: number;
  auto_clear_threshold: number;
}

export interface CacheOperation {
  operation: 'get' | 'set' | 'delete' | 'clear' | 'invalidate';
  key: string;
  success: boolean;
  duration: number;
  timestamp: Date;
  error?: string;
}

export interface CDNConfig {
  provider: 'cloudflare' | 'aws' | 'azure' | 'custom';
  endpoint: string;
  api_key: string;
  zone_id?: string;
  enabled: boolean;
  cache_ttl: number;
  compression_enabled: boolean;
}

export interface PerformanceDashboard {
  real_time_metrics: PerformanceMetrics[];
  cache_performance: CacheStats;
  system_health: {
    memory_usage: number;
    cpu_usage: number;
    disk_usage: number;
    network_latency: number;
  };
  optimization_suggestions: string[];
  last_updated: Date;
}

export interface CacheFilter {
  key_pattern?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
  size_range?: {
    min: number;
    max: number;
  };
  hit_rate_range?: {
    min: number;
    max: number;
  };
}

export interface CacheBulkOperation {
  operation: 'delete' | 'invalidate' | 'compress';
  keys: string[];
  filters?: CacheFilter;
}

export interface CacheOptimization {
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  estimated_improvement: number;
  description: string;
}