import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ProgressSkeletonProps {
  type?: 'card' | 'bar' | 'chart' | 'list';
  className?: string;
}

export function ProgressSkeleton({ type = 'card', className }: ProgressSkeletonProps) {
  const shimmer = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  };

  if (type === 'bar') {
    return (
      <div className={className}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"
              style={shimmer}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-64 bg-gray-100 rounded-lg relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300"
              style={shimmer}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
            <div className="text-center">
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (type === 'list') {
    return (
      <div className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-3 bg-gray-200 rounded"></div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Default card skeleton
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"
              style={shimmer}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </Card>
  );
}