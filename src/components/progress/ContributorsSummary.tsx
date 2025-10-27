import { motion } from 'framer-motion';
import { User, Award, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GoalProgressDetails } from '@/types/progress';

interface ContributorsSummaryProps {
  contributors: GoalProgressDetails['contributors_summary'];
  totalValue: number;
  className?: string;
}

export function ContributorsSummary({ 
  contributors, 
  totalValue,
  className 
}: ContributorsSummaryProps) {
  if (!contributors || contributors.length === 0) {
    return (
      <div className={cn('card p-6 text-center', className)}>
        <Users className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No Contributors Yet</h3>
        <p className="text-text-secondary">
          Invite family members to start contributing to this goal.
        </p>
      </div>
    );
  }

  const topContributor = contributors.reduce((prev, current) => 
    (prev.total_contributed > current.total_contributed) ? prev : current
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('card p-6', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-mint-green" />
          <h3 className="text-lg font-semibold text-text-primary">Contributors</h3>
        </div>
        <span className="text-sm text-text-secondary">
          {contributors.length} member{contributors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contributors list */}
      <div className="space-y-4">
        {contributors.map((contributor, index) => {
          const isTopContributor = contributor.user_id === topContributor.user_id;
          const contributionPercentage = (contributor.total_contributed / totalValue) * 100;
          
          return (
            <motion.div
              key={contributor.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200',
                isTopContributor ? 'bg-mint-tint border border-mint-green' : 'bg-gray-50 hover:bg-gray-100'
              )}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-pale-lavender flex items-center justify-center">
                  {contributor.avatar_url ? (
                    <img 
                      src={contributor.avatar_url} 
                      alt={contributor.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-text-primary" />
                  )}
                </div>
                {isTopContributor && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pastel-yellow rounded-full flex items-center justify-center">
                    <Award className="h-3 w-3 text-text-primary" />
                  </div>
                )}
              </div>

              {/* Contributor info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-text-primary truncate">
                    {contributor.full_name}
                  </p>
                  {isTopContributor && (
                    <span className="text-xs bg-pastel-yellow text-text-primary px-2 py-1 rounded-full font-medium">
                      Top Contributor
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>${contributor.total_contributed.toLocaleString()}</span>
                  <span>{contributor.percentage_of_total.toFixed(1)}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-20">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={cn(
                      'h-2 rounded-full',
                      isTopContributor ? 'bg-mint-green' : 'bg-pale-lavender'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(contributionPercentage, 100)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-mint-green">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-text-secondary">Total Raised</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-pale-lavender">
              {contributors.length}
            </p>
            <p className="text-sm text-text-secondary">Active Contributors</p>
          </div>
        </div>
      </div>

      {/* Top contributor highlight */}
      {topContributor && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-gradient-to-r from-mint-green to-light-mint rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-text-primary" />
            <span className="font-medium text-text-primary">
              🎉 {topContributor.full_name} is leading with ${topContributor.total_contributed.toLocaleString()}!
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}