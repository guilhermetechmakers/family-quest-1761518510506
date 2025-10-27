import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CardTemplate, CardColorScheme } from '@/types/card';
import { cn } from '@/lib/utils';

interface CardTemplatePreviewProps {
  template: CardTemplate;
  colorScheme: CardColorScheme;
  title?: string;
  subtitle?: string;
  description?: string;
  customText?: string;
  className?: string;
}

export function CardTemplatePreview({
  template,
  colorScheme,
  title = 'Sample Title',
  subtitle = 'Sample Subtitle',
  description = 'This is a sample description for the card preview.',
  customText = 'Custom message here!',
  className,
}: CardTemplatePreviewProps) {
  const renderTemplate = () => {
    switch (template.id) {
      case 'celebration':
        return (
          <div
            className="w-full h-80 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at 20% 80%, ${colorScheme.primary} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${colorScheme.secondary} 0%, transparent 50%)`,
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2">
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-lg mb-4"
                  style={{ color: colorScheme.text_secondary }}
                >
                  {subtitle}
                </p>
              )}
              
              {/* Achievement Badge */}
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center mx-auto"
                style={{ backgroundColor: colorScheme.primary }}
              >
                <span className="text-2xl">🎉</span>
              </div>
              
              {description && (
                <p className="text-sm mb-4">
                  {description}
                </p>
              )}
              
              {customText && (
                <p 
                  className="text-sm font-medium"
                  style={{ color: colorScheme.accent }}
                >
                  {customText}
                </p>
              )}
            </div>
          </div>
        );

      case 'progress':
        return (
          <div
            className="w-full h-64 rounded-2xl flex flex-col p-6 relative overflow-hidden"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `linear-gradient(135deg, ${colorScheme.primary} 0%, ${colorScheme.secondary} 100%)`,
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-2">
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-sm mb-4"
                  style={{ color: colorScheme.text_secondary }}
                >
                  {subtitle}
                </p>
              )}
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div 
                  className="w-full h-2 rounded-full"
                  style={{ backgroundColor: colorScheme.secondary }}
                >
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: colorScheme.primary,
                      width: '75%'
                    }}
                  />
                </div>
              </div>
              
              {description && (
                <p className="text-sm mb-4 flex-1">
                  {description}
                </p>
              )}
              
              {/* Family Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: colorScheme.accent }}
                    />
                  ))}
                </div>
                <span className="text-xs" style={{ color: colorScheme.text_secondary }}>
                  Family Team
                </span>
              </div>
            </div>
          </div>
        );

      case 'achievement':
        return (
          <div
            className="w-full h-80 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `conic-gradient(from 0deg, ${colorScheme.primary}, ${colorScheme.secondary}, ${colorScheme.accent}, ${colorScheme.primary})`,
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Achievement Badge */}
              <div
                className="w-20 h-20 rounded-full mb-4 flex items-center justify-center mx-auto"
                style={{ backgroundColor: colorScheme.primary }}
              >
                <span className="text-3xl">🏆</span>
              </div>
              
              <h2 className="text-xl font-bold mb-2">
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-sm mb-4"
                  style={{ color: colorScheme.text_secondary }}
                >
                  {subtitle}
                </p>
              )}
              
              {description && (
                <p className="text-sm mb-4">
                  {description}
                </p>
              )}
              
              {customText && (
                <p 
                  className="text-sm font-medium"
                  style={{ color: colorScheme.accent }}
                >
                  {customText}
                </p>
              )}
            </div>
          </div>
        );

      case 'family':
        return (
          <div
            className="w-full h-80 rounded-2xl flex flex-col p-6 relative overflow-hidden"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at center, ${colorScheme.primary} 0%, transparent 70%)`,
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold mb-2">
                {title}
              </h2>
              {subtitle && (
                <p 
                  className="text-lg mb-6"
                  style={{ color: colorScheme.text_secondary }}
                >
                  {subtitle}
                </p>
              )}
              
              {/* Family Circle */}
              <div className="relative mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                </div>
                {/* Decorative circles */}
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                  style={{ backgroundColor: colorScheme.secondary }}
                />
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full"
                  style={{ backgroundColor: colorScheme.accent }}
                />
              </div>
              
              {description && (
                <p className="text-sm mb-4">
                  {description}
                </p>
              )}
              
              {customText && (
                <p 
                  className="text-sm font-medium"
                  style={{ color: colorScheme.accent }}
                >
                  {customText}
                </p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div
            className="w-full h-80 rounded-2xl flex flex-col items-center justify-center p-6 text-center"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
            }}
          >
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-sm">{description}</p>
          </div>
        );
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {renderTemplate()}
        
        {/* Template Info */}
        <div className="p-4 bg-white border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">
                {template.name}
              </span>
              {template.is_premium && (
                <Badge variant="secondary" className="text-xs">
                  Premium
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {template.layout.dimensions.width} × {template.layout.dimensions.height}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}