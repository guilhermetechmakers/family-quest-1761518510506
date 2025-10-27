import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  User,
  Target,
  Receipt
} from 'lucide-react';
import type { Contribution } from '@/types/contribution';
import { format } from 'date-fns';

interface TransactionHistoryProps {
  contributions: Contribution[];
  isLoading: boolean;
}

export function TransactionHistory({ contributions, isLoading }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-mint-green text-text-primary';
      case 'approved':
        return 'bg-mint-green text-text-primary';
      case 'pending':
        return 'bg-pastel-yellow text-text-primary';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monetary':
        return <DollarSign className="h-4 w-4" />;
      case 'manual':
        return <CheckCircle className="h-4 w-4" />;
      case 'chore':
        return <Target className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredContributions = contributions
    .filter(contribution => {
      const matchesSearch = contribution.goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contribution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contribution.contributor.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || contribution.status === statusFilter;
      const matchesType = typeFilter === 'all' || contribution.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/PDF
    console.log('Export feature coming soon!');
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-tertiary" />
              <Input
                placeholder="Search contributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="monetary">Monetary</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="chore">Chore</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="amount-desc">Highest Amount</SelectItem>
                <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Contributions List */}
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Transaction History
          </h2>
          <p className="text-text-secondary">
            {filteredContributions.length} contribution{filteredContributions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="space-y-4">
          {filteredContributions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                No Contributions Found
              </h3>
              <p className="text-text-secondary">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Start contributing to your family goals!'}
              </p>
            </div>
          ) : (
            filteredContributions.map((contribution, index) => (
              <motion.div
                key={contribution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-2xl border border-gray-200 hover:border-mint-green hover:bg-mint-tint/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-mint-tint rounded-full">
                      {getTypeIcon(contribution.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-text-primary truncate">
                          {contribution.goal.title}
                        </h3>
                        <Badge className={getStatusColor(contribution.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(contribution.status)}
                            {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                        {contribution.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-text-tertiary">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {contribution.contributor.full_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(contribution.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${contribution.amount} {contribution.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-text-primary">
                        ${contribution.amount}
                      </p>
                      <p className="text-sm text-text-tertiary">
                        {contribution.currency}
                      </p>
                    </div>
                    
                    {contribution.receipt_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => window.open(contribution.receipt_url, '_blank')}
                      >
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}