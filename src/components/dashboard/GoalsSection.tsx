import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { GoalCard } from './GoalCard';
import type { Goal } from '@/types/goal';

interface GoalsSectionProps {
  goals: Goal[];
  isLoading: boolean;
  onQuickContribute: (goalId: string) => void;
}

export function GoalsSection({ goals, isLoading, onQuickContribute }: GoalsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Goals', count: goals.length },
    { value: 'active', label: 'Active', count: goals.filter(g => g.status === 'active').length },
    { value: 'completed', label: 'Completed', count: goals.filter(g => g.status === 'completed').length },
    { value: 'paused', label: 'Paused', count: goals.filter(g => g.status === 'paused').length },
  ];

  return (
    <div className="lg:col-span-2">
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-xl font-semibold text-text-primary">Your Goals</h3>
        <Link to="/goals/create">
          <Button className="bg-mint-green hover:bg-light-mint text-text-primary font-medium px-6 py-3 rounded-full transition-all duration-200 hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </Link>
      </motion.div>

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <Input
            type="text"
            placeholder="Search goals..."
            className="pl-10 pr-4 py-3 border-gray-300 rounded-2xl focus:ring-2 focus:ring-mint-green focus:border-transparent bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={filterStatus === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(option.value as any)}
              className={`capitalize transition-all duration-200 ${
                filterStatus === option.value
                  ? 'bg-mint-green text-text-primary border-mint-green'
                  : 'border-gray-300 text-text-secondary hover:bg-mint-tint hover:text-text-primary'
              }`}
            >
              {option.label}
              {option.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {option.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Goals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : filteredGoals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-mint-tint rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-mint-green" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchQuery ? 'No goals found' : 'No goals yet'}
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                  : 'Create your first family goal to get started on your journey together!'
                }
              </p>
              {!searchQuery && (
                <Link to="/goals/create">
                  <Button className="bg-mint-green hover:bg-light-mint text-text-primary font-medium px-6 py-3 rounded-full transition-all duration-200 hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </Button>
                </Link>
              )}
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            {filteredGoals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                index={index}
                onQuickContribute={onQuickContribute}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}