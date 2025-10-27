import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoalDashboard } from '@/components/goal-dashboard/GoalDashboard';
import { GoalDetail } from '@/components/goal-dashboard/GoalDetail';
import { GoalEdit } from '@/components/goal-dashboard/GoalEdit';
import { GoalTemplates } from '@/components/goal-dashboard/GoalTemplates';
import { GoalWizard } from '@/components/goal-wizard/GoalWizard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';

type ViewMode = 'dashboard' | 'detail' | 'edit' | 'create' | 'templates';


export function GoalManagement() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  const handleCreateGoal = () => {
    setCurrentView('create');
  };

  const handleViewGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentView('detail');
  };

  const handleEditGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setCurrentView('edit');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedGoalId(null);
  };

  const handleShowTemplates = () => {
    setCurrentView('templates');
  };

  const handleSelectTemplate = () => {
    // Convert template to goal creation data
    // This would typically populate the goal wizard with template data
    setCurrentView('create');
  };

  const handleGoalUpdated = () => {
    setCurrentView('detail');
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <GoalDashboard
              onCreateGoal={handleCreateGoal}
              onViewGoal={handleViewGoal}
              onEditGoal={handleEditGoal}
            />
          </motion.div>
        )}

        {currentView === 'detail' && selectedGoalId && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GoalDetail
              goalId={selectedGoalId}
              onBack={handleBackToDashboard}
              onEdit={() => setCurrentView('edit')}
            />
          </motion.div>
        )}

        {currentView === 'edit' && selectedGoalId && (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GoalEdit
              goalId={selectedGoalId}
              onBack={() => setCurrentView('detail')}
              onSave={handleGoalUpdated}
            />
          </motion.div>
        )}

        {currentView === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-h-screen bg-primary-bg">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      variant="ghost"
                      onClick={handleBackToDashboard}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Goals
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleShowTemplates}
                        className="h-10"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
                
                <GoalWizard />
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'templates' && (
          <motion.div
            key="templates"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <GoalTemplates
              onSelectTemplate={handleSelectTemplate}
              onClose={handleBackToDashboard}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
