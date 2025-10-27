import { motion } from 'framer-motion';
import { PerformanceSettingsForm } from '@/components/cache/PerformanceSettingsForm';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';

export function CacheManagementPage() {
  return (
    <ResponsiveLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary">Cache Management</h1>
          <p className="text-text-secondary">
            Configure and manage your application's caching strategy and performance settings
          </p>
        </div>
        
        <PerformanceSettingsForm />
      </motion.div>
    </ResponsiveLayout>
  );
}