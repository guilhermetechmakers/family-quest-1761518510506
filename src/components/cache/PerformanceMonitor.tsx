import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  HardDrive, 
  TrendingUp, 
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useClientCache, usePerformanceMonitoring } from '@/hooks/useCache';
import { useCacheOptimization } from '@/lib/cache-optimization';
import { cn } from '@/lib/utils';

interface PerformanceMonitorProps {
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function PerformanceMonitor({ 
  compact = false, 
  showDetails = true,
  className 
}: PerformanceMonitorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const { getStats } = useClientCache();
  const { getCacheHitRate, getAverageResponseTime } = usePerformanceMonitoring();
  const { optimizeCache } = useCacheOptimization();

  const stats = getStats();
  const hitRate = getCacheHitRate();
  const avgResponseTime = getAverageResponseTime();

  // Update timestamp every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getPerformanceStatus = () => {
    if (hitRate >= 0.8 && avgResponseTime <= 100) {
      return { status: 'excellent', color: 'text-green-500', icon: CheckCircle };
    }
    if (hitRate >= 0.6 && avgResponseTime <= 200) {
      return { status: 'good', color: 'text-yellow-500', icon: Activity };
    }
    return { status: 'needs-attention', color: 'text-red-500', icon: AlertTriangle };
  };

  const performanceStatus = getPerformanceStatus();
  const memoryUsage = (stats.size / stats.maxSize) * 100;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn("space-y-2", className)}
      >
        <Card className={cn(
          "card transition-all duration-200 hover:shadow-card-hover",
          compact ? "p-3" : "p-4"
        )}>
          <CardContent className={cn(
            "space-y-3",
            compact ? "p-0" : "p-0"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-mint-green" />
                <span className="font-medium text-text-primary">
                  {compact ? 'Performance' : 'Performance Monitor'}
                </span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    performanceStatus.status === 'excellent' ? "bg-mint-tint text-text-primary" :
                    performanceStatus.status === 'good' ? "bg-pastel-yellow text-text-primary" :
                    "bg-light-pink text-text-primary"
                  )}
                >
                  {performanceStatus.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {!compact && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => optimizeCache()}
                    className="text-xs"
                  >
                    <Zap className="h-3 w-3" />
                    Optimize
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {showDetails && (
              <div className="space-y-3">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Hit Rate</span>
                      <span className="font-medium text-text-primary">
                        {(hitRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={hitRate * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Response Time</span>
                      <span className="font-medium text-text-primary">
                        {avgResponseTime.toFixed(0)}ms
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((500 - avgResponseTime) / 500 * 100, 100)} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary flex items-center gap-1">
                      <HardDrive className="h-3 w-3" />
                      Memory Usage
                    </span>
                    <span className="font-medium text-text-primary">
                      {stats.size} / {stats.maxSize} entries
                    </span>
                  </div>
                  <Progress 
                    value={memoryUsage} 
                    className="h-2"
                  />
                </div>

                {/* Performance Indicators */}
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <performanceStatus.icon className={cn("h-3 w-3", performanceStatus.color)} />
                      <span>Status: {performanceStatus.status}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {!compact && (
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // In a real app, this would navigate to performance dashboard
                        console.log('Navigate to performance dashboard');
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        // In a real app, this would open cache management
                        console.log('Open cache management');
                      }}
                    >
                      Manage Cache
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}