import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Send, 
  Edit, 
  Trash2, 
  Eye, 
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download
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
import { useBroadcastMessages, useSendBroadcastMessage, useDeleteBroadcastMessage } from '@/hooks/useAdmin';
import { CreateBroadcastMessageModal } from './CreateBroadcastMessageModal';
import { BroadcastMessageDetail } from './BroadcastMessageDetail';
import type { BroadcastMessage } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BroadcastMessagesManagementProps {
  onViewMessage?: (message: BroadcastMessage) => void;
  onCreateMessage?: () => void;
}

export function BroadcastMessagesManagement({ }: BroadcastMessagesManagementProps) {
  const [selectedMessage, setSelectedMessage] = useState<BroadcastMessage | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    audience: '',
    search: ''
  });
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const { data: messages, isLoading } = useBroadcastMessages();
  const sendMessageMutation = useSendBroadcastMessage();
  const deleteMessageMutation = useDeleteBroadcastMessage();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectMessage = (messageId: string, selected: boolean) => {
    setSelectedMessages(prev => 
      selected 
        ? [...prev, messageId]
        : prev.filter(id => id !== messageId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedMessages(messages?.map(m => m.id) || []);
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSendMessage = async (messageId: string) => {
    try {
      await sendMessageMutation.mutateAsync(messageId);
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageMutation.mutateAsync(messageId);
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusIcon = (status: BroadcastMessage['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'sent':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: BroadcastMessage['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getAudienceColor = (audience: BroadcastMessage['target_audience']) => {
    switch (audience) {
      case 'all':
        return 'bg-mint-green text-text-primary';
      case 'parents':
        return 'bg-pale-lavender text-text-primary';
      case 'children':
        return 'bg-light-pink text-text-primary';
      case 'guests':
        return 'bg-pastel-yellow text-text-primary';
      case 'specific_families':
        return 'bg-light-mint text-text-primary';
    }
  };

  const filteredMessages = messages?.filter(message => {
    if (filters.status && message.status !== filters.status) return false;
    if (filters.audience && message.target_audience !== filters.audience) return false;
    if (filters.search && !message.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !message.content.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Broadcast Messages</h2>
          <p className="text-text-secondary">Create and manage platform-wide announcements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-mint-green hover:bg-mint-green/90 text-text-primary">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search messages..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.audience} onValueChange={(value) => handleFilterChange('audience', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="parents">Parents</SelectItem>
                <SelectItem value="children">Children</SelectItem>
                <SelectItem value="guests">Guests</SelectItem>
                <SelectItem value="specific_families">Specific Families</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedMessages.length > 0 && (
        <Card className="p-4 bg-mint-tint border-mint-green">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedMessages.length} message(s) selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                <Send className="h-4 w-4 mr-2" />
                Send All
              </Button>
              <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedMessages([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Messages List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-lavender-bg border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedMessages.length === filteredMessages?.length && filteredMessages.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">Message</th>
                <th className="p-4 text-left font-semibold text-text-primary">Audience</th>
                <th className="p-4 text-left font-semibold text-text-primary">Status</th>
                <th className="p-4 text-left font-semibold text-text-primary">Created</th>
                <th className="p-4 text-left font-semibold text-text-primary">Scheduled</th>
                <th className="p-4 text-left font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    Loading messages...
                  </td>
                </tr>
              ) : filteredMessages?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    No messages found
                  </td>
                </tr>
              ) : (
                filteredMessages?.map((message) => (
                  <motion.tr
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-border hover:bg-pale-lavender-bg/50 transition-colors"
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedMessages.includes(message.id)}
                        onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="max-w-md">
                        <div className="font-medium text-text-primary mb-1">
                          {message.title}
                        </div>
                        <div className="text-sm text-text-secondary line-clamp-2">
                          {message.content}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("text-white", getAudienceColor(message.target_audience))}>
                        {message.target_audience.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(message.status))}>
                        {getStatusIcon(message.status)}
                        {message.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary">
                        {new Date(message.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-text-secondary">
                        {message.scheduled_at ? new Date(message.scheduled_at).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMessage(message)}
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
                            <DropdownMenuItem onClick={() => setSelectedMessage(message)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {message.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleSendMessage(message.id)}>
                                <Send className="h-4 w-4 mr-2" />
                                Send Now
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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

      {/* Modals */}
      {showCreateModal && (
        <CreateBroadcastMessageModal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {selectedMessage && (
        <BroadcastMessageDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
}