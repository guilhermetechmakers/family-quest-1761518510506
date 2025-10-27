import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSupportTickets, useSupportStats, useBulkUpdateTickets } from '@/hooks/useSupport';
import type { SupportTicket, SupportTicketFilters } from '@/types/support';
import { cn } from '@/lib/utils';

interface SupportTicketManagementProps {
  onViewTicket?: (ticket: SupportTicket) => void;
  onCreateTicket?: () => void;
}

export function SupportTicketManagement({ onViewTicket, onCreateTicket }: SupportTicketManagementProps) {
  const [filters, setFilters] = useState<SupportTicketFilters>({});
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tickets, isLoading } = useSupportTickets(filters);
  const { data: stats } = useSupportStats();
  const bulkUpdateMutation = useBulkUpdateTickets();

  const handleFilterChange = (key: keyof SupportTicketFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery || undefined,
    }));
  };

  const handleSelectTicket = (ticketId: string, selected: boolean) => {
    setSelectedTickets(prev => 
      selected 
        ? [...prev, ticketId]
        : prev.filter(id => id !== ticketId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedTickets(tickets?.map(t => t.id) || []);
    } else {
      setSelectedTickets([]);
    }
  };

  const handleBulkStatusUpdate = (status: SupportTicket['status']) => {
    if (selectedTickets.length === 0) return;
    
    bulkUpdateMutation.mutate({
      ticketIds: selectedTickets,
      updates: { status },
    });
    setSelectedTickets([]);
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Support Tickets</h2>
          <p className="text-text-secondary">Manage and respond to user support requests</p>
        </div>
        <Button onClick={onCreateTicket} className="bg-mint-green hover:bg-mint-green/90 text-text-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Tickets"
            value={stats.total_tickets}
            icon={MessageSquare}
            color="bg-mint-green"
          />
          <StatCard
            title="Open"
            value={stats.open_tickets}
            icon={AlertCircle}
            color="bg-red-100 text-red-800"
          />
          <StatCard
            title="In Progress"
            value={stats.in_progress_tickets}
            icon={Clock}
            color="bg-yellow-100 text-yellow-800"
          />
          <StatCard
            title="Resolved"
            value={stats.resolved_tickets}
            icon={CheckCircle}
            color="bg-green-100 text-green-800"
          />
        </div>
      )}

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedTickets.length > 0 && (
        <Card className="p-4 bg-mint-tint border-mint-green">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedTickets.length} ticket(s) selected
            </span>
            <div className="flex gap-2">
              <Select onValueChange={handleBulkStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedTickets([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tickets Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-lavender-bg border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedTickets.length === tickets?.length && tickets.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">Ticket</th>
                <th className="p-4 text-left font-semibold text-text-primary">User</th>
                <th className="p-4 text-left font-semibold text-text-primary">Status</th>
                <th className="p-4 text-left font-semibold text-text-primary">Priority</th>
                <th className="p-4 text-left font-semibold text-text-primary">Category</th>
                <th className="p-4 text-left font-semibold text-text-primary">Created</th>
                <th className="p-4 text-left font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets?.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-pale-lavender-bg/50 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-text-primary mb-1">
                          {ticket.subject}
                        </div>
                        <div className="text-sm text-text-secondary line-clamp-2">
                          {ticket.description}
                        </div>
                        {ticket.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {ticket.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {ticket.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{ticket.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-mint-green flex items-center justify-center">
                          <User className="h-4 w-4 text-text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary text-sm">
                            {ticket.user_name}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {ticket.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(ticket.status))}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("text-white", getPriorityColor(ticket.priority))}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-text-secondary capitalize">
                        {ticket.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-text-secondary">
                        <Calendar className="h-4 w-4" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewTicket?.(ticket)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Assign to Me
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Close Ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
        <div className={cn("p-3 rounded-2xl", color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}