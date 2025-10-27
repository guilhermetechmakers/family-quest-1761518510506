import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Share2,
  Download,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Mail,
  Loader2,
} from 'lucide-react';
import type { ShareableCard } from '@/types/card';
import { useGenerateCardImage, useShareCard } from '@/hooks/useCards';
import { toast } from 'sonner';

interface CardPreviewModalProps {
  card: ShareableCard | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export function CardPreviewModal({ card, isOpen, onClose, onEdit }: CardPreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  
  const generateCardImageMutation = useGenerateCardImage();
  const shareCardMutation = useShareCard();

  if (!card) return null;

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const result = await generateCardImageMutation.mutateAsync({
        card_id: card.id,
        template_id: card.template_id,
        data: {
          title: card.title,
          subtitle: card.subtitle,
          description: card.description,
          custom_text: card.custom_text,
          milestone_data: {
            title: card.title,
            achieved_at: card.created_at,
            goal_title: 'Sample Goal', // This would come from the goal data
            progress_percentage: 100,
          },
          family_data: {
            name: 'The Smith Family', // This would come from family data
            member_count: 4,
            avatars: ['/avatars/user1.jpg', '/avatars/user2.jpg'],
          },
          color_scheme: card.color_scheme,
        },
        dimensions: {
          width: 400,
          height: 400,
        },
      });

      if (result.success && result.image_url) {
        setGeneratedImageUrl(result.image_url);
        toast.success('Card image generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (platform?: string) => {
    try {
      const result = await shareCardMutation.mutateAsync({
        card_id: card.id,
        platform: platform as any,
      });

      if (result.data) {
        // Open share URL in new tab
        window.open(result.data.share_url, '_blank');
        toast.success('Card shared successfully!');
      }
    } catch (error) {
      console.error('Failed to share card:', error);
      toast.error('Failed to share card. Please try again.');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://familyquest.app/share/${card.share_token}`);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const handleDownload = () => {
    if (generatedImageUrl) {
      const link = document.createElement('a');
      link.href = generatedImageUrl;
      link.download = `family-quest-card-${card.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Card downloaded successfully!');
    } else {
      toast.error('Please generate the image first');
    }
  };

  const shareOptions = [
    { platform: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { platform: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400' },
    { platform: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
    { platform: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500' },
    { platform: 'email', label: 'Email', icon: Mail, color: 'bg-gray-600' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Card
          </DialogTitle>
          <DialogDescription>
            Preview and share your milestone celebration card
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Preview */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Preview</CardTitle>
                <CardDescription>
                  This is how your card will appear when shared
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div
                    className="w-80 h-80 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
                    style={{
                      backgroundColor: card.color_scheme.background,
                      color: card.color_scheme.text,
                    }}
                  >
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: `radial-gradient(circle at 20% 80%, ${card.color_scheme.primary} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${card.color_scheme.secondary} 0%, transparent 50%)`,
                      }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-2">
                        {card.title}
                      </h2>
                      {card.subtitle && (
                        <p 
                          className="text-lg mb-4"
                          style={{ color: card.color_scheme.text_secondary }}
                        >
                          {card.subtitle}
                        </p>
                      )}
                      
                      {/* Achievement Badge */}
                      <div
                        className="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
                        style={{ backgroundColor: card.color_scheme.primary }}
                      >
                        <span className="text-2xl">🎉</span>
                      </div>
                      
                      {card.description && (
                        <p className="text-sm mb-4">
                          {card.description}
                        </p>
                      )}
                      
                      {card.custom_text && (
                        <p 
                          className="text-sm font-medium"
                          style={{ color: card.color_scheme.accent }}
                        >
                          {card.custom_text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Image */}
            {generatedImageUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generated Image</CardTitle>
                  <CardDescription>
                    High-quality image ready for sharing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={generatedImageUrl}
                      alt="Generated card"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Generate Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generate Image</CardTitle>
                <CardDescription>
                  Create a high-quality image for sharing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || generateCardImageMutation.isPending}
                  className="w-full"
                >
                  {isGenerating || generateCardImageMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share Options</CardTitle>
                <CardDescription>
                  Share your card on social media or via direct link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Social Media Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {shareOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <Button
                        key={option.platform}
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(option.platform)}
                        disabled={shareCardMutation.isPending}
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </Button>
                    );
                  })}
                </div>

                <Separator />

                {/* Copy Link */}
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>

                {/* Download */}
                {generatedImageUrl && (
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Image
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Card Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Template</span>
                  <Badge variant="secondary" className="capitalize">
                    {card.template_id.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge 
                    variant={card.status === 'published' ? 'default' : 'secondary'}
                  >
                    {card.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm">
                    {new Date(card.created_at).toLocaleDateString()}
                  </span>
                </div>
                {card.published_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Published</span>
                    <span className="text-sm">
                      {new Date(card.published_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
              {onEdit && (
                <Button
                  onClick={onEdit}
                  variant="outline"
                  className="flex-1"
                >
                  Edit Card
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}