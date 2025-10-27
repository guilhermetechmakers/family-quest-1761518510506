import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Flag, 
  User, 
  Calendar,
  MessageSquare,
  Image,
  Filter
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useModerationQueue, useModerateContent } from '@/hooks/useAdmin';
import type { ContentModeration, ModerationFilters } from '@/types/admin';
import { toast } from 'sonner';

interface ModerationQueueProps {
  onContentSelect?: (content: ContentModeration) => void;
}

export function ModerationQueue({ onContentSelect }: ModerationQueueProps) {
  const [filters, setFilters] = useState<ModerationFilters>({});

  const { data: moderationQueue, isLoading } = useModerationQueue(filters);
  const moderateContent = useModerateContent();

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

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({ 
      ...prev, 
      status: status === 'all' ? undefined : status as any 
    }));
  };

  const handleTypeFilter = (type: string) => {
    setFilters(prev => ({ 
      ...prev, 
      content_type: type === 'all' ? undefined : type as any 
    }));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-pastel-yellow text-text-primary',
      approved: 'bg-mint-green text-text-primary',
      rejected: 'bg-red-100 text-red-800',
      removed: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100'}>
        {status}
      </Badge>
    );
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
        <h2 className="text-xl font-semibold text-text-primary">Content Moderation Queue</h2>
        
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
              <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('approved')}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('rejected')}>
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusFilter('removed')}>
                Removed
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
              <DropdownMenuItem onClick={() => handleTypeFilter('post')}>
                Posts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeFilter('comment')}>
                Comments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeFilter('media')}>
                Media
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="space-y-3">
        {moderationQueue?.map((content, index) => {
          const TypeIcon = getTypeIcon(content.content_type);
          
          return (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-4 p-4 bg-pale-lavender-bg rounded-2xl hover:bg-mint-tint transition-colors duration-200"
            >
              <div className={`p-2 rounded-xl ${getTypeColor(content.content_type)}`}>
                <TypeIcon className="h-5 w-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-text-primary capitalize">
                    {content.content_type}
                  </h3>
                  {getStatusBadge(content.status)}
                  <Badge variant="outline" className="text-xs">
                    {content.flag_count} flags
                  </Badge>
                </div>
                
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {content.content}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{content.author_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(content.created_at).toLocaleDateString()}</span>
                  </div>
                  {content.flag_reasons.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Flag className="h-3 w-3" />
                      <span>{content.flag_reasons.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onContentSelect?.(content)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                
                {content.status === 'pending' && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerate(content.id, 'approve')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerate(content.id, 'reject')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModerate(content.id, 'remove')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {moderationQueue?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-text-secondary">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No content to moderate</p>
            <p className="text-sm">All content has been reviewed</p>
          </div>
        </div>
      )}
    </div>
  );
}