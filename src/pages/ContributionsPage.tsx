import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CheckCircle, Clock, Receipt, TrendingUp } from 'lucide-react';
import { ContributionForm } from '@/components/contribution-form/ContributionForm';
import { TransactionHistory } from '@/components/contributions/TransactionHistory';
import { ApprovalModal } from '@/components/contributions/ApprovalModal';
import { useContributionsByUser, useContributionStats } from '@/hooks/useContributions';

export function ContributionsPage() {
  const [activeTab, setActiveTab] = useState('contribute');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [pendingContributionId, setPendingContributionId] = useState<string | null>(null);

  const { data: contributions = [], isLoading: contributionsLoading } = useContributionsByUser();
  const { data: stats, isLoading: statsLoading } = useContributionStats();

  // Mock goals data - in a real app this would come from a goals API
  const mockGoals = [
    { id: '1', title: 'Family Vacation to Hawaii', target: 5000, current: 3200, currency: 'USD' },
    { id: '2', title: 'New Family Car', target: 25000, current: 18500, currency: 'USD' },
    { id: '3', title: 'Home Renovation', target: 15000, current: 8500, currency: 'USD' },
  ];

  const handleContributionSuccess = () => {
    setSelectedGoalId(null);
    setShowApprovalModal(true);
  };

  const handleApprovalComplete = () => {
    setShowApprovalModal(false);
    setPendingContributionId(null);
  };

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            Contributions
          </h1>
          <p className="text-text-secondary text-lg">
            Add monetary or manual contributions to help reach your family goals
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 bg-mint-tint border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Total Contributions</p>
                <p className="text-2xl font-semibold text-text-primary">
                  {statsLoading ? '...' : stats?.total_contributions || 0}
                </p>
              </div>
              <div className="p-3 bg-mint-green rounded-full">
                <TrendingUp className="h-6 w-6 text-text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-pale-lavender-bg border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                <p className="text-2xl font-semibold text-text-primary">
                  ${statsLoading ? '...' : (stats?.total_amount || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-pale-lavender rounded-full">
                <DollarSign className="h-6 w-6 text-text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-light-pink border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Pending Approval</p>
                <p className="text-2xl font-semibold text-text-primary">
                  {contributions.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-light-pink rounded-full">
                <Clock className="h-6 w-6 text-text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-pastel-yellow border-0 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary mb-1">Completed</p>
                <p className="text-2xl font-semibold text-text-primary">
                  {contributions.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-pastel-yellow rounded-full">
                <CheckCircle className="h-6 w-6 text-text-primary" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-card">
              <TabsTrigger 
                value="contribute" 
                className="flex items-center gap-2 data-[state=active]:bg-mint-green data-[state=active]:text-text-primary"
              >
                <DollarSign className="h-4 w-4" />
                Contribute
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 data-[state=active]:bg-pale-lavender data-[state=active]:text-text-primary"
              >
                <Receipt className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="flex items-center gap-2 data-[state=active]:bg-light-pink data-[state=active]:text-text-primary"
              >
                <Clock className="h-4 w-4" />
                Approvals
              </TabsTrigger>
            </TabsList>

            {/* Contribute Tab */}
            <TabsContent value="contribute" className="space-y-6">
              <Card className="p-6 bg-white shadow-card border-0">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    Select a Goal to Contribute To
                  </h2>
                  <p className="text-text-secondary">
                    Choose which family goal you'd like to contribute to
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {mockGoals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedGoalId === goal.id
                          ? 'border-mint-green bg-mint-tint'
                          : 'border-gray-200 bg-white hover:border-mint-green hover:bg-mint-tint/50'
                      }`}
                      onClick={() => setSelectedGoalId(goal.id)}
                    >
                      <h3 className="font-semibold text-text-primary mb-2">{goal.title}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Progress</span>
                          <span className="font-medium text-text-primary">
                            ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-mint-green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-tertiary">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {selectedGoalId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ContributionForm
                      goalId={selectedGoalId}
                      goalTitle={mockGoals.find(g => g.id === selectedGoalId)?.title || ''}
                      onSuccess={handleContributionSuccess}
                      onCancel={() => setSelectedGoalId(null)}
                    />
                  </motion.div>
                )}
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <TransactionHistory contributions={contributions} isLoading={contributionsLoading} />
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals">
              <Card className="p-6 bg-white shadow-card border-0">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary mb-2">
                    Pending Approvals
                  </h2>
                  <p className="text-text-secondary">
                    Review and approve contributions that require parental consent
                  </p>
                </div>

                <div className="space-y-4">
                  {contributions
                    .filter(c => c.status === 'pending')
                    .map((contribution) => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-light-pink/30 rounded-2xl border border-light-pink"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary">
                              {contribution.goal.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-2">
                              {contribution.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-text-secondary">
                                Amount: ${contribution.amount} {contribution.currency}
                              </span>
                              <span className="text-text-secondary">
                                Type: {contribution.type}
                              </span>
                              <span className="text-text-secondary">
                                By: {contribution.contributor.full_name}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-mint-green hover:bg-light-mint text-text-primary"
                              onClick={() => {
                                setPendingContributionId(contribution.id);
                                setShowApprovalModal(true);
                              }}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                  {contributions.filter(c => c.status === 'pending').length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-mint-green mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        No Pending Approvals
                      </h3>
                      <p className="text-text-secondary">
                        All contributions have been reviewed and approved
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Approval Modal */}
        {showApprovalModal && pendingContributionId && (
          <ApprovalModal
            contributionId={pendingContributionId}
            onClose={() => setShowApprovalModal(false)}
            onComplete={handleApprovalComplete}
          />
        )}
      </div>
    </div>
  );
}