# UI/UX Design Guidelines

## Quick Summary

- **Design System**: Clean, modern design with shadcn/ui components
- **Color Palette**: Brand-focused system with blue primary and emerald accent colors
- **Mobile-First**: Responsive design with progressive enhancement for larger screens
- **Component Library**: shadcn/ui as the primary UI component system
- **Design Philosophy**: Accessible, performant, and maintainable design patterns

## Design System Configuration

The project uses **shadcn/ui** with the **New York** style variant and **brand colors**:

```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "blue",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/src/components",
    "utils": "@/src/helpers/tailwind.helper",
    "ui": "@/src/components/ui"
  }
}
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

## Core Component Patterns

### Button Usage

```typescript
import { Button } from "@/src/components/ui/button";

// Variants
<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Action</Button>

// Sizes
<Button size="sm|default|lg|icon">Content</Button>
```

### Form Components

```typescript
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    className="w-full"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="role">Role</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select role" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="accountant">CA</SelectItem>
      <SelectItem value="customer">Customer</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Card Components

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

<Card className="w-full">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <UserIcon className="h-5 w-5" />
      Profile Information
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-muted-foreground">Profile details here</p>
  </CardContent>
</Card>
```

## Brand Color Applications

### Primary Brand Usage

```typescript
// Buttons and CTAs
<Button className="bg-primary-600 hover:bg-primary-700 text-white">Primary Action</Button>

// Badges and highlights
<Badge className="bg-primary-100 text-primary-900 border-primary-200">Featured</Badge>

// Focus states
<Input className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />

// Borders and accents
<div className="border-l-4 border-primary-500 bg-primary-50 p-4">
  <h3 className="text-primary-900">Important Notice</h3>
</div>
```

### Accent Color Usage

```typescript
// Success states and positive actions
<Button className="bg-accent-600 hover:bg-accent-700 text-white">Confirm</Button>
<Badge className="bg-accent-100 text-accent-900 border-accent-200">Success</Badge>

// Success feedback
<div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
  <div className="flex items-center gap-2 text-accent-700">
    <CheckCircleIcon className="h-5 w-5" />
    <span className="font-medium">Operation completed successfully</span>
  </div>
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
