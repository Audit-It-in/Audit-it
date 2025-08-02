# UI/UX Design Guidelines

## Quick Summary

- **Design Philosophy**: **Neumorphic design** with brand colors for depth and visual appeal
- **Color Palette**: Brand-focused system with blue primary and emerald accent colors
- **Mobile-First**: Responsive design with progressive enhancement for larger screens
- **Component Library**: Custom neumorphic UI components with brand color integration
- **Visual Style**: Soft shadows, subtle depth, and brand-consistent color schemes

## Neumorphic Design System

The project uses a **neumorphic design philosophy** with custom components that integrate **brand colors** for depth and visual appeal:

### Design Principles
- **Soft Depth**: Subtle shadows and raised/inset effects that create visual hierarchy
- **Brand Color Integration**: Primary blue and accent emerald colors used throughout the depth effects
- **Consistent Typography**: Clear text hierarchy with brand-appropriate colors
- **Accessibility**: Maintains WCAG standards while achieving neumorphic aesthetics
- **Responsive**: Neumorphic effects scale appropriately across devices

### Component Configuration
```typescript
// All components located in: @/src/components/ui/
// Examples: button.tsx, card.tsx, input.tsx, etc.
// Each component implements neumorphic design with brand colors

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
```

### Neumorphic Shadow System

**Custom Tailwind utilities for consistent neumorphic effects:**

```css
/* Raised effects (for buttons, cards) */
.shadow-neumorphic-sm     /* Subtle elevation */
.shadow-neumorphic-md     /* Standard elevation */
.shadow-neumorphic-lg     /* High elevation */
.shadow-neumorphic-xl     /* Maximum elevation */

/* Inset effects (for inputs, pressed states) */
.shadow-neumorphic-inset          /* Standard inset */
.shadow-neumorphic-inset-deep     /* Deep inset */

/* Interactive states */
.shadow-neumorphic-focus          /* Focus state with brand colors */
.shadow-neumorphic-hover          /* Hover enhancement */
.shadow-neumorphic-active         /* Active/pressed state */

/* Error states */
.shadow-neumorphic-error          /* Error focus state */
.shadow-neumorphic-inset-error    /* Error inset state */
```

**Usage Examples:**
```typescript
// Standard raised button
<Button className="shadow-neumorphic-md hover:shadow-neumorphic-lg">
  Click me
</Button>

// Input field with inset appearance
<Input className="shadow-neumorphic-inset focus:shadow-neumorphic-focus" />

// Interactive card
<Card className="shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm transition-all duration-200">
  Content
</Card>
```

## Brand Color System

### CSS Custom Properties

```css
:root {
  --primary: oklch(0.445 0.165 264.092); /* Blue-600 */
  --accent: oklch(0.724 0.137 161.327); /* Emerald-500 */
  --ring: oklch(0.445 0.165 264.092); /* Blue-600 for focus rings */
  /* ...other standard shadcn variables */
}
```

### Brand Colors

```javascript
// tailwind.config.js
colors: {
  primary: {
    50: "#eff6ff", 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd",
    400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8",
    800: "#1e40af", 900: "#1e3a8a"
  },
  accent: {
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
    400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857",
    800: "#065f46", 900: "#064e3b"
  },
  neutral: {
    50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
    400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
    800: "#1f2937", 900: "#111827"
  }
}
```

## Neumorphic Component Patterns

### Neumorphic Button Usage

```typescript
import { Button } from "@/src/components/ui/button";

// Neumorphic variants with brand colors
<Button variant="default">Primary Action</Button>        // Raised effect with primary colors
<Button variant="secondary">Secondary Action</Button>    // Subtle raised effect
<Button variant="outline">Outline Button</Button>        // Inset border effect
<Button variant="ghost">Ghost Button</Button>            // Minimal hover effects
<Button variant="destructive">Delete Action</Button>     // Red-tinted neumorphic style

// Sizes maintain neumorphic proportions
<Button size="sm|default|lg|icon">Content</Button>

// Custom neumorphic styling
<Button className="shadow-neumorphic-md hover:shadow-neumorphic-lg transition-all duration-200">
  Enhanced Depth
</Button>
```

### Neumorphic Design Principles

