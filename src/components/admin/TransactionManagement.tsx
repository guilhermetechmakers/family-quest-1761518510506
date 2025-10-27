import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  RefreshCw, 
  Calendar,
  User,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAdminTransactions, useRefundTransaction } from '@/hooks/useAdmin';
import type { AdminTransaction, TransactionFilters } from '@/types/admin';
import { toast } from 'sonner';

interface TransactionManagementProps {
  onTransactionSelect?: (transaction: AdminTransaction) => void;
}

export function TransactionManagement({ onTransactionSelect }: TransactionManagementProps) {
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, isLoading } = useAdminTransactions(filters);
  const refundTransaction = useRefundTransaction();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value || undefined }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status as any 
    }));
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ 
      ...prev, 
      type: type === 'all' ? undefined : type as any 
    }));
  };

  const handleRefund = async (transactionId: string) => {
    try {
      await refundTransaction.mutateAsync({ 
        id: transactionId, 
        reason: 'Admin refund' 
      });
      toast.success('Transaction refunded successfully');
    } catch (error) {
      toast.error('Failed to refund transaction');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-mint-green text-text-primary',
      pending: 'bg-pastel-yellow text-text-primary',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100'}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      case 'refunded':
        return RefreshCw;
      default:
        return AlertTriangle;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      contribution: 'bg-blue-100 text-blue-800',
      refund: 'bg-orange-100 text-orange-800',
      fee: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={variants[type as keyof typeof variants] || 'bg-gray-100'}>
        {type}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-20 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Transaction Management</h2>
        
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('completed')}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('failed')}>
                  Failed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('refunded')}>
                  Refunded
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Type
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleTypeFilter('all')}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeFilter('contribution')}>
                  Contribution
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeFilter('refund')}>
                  Refund
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTypeFilter('fee')}>
                  Fee
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="space-y-3">
        {transactions?.map((transaction, index) => {
          const StatusIcon = getStatusIcon(transaction.status);
          
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-2xl ${
                  transaction.status === 'completed' ? 'bg-mint-green' :
                  transaction.status === 'pending' ? 'bg-pastel-yellow' :
                  transaction.status === 'failed' ? 'bg-red-100' :
                  'bg-gray-100'
                }`}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-text-primary truncate">
                      {transaction.goal_title}
                    </h3>
                    {getStatusBadge(transaction.status)}
                    {getTypeBadge(transaction.type)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span className="truncate">{transaction.user_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span className="truncate">{transaction.goal_title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                    </div>
                    {transaction.error_message && (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="truncate">{transaction.error_message}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-text-primary">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {transaction.payment_method}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTransactionSelect?.(transaction)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onTransactionSelect?.(transaction)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {transaction.status === 'completed' && (
                        <DropdownMenuItem 
                          onClick={() => handleRefund(transaction.id)}
                          className="text-red-600"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refund Transaction
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {transactions?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary">
            <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No transactions found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}