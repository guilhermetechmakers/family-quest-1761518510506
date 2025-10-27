import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGoals, useDeleteGoal } from '@/hooks/useGoals';
import { GoalCard } from './GoalCard';
import { GoalFilters } from './GoalFilters';
import { CreateGoalButton } from './CreateGoalButton';
import { 
  Search, 
  Filter, 
  Target, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Grid3X3,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import type { GoalStatus, GoalType } from '@/types/goal';

interface GoalDashboardProps {
  onCreateGoal?: () => void;
  onViewGoal?: (goalId: string) => void;
  onEditGoal?: (goalId: string) => void;
}

export function GoalDashboard({ onCreateGoal, onViewGoal, onEditGoal }: GoalDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<GoalType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'progress' | 'target'>('created');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const { data: goals = [], isLoading, error } = useGoals();
  const deleteGoal = useDeleteGoal();

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    let filtered = goals;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(goal => 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(goal => goal.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(goal => goal.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        case 'progress':
          const aProgress = (a.current_value / a.target_value) * 100;
          const bProgress = (b.current_value / b.target_value) * 100;
          comparison = aProgress - bProgress;
          break;
        case 'target':
          comparison = a.target_value - b.target_value;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [goals, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === 'active').length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const totalValue = goals.reduce((sum, goal) => sum + goal.target_value, 0);
    const currentValue = goals.reduce((sum, goal) => sum + goal.current_value, 0);
    const overallProgress = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      totalValue,
      currentValue,
      overallProgress
    };
  }, [goals]);

  const handleDeleteGoal = async () => {
    if (deleteGoalId) {
      try {
        await deleteGoal.mutateAsync(deleteGoalId);
        setDeleteGoalId(null);
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const goalTypes: { value: GoalType | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'All Types', icon: '🎯' },
    { value: 'vacation', label: 'Vacation', icon: '🏖️' },
    { value: 'purchase', label: 'Purchase', icon: '🛍️' },
    { value: 'home_upgrade', label: 'Home Upgrade', icon: '🏠' },
    { value: 'pet', label: 'Pet', icon: '🐕' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '⭐' },
  ];

  const statusOptions: { value: GoalStatus | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Status', color: 'bg-gray-100' },
    { value: 'draft', label: 'Draft', color: 'bg-gray-200' },
    { value: 'active', label: 'Active', color: 'bg-mint-green' },
    { value: 'paused', label: 'Paused', color: 'bg-pastel-yellow' },
    { value: 'completed', label: 'Completed', color: 'bg-light-mint' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-light-pink' },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-light-pink rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-8 w-8 text-text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Unable to Load Goals</h2>
          <p className="text-text-secondary mb-4">
            There was an error loading your goals. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">Family Goals</h1>
                <p className="text-text-secondary text-lg">
                  Track and achieve your family's dreams together
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <CreateGoalButton onCreateGoal={onCreateGoal} />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Total Goals</p>
                      <p className="text-2xl font-bold text-text-primary">{stats.totalGoals}</p>
                    </div>
                    <div className="w-12 h-12 bg-mint-green rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-text-primary" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Active Goals</p>
                      <p className="text-2xl font-bold text-text-primary">{stats.activeGoals}</p>
                    </div>
                    <div className="w-12 h-12 bg-pale-lavender rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-text-primary" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Completed</p>
                      <p className="text-2xl font-bold text-text-primary">{stats.completedGoals}</p>
                    </div>
                    <div className="w-12 h-12 bg-light-mint rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-text-primary" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 bg-white shadow-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">Total Progress</p>
                      <p className="text-2xl font-bold text-text-primary">
                        {Math.round(stats.overallProgress)}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-pastel-yellow rounded-full flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-text-primary" />
                    </div>
                  </div>
                  <Progress value={stats.overallProgress} className="mt-2" />
                </Card>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <Card className="p-6 bg-white shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                    <Input
                      placeholder="Search goals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>

                  {/* Quick Filters */}
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                      <SelectTrigger className="w-40 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${option.color}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                      <SelectTrigger className="w-40 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goalTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-32 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Created</SelectItem>
                      <SelectItem value="updated">Updated</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                      <SelectItem value="target">Target</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="h-12"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <GoalFilters
                      onFilterChange={(filters) => {
                        // Handle advanced filters
                        console.log('Advanced filters:', filters);
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Goals Grid/List */}
          <div className="mb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 bg-white shadow-card">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : filteredGoals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-pale-lavender rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-12 w-12 text-text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'No goals match your filters' 
                    : 'No goals yet'
                  }
                </h3>
                <p className="text-text-secondary mb-6">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Create your first family goal to get started on your journey together.'
                  }
                </p>
                {(!searchQuery && statusFilter === 'all' && typeFilter === 'all') && (
                  <CreateGoalButton onCreateGoal={onCreateGoal} />
                )}
              </motion.div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                <AnimatePresence>
                  {filteredGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <GoalCard
                        goal={goal}
                        viewMode={viewMode}
                        onView={() => onViewGoal?.(goal.id)}
                        onEdit={() => onEditGoal?.(goal.id)}
                        onDelete={() => setDeleteGoalId(goal.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteGoalId} onOpenChange={() => setDeleteGoalId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-text-primary">
              Delete Goal
            </DialogTitle>
            <DialogDescription className="text-text-secondary">
              Are you sure you want to delete this goal? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteGoalId(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGoal}
              disabled={deleteGoal.isPending}
              className="flex-1"
            >
              {deleteGoal.isPending ? 'Deleting...' : 'Delete Goal'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
