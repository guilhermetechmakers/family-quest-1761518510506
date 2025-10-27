import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Share2,
  Download,
  Copy,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  ArrowLeft,
  Calendar,
  Users,
  Heart,
} from 'lucide-react';
import { usePublicCard } from '@/hooks/useCards';

export function PublicCardPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data: cardData, isLoading, error } = usePublicCard(shareToken || '');

  const card = cardData?.data;

  const handleShare = (platform: string) => {
    const shareUrl = window.location.href;
    const text = `Check out this amazing milestone achievement!`;
    
    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard! You can paste it in your Instagram story or post.');
        return;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent('Check out this milestone!')}&body=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleDownload = () => {
    if (card?.generated_image_url) {
      const link = document.createElement('a');
      link.href = card.generated_image_url;
      link.download = `family-quest-card-${card.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Card Not Found</h2>
                <p className="text-gray-600 mt-2">
                  This card may have been deleted or the link is invalid.
                </p>
              </div>
              <Button onClick={() => window.location.href = '/'} className="mt-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Milestone Celebration
          </h1>
          <p className="text-gray-600">
            A family achievement worth celebrating!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Display */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div
                  className="h-96 rounded-t-lg flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
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
                    <h2 className="text-3xl font-bold mb-4">
                      {card.title}
                    </h2>
                    {card.subtitle && (
                      <p 
                        className="text-xl mb-6"
                        style={{ color: card.color_scheme.text_secondary }}
                      >
                        {card.subtitle}
                      </p>
                    )}
                    
                    {/* Achievement Badge */}
                    <div
                      className="w-20 h-20 rounded-full mb-6 flex items-center justify-center mx-auto"
                      style={{ backgroundColor: card.color_scheme.primary }}
                    >
                      <span className="text-3xl">🎉</span>
                    </div>
                    
                    {card.description && (
                      <p className="text-lg mb-4">
                        {card.description}
                      </p>
                    )}
                    
                    {card.custom_text && (
                      <p 
                        className="text-lg font-medium"
                        style={{ color: card.color_scheme.accent }}
                      >
                        {card.custom_text}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">
                      Published
                    </Badge>
                    <span className="text-sm text-gray-500 capitalize">
                      {card.template_id.replace('_', ' ')} Template
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(card.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      Family Achievement
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Image */}
            {card.generated_image_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">High-Quality Image</CardTitle>
                  <CardDescription>
                    Download the full-resolution image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={card.generated_image_url}
                      alt="Generated card"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share This Achievement
                </CardTitle>
                <CardDescription>
                  Help celebrate this family milestone by sharing it with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Social Media Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleShare('facebook')}
                    className="justify-start"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('twitter')}
                    className="justify-start"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('instagram')}
                    className="justify-start"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleShare('whatsapp')}
                    className="justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
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
                {card.generated_image_url && (
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

            {/* About Family Quest */}
            <Card>
              <CardHeader>
                <CardTitle>About Family Quest</CardTitle>
                <CardDescription>
                  The app that helps families achieve their goals together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Family Quest helps families work together towards shared goals like vacations, 
                  home improvements, or saving for special purchases. Track progress, celebrate 
                  milestones, and build stronger family bonds.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Learn More
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Family Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Milestone Type</span>
                    <Badge variant="secondary" className="capitalize">
                      {card.template_id.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm">
                      {new Date(card.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      Achieved
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}