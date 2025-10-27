import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Paperclip, 
  Send, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
import { useSupportTicket, useCreateSupportReply, useUpdateSupportTicket, useCloseTicket, useReopenTicket } from '@/hooks/useSupport';
import type { SupportTicket, CreateSupportReplyInput } from '@/types/support';
import { cn } from '@/lib/utils';

interface SupportTicketDetailProps {
  ticketId: string;
  onBack: () => void;
}

export function SupportTicketDetail({ ticketId, onBack }: SupportTicketDetailProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isInternalReply, setIsInternalReply] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const { data: ticket, isLoading } = useSupportTicket(ticketId);
  const createReplyMutation = useCreateSupportReply();
  const updateTicketMutation = useUpdateSupportTicket();
  const closeTicketMutation = useCloseTicket();
  const reopenTicketMutation = useReopenTicket();

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;

    const replyData: CreateSupportReplyInput = {
      content: replyContent,
      is_internal: isInternalReply,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    createReplyMutation.mutate(
      { ticketId, data: replyData },
      {
        onSuccess: () => {
          setReplyContent('');
          setAttachments([]);
          setIsInternalReply(false);
        },
      }
    );
  };

  const handleStatusChange = (status: SupportTicket['status']) => {
    updateTicketMutation.mutate({
      id: ticketId,
      updates: { status },
    });
  };

  const handleCloseTicket = () => {
    closeTicketMutation.mutate({ id: ticketId });
  };

  const handleReopenTicket = () => {
    reopenTicketMutation.mutate(ticketId);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Ticket not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{ticket.subject}</h2>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={cn("flex items-center gap-1 w-fit", getStatusColor(ticket.status))}>
                {getStatusIcon(ticket.status)}
                {ticket.status.replace('_', ' ')}
              </Badge>
              <Badge className={cn("text-white", getPriorityColor(ticket.priority))}>
                {ticket.priority}
              </Badge>
              <span className="text-sm text-text-secondary">
                #{ticket.id.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select value={ticket.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReopenTicket}>
                Reopen Ticket
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCloseTicket}>
                Close Ticket
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Assign to Me
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-text-secondary" />
              <span className="font-medium text-text-primary">{ticket.user_name}</span>
              <span className="text-sm text-text-secondary">({ticket.user_email})</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-text-primary whitespace-pre-wrap">{ticket.description}</p>
            </div>
            {ticket.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-medium text-text-primary mb-2">Attachments</h4>
                <div className="space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-pale-lavender-bg rounded-lg">
                      <Paperclip className="h-4 w-4 text-text-secondary" />
                      <span className="text-sm text-text-primary">{attachment.filename}</span>
                      <span className="text-xs text-text-secondary">
                        ({(attachment.file_size / 1024).toFixed(1)} KB)
                      </span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Replies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary">Conversation</h3>
            {ticket.replies.map((reply) => (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-4 rounded-2xl",
                  reply.author_type === 'admin' 
                    ? "bg-mint-tint border border-mint-green" 
                    : "bg-pale-lavender-bg"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-mint-green flex items-center justify-center">
                    <User className="h-4 w-4 text-text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary text-sm">
                      {reply.author_name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {new Date(reply.created_at).toLocaleString()}
                    </div>
                  </div>
                  {reply.is_internal && (
                    <Badge variant="secondary" className="text-xs">
                      Internal
                    </Badge>
                  )}
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-primary whitespace-pre-wrap">{reply.content}</p>
                </div>
                {reply.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="space-y-2">
                      {reply.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Paperclip className="h-4 w-4 text-text-secondary" />
                          <span className="text-sm text-text-primary">{attachment.filename}</span>
                          <Button variant="ghost" size="sm" className="ml-auto">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Reply Form */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Add Reply</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="resize-none"
              />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="internal-reply"
                    checked={isInternalReply}
                    onCheckedChange={(checked) => setIsInternalReply(checked as boolean)}
                  />
                  <label htmlFor="internal-reply" className="text-sm text-text-secondary">
                    Internal reply (not visible to user)
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                  className="flex-1"
                />
                <Button
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim() || createReplyMutation.isPending}
                  className="bg-mint-green hover:bg-mint-green/90 text-text-primary"
                >
                  {createReplyMutation.isPending ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Reply
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Ticket Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-text-secondary">Category</label>
                <p className="text-text-primary capitalize">{ticket.category.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Created</label>
                <p className="text-text-primary">
                  {new Date(ticket.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-text-secondary">Last Updated</label>
                <p className="text-text-primary">
                  {new Date(ticket.updated_at).toLocaleString()}
                </p>
              </div>
              {ticket.assigned_to_name && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">Assigned To</label>
                  <p className="text-text-primary">{ticket.assigned_to_name}</p>
                </div>
              )}
              {ticket.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-text-secondary">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* User Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">User Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-mint-green flex items-center justify-center">
                  <User className="h-6 w-6 text-text-primary" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{ticket.user_name}</p>
                  <p className="text-sm text-text-secondary">{ticket.user_email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View User Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}