# Family Quest - Family Goal Tracking App

A modern, family-friendly goal tracking application that helps families achieve their dreams together. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### Core Functionality
- **Goal Management**: Create, track, and manage family goals with visual progress indicators
- **Contribution System**: Support for both monetary and non-monetary contributions
- **Family Collaboration**: Invite family members with different permission levels
- **Activity Feed**: Real-time updates on family activities and achievements
- **Milestone Tracking**: Celebrate progress with customizable milestones and rewards
- **Shareable Cards**: Generate beautiful shareable cards for social media

### User Experience
- **Responsive Design**: Mobile-first approach with dedicated mobile and desktop layouts
- **Role-Based Access**: Parent, Child, and Guest roles with appropriate permissions
- **Real-time Updates**: Live activity feed and notifications
- **Gamification**: Points, badges, and rewards to keep families engaged
- **Social Features**: Comments, reactions, and family interactions

### Technical Features
- **Modern Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **State Management**: TanStack React Query for server state
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Tailwind CSS animations and transitions
- **Type Safety**: Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family-quest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── layout/          # Layout components
│   ├── goal-wizard/     # Goal creation wizard
│   ├── contribution-form/ # Contribution forms
│   ├── activity-feed/   # Activity feed components
│   └── notifications/   # Notification components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── api/                 # API layer and utilities
├── types/               # TypeScript type definitions
├── lib/                 # Utility functions
└── main.tsx            # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary Background**: #F7FAFC (very light blueish white)
- **Card Backgrounds**: #FFFFFF, #F6F6FF, #ECFDF5, #FFF8E7
- **Accent Colors**: 
  - #B9F5D0 (mint green for completed tasks)
  - #E2D7FB (pale lavender for secondary accents)
  - #F7E1F5 (light pink for playful highlights)
  - #FFE9A7 (pastel yellow for information tags)
- **Text Colors**: #121212 (primary), #717171 (secondary), #A3A3A3 (tertiary)

### Typography
- **Font Family**: Inter, Poppins, Nunito (rounded, geometric sans-serif)
- **Weights**: Medium (500) for headings, Regular (400) for body, SemiBold (600) for key numbers
- **Hierarchy**: Large titles (28–32px), section headers (18–20px), card titles (16–18px), body text (14–16px)

### Components
- **Cards**: Floating cards with soft shadows (rgba(0,0,0,0.06))
- **Buttons**: Pill-shaped with hover effects and micro-interactions
- **Status Tags**: Rounded pills with bold color fills
- **Progress Bars**: Animated progress indicators with smooth transitions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Responsive Design

The application features a responsive design that adapts to different screen sizes:

- **Mobile (< 1024px)**: Bottom navigation, collapsible menu, touch-friendly interface
- **Desktop (≥ 1024px)**: Sidebar navigation, expanded layout, hover interactions

## 🎯 Key Pages

### Public Pages
- **Landing Page**: Marketing page with feature highlights and pricing
- **Login/Signup**: Authentication with social login options
- **Password Reset**: Secure password recovery flow

### Protected Pages
- **Dashboard**: Overview of goals, progress, and quick actions
- **Goal Detail**: Individual goal view with contributions and activity
- **Create Goal**: Multi-step wizard for goal creation
- **Activity Feed**: Family activity timeline with interactions
- **Notifications**: Notification center with filtering
- **Profile**: User profile and family settings

## 🔐 Authentication & Authorization

- **JWT-based Authentication**: Secure token-based auth
- **Role-Based Access Control**: Parent, Child, Guest roles
- **Social Login**: Google and Apple OAuth integration
- **Password Security**: Strength validation and secure storage

## 📊 State Management

- **Server State**: TanStack React Query for API data
- **Form State**: React Hook Form for form management
- **Local State**: React useState for component state
- **Caching**: Intelligent caching with background updates

## 🎨 UI/UX Features

### Animations
- **Page Transitions**: Smooth fade and slide animations
- **Micro-interactions**: Hover effects, button presses, loading states
- **Progress Animations**: Animated progress bars and counters
- **Staggered Lists**: Sequential animations for list items

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Clear focus indicators

## 🚀 Performance

- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: WebP format with lazy loading
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Intelligent API caching and invalidation

## 🧪 Testing

The project is set up for testing with:
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing setup

## 📦 Dependencies

### Core
- React 18.3.1
- TypeScript 5.8.3
- Vite 5.4.19

### UI & Styling
- Tailwind CSS 3.4.17
- Shadcn/ui components
- Radix UI primitives
- Lucide React icons

### State Management
- TanStack React Query 5.83.0
- React Hook Form 7.61.1
- Zod 3.25.76

### Routing & Navigation
- React Router DOM 6.30.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from modern family apps
- Shadcn/ui for the excellent component library
- Radix UI for accessible primitives
- Tailwind CSS for the utility-first approach

---

**Family Quest** - Making family dreams come true, one goal at a time! 🎯👨‍👩‍👧‍👦