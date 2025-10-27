import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Image, Type, Sparkles } from 'lucide-react';
import { useCardTemplates, useCreateCard } from '@/hooks/useCards';
import type { CreateCardInput, CardColorScheme } from '@/types/card';
import { CARD_COLOR_SCHEMES } from '@/types/card';
import { cn } from '@/lib/utils';

const createCardSchema = z.object({
  milestone_id: z.string().min(1, 'Please select a milestone'),
  goal_id: z.string().min(1, 'Please select a goal'),
  template_id: z.enum(['celebration', 'progress', 'achievement', 'family', 'custom']),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subtitle: z.string().max(100, 'Subtitle must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  custom_text: z.string().max(200, 'Custom text must be less than 200 characters').optional(),
  color_scheme: z.string().min(1, 'Please select a color scheme'),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type CreateCardFormData = z.infer<typeof createCardSchema>;

interface CardCreationFormProps {
  milestones: Array<{
    id: string;
    title: string;
    goal_id: string;
    goal_title: string;
    achieved_at: string;
  }>;
  onSuccess?: (cardId: string) => void;
  onCancel?: () => void;
}

export function CardCreationForm({ milestones, onSuccess, onCancel }: CardCreationFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>('');
  const [previewMode, setPreviewMode] = useState(false);

  const { data: templatesData, isLoading: templatesLoading } = useCardTemplates();
  const createCardMutation = useCreateCard();

  const templates = templatesData?.data || [];

  const form = useForm<CreateCardFormData>({
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      template_id: 'celebration',
      color_scheme: 'mint_celebration',
    },
  });

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  const onSubmit = async (data: CreateCardFormData) => {
    const colorScheme = CARD_COLOR_SCHEMES[data.color_scheme] as CardColorScheme;
    
    const cardData: CreateCardInput = {
      milestone_id: data.milestone_id,
      goal_id: data.goal_id,
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      custom_text: data.custom_text,
      template_id: data.template_id as any,
      color_scheme: colorScheme,
      image_url: data.image_url,
    };

    try {
      const result = await createCardMutation.mutateAsync(cardData);
      if (result.data) {
        onSuccess?.(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    form.setValue('template_id', templateId as any);
    
    // Set default color scheme for template
    const template = templates.find(t => t.id === templateId);
    if (template && template.color_schemes.length > 0) {
      // Get the first color scheme key from CARD_COLOR_SCHEMES
      const firstSchemeKey = Object.keys(CARD_COLOR_SCHEMES)[0];
      setSelectedColorScheme(firstSchemeKey);
      form.setValue('color_scheme', firstSchemeKey);
    }
  };

  const handleColorSchemeSelect = (schemeId: string) => {
    setSelectedColorScheme(schemeId);
    form.setValue('color_scheme', schemeId);
  };

  if (templatesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Create Shareable Card</h1>
        <p className="text-gray-600">
          Celebrate your family's achievements with a beautiful, shareable card
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Milestone Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Select Milestone
                </CardTitle>
                <CardDescription>
                  Choose the milestone you want to celebrate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="milestone_id">Milestone</Label>
                  <Select
                    value={form.watch('milestone_id')}
                    onValueChange={(value) => {
                      form.setValue('milestone_id', value);
                      const milestone = milestones.find(m => m.id === value);
                      if (milestone) {
                        form.setValue('goal_id', milestone.goal_id);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a milestone" />
                    </SelectTrigger>
                    <SelectContent>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{milestone.title}</span>
                            <span className="text-sm text-gray-500">{milestone.goal_title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.milestone_id && (
                    <p className="text-sm text-red-600">{form.formState.errors.milestone_id.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Choose Template
                </CardTitle>
                <CardDescription>
                  Select a template that matches your celebration style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{template.name}</h3>
                          {template.is_premium && (
                            <Badge variant="secondary" className="text-xs">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{template.description}</p>
                        <div className="w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">Preview</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.template_id && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.template_id.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Color Scheme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>
                  Choose colors that match your family's style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(CARD_COLOR_SCHEMES).map(([key, scheme]) => (
                    <div
                      key={key}
                      className={cn(
                        "relative p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                        selectedColorScheme === key
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => handleColorSchemeSelect(key)}
                    >
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: scheme.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: scheme.secondary }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: scheme.accent }}
                          />
                        </div>
                        <p className="text-xs font-medium capitalize">
                          {key.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.color_scheme && (
                  <p className="text-sm text-red-600 mt-2">{form.formState.errors.color_scheme.message}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content Customization */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Customize Content
                </CardTitle>
                <CardDescription>
                  Add your personal touch to the card
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter card title"
                    {...form.register('title')}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Enter subtitle (optional)"
                    {...form.register('subtitle')}
                  />
                  {form.formState.errors.subtitle && (
                    <p className="text-sm text-red-600">{form.formState.errors.subtitle.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description (optional)"
                    rows={3}
                    {...form.register('description')}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_text">Custom Message</Label>
                  <Textarea
                    id="custom_text"
                    placeholder="Add a personal message (optional)"
                    rows={2}
                    {...form.register('custom_text')}
                  />
                  {form.formState.errors.custom_text && (
                    <p className="text-sm text-red-600">{form.formState.errors.custom_text.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    placeholder="https://example.com/image.jpg"
                    {...form.register('image_url')}
                  />
                  {form.formState.errors.image_url && (
                    <p className="text-sm text-red-600">{form.formState.errors.image_url.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview Toggle */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="w-full"
                >
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Section */}
        {previewMode && selectedTemplateData && selectedColorScheme && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                This is how your card will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className="w-80 h-80 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 text-center"
                  style={{
                    backgroundColor: CARD_COLOR_SCHEMES[selectedColorScheme]?.background,
                    color: CARD_COLOR_SCHEMES[selectedColorScheme]?.text,
                  }}
                >
                  <h2 className="text-2xl font-bold mb-2">
                    {form.watch('title') || 'Your Title'}
                  </h2>
                  {form.watch('subtitle') && (
                    <p className="text-lg mb-4" style={{ color: CARD_COLOR_SCHEMES[selectedColorScheme]?.text_secondary }}>
                      {form.watch('subtitle')}
                    </p>
                  )}
                  <div
                    className="w-16 h-16 rounded-full mb-4"
                    style={{ backgroundColor: CARD_COLOR_SCHEMES[selectedColorScheme]?.primary }}
                  />
                  {form.watch('description') && (
                    <p className="text-sm mb-4">
                      {form.watch('description')}
                    </p>
                  )}
                  {form.watch('custom_text') && (
                    <p className="text-sm font-medium">
                      {form.watch('custom_text')}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={createCardMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createCardMutation.isPending}
            className="bg-gradient-to-r from-primary to-primary/80"
          >
            {createCardMutation.isPending ? 'Creating...' : 'Create Card'}
          </Button>
        </div>
      </form>
    </div>
  );
}