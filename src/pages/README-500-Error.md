# 500 Server Error Page Implementation

## Overview

The 500 Server Error page is a comprehensive error handling component designed to maintain user trust and provide clear guidance during server-related disruptions. It follows the Family Quest design system and provides multiple recovery options for users.

## Features

### Core Functionality
- **Error Display**: Clear, user-friendly error message with visual hierarchy
- **Trace ID**: Unique identifier for support troubleshooting
- **Retry Logic**: Smart retry functionality with attempt tracking
- **Support Contact**: Pre-formatted email with error details
- **Navigation Options**: Multiple ways to recover or navigate away

### Design Elements
- **Family Quest Color Palette**: Uses project-specific colors (#F7FAFC, #B9F5D0, #E2D7FB, etc.)
- **Rounded Design**: 16-24px border radius following design system
- **Card-based Layout**: Floating cards with soft shadows
- **Responsive Design**: Mobile-first approach with tablet/desktop enhancements
- **Animations**: Fade-in, slide-up, and bounce animations using Tailwind CSS

### Accessibility
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Components

### ServerErrorPage
Main error page component with the following props:
- `traceId?: string` - Optional trace ID for error tracking
- `errorMessage?: string` - Custom error message
- `onRetry?: () => void` - Custom retry handler

### ErrorHandler
Utility class for managing errors throughout the application:
- `handleServerError()` - Handles server errors and redirects to 500 page
- `handleApiError()` - Handles API errors with retry logic
- `generateTraceId()` - Creates unique trace IDs
- `getErrorFromUrl()` - Extracts error details from URL parameters

## Usage

### Basic Usage
```tsx
import { ServerErrorPage } from '@/pages/ServerErrorPage';

// Direct usage
<ServerErrorPage />

// With custom props
<ServerErrorPage 
  traceId="ERR-1234567890-ABC123"
  errorMessage="Custom error message"
  onRetry={() => window.location.reload()}
/>
```

### Error Handling in Components
```tsx
import { errorHandler } from '@/lib/errorHandler';

// Handle server errors
try {
  // API call
} catch (error) {
  errorHandler.handleServerError(error, 'Custom error message');
}

// Handle API errors with retry
try {
  // API call
} catch (error) {
  await errorHandler.handleApiError(
    error,
    async () => {
      // Retry logic
      return await retryApiCall();
    },
    3 // max retries
  );
}
```

## Routing

The 500 error page is accessible via multiple routes:
- `/500` - Primary error page route
- `/server-error` - Alternative route
- `/test-errors` - Development testing page

## Error Flow

1. **Error Occurs**: Server error or API failure
2. **Error Handler**: `ErrorHandler` processes the error
3. **Trace ID Generation**: Unique identifier created
4. **Error Logging**: Error details logged to console
5. **Redirect**: User redirected to 500 page with error details
6. **User Actions**: User can retry, contact support, or navigate away

## Retry Logic

- **Maximum Attempts**: 3 retry attempts allowed
- **Retry Tracking**: Attempts tracked in error queue
- **Visual Feedback**: Loading states and attempt counters
- **Smart Retry**: Only retries 5xx errors with retry functions

## Support Integration

- **Pre-formatted Email**: Includes trace ID, error message, URL, timestamp
- **Error Context**: User agent, retry count, and technical details
- **Support Links**: Direct links to help center and status page

## Testing

Use the `/test-errors` page to test different error scenarios:
- Server errors (500)
- API errors with retry
- Retryable errors
- Error queue management

## Design System Compliance

### Colors
- Primary Background: #F7FAFC
- Card Background: #FFFFFF
- Mint Green: #B9F5D0 (primary actions)
- Pale Lavender: #E2D7FB (secondary actions)
- Text Primary: #121212
- Text Secondary: #717171

### Typography
- Font Family: Inter, Poppins, Nunito
- Headings: 28-32px, font-weight 500
- Body: 14-16px, font-weight 400
- Rounded geometric sans-serif

### Spacing
- Main areas: 24-32px padding
- Card content: 16-20px padding
- Consistent 4px spacing scale

### Animations
- Fade-in: 0.4s ease-out
- Slide-up: 0.4s ease-out
- Bounce-in: 0.6s ease-out
- Hover effects: 0.2s ease-out

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile, tablet, and desktop
- Graceful degradation for older browsers

## Performance

- Optimized animations using CSS transforms
- Lazy loading of error details
- Minimal JavaScript footprint
- Efficient error queue management

## Security

- No sensitive data exposed in error messages
- Trace IDs are non-sequential and non-guessable
- Error details sanitized before display
- Secure error logging practices

## Future Enhancements

- Real-time error monitoring integration
- Advanced retry strategies (exponential backoff)
- Error analytics and reporting
- Custom error page themes
- Multi-language support