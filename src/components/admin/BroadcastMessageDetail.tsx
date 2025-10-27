import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Send, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  EyeOff,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useSendBroadcastMessage, useDeleteBroadcastMessage } from '@/hooks/useAdmin';
import type { BroadcastMessage } from '@/types/admin';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BroadcastMessageDetailProps {
  message: BroadcastMessage;
  onClose: () => void;
}

export function BroadcastMessageDetail({ message, onClose }: BroadcastMessageDetailProps) {
  const [showPreview, setShowPreview] = useState(false);

  const sendMessageMutation = useSendBroadcastMessage();
  const deleteMessageMutation = useDeleteBroadcastMessage();

  const handleSendMessage = async () => {
    try {
      await sendMessageMutation.mutateAsync(message.id);
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessageMutation.mutateAsync(message.id);
      toast.success('Message deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusIcon = (status: BroadcastMessage['status']) => {
    switch (status) {
      case 'draft':
        return <MessageSquare className="h-4 w-4" />;
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
            <div className="p-2 rounded-xl bg-mint-green">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{message.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(message.status))}>
                  {getStatusIcon(message.status)}
                  {message.status}
                </Badge>
                <Badge className={cn("text-white", getAudienceColor(message.target_audience))}>
                  {message.target_audience.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Message Content */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Message Content</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <p className="text-text-primary whitespace-pre-wrap">{message.content}</p>
            </div>

            {showPreview && (
              <div className="mt-4 p-4 bg-pale-lavender-bg rounded-lg border border-border">
                <h4 className="font-medium text-text-primary mb-2">User Preview</h4>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-text-primary mb-2">{message.title}</h3>
                  <p className="text-text-secondary text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Message Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Message Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">Target Audience</label>
                  <p className="text-text-primary capitalize">{message.target_audience.replace('_', ' ')}</p>
                </div>
                
                {message.target_family_ids && message.target_family_ids.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Target Family IDs</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.target_family_ids.map((id, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {id}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-text-secondary">Created</label>
                  <p className="text-text-primary">
                    {new Date(message.created_at).toLocaleString()}
                  </p>
                </div>

                {message.scheduled_at && (
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Scheduled For</label>
                    <p className="text-text-primary">
                      {new Date(message.scheduled_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {message.sent_at && (
                  <div>
                    <label className="text-sm font-medium text-text-secondary">Sent At</label>
                    <p className="text-text-primary">
                      {new Date(message.sent_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Message Statistics</h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-mint-tint rounded-lg">
                  <div className="text-2xl font-bold text-text-primary">
                    {message.target_audience === 'all' ? 'All Users' : 
                     message.target_audience === 'parents' ? 'Parents Only' :
                     message.target_audience === 'children' ? 'Children Only' :
                     message.target_audience === 'guests' ? 'Guests Only' :
                     `${message.target_family_ids?.length || 0} Families`}
                  </div>
                  <div className="text-sm text-text-secondary">Target Audience</div>
                </div>

                <div className="text-center p-4 bg-pale-lavender-bg rounded-lg">
                  <div className="text-2xl font-bold text-text-primary">
                    {message.status === 'sent' ? '100%' : 
                     message.status === 'failed' ? '0%' : '0%'}
                  </div>
                  <div className="text-sm text-text-secondary">Delivery Rate</div>
                </div>

                <div className="text-center p-4 bg-light-pink rounded-lg">
                  <div className="text-2xl font-bold text-text-primary">
                    {message.status === 'sent' ? '✓' : 
                     message.status === 'failed' ? '✗' : '⏳'}
                  </div>
                  <div className="text-sm text-text-secondary">Status</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSendMessage}
                disabled={message.status === 'sent' || sendMessageMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {sendMessageMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>

              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Message
              </Button>

              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreHorizontal className="h-4 w-4 mr-2" />
                    More Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Users className="h-4 w-4 mr-2" />
                    View Recipients
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDeleteMessage}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}