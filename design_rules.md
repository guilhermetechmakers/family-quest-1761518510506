# Design Rules for This Project

## Project Design Pattern: ---

## Visual Style

### Color Palette:
- Primary background: #F7FAFC (very light blueish white for main canvas)
- Card backgrounds: #FFFFFF (white), #F6F6FF (very pale lavender), #ECFDF5 (mint green tint), #FFF8E7 (soft cream-yellow)
- Accent colors: 
  - #B9F5D0 (mint green for “Completed”/task cards)
  - #E2D7FB (pale lavender for secondary accents)
  - #F7E1F5 (light pink for playful highlights)
  - #FFE9A7 (pastel yellow for information/task tags)
- Text colors: 
  - #121212 (primary, deep charcoal)
  - #717171 (secondary, muted gray)
  - #A3A3A3 (tertiary, light gray for less important info)
- Highlight colors: #A7F3D0 (light mint green for tags), #C4B5FD (light purple for progress indicators)
- Use of gradients is minimal; color blocks and soft overlays are preferred.

### Typography & Layout:
- Font family: Rounded, geometric sans-serif (e.g., Poppins, Nunito, or similar)
- Font weights: Medium (500) for headings, Regular (400) for body, SemiBold (600) for key numbers/tags
- Hierarchy: Large, bold titles (28–32px); medium section headers (18–20px); card titles (16–18px); body text (14–16px)
- Spacing: Generous padding (24–32px main areas, 16–20px within cards), clear separation between content blocks
- Alignment: Left-aligned for main content, center-aligned for key stats; consistent vertical rhythm
- Rounded treatments: All corners very rounded (16–24px radius), especially on cards and buttons

### Key Design Elements
#### Card Design:
- Cards float above the background with soft, deep drop-shadows (rgba(0,0,0,0.06))
- No hard borders; separation by white space and shadow
- Information hierarchy: Large titles, prominent status tags, secondary info in smaller/gray text
- Status tags (e.g., “Completed”, “Upcoming”) use pill shapes with bold color fills
- Cards may contain avatars or playful iconography for personality

#### Navigation:
- Top navigation bar with monochrome icons (white on black bar), user avatar on the right
- Bottom tab-like section with soft pastel background circles for quick filters
- Active states: Bolder color, subtle shadow, or filled icon
- Navigation is always visible; no collapsible elements

#### Data Visualization:
- Stat blocks: Rounded rectangles with pastel backgrounds, large bold numbers, simple icons
- Progress indicators: Dotted or dashed connecting lines in soft pastel hues
- Minimalist styles: No complex charts, favoring counters and simple tag-based indicators

#### Interactive Elements:
- Buttons: Rounded, pill-shaped; filled for primary (mint green, pastel purple), outlined or ghost for secondary
- Form elements: Rounded input boxes, subtle shadows, placeholder text in light gray
- Hover states: Raise/shadow effect, background color intensifies slightly
- Micro-interactions: Animated status changes (tag appears, card slides in), playful icon pops

### Design Philosophy
This interface embodies:
- A playful, approachable, and family-friendly modern aesthetic with a focus on visual clarity and delight
- Design principles: High accessibility, soft and inviting visuals, clear information hierarchy, and easy navigation for multi-age users
- User experience goals: Reduce cognitive load, foster positive engagement, celebrate progress, and make participation fun for both kids and adults through color, iconography, and visual feedback

---

This project follows the "---

## Visual Style

### Color Palette:
- Primary background: #F7FAFC (very light blueish white for main canvas)
- Card backgrounds: #FFFFFF (white), #F6F6FF (very pale lavender), #ECFDF5 (mint green tint), #FFF8E7 (soft cream-yellow)
- Accent colors: 
  - #B9F5D0 (mint green for “Completed”/task cards)
  - #E2D7FB (pale lavender for secondary accents)
  - #F7E1F5 (light pink for playful highlights)
  - #FFE9A7 (pastel yellow for information/task tags)
- Text colors: 
  - #121212 (primary, deep charcoal)
  - #717171 (secondary, muted gray)
  - #A3A3A3 (tertiary, light gray for less important info)
- Highlight colors: #A7F3D0 (light mint green for tags), #C4B5FD (light purple for progress indicators)
- Use of gradients is minimal; color blocks and soft overlays are preferred.

### Typography & Layout:
- Font family: Rounded, geometric sans-serif (e.g., Poppins, Nunito, or similar)
- Font weights: Medium (500) for headings, Regular (400) for body, SemiBold (600) for key numbers/tags
- Hierarchy: Large, bold titles (28–32px); medium section headers (18–20px); card titles (16–18px); body text (14–16px)
- Spacing: Generous padding (24–32px main areas, 16–20px within cards), clear separation between content blocks
- Alignment: Left-aligned for main content, center-aligned for key stats; consistent vertical rhythm
- Rounded treatments: All corners very rounded (16–24px radius), especially on cards and buttons

### Key Design Elements
#### Card Design:
- Cards float above the background with soft, deep drop-shadows (rgba(0,0,0,0.06))
- No hard borders; separation by white space and shadow
- Information hierarchy: Large titles, prominent status tags, secondary info in smaller/gray text
- Status tags (e.g., “Completed”, “Upcoming”) use pill shapes with bold color fills
- Cards may contain avatars or playful iconography for personality

#### Navigation:
- Top navigation bar with monochrome icons (white on black bar), user avatar on the right
- Bottom tab-like section with soft pastel background circles for quick filters
- Active states: Bolder color, subtle shadow, or filled icon
- Navigation is always visible; no collapsible elements

#### Data Visualization:
- Stat blocks: Rounded rectangles with pastel backgrounds, large bold numbers, simple icons
- Progress indicators: Dotted or dashed connecting lines in soft pastel hues
- Minimalist styles: No complex charts, favoring counters and simple tag-based indicators

#### Interactive Elements:
- Buttons: Rounded, pill-shaped; filled for primary (mint green, pastel purple), outlined or ghost for secondary
- Form elements: Rounded input boxes, subtle shadows, placeholder text in light gray
- Hover states: Raise/shadow effect, background color intensifies slightly
- Micro-interactions: Animated status changes (tag appears, card slides in), playful icon pops

### Design Philosophy
This interface embodies:
- A playful, approachable, and family-friendly modern aesthetic with a focus on visual clarity and delight
- Design principles: High accessibility, soft and inviting visuals, clear information hierarchy, and easy navigation for multi-age users
- User experience goals: Reduce cognitive load, foster positive engagement, celebrate progress, and make participation fun for both kids and adults through color, iconography, and visual feedback

---" design pattern.
All design decisions should align with this pattern's best practices.

## General Design Principles

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Dark mode with elevated surfaces

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)
- Test colors in both light and dark modes

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)
- Adjust shadow intensity based on theme (lighter in dark mode)

---

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast (both themes)
- Respect reduced motion preferences

---

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions
9. **Be Themeable** - Support both dark and light modes seamlessly

---

