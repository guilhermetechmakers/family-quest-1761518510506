import type { CardColorScheme, CardTemplate } from '@/types/card';

/**
 * Utility functions for card generation and image processing
 */

export interface CardGenerationData {
  title: string;
  subtitle?: string;
  description?: string;
  customText?: string;
  milestoneData: {
    title: string;
    achievedAt: string;
    goalTitle: string;
    progressPercentage: number;
  };
  familyData: {
    name: string;
    memberCount: number;
    avatars: string[];
  };
  colorScheme: CardColorScheme;
}

export interface CardCanvasOptions {
  width: number;
  height: number;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

/**
 * Generate a canvas element for card rendering
 */
export function createCardCanvas(options: CardCanvasOptions): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, options.width, options.height);

  return canvas;
}

/**
 * Draw text on canvas with proper font sizing and positioning
 */
export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: CanvasTextAlign;
    maxWidth?: number;
  }
): void {
  const {
    fontSize,
    fontFamily = 'Inter, system-ui, sans-serif',
    fontWeight = '400',
    color = '#000000',
    textAlign = 'left',
    maxWidth,
  } = options;

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;

  if (maxWidth) {
    // Handle text wrapping
    const words = text.split(' ');
    let line = '';
    let lineY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, lineY);
        line = words[i] + ' ';
        lineY += fontSize * 1.2;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);
  } else {
    ctx.fillText(text, x, y);
  }
}

/**
 * Draw a circle on canvas
 */
export function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  strokeColor?: string,
  strokeWidth?: number
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  
  if (strokeColor && strokeWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
}

/**
 * Draw a progress bar on canvas
 */
export function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  progress: number,
  backgroundColor: string,
  fillColor: string
): void {
  // Background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(x, y, width, height);
  
  // Progress fill
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width * (progress / 100), height);
}

/**
 * Generate a celebration card
 */
export function generateCelebrationCard(
  canvas: HTMLCanvasElement,
  data: CardGenerationData,
  _template: CardTemplate
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const { colorScheme } = data;

  // Background pattern
  const gradient = ctx.createRadialGradient(
    width * 0.2, height * 0.8, 0,
    width * 0.2, height * 0.8, width * 0.6
  );
  gradient.addColorStop(0, colorScheme.primary + '20');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Title
  drawText(ctx, data.title, width / 2, height * 0.2, {
    fontSize: 32,
    fontWeight: '600',
    color: colorScheme.text,
    textAlign: 'center',
    maxWidth: width * 0.8,
  });

  // Subtitle
  if (data.subtitle) {
    drawText(ctx, data.subtitle, width / 2, height * 0.3, {
      fontSize: 18,
      fontWeight: '500',
      color: colorScheme.text_secondary,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Achievement badge
  const badgeX = width / 2;
  const badgeY = height * 0.5;
  const badgeRadius = 40;
  drawCircle(ctx, badgeX, badgeY, badgeRadius, colorScheme.primary);
  
  // Badge emoji
  ctx.font = '32px Arial';
  ctx.fillStyle = colorScheme.text;
  ctx.textAlign = 'center';
  ctx.fillText('🎉', badgeX, badgeY + 10);

  // Description
  if (data.description) {
    drawText(ctx, data.description, width / 2, height * 0.7, {
      fontSize: 16,
      color: colorScheme.text,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Custom text
  if (data.customText) {
    drawText(ctx, data.customText, width / 2, height * 0.8, {
      fontSize: 14,
      fontWeight: '600',
      color: colorScheme.accent,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }
}

/**
 * Generate a progress card
 */
export function generateProgressCard(
  canvas: HTMLCanvasElement,
  data: CardGenerationData,
  _template: CardTemplate
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const { colorScheme } = data;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colorScheme.primary + '10');
  gradient.addColorStop(1, colorScheme.secondary + '10');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Title
  drawText(ctx, data.title, 20, 40, {
    fontSize: 24,
    fontWeight: '600',
    color: colorScheme.text,
    maxWidth: width - 40,
  });

  // Subtitle
  if (data.subtitle) {
    drawText(ctx, data.subtitle, 20, 70, {
      fontSize: 16,
      color: colorScheme.text_secondary,
      maxWidth: width - 40,
    });
  }

  // Progress bar
  const progressBarY = height * 0.4;
  const progressBarHeight = 20;
  drawProgressBar(
    ctx,
    20,
    progressBarY,
    width - 40,
    progressBarHeight,
    data.milestoneData.progressPercentage,
    colorScheme.secondary,
    colorScheme.primary
  );

  // Progress percentage
  drawText(ctx, `${data.milestoneData.progressPercentage}%`, width - 20, progressBarY + 15, {
    fontSize: 14,
    fontWeight: '600',
    color: colorScheme.text,
    textAlign: 'right',
  });

  // Description
  if (data.description) {
    drawText(ctx, data.description, 20, height * 0.6, {
      fontSize: 14,
      color: colorScheme.text,
      maxWidth: width - 40,
    });
  }

  // Family avatars
  const avatarY = height - 40;
  const avatarSize = 24;
  const avatarSpacing = 8;
  const totalAvatarWidth = (data.familyData.avatars.length * avatarSize) + 
    ((data.familyData.avatars.length - 1) * avatarSpacing);
  const startX = (width - totalAvatarWidth) / 2;

  data.familyData.avatars.forEach((_, index) => {
    const avatarX = startX + (index * (avatarSize + avatarSpacing));
    drawCircle(ctx, avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, colorScheme.accent);
  });
}

/**
 * Generate an achievement card
 */
export function generateAchievementCard(
  canvas: HTMLCanvasElement,
  data: CardGenerationData,
  _template: CardTemplate
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const { colorScheme } = data;

  // Background with conic gradient effect
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, colorScheme.primary + '20');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Achievement badge
  const badgeRadius = 60;
  drawCircle(ctx, centerX, centerY - 20, badgeRadius, colorScheme.primary);
  
  // Badge emoji
  ctx.font = '48px Arial';
  ctx.fillStyle = colorScheme.text;
  ctx.textAlign = 'center';
  ctx.fillText('🏆', centerX, centerY - 10);

  // Title
  drawText(ctx, data.title, centerX, centerY + 80, {
    fontSize: 20,
    fontWeight: '600',
    color: colorScheme.text,
    textAlign: 'center',
    maxWidth: width * 0.8,
  });

  // Subtitle
  if (data.subtitle) {
    drawText(ctx, data.subtitle, centerX, centerY + 110, {
      fontSize: 14,
      color: colorScheme.text_secondary,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Description
  if (data.description) {
    drawText(ctx, data.description, centerX, centerY + 140, {
      fontSize: 12,
      color: colorScheme.text,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Custom text
  if (data.customText) {
    drawText(ctx, data.customText, centerX, centerY + 170, {
      fontSize: 12,
      fontWeight: '600',
      color: colorScheme.accent,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }
}

/**
 * Generate a family card
 */
export function generateFamilyCard(
  canvas: HTMLCanvasElement,
  data: CardGenerationData,
  _template: CardTemplate
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  const { colorScheme } = data;

  // Background
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
  gradient.addColorStop(0, colorScheme.primary + '20');
  gradient.addColorStop(1, 'transparent');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Title
  drawText(ctx, data.title, width / 2, height * 0.2, {
    fontSize: 28,
    fontWeight: '600',
    color: colorScheme.text,
    textAlign: 'center',
    maxWidth: width * 0.8,
  });

  // Subtitle
  if (data.subtitle) {
    drawText(ctx, data.subtitle, width / 2, height * 0.3, {
      fontSize: 16,
      color: colorScheme.text_secondary,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Family circle
  const centerX = width / 2;
  const centerY = height * 0.5;
  const familyRadius = 60;
  drawCircle(ctx, centerX, centerY, familyRadius, colorScheme.primary);
  
  // Family emoji
  ctx.font = '36px Arial';
  ctx.fillStyle = colorScheme.text;
  ctx.textAlign = 'center';
  ctx.fillText('👨‍👩‍👧‍👦', centerX, centerY + 10);

  // Decorative circles
  drawCircle(ctx, centerX + 40, centerY - 40, 15, colorScheme.secondary);
  drawCircle(ctx, centerX - 40, centerY + 40, 15, colorScheme.accent);

  // Description
  if (data.description) {
    drawText(ctx, data.description, width / 2, height * 0.75, {
      fontSize: 14,
      color: colorScheme.text,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }

  // Custom text
  if (data.customText) {
    drawText(ctx, data.customText, width / 2, height * 0.85, {
      fontSize: 12,
      fontWeight: '600',
      color: colorScheme.accent,
      textAlign: 'center',
      maxWidth: width * 0.8,
    });
  }
}

/**
 * Main card generation function
 */
export function generateCardImage(
  data: CardGenerationData,
  template: CardTemplate
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = createCardCanvas({
        width: 400, // Default width
        height: 400, // Default height
        backgroundColor: data.colorScheme.background,
        textColor: data.colorScheme.text,
        primaryColor: data.colorScheme.primary,
        secondaryColor: data.colorScheme.secondary,
        accentColor: data.colorScheme.accent,
      });

      // Generate based on template type
      switch (template.id) {
        case 'celebration':
          generateCelebrationCard(canvas, data, template);
          break;
        case 'progress':
          generateProgressCard(canvas, data, template);
          break;
        case 'achievement':
          generateAchievementCard(canvas, data, template);
          break;
        case 'family':
          generateFamilyCard(canvas, data, template);
          break;
        default:
          generateCelebrationCard(canvas, data, template);
      }

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download card as PNG file
 */
export function downloadCardAsPNG(dataUrl: string, filename: string = 'family-quest-card.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy card image to clipboard
 */
export async function copyCardToClipboard(dataUrl: string): Promise<void> {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Copy to clipboard
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
}