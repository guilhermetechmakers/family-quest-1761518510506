import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Receipt, 
  CheckCircle, 
  DollarSign, 
  Calendar, 
  User, 
  Target,
  Share2,
  Mail,
  Printer
} from 'lucide-react';
import { usePaymentReceipt, useGenerateReceiptPDF } from '@/hooks/usePayments';
import { format } from 'date-fns';

interface ReceiptGeneratorProps {
  paymentIntentId: string;
  onClose?: () => void;
}

export function ReceiptGenerator({ paymentIntentId, onClose }: ReceiptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: receipt, isLoading } = usePaymentReceipt(paymentIntentId);
  const generateReceiptPDF = useGenerateReceiptPDF();

  const handleDownloadPDF = async () => {
    if (!receipt) return;
    
    setIsGenerating(true);
    try {
      await generateReceiptPDF.mutateAsync(receipt.payment_intent_id);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!receipt) return;
    
    const shareData = {
      title: `Contribution Receipt - ${receipt.goal.title}`,
      text: `I contributed $${receipt.amount} ${receipt.currency} to "${receipt.goal.title}"`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareData.text);
      // You could show a toast here
    }
  };

  const handleEmail = () => {
    if (!receipt) return;
    
    const subject = `Contribution Receipt - ${receipt.goal.title}`;
    const body = `Hi,\n\nI wanted to share my contribution receipt:\n\n` +
      `Goal: ${receipt.goal.title}\n` +
      `Amount: $${receipt.amount} ${receipt.currency}\n` +
      `Date: ${format(new Date(receipt.created_at), 'PPP')}\n` +
      `Status: ${receipt.status}\n\n` +
      `Best regards`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mint-green"></div>
        </div>
      </Card>
    );
  }

  if (!receipt) {
    return (
      <Card className="p-6 bg-white shadow-card border-0">
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Receipt Not Found
          </h3>
          <p className="text-text-secondary">
            The receipt you're looking for could not be found.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white shadow-card border-0 print:shadow-none">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Contribution Receipt
          </h2>
          <p className="text-text-secondary">
            Thank you for your contribution to the family goal!
          </p>
        </div>

        {/* Receipt Details */}
        <div className="space-y-6 mb-8 print:mb-6">
          {/* Goal Information */}
          <div className="p-4 bg-mint-tint rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-5 w-5 text-mint-green" />
              <h3 className="font-semibold text-text-primary">Goal</h3>
            </div>
            <p className="text-text-primary font-medium">{receipt.goal.title}</p>
          </div>

          {/* Amount and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-pale-lavender-bg rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-pale-lavender" />
                <h3 className="font-semibold text-text-primary">Amount</h3>
              </div>
              <p className="text-2xl font-bold text-text-primary">
                ${receipt.amount} {receipt.currency}
              </p>
            </div>

            <div className="p-4 bg-light-pink rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-light-pink" />
                <h3 className="font-semibold text-text-primary">Status</h3>
              </div>
              <Badge className="bg-mint-green text-text-primary">
                {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Contributor and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-pastel-yellow rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-pastel-yellow" />
                <h3 className="font-semibold text-text-primary">Contributor</h3>
              </div>
              <p className="text-text-primary font-medium">{receipt.contributor.full_name}</p>
            </div>

            <div className="p-4 bg-cream-yellow rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-pastel-yellow" />
                <h3 className="font-semibold text-text-primary">Date</h3>
              </div>
              <p className="text-text-primary font-medium">
                {format(new Date(receipt.created_at), 'PPP')}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt ID */}
        <div className="mb-8 print:mb-6 p-4 bg-gray-50 rounded-2xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">Receipt ID:</span>
            <span className="text-sm font-mono text-text-primary">{receipt.id}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-text-secondary">Payment Intent ID:</span>
            <span className="text-sm font-mono text-text-primary">{receipt.payment_intent_id}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 print:hidden">
          <Button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex-1 bg-mint-green hover:bg-light-mint text-text-primary"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>

          <Button
            onClick={handlePrint}
            variant="outline"
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button
            onClick={handleEmail}
            variant="outline"
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>

        {/* Close Button */}
        {onClose && (
          <div className="mt-6 print:hidden">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 print:mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-text-tertiary">
            This receipt was generated by Family Quest on {format(new Date(), 'PPP')}
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            For support, contact us at support@familyquest.app
          </p>
        </div>
      </Card>
    </motion.div>
  );
}