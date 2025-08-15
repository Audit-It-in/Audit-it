# Design Document

## Overview

The accountant profile page redesign transforms the existing interface into a sophisticated neumorphic experience that showcases Chartered Accountants' professional credentials through creative depth effects, strategic brand color integration, and enhanced visual hierarchy. The design maintains all current functionality while elevating the user experience through modern neumorphic principles.

The redesign focuses on creating a premium, trustworthy appearance that reflects the professional nature of CA services while making the interface more engaging and easier to navigate. Every element will utilize neumorphic styling to create a cohesive, modern aesthetic that differentiates the platform from competitors.

## Architecture

### Component Structure

The redesigned page maintains the existing component architecture while enhancing each component with neumorphic styling:

```
AccountantProfilePage (Server Component)
├── AccountantProfilePageClient (Client Wrapper)
└── AccountantProfileView (Main Component)
    ├── ProfileNav (Breadcrumb + Actions)
    ├── ProfileHeader (Hero Section)
    ├── MainContent (Two/Three Column Layout)
    │   ├── ProfessionalSummary (Bio + Highlights)
    │   ├── ExperienceSection (Work History)
    │   └── EducationSection (Academic Background)
    └── SidebarDetails (Contact + Specializations)
    └── ProfileCTA (Bottom Action Section)
```

### Layout Architecture

#### Desktop Layout (1024px+)

- **Three-column grid**: Main content (2 columns) + Sidebar (1 column)
- **Enhanced spacing**: Generous padding and margins for neumorphic depth
- **Floating elements**: Cards with elevated shadows for premium feel

#### Tablet Layout (768px - 1023px)

- **Two-column grid**: Stacked main content + Sidebar
- **Adaptive spacing**: Optimized for touch while maintaining neumorphic effects
- **Responsive cards**: Adjusted shadow intensities for medium screens

#### Mobile Layout (320px - 767px)

- **Single-column stack**: Vertical flow with full-width neumorphic cards
- **Touch-optimized**: Larger touch targets with enhanced active states
- **Progressive disclosure**: Collapsible sections with neumorphic indicators

### Visual Hierarchy System

#### Primary Level (Hero Information)

- **Elevation**: `shadow-neumorphic-xl` with brand color hints
- **Typography**: Large, bold headings with `text-primary-900`
- **Spacing**: Generous padding (p-8) for premium feel

#### Secondary Level (Section Headers)

- **Elevation**: `shadow-neumorphic-lg` with subtle brand accents
- **Typography**: Medium headings with `text-primary-800`
- **Spacing**: Balanced padding (p-6) for content sections

#### Tertiary Level (Content Cards)

- **Elevation**: `shadow-neumorphic-md` for individual items
- **Typography**: Regular text with `text-primary-700`
- **Spacing**: Comfortable padding (p-4) for readability

## Components and Interfaces

### Enhanced ProfileHeader Component

#### Design Specifications

```typescript
interface ProfileHeaderProps {
  fullName: string;
  location: string;
  initials: string;
  avatarUrl?: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  responseTime: string;
  onPrimaryCTA: () => void;
  secondaryPhone?: string;
  secondaryEmail?: string;
  isAuthenticated: boolean;
}
```

#### Visual Design

- **Container**: Large neumorphic card with `shadow-neumorphic-xl` and subtle primary color hints
- **Avatar Section**:
  - Profile picture in circular neumorphic frame with `shadow-neumorphic-inset`
  - Verification badge with `shadow-neumorphic-sm` and accent color
  - Fallback initials with brand color background
- **Information Layout**:
  - Name in `text-3xl font-bold text-primary-900`
  - Location with map icon in `text-primary-700`
  - Rating stars with neumorphic glow effects
- **Action Buttons**:
  - Primary CTA with `shadow-neumorphic-primary hover:shadow-neumorphic-primary-lg`
  - Secondary actions with `shadow-neumorphic-sm` styling

### Enhanced ProfessionalSummary Component

#### Design Specifications

- **Bio Container**: Neumorphic inset design with `shadow-neumorphic-inset` and `bg-neutral-50`
- **Highlights Grid**: Four-column grid with neumorphic metric cards
- **Visual Accents**: Colored accent bars and neumorphic icons

#### Implementation Pattern

```typescript
<Card className='shadow-neumorphic-lg border border-primary-100 bg-white'>
  <div className='p-8 space-y-6'>
    <SectionHeader title='Professional Summary' />
    <div className='p-6 rounded-xl shadow-neumorphic-inset bg-neutral-50 border border-primary-100'>
      <BiographyText />
    </div>
    <HighlightsGrid />
  </div>
</Card>
```

### Enhanced ExperienceSection Component

#### Design Specifications

- **Timeline Layout**: Vertical timeline with neumorphic connection lines
- **Experience Cards**: Individual neumorphic cards with hover effects
- **Date Indicators**: Neumorphic date badges with brand color accents
- **Company Logos**: Placeholder neumorphic containers for future logo integration

#### Visual Elements

- **Timeline Connector**: Vertical line with neumorphic depth using `shadow-neumorphic-inset`
- **Date Badges**: Circular neumorphic elements with `shadow-neumorphic-sm`
- **Content Cards**: `shadow-neumorphic-md hover:shadow-neumorphic-lg` with smooth transitions

### Enhanced EducationSection Component

#### Design Specifications

- **Academic Cards**: Neumorphic cards with institutional branding areas
- **Degree Hierarchy**: Visual emphasis on degree levels using shadow intensity
- **Grade Display**: Neumorphic badge system for academic achievements
- **Timeline Integration**: Consistent with experience section styling

### Enhanced SidebarDetails Component

#### Design Specifications

- **Sticky Positioning**: Sidebar follows scroll with neumorphic shadow adjustments
- **Information Blocks**: Grouped neumorphic containers for different data types
- **Contact Methods**: Interactive neumorphic buttons with brand color integration
- **Specialization Tags**: Neumorphic pill design with category color coding

#### Section Breakdown

1. **Contact Information**: Primary neumorphic card with contact methods
2. **Specializations**: Grid of neumorphic tags with category colors
3. **Languages**: Horizontal neumorphic pills with flag icons
4. **Verification Details**: Neumorphic status indicators with trust signals

### Enhanced ProfileCTA Component

#### Design Specifications

- **Sticky Bottom Bar**: Mobile-optimized with neumorphic elevation
- **Action Hierarchy**: Primary and secondary actions with distinct neumorphic styling
- **Responsive Behavior**: Adapts from bottom bar to inline section on larger screens

## Data Models

### ProfileDetails Interface (Existing)

The design utilizes all existing database fields without modifications:

```typescript
interface ProfileDetails extends Profile {
  // Core profile data
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  bio?: string;
  email?: string;
  phone?: string;
  whatsapp_available: boolean;

  // Location data (resolved from foreign keys)
  state_name?: string;
  district_name?: string;

  // Specializations and languages (resolved arrays)
  language_names: string[];
  specialization_names: string[];
}
```

### Experience Interface (Existing)

```typescript
interface Experience {
  title?: string;
  company_name?: string;
  location?: string;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  description?: string;
}
```

### Education Interface (Existing)

```typescript
interface Education {
  institute_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
}
```

### Verification Interface (Existing)

```typescript
interface Verification {
  membership_number?: string;
  membership_certificate_url?: string;
  verified_at?: string;
  verified_by?: string;
}
```

## Error Handling

### Enhanced Error States with Neumorphic Design

#### Profile Not Found

- **Container**: Large neumorphic card with subtle error color hints
- **Icon**: Neumorphic error icon with appropriate shadow depth
- **Actions**: Neumorphic buttons for navigation options
- **Typography**: Clear, empathetic messaging with proper hierarchy

#### Loading States

- **Skeleton Components**: Neumorphic skeleton cards that match final layout
- **Progressive Loading**: Staggered appearance of neumorphic elements
- **Smooth Transitions**: Fade-in effects for loaded content

#### Network Errors

- **Retry Interface**: Neumorphic retry button with clear messaging
- **Offline Indicators**: Neumorphic status bars for connection issues

## Testing Strategy

### Visual Regression Testing

- **Component Screenshots**: Capture neumorphic styling across breakpoints
- **Interaction States**: Document hover, active, and focus states
- **Cross-browser Compatibility**: Ensure neumorphic effects render consistently

### Accessibility Testing

- **Focus Indicators**: Verify neumorphic focus rings meet contrast requirements
- **Screen Reader Testing**: Ensure neumorphic elements don't interfere with accessibility
- **Keyboard Navigation**: Test neumorphic interactive elements with keyboard-only navigation

### Performance Testing

- **Shadow Rendering**: Monitor performance impact of multiple neumorphic shadows
- **Animation Smoothness**: Ensure 60fps performance for neumorphic transitions
- **Bundle Size**: Track CSS impact of neumorphic utilities

## Implementation Phases

### Phase 1: Core Neumorphic Framework

1. **Shadow System**: Implement enhanced neumorphic shadow utilities
2. **Base Components**: Convert existing UI components to neumorphic styling
3. **Color Integration**: Apply brand colors to neumorphic elements

### Phase 2: Layout Enhancement

1. **Grid System**: Implement responsive neumorphic layout containers
2. **Spacing System**: Apply consistent neumorphic spacing patterns
3. **Typography**: Enhance text hierarchy with neumorphic context

### Phase 3: Interactive Elements

1. **Button States**: Implement neumorphic hover, active, and focus states
2. **Form Elements**: Style contact forms with neumorphic design
3. **Navigation**: Enhance breadcrumbs and navigation with neumorphic styling

### Phase 4: Advanced Features

1. **Animations**: Add smooth neumorphic transitions and micro-interactions
2. **Loading States**: Implement neumorphic skeleton components
3. **Error Handling**: Style error states with neumorphic design principles

### Phase 5: Optimization

1. **Performance**: Optimize neumorphic shadow rendering
2. **Accessibility**: Fine-tune neumorphic elements for accessibility compliance
3. **Cross-browser**: Ensure consistent neumorphic rendering across browsers

## Design Tokens

### Enhanced Neumorphic Shadows

```css
/* Primary brand-colored shadows */
.shadow-neumorphic-primary: 4px 4px 12px rgba(37, 99, 235, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)
.shadow-neumorphic-primary-lg: 6px 6px 16px rgba(37, 99, 235, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)

/* Accent emerald shadows */
.shadow-neumorphic-accent: 4px 4px 12px rgba(16, 185, 129, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)

/* Interactive state shadows */
.shadow-neumorphic-focus: 0 0 0 3px rgba(37, 99, 235, 0.2), 4px 4px 12px rgba(0, 0, 0, 0.08)
.shadow-neumorphic-hover: 6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)
```

### Brand Color Integration

```css
/* Primary blue spectrum for neumorphic elements */
--primary-neumorphic-bg: #eff6ff;
--primary-neumorphic-border: #bfdbfe;
--primary-neumorphic-accent: #2563eb;

/* Accent emerald for success states */
--accent-neumorphic-bg: #ecfdf5;
--accent-neumorphic-border: #a7f3d0;
--accent-neumorphic-accent: #10b981;
```

### Responsive Breakpoints

```css
/* Neumorphic shadow adjustments by screen size */
@media (max-width: 768px) {
  .shadow-neumorphic-md {
    /* Reduced intensity for mobile */
  }
}

@media (min-width: 1024px) {
  .shadow-neumorphic-xl {
    /* Enhanced depth for desktop */
  }
}
```

This design document provides a comprehensive blueprint for transforming the accountant profile page into a sophisticated neumorphic experience while maintaining all existing functionality and data structures.