**Key Visual Elements:**
- **Raised Effects**: Primary buttons and cards appear to float above the surface
- **Inset Effects**: Input fields and selected states appear pressed into the surface
- **Brand Color Integration**: Shadows and highlights use variations of primary/accent colors
- **Soft Transitions**: Smooth animations between states enhance the tactile feel
- **Consistent Depth**: Layered hierarchy through varying shadow intensities

### Neumorphic Form Components

```typescript
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

// Neumorphic input with inset appearance
<div className="space-y-2">
  <Label htmlFor="email" className="text-primary-700 font-medium">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    className="w-full shadow-neumorphic-inset focus:shadow-neumorphic-focus"
  />
</div>

// Neumorphic select with brand color integration
<div className="space-y-2">
  <Label htmlFor="role" className="text-primary-700 font-medium">Role</Label>
  <Select>
    <SelectTrigger className="shadow-neumorphic-sm hover:shadow-neumorphic-md">
      <SelectValue placeholder="Select role" />
    </SelectTrigger>
    <SelectContent className="shadow-neumorphic-lg border border-primary-200/50">
      <SelectItem value="accountant">CA</SelectItem>
      <SelectItem value="customer">Customer</SelectItem>
    </SelectContent>
  </Select>
</div>

// Form validation with neumorphic error styling
<div className="space-y-2">
  <Label htmlFor="password" className="text-primary-700 font-medium">Password</Label>
  <Input
    id="password"
    type="password"
    className={cn(
      "w-full transition-all duration-200",
      hasError 
        ? "shadow-neumorphic-inset-error border-red-300 focus:shadow-neumorphic-error" 
        : "shadow-neumorphic-inset focus:shadow-neumorphic-focus"
    )}
  />
  {hasError && (
    <p className="text-red-600/90 text-sm font-medium flex items-center gap-1">
      <AlertTriangleIcon className="h-4 w-4" />
      Password is required
    </p>
  )}
</div>
```

### Neumorphic Card Components

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

// Standard neumorphic card with soft elevation
<Card className="w-full shadow-neumorphic-md hover:shadow-neumorphic-lg transition-all duration-300">
  <CardHeader className="border-b border-primary-100/50">
    <CardTitle className="flex items-center gap-2 text-primary-800">
      <UserIcon className="h-5 w-5 text-primary-600" weight="bold" />
      Profile Information
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4 pt-6">
    <p className="text-primary-600/70">Profile details here</p>
  </CardContent>
</Card>

// Interactive card with pressed state
<Card className="w-full cursor-pointer group shadow-neumorphic-md hover:shadow-neumorphic-sm active:shadow-neumorphic-inset transition-all duration-200">
  <CardContent className="p-6">
    <div className="flex items-center justify-between">
      <span className="text-primary-700 font-medium group-hover:text-primary-800">
        Interactive Card
      </span>
      <ArrowRightIcon className="h-4 w-4 text-primary-500 group-hover:text-primary-600" weight="bold" />
    </div>
  </CardContent>
</Card>

// Status card with accent color integration
<Card className="w-full shadow-neumorphic-md border border-accent-200/50">
  <CardContent className="p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg shadow-neumorphic-inset bg-accent-50">
        <CheckCircleIcon className="h-5 w-5 text-accent-600" weight="bold" />
      </div>
      <div>
        <h3 className="text-primary-800 font-medium">Success</h3>
        <p className="text-primary-600/70 text-sm">Operation completed</p>
      </div>
    </div>
  </CardContent>
</Card>
```

## Neumorphic Brand Color Applications

### Primary Brand Colors in Neumorphic Design

```typescript
// Neumorphic buttons with brand color depth
<Button className="bg-primary-600 hover:bg-primary-700 text-white shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm transition-all duration-200">
  Primary Action
</Button>

// Neumorphic badges with soft depth
<Badge className="bg-primary-100 text-primary-900 border border-primary-200/50 shadow-neumorphic-sm">
  Featured
</Badge>

// Neumorphic focus states with brand colors
<Input className="focus:shadow-neumorphic-focus focus:border-primary-400 transition-all duration-200" />

// Neumorphic notification panels
<div className="border-l-4 border-primary-500 bg-primary-50 p-4 shadow-neumorphic-inset rounded-r-lg">
  <h3 className="text-primary-900 font-medium">Important Notice</h3>
  <p className="text-primary-700/80 text-sm mt-1">With subtle neumorphic depth</p>
</div>
```

### Accent Colors in Neumorphic Components

```typescript
// Success states with neumorphic depth
<Button className="bg-accent-600 hover:bg-accent-700 text-white shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm transition-all duration-200">
  Confirm
</Button>

<Badge className="bg-accent-100 text-accent-900 border border-accent-200/50 shadow-neumorphic-sm">
  Success
</Badge>

// Neumorphic success feedback cards
<div className="bg-accent-50 border border-accent-200/50 rounded-lg p-4 shadow-neumorphic-md">
  <div className="flex items-center gap-2 text-accent-700">
    <div className="p-1 rounded-full shadow-neumorphic-inset bg-accent-100">
      <CheckCircleIcon className="h-4 w-4 text-accent-600" weight="bold" />
    </div>
    <span className="font-medium">Operation completed successfully</span>
  </div>
</div>

// Neumorphic status indicators
<div className="flex items-center gap-2 p-3 bg-accent-50 rounded-lg shadow-neumorphic-inset border border-accent-200/30">
  <div className="w-2 h-2 bg-accent-500 rounded-full shadow-neumorphic-sm"></div>
  <span className="text-accent-800 text-sm font-medium">Active Status</span>
</div>
```

### Text and Background Colors

```typescript
// Text hierarchy
<h1 className="text-primary-900 font-bold">Main Heading</h1>
<h2 className="text-primary-800">Section Heading</h2>
<p className="text-neutral-700">Body text</p>
<span className="text-neutral-500">Secondary information</span>

// Backgrounds
<div className="bg-white">Main content</div>
<div className="bg-neutral-50">Secondary background</div>
<div className="bg-primary-50">Primary branded section</div>

// Links and interactive text
<a href="#" className="text-primary-600 hover:text-primary-700 underline">Link text</a>
```

## Loading States

**Contextual Loading System**: Use meaningful icons that relate to the action being performed.

```typescript
import { InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

// Button loading states
<Button disabled={isLoading}>
  {isLoading ? (
    <div className="flex items-center justify-center space-x-2">
      <InlineLoader action={LoadingAction.SAVING} />
      <span>Saving...</span>
    </div>
  ) : (
    "Save Changes"
  )}
</Button>

// Full-screen loading
<Loader 
  action={LoadingAction.PROCESSING} 
  title="Processing your request..."
  subtitle="This may take a few moments"
/>

// Available loading actions
LoadingAction.SAVING      // FloppyDiskIcon with pulse
LoadingAction.UPLOADING   // CloudArrowUpIcon with bounce
LoadingAction.SEARCHING   // MagnifyingGlassIcon with scanning
LoadingAction.PROCESSING  // CpuIcon with processing animation
LoadingAction.LOADING     // HourglassHighIcon with flip
LoadingAction.SYNCING     // ArrowsClockwiseIcon with spin
LoadingAction.DOWNLOADING // DownloadSimpleIcon with bounce
```

## Status Messages

```typescript
import { StatusMessage } from "@/src/components/common/StatusMessage.component";
import { StatusMessageType } from "@/src/types/common.type";

<StatusMessage message={{ type: StatusMessageType.SUCCESS, text: "Profile updated successfully!" }} />
<StatusMessage message={{ type: StatusMessageType.WARNING, text: "Session expires in 5 minutes" }} />
<StatusMessage message={{ type: StatusMessageType.ERROR, text: "Failed to save changes" }} />
<StatusMessage message={{ type: StatusMessageType.INFO, text: "New features available" }} />
```

## Layout Patterns

### Page Structure

```typescript
<div className='min-h-screen bg-background'>
  <header className='border-b border-border bg-background/95 backdrop-blur'>
    {/* Navigation */}
  </header>
  <main className='container mx-auto px-4 py-8'>
    <div className='max-w-4xl mx-auto space-y-8'>{/* Content */}</div>
  </main>
  <footer className='border-t border-border bg-muted/50'>{/* Footer */}</footer>
</div>
```

### Content Containers

```typescript
// Narrow content (forms, articles)
<div className="container mx-auto px-4 py-8">
  <div className="max-w-2xl mx-auto space-y-6">
    {/* Content */}
  </div>
</div>

// Grid layouts (cards, listings)
<div className="container mx-auto px-4 py-8">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Grid items */}
    </div>
  </div>
</div>
```

## Mobile-First Design

### Responsive Patterns

```typescript
// Mobile-first classes
<div className="p-4 sm:p-6 lg:p-8">
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Touch-friendly sizing
<Button className="h-12 px-6">Touch-friendly button</Button>
<div className="min-h-[44px] flex items-center">Minimum touch target</div>

// Mobile navigation
<nav className='flex items-center justify-between p-4'>
  <div className='flex items-center gap-2'>
    <Button variant='ghost' size='icon' className='md:hidden'>
      <MenuIcon className='h-5 w-5' />
    </Button>
    <span className='font-semibold'>Logo</span>
  </div>
  <div className='hidden md:flex items-center gap-4'>{/* Desktop nav */}</div>
</nav>
```

## Form Design Standards

### Layout and Validation

```typescript
<form className='space-y-6'>
  <div className='space-y-4'>
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
      <div className='space-y-2'>
        <Label htmlFor='first_name'>First Name</Label>
        <Input id='first_name' />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='last_name'>Last Name</Label>
        <Input id='last_name' />
      </div>
    </div>
  </div>

  <div className='flex justify-end gap-2'>
    <Button variant='outline'>Cancel</Button>
    <Button type='submit'>Save</Button>
  </div>
</form>

// Validation patterns
<div className='space-y-2'>
  <Label htmlFor='email'>Email</Label>
  <Input 
    id='email' 
    type='email' 
    aria-invalid={!!errors.email} 
    className={errors.email ? "border-destructive" : ""} 
  />
  {errors.email && (
    <p className='text-sm text-destructive flex items-center gap-1'>
      <AlertCircleIcon className='h-4 w-4' />
      {errors.email.message}
    </p>
  )}
</div>
```

## Icon System

### Icon Usage Guidelines

- **Primary**: Phosphor Icons with `weight="bold"` for consistency and 'Icon' suffix
- **Secondary**: Lucide Icons for shadcn compatibility
- **Sizing**: Use consistent sizes (`h-4 w-4`, `h-5 w-5`)
- **Weight**: Always use `weight='bold'` for all Phosphor icons for visual consistency
- **Colors**: Use semantic color classes (`text-muted-foreground`, `text-primary`)
- **Context**: Prefer Phosphor for consistency, Lucide for shadcn components

```typescript
// Phosphor icons (preferred) - always use 'Icon' suffix
import { UserIcon, CameraIcon, CheckCircleIcon } from "@phosphor-icons/react";

<UserIcon className="h-5 w-5 text-primary-700" weight="bold" />
<CheckCircleIcon className="h-4 w-4 text-accent-600" weight="bold" />

// Lucide icons (for shadcn components)
import { User, Camera, CheckCircle } from "lucide-react";

<User className="h-5 w-5 text-muted-foreground" />
<Camera className="h-4 w-4 text-primary" />
```

## Accessibility Requirements

### ARIA and Keyboard Navigation

```typescript
// Proper ARIA usage
<Button
  aria-label={`Delete ${item.name}`}
  aria-describedby="delete-description"
>
  <TrashIcon className="h-4 w-4" />
</Button>
<div id="delete-description" className="sr-only">
  This action cannot be undone
</div>

// Form field associations
<div className="space-y-2">
  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    type="password"
    aria-describedby="password-help"
  />
  <p id="password-help" className="text-sm text-muted-foreground">
    Must be at least 8 characters
  </p>
</div>

// Keyboard navigation
<div
  tabIndex={0}
  role='button'
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleAction();
    }
  }}
  className='focus:ring-2 focus:ring-ring focus:ring-offset-2'
>
  Custom interactive element
</div>
```

## Performance Guidelines

### Efficient Styling

```typescript
// Use cn utility for conditional classes
import { cn } from "@/src/helpers/tailwind.helper";

<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  isActive && "active-classes",
  className
)}>
  Content
</div>

// Component optimization
const ProfileCard = memo(({ profile, onUpdate }: Props) => {
  const handleUpdate = useCallback(
    (data: ProfileUpdateData) => {
      onUpdate(profile.id, data);
    },
    [profile.id, onUpdate]
  );

  return <Card>{/* Component content */}</Card>;
});
```

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management patterns
- [Database Schema](./database-schema.md) - Database design and relationships
- [Component Standards](./component-standards.md) - Development standards and naming conventions
