import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Flag, 
  AlertTriangle, 
  Shield, 
  Eye, 
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentModerationProps {
  activityId: string;
  activityTitle: string;
  onFlag: (activityId: string, reason: string, details?: string) => void;
  onHide: (activityId: string) => void;
  onApprove?: (activityId: string) => void;
  onReject?: (activityId: string) => void;
  isModerator?: boolean;
  className?: string;
}

const flagReasons = [
  { value: 'inappropriate', label: 'Inappropriate Content', icon: AlertTriangle, color: 'text-red-500' },
  { value: 'spam', label: 'Spam or Misleading', icon: XCircle, color: 'text-orange-500' },
  { value: 'harassment', label: 'Harassment or Bullying', icon: User, color: 'text-red-600' },
  { value: 'privacy', label: 'Privacy Violation', icon: Shield, color: 'text-blue-500' },
  { value: 'offensive', label: 'Offensive Language', icon: MessageSquare, color: 'text-yellow-500' },
  { value: 'other', label: 'Other', icon: Flag, color: 'text-gray-500' },
];

const moderationStatuses = [
  { value: 'pending', label: 'Pending Review', icon: Clock, color: 'text-yellow-500' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-500' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500' },
  { value: 'hidden', label: 'Hidden', icon: EyeOff, color: 'text-gray-500' },
];

export function ContentModeration({
  activityId,
  activityTitle,
  onFlag,
  onHide,
  onApprove,
  onReject,
  isModerator = false,
  className,
}: ContentModerationProps) {
  const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false);
  const [isHideDialogOpen, setIsHideDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagDetails, setFlagDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFlagSubmit = async () => {
    if (!flagReason) {
      toast.error('Please select a reason for flagging this content');
      return;
    }

    setIsSubmitting(true);
    try {
      await onFlag(activityId, flagReason, flagDetails);
      toast.success('Content has been reported. Thank you for keeping our community safe!');
      setIsFlagDialogOpen(false);
      setFlagReason('');
      setFlagDetails('');
    } catch (error) {
      toast.error('Failed to report content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHide = async () => {
    try {
      await onHide(activityId);
      toast.success('Content has been hidden from your feed');
      setIsHideDialogOpen(false);
    } catch (error) {
      toast.error('Failed to hide content. Please try again.');
    }
  };

  const handleModerationAction = async (action: 'approve' | 'reject') => {
    try {
      if (action === 'approve' && onApprove) {
        await onApprove(activityId);
        toast.success('Content approved');
      } else if (action === 'reject' && onReject) {
        await onReject(activityId);
        toast.success('Content rejected');
      }
    } catch (error) {
      toast.error(`Failed to ${action} content. Please try again.`);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Flag Content Dialog */}
      <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-tertiary hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5 text-red-500" />
              <span>Report Content</span>
            </DialogTitle>
            <DialogDescription>
              Help us keep the community safe by reporting inappropriate content.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Reason for reporting
              </label>
              <Select value={flagReason} onValueChange={setFlagReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {flagReasons.map((reason) => {
                    const IconComponent = reason.icon;
                    return (
                      <SelectItem key={reason.value} value={reason.value}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className={`h-4 w-4 ${reason.color}`} />
                          <span>{reason.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Additional details (optional)
              </label>
              <Textarea
                placeholder="Please provide more details about why this content should be reviewed..."
                value={flagDetails}
                onChange={(e) => setFlagDetails(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="text-xs text-text-tertiary mt-1 text-right">
                {flagDetails.length}/500
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-text-secondary">
                <strong>Content being reported:</strong> {activityTitle}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFlagDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFlagSubmit}
              disabled={!flagReason || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isSubmitting ? 'Reporting...' : 'Report Content'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hide Content Dialog */}
      <Dialog open={isHideDialogOpen} onOpenChange={setIsHideDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-text-tertiary hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <EyeOff className="h-4 w-4 mr-1" />
            Hide
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <EyeOff className="h-5 w-5 text-gray-500" />
              <span>Hide Content</span>
            </DialogTitle>
            <DialogDescription>
              This will hide this content from your feed. You can unhide it later from your settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-text-secondary">
              <strong>Content to hide:</strong> {activityTitle}
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsHideDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleHide}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Hide Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Moderator Actions */}
      {isModerator && (
        <div className="flex space-x-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModerationAction('approve')}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModerationAction('reject')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

// Moderation Queue Component for Admins
export function ModerationQueue({ className }: { className?: string }) {
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock moderation queue data
  const moderationItems = [
    {
      id: '1',
      activityId: 'activity-1',
      title: 'Inappropriate language detected',
      reportedBy: 'Sarah Johnson',
      reportedAt: '2 hours ago',
      status: 'pending',
      reason: 'offensive',
      content: 'This post contains inappropriate language...',
    },
    {
      id: '2',
      activityId: 'activity-2',
      title: 'Spam content reported',
      reportedBy: 'Mike Johnson',
      reportedAt: '4 hours ago',
      status: 'pending',
      reason: 'spam',
      content: 'This appears to be spam content...',
    },
  ];

  const filteredItems = selectedStatus === 'all' 
    ? moderationItems 
    : moderationItems.filter(item => item.status === selectedStatus);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Moderation Queue</h3>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            {moderationStatuses.map((status) => {
              const IconComponent = status.icon;
              return (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`h-4 w-4 ${status.color}`} />
                    <span>{status.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => {
          const reason = flagReasons.find(r => r.value === item.reason);
          const status = moderationStatuses.find(s => s.value === item.status);
          
          return (
            <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-1">{item.title}</h4>
                  <p className="text-sm text-text-secondary mb-2">{item.content}</p>
                  <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                    <span>Reported by {item.reportedBy}</span>
                    <span>•</span>
                    <span>{item.reportedAt}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {reason && (
                    <Badge variant="secondary" className={`${reason.color} bg-opacity-20`}>
                      {reason.label}
                    </Badge>
                  )}
                  {status && (
                    <Badge variant="outline" className={`${status.color} border-current`}>
                      {status.label}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}