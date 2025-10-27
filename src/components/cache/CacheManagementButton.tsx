import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CacheManagementDialog } from './CacheManagementDialog';
import { useClientCache, usePerformanceMonitoring } from '@/hooks/useCache';
import { Settings, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CacheManagementButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showStats?: boolean;
  className?: string;
}

export function CacheManagementButton({ 
  variant = 'outline', 
  size = 'default',
  showStats = true,
  className 
}: CacheManagementButtonProps) {
  const { getStats } = useClientCache();
  const { getCacheHitRate, getAverageResponseTime } = usePerformanceMonitoring();

  const stats = getStats();
  const hitRate = getCacheHitRate();
  const avgResponseTime = getAverageResponseTime();

  const getPerformanceColor = () => {
    if (hitRate >= 0.8 && avgResponseTime <= 100) return 'text-green-500';
    if (hitRate >= 0.6 && avgResponseTime <= 200) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <CacheManagementDialog>
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative group transition-all duration-200 hover:scale-105",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Cache</span>
          {showStats && (
            <div className="flex items-center gap-1">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs px-1.5 py-0.5",
                  stats.size > stats.maxSize * 0.8 ? "bg-pastel-yellow text-text-primary" :
                  stats.size > stats.maxSize * 0.6 ? "bg-light-pink text-text-primary" :
                  "bg-mint-tint text-text-primary"
                )}
              >
                {stats.size}
              </Badge>
              <div className={cn("w-2 h-2 rounded-full", getPerformanceColor())} />
            </div>
          )}
        </div>
        
        {/* Hover tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-50"
        >
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span>Hit Rate: {(hitRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3" />
              <span>Avg: {avgResponseTime.toFixed(0)}ms</span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
        </motion.div>
      </Button>
    </CacheManagementDialog>
  );
}