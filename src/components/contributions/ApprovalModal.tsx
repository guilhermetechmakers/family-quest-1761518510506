import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, DollarSign, User, Target } from 'lucide-react';
import { useContribution, useApproveContribution, useRejectContribution } from '@/hooks/useContributions';

interface ApprovalModalProps {
  contributionId: string;
  onClose: () => void;
  onComplete: () => void;
}

export function ApprovalModal({ contributionId, onClose, onComplete }: ApprovalModalProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const { data: contribution, isLoading } = useContribution(contributionId);
  const approveContribution = useApproveContribution();
  const rejectContribution = useRejectContribution();

  const handleApprove = async () => {
    try {
      await approveContribution.mutateAsync(contributionId);
      onComplete();
    } catch (error) {
      console.error('Error approving contribution:', error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectContribution.mutateAsync({
        id: contributionId,
        reason: rejectionReason || undefined,
      });
      onComplete();
    } catch (error) {
      console.error('Error rejecting contribution:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-pastel-yellow text-text-primary';
      case 'approved':
        return 'bg-mint-green text-text-primary';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'monetary':
        return <DollarSign className="h-5 w-5" />;
      case 'manual':
        return <CheckCircle className="h-5 w-5" />;
      case 'chore':
        return <Target className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-green"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!contribution) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Contribution Not Found
            </h3>
            <p className="text-text-secondary mb-4">
              The contribution you're looking for could not be found.
            </p>
            <Button onClick={onClose} className="bg-mint-green hover:bg-light-mint">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-text-primary">
            Review Contribution
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contribution Details */}
          <Card className="p-6 bg-mint-tint border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-mint-green rounded-full">
                  {getTypeIcon(contribution.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {contribution.goal.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {contribution.type.charAt(0).toUpperCase() + contribution.type.slice(1)} Contribution
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(contribution.status)}>
                {contribution.status.charAt(0).toUpperCase() + contribution.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-text-tertiary" />
                  <span className="text-text-secondary">Contributor:</span>
                  <span className="font-medium text-text-primary">
                    {contribution.contributor.full_name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-text-tertiary" />
                  <span className="text-text-secondary">Amount:</span>
                  <span className="font-medium text-text-primary">
                    ${contribution.amount} {contribution.currency}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-text-tertiary" />
                  <span className="text-text-secondary">Date:</span>
                  <span className="font-medium text-text-primary">
                    {new Date(contribution.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-text-tertiary" />
                  <span className="text-text-secondary">Type:</span>
                  <span className="font-medium text-text-primary">
                    {contribution.type}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-text-secondary">Description</Label>
              <p className="mt-1 p-3 bg-white rounded-lg text-sm text-text-primary">
                {contribution.description}
              </p>
            </div>

            {contribution.receipt_url && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-text-secondary">Receipt</Label>
                <div className="mt-1">
                  <a
                    href={contribution.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-mint-green hover:text-light-mint transition-colors"
                  >
                    <DollarSign className="h-4 w-4" />
                    View Receipt
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Rejection Reason Form */}
          <AnimatePresence>
            {showRejectionForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="rejection-reason" className="text-sm font-medium text-text-secondary">
                    Reason for Rejection (Optional)
                  </Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please provide a reason for rejecting this contribution..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={approveContribution.isPending || rejectContribution.isPending}
            >
              Cancel
            </Button>
            
            {!showRejectionForm ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionForm(true)}
                  disabled={approveContribution.isPending || rejectContribution.isPending}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={approveContribution.isPending || rejectContribution.isPending}
                  className="bg-mint-green hover:bg-light-mint text-text-primary"
                >
                  {approveContribution.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectionForm(false)}
                  disabled={approveContribution.isPending || rejectContribution.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={approveContribution.isPending || rejectContribution.isPending}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {rejectContribution.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Confirm Rejection
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}