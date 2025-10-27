import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Flag, 
  User, 
  MessageSquare,
  Image,
  Filter,
  Search,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { useModerationQueue, useModerateContent } from '@/hooks/useAdmin';
import type { ContentModeration, ModerationFilters } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EnhancedModerationQueueProps {
  onContentSelect?: (content: ContentModeration) => void;
}

export function EnhancedModerationQueue({ onContentSelect }: EnhancedModerationQueueProps) {
  const [filters, setFilters] = useState<ModerationFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: moderationQueue, isLoading } = useModerationQueue(filters);
  const moderateContent = useModerateContent();

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchQuery || undefined,
    }));
  };

  const handleFilterChange = (key: keyof ModerationFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSelectItem = (itemId: string, selected: boolean) => {
    setSelectedItems(prev => 
      selected 
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedItems(moderationQueue?.map(item => item.id) || []);
    } else {
      setSelectedItems([]);
    }
  };

  const handleModerate = async (
    id: string, 
    action: 'approve' | 'reject' | 'remove', 
    notes?: string
  ) => {
    try {
      await moderateContent.mutateAsync({ id, action, notes });
      toast.success(`Content ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} content`);
    }
  };

  const handleBulkModerate = async (action: 'approve' | 'reject' | 'remove') => {
    if (selectedItems.length === 0) return;
    
    try {
      await Promise.all(
        selectedItems.map(id => moderateContent.mutateAsync({ id, action }))
      );
      toast.success(`${selectedItems.length} items ${action}d successfully`);
      setSelectedItems([]);
    } catch (error) {
      toast.error(`Failed to ${action} items`);
    }
  };

  const getStatusIcon = (status: ContentModeration['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'removed':
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ContentModeration['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'removed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
        return MessageSquare;
      case 'comment':
        return MessageSquare;
      case 'media':
        return Image;
      default:
        return Flag;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-mint-green';
      case 'comment':
        return 'bg-pale-lavender';
      case 'media':
        return 'bg-light-pink';
      default:
        return 'bg-gray-100';
    }
  };

  const getPriorityColor = (flagCount: number) => {
    if (flagCount >= 5) return 'bg-red-500 text-white';
    if (flagCount >= 3) return 'bg-orange-500 text-white';
    if (flagCount >= 1) return 'bg-yellow-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Content Moderation</h2>
          <p className="text-text-secondary">Review and moderate flagged content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="removed">Removed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Content Type</label>
              <Select value={filters.content_type} onValueChange={(value) => handleFilterChange('content_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Min Flags</label>
              <Input
                type="number"
                value={filters.flag_count_min}
                onChange={(e) => handleFilterChange('flag_count_min', e.target.value ? e.target.value : '')}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date From</label>
              <Input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Search and Quick Actions */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Search content, author, or flags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Bulk Actions
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="p-4 bg-mint-tint border-mint-green">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedItems.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleBulkModerate('approve')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve All
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkModerate('reject')}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkModerate('remove')}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Moderation Queue */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pale-lavender-bg border-b border-border">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedItems.length === moderationQueue?.length && moderationQueue.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">Content</th>
                <th className="p-4 text-left font-semibold text-text-primary">Author</th>
                <th className="p-4 text-left font-semibold text-text-primary">Type</th>
                <th className="p-4 text-left font-semibold text-text-primary">Status</th>
                <th className="p-4 text-left font-semibold text-text-primary">Flags</th>
                <th className="p-4 text-left font-semibold text-text-primary">Created</th>
                <th className="p-4 text-left font-semibold text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    Loading content...
                  </td>
                </tr>
              ) : moderationQueue?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-text-secondary">
                    No content to moderate
                  </td>
                </tr>
              ) : (
                moderationQueue?.map((content) => {
                  const TypeIcon = getTypeIcon(content.content_type);
                  
                  return (
                    <motion.tr
                      key={content.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-border hover:bg-pale-lavender-bg/50 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedItems.includes(content.id)}
                          onCheckedChange={(checked) => handleSelectItem(content.id, checked as boolean)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="max-w-md">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 rounded ${getTypeColor(content.content_type)}`}>
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-text-primary capitalize">
                              {content.content_type}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-2">
                            {content.content}
                          </p>
                          {content.flag_reasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {content.flag_reasons.map((reason, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
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
                              {content.author_name}
                            </div>
                            <div className="text-xs text-text-secondary">
                              ID: {content.author_id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={cn("text-white", getTypeColor(content.content_type))}>
                          {content.content_type}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(content.status))}>
                          {getStatusIcon(content.status)}
                          {content.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={cn("text-white", getPriorityColor(content.flag_count))}>
                          {content.flag_count}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-text-secondary">
                          {new Date(content.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onContentSelect?.(content)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {content.status === 'pending' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleModerate(content.id, 'approve')}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleModerate(content.id, 'reject')}>
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleModerate(content.id, 'remove')}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}