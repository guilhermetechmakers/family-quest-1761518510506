import { motion } from 'framer-motion';
import { PerformanceDashboard } from '@/components/cache/PerformanceDashboard';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

export function PerformancePage() {
  return (
    <ResponsiveLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">Performance Dashboard</h1>
          <p className="text-text-secondary">
            Monitor and optimize your application's performance and caching strategy
          </p>
        </div>
        
        <PerformanceDashboard />
      </motion.div>
    </ResponsiveLayout>
  );
}