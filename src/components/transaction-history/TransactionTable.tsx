import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  DollarSign,
  User,
  Target,
  MoreHorizontal
} from 'lucide-react';
import type { TransactionHistory, TransactionType, TransactionStatus } from '@/types/transaction';

interface TransactionTableProps {
  transactions: TransactionHistory[];
  onDisputeTransaction: (transactionId: string) => void;
  userRole: 'parent' | 'child' | 'guest';
  isLoading?: boolean;
}

const getStatusIcon = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4 text-gray-500" />;
    case 'disputed':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status: TransactionStatus) => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'pending':
      return 'status-upcoming';
    case 'failed':
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'disputed':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeIcon = (type: TransactionType) => {
  switch (type) {
    case 'contribution':
    case 'payment':
      return <DollarSign className="h-4 w-4" />;
    case 'refund':
      return <DollarSign className="h-4 w-4 text-red-500" />;
    case 'adjustment':
      return <Target className="h-4 w-4" />;
    case 'manual':
      return <User className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy');
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onDisputeTransaction,
  userRole,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No transactions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new transactions.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Contributor</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span className="text-sm">{formatDate(transaction.date)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(transaction.created_at)}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(transaction.type)}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className={`font-semibold ${
                      transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'refund' ? '-' : '+'}
                      {formatAmount(transaction.amount, transaction.currency)}
                    </span>
                    {transaction.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {transaction.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {transaction.contributor.avatar_url ? (
                        <img 
                          src={transaction.contributor.avatar_url} 
                          alt={transaction.contributor.full_name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-mint-green flex items-center justify-center">
                          <User className="h-4 w-4 text-text-primary" />
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {transaction.contributor.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {transaction.contributor.role}
                      </span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {transaction.goal.image_url ? (
                      <img 
                        src={transaction.goal.image_url} 
                        alt={transaction.goal.title}
                        className="h-6 w-6 rounded object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded bg-pale-lavender flex items-center justify-center">
                        <Target className="h-3 w-3 text-text-primary" />
                      </div>
                    )}
                    <span className="text-sm truncate max-w-[150px]">
                      {transaction.goal.title}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction.status)}
                    <Badge className={`status-tag ${getStatusBadgeVariant(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {userRole === 'parent' && transaction.status !== 'disputed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDisputeTransaction(transaction.id)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};