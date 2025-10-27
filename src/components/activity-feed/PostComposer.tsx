import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Image as ImageIcon,
  Smile,
  Target,
  Send,
  X,
  Camera,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PostComposerData, ChildPostData } from '@/types/activity';

interface PostComposerProps {
  onSubmit: (data: PostComposerData) => void;
  onChildSubmit?: (data: ChildPostData) => void;
  goals: Array<{ id: string; title: string }>;
  isChild?: boolean;
  isLoading?: boolean;
}

const childEmojis = ['😊', '🎉', '💪', '⭐', '🏆', '❤️', '👍', '🎯', '🔥', '✨'];

export function PostComposer({ 
  onSubmit, 
  onChildSubmit, 
  goals, 
  isChild = false, 
  isLoading = false 
}: PostComposerProps) {
  const [content, setContent] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [postType, setPostType] = useState<'general' | 'milestone' | 'celebration'>('general');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;

    if (isChild && onChildSubmit) {
      onChildSubmit({
        content: content.trim(),
        emoji: selectedEmoji,
        goal_id: selectedGoal || undefined,
        photo_url: mediaUrls[0],
      });
    } else {
      onSubmit({
        content: content.trim(),
        goal_id: selectedGoal || undefined,
        type: postType,
        media_urls: mediaUrls,
        tags: tags,
      });
    }

    // Reset form
    setContent('');
    setSelectedGoal('');
    setPostType('general');
    setSelectedEmoji('😊');
    setMediaUrls([]);
    setTags([]);
    setNewTag('');
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // In a real app, you'd upload these files and get URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setMediaUrls(prev => [...prev, url]);
    });
  };

  const removeMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  if (isChild) {
    return (
      <Card className="p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Smile className="h-5 w-5 text-mint-green" />
          <h3 className="font-semibold text-text-primary">Share Something Fun!</h3>
        </div>

        <div className="space-y-4">
          {/* Emoji Selection */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {childEmojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-10 w-10 p-0 text-lg",
                    selectedEmoji === emoji 
                      ? "bg-mint-green text-text-primary" 
                      : "hover:bg-mint-tint"
                  )}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              What would you like to share?
            </label>
            <Textarea
              placeholder="Tell your family about what you did today..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-text-tertiary mt-1 text-right">
              {content.length}/500
            </div>
          </div>

          {/* Goal Selection */}
          {goals.length > 0 && (
            <div>
              <label className="text-sm font-medium text-text-secondary mb-2 block">
                Related to a goal? (Optional)
              </label>
              <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific goal</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Add a photo (Optional)
            </label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleMediaUpload}
                className="hidden"
                id="child-photo-upload"
              />
              <label
                htmlFor="child-photo-upload"
                className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-mint-green rounded-lg cursor-pointer hover:bg-mint-tint transition-colors"
              >
                <Camera className="h-4 w-4 text-mint-green" />
                <span className="text-sm text-text-secondary">Take or upload photo</span>
              </label>
            </div>
            
            {mediaUrls.length > 0 && (
              <div className="mt-2">
                <img
                  src={mediaUrls[0]}
                  alt="Uploaded"
                  className="h-20 w-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
              className="bg-mint-green hover:bg-light-mint text-text-primary"
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sharing...' : 'Share!'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="h-5 w-5 text-mint-green" />
        <h3 className="font-semibold text-text-primary">Create a Post</h3>
      </div>

      <div className="space-y-4">
        {/* Post Type Selection */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            Post Type
          </label>
          <Select value={postType} onValueChange={(value: any) => setPostType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Update</SelectItem>
              <SelectItem value="milestone">Milestone Achievement</SelectItem>
              <SelectItem value="celebration">Celebration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            What's happening?
          </label>
          <Textarea
            placeholder="Share an update with your family..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={1000}
          />
          <div className="text-xs text-text-tertiary mt-1 text-right">
            {content.length}/1000
          </div>
        </div>

        {/* Goal Selection */}
        {goals.length > 0 && (
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">
              Related Goal (Optional)
            </label>
            <Select value={selectedGoal} onValueChange={setSelectedGoal}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No specific goal</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Media Upload */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            Add Photos/Videos
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaUpload}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className="flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-mint-green rounded-lg cursor-pointer hover:bg-mint-tint transition-colors"
            >
              <ImageIcon className="h-4 w-4 text-mint-green" />
              <span className="text-sm text-text-secondary">Upload media</span>
            </label>
          </div>
          
          {mediaUrls.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {mediaUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    onClick={() => removeMedia(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-text-secondary mb-2 block">
            Tags (Optional)
          </label>
          <div className="flex space-x-2 mb-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTag}
              disabled={!newTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-mint-tint text-text-primary"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isLoading}
            className="bg-mint-green hover:bg-light-mint text-text-primary"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Posting...' : 'Post Update'}
          </Button>
        </div>
      </div>
    </Card>
  );
}