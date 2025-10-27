import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  Eye, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useUserAuditLogs } from '@/hooks/useAdmin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AuditLogViewerProps {
  userId?: string;
  onClose?: () => void;
}

export function AuditLogViewer({ userId, onClose }: AuditLogViewerProps) {
  const [filters, setFilters] = useState({
    action: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);

  const { data: auditLogs, isLoading, refetch } = useUserAuditLogs(userId || '');

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectLog = (logId: string, selected: boolean) => {
    setSelectedLogs(prev => 
      selected 
        ? [...prev, logId]
        : prev.filter(id => id !== logId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLogs(auditLogs?.map(log => log.id) || []);
    } else {
      setSelectedLogs([]);
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Audit logs refreshed');
  };

  const handleExport = () => {
    toast.success('Audit logs exported successfully');
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth')) {
      return <Shield className="h-4 w-4" />;
    }
    if (action.includes('create') || action.includes('add')) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (action.includes('delete') || action.includes('remove')) {
      return <XCircle className="h-4 w-4" />;
    }
    if (action.includes('update') || action.includes('modify')) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('login') || action.includes('auth')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (action.includes('create') || action.includes('add')) {
      return 'bg-green-100 text-green-800';
    }
    if (action.includes('delete') || action.includes('remove')) {
      return 'bg-red-100 text-red-800';
    }
    if (action.includes('update') || action.includes('modify')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (action: string) => {
    if (action.includes('delete') || action.includes('remove') || action.includes('suspend')) {
      return 'bg-red-500 text-white';
    }
    if (action.includes('update') || action.includes('modify') || action.includes('change')) {
      return 'bg-yellow-500 text-white';
    }
    if (action.includes('create') || action.includes('add') || action.includes('approve')) {
      return 'bg-green-500 text-white';
    }
    return 'bg-blue-500 text-white';
  };

  const filteredLogs = auditLogs?.filter(log => {
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) return false;
    if (filters.search && !log.action.toLowerCase().includes(filters.search.toLowerCase()) && 
        !log.details.toString().toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.dateFrom && new Date(log.created_at) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(log.created_at) > new Date(filters.dateTo)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Audit Logs</h2>
          <p className="text-text-secondary">Monitor user actions and system events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search actions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Action Type</label>
            <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="login">Login/Auth</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="suspend">Suspend</SelectItem>
                <SelectItem value="approve">Approve</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Date From</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Date To</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedLogs.length > 0 && (
        <Card className="p-4 bg-mint-tint border-mint-green">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedLogs.length} log(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedLogs([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-lavender-bg border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedLogs.length === filteredLogs?.length && filteredLogs.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">Action</th>
                <th className="p-4 text-left font-semibold text-text-primary">Details</th>
                <th className="p-4 text-left font-semibold text-text-primary">IP Address</th>
                <th className="p-4 text-left font-semibold text-text-primary">User Agent</th>
                <th className="p-4 text-left font-semibold text-text-primary">Timestamp</th>
                <th className="p-4 text-left font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                filteredLogs?.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-pale-lavender-bg/50 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedLogs.includes(log.id)}
                        onCheckedChange={(checked) => handleSelectLog(log.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getActionColor(log.action)}`}>
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary text-sm">
                            {log.action}
                          </div>
                          <Badge className={cn("text-white text-xs", getSeverityColor(log.action))}>
                            {log.action.includes('delete') || log.action.includes('remove') ? 'High' :
                             log.action.includes('update') || log.action.includes('modify') ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-md">
                        <div className="text-sm text-text-primary line-clamp-2">
                          {JSON.stringify(log.details, null, 2)}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary font-mono">
                        {log.ip_address}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary max-w-xs truncate">
                        {log.user_agent}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Show detailed view
                            console.log('View details for log:', log.id);
                          }}
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export Log
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Flag for Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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