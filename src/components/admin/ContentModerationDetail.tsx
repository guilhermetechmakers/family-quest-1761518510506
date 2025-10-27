import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Check, 
  XCircle, 
  Trash2, 
  User, 
  Flag, 
  MessageSquare,
  Image,
  Clock,
  CheckCircle,
  XCircle as XCircleIcon,
  Save,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModerateContent } from '@/hooks/useAdmin';
import type { ContentModeration } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ContentModerationDetailProps {
  content: ContentModeration | null;
  onClose: () => void;
}

export function ContentModerationDetail({ content, onClose }: ContentModerationDetailProps) {
  const [moderationNotes, setModerationNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'remove' | ''>('');
  const [showNotes, setShowNotes] = useState(false);

  const moderateContent = useModerateContent();

  if (!content) return null;

  const handleModerate = async () => {
    if (!selectedAction) return;

    try {
      await moderateContent.mutateAsync({
        id: content.id,
        action: selectedAction,
        notes: moderationNotes || undefined,
      });
      toast.success(`Content ${selectedAction}d successfully`);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${selectedAction} content`);
    }
  };

  const getStatusIcon = (status: ContentModeration['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
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

  const TypeIcon = getTypeIcon(content.content_type);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-card-hover max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${getTypeColor(content.content_type)}`}>
              <TypeIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary capitalize">
                {content.content_type} Moderation
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(content.status))}>
                  {getStatusIcon(content.status)}
                  {content.status}
                </Badge>
                <Badge className={cn("text-white", getPriorityColor(content.flag_count))}>
                  {content.flag_count} flags
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Content Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Content Preview</h3>
            <div className="prose prose-sm max-w-none">
              <div className="bg-pale-lavender-bg p-4 rounded-lg">
                <p className="text-text-primary whitespace-pre-wrap">{content.content}</p>
              </div>
            </div>
          </Card>

          {/* Author Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Author Information</h3>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-mint-green flex items-center justify-center">
                <User className="h-6 w-6 text-text-primary" />
              </div>
              <div>
                <div className="font-medium text-text-primary">{content.author_name}</div>
                <div className="text-sm text-text-secondary">ID: {content.author_id}</div>
                <div className="text-sm text-text-secondary">
                  Created: {new Date(content.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Flag Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Flag Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-text-secondary" />
                <span className="font-medium text-text-primary">Flag Count: </span>
                <Badge className={cn("text-white", getPriorityColor(content.flag_count))}>
                  {content.flag_count}
                </Badge>
              </div>
              
              {content.flag_reasons.length > 0 && (
                <div>
                  <span className="font-medium text-text-primary">Flag Reasons:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.flag_reasons.map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Moderation History */}
          {content.moderator_id && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Moderation History</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">Moderated by: {content.moderator_id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">
                    Last updated: {new Date(content.updated_at).toLocaleString()}
                  </span>
                </div>
                {content.moderator_notes && (
                  <div className="mt-2 p-3 bg-pale-lavender-bg rounded-lg">
                    <span className="text-sm font-medium text-text-primary">Moderator Notes:</span>
                    <p className="text-sm text-text-secondary mt-1">{content.moderator_notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Moderation Actions */}
          {content.status === 'pending' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Moderation Actions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Action
                  </label>
                  <Select value={selectedAction} onValueChange={(value: any) => setSelectedAction(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approve">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          Approve Content
                        </div>
                      </SelectItem>
                      <SelectItem value="reject">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Reject Content
                        </div>
                      </SelectItem>
                      <SelectItem value="remove">
                        <div className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4 text-red-600" />
                          Remove Content
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNotes(!showNotes)}
                  >
                    {showNotes ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showNotes ? 'Hide' : 'Add'} Notes
                  </Button>
                </div>

                {showNotes && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Moderation Notes
                    </label>
                    <Textarea
                      value={moderationNotes}
                      onChange={(e) => setModerationNotes(e.target.value)}
                      placeholder="Add notes about your moderation decision..."
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleModerate}
                    disabled={!selectedAction || moderateContent.isPending}
                    className={cn(
                      "text-white",
                      selectedAction === 'approve' && "bg-green-500 hover:bg-green-600",
                      selectedAction === 'reject' && "bg-red-500 hover:bg-red-600",
                      selectedAction === 'remove' && "bg-gray-500 hover:bg-gray-600"
                    )}
                  >
                    {moderateContent.isPending ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {selectedAction === 'approve' && 'Approve Content'}
                        {selectedAction === 'reject' && 'Reject Content'}
                        {selectedAction === 'remove' && 'Remove Content'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}