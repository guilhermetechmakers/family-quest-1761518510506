import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  TrendingUp, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TransactionFilters } from '@/components/transaction-history/TransactionFilters';
import { TransactionTable } from '@/components/transaction-history/TransactionTable';
import { TransactionStats } from '@/components/transaction-history/TransactionStats';
import { ExportModal } from '@/components/transaction-history/ExportModal';
import { DisputeModal } from '@/components/transaction-history/DisputeModal';
import { useTransactions } from '@/hooks/useTransactions';
import type { TransactionHistoryFilters, TransactionHistory } from '@/types/transaction';

export const TransactionHistoryPage: React.FC = () => {
  const [filters, setFilters] = useState<TransactionHistoryFilters>({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistory | null>(null);

  const { 
    data: transactions = [], 
    isLoading, 
    error, 
    refetch 
  } = useTransactions(filters);

  const handleFiltersChange = (newFilters: TransactionHistoryFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleDisputeTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowDisputeModal(true);
    }
  };

  const handleCloseDisputeModal = () => {
    setShowDisputeModal(false);
    setSelectedTransaction(null);
  };

  // Mock user role - in a real app this would come from auth context
  const userRole: 'parent' | 'child' | 'guest' = 'parent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground mt-1">
                View and manage all your family's financial transactions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              onClick={() => setShowExportModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Transactions</h3>
                  <p className="text-sm text-red-600">
                    There was a problem loading your transaction history. Please try again.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TransactionStats filters={filters} />
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </motion.div>

        {/* Results Summary */}
        {!isLoading && transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-mint-green" />
                  <span className="text-sm font-medium">
                    Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Total: ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
                  <span>Avg: ${(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TransactionTable
            transactions={transactions}
            onDisputeTransaction={handleDisputeTransaction}
            userRole={userRole}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Empty State */}
        {!isLoading && transactions.length === 0 && Object.keys(filters).length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <Card className="p-12 max-w-md mx-auto">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Transactions Yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start contributing to your family goals to see transactions here.
                  </p>
                  <Button className="btn-primary">
                    View Goals
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Modals */}
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          currentFilters={filters}
        />

        <DisputeModal
          isOpen={showDisputeModal}
          onClose={handleCloseDisputeModal}
          transaction={selectedTransaction}
        />
      </div>
    </motion.div>
  );
};