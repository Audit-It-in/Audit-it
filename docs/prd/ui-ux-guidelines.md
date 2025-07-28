# UI/UX Design Guidelines

## Quick Summary

- **Design System**: Clean, modern design with shadcn/ui components
- **Color Palette**: Neutral-based system with CSS custom properties
- **Mobile-First**: Responsive design with progressive enhancement for larger screens
- **Component Library**: shadcn/ui as the primary UI component system
- **Design Philosophy**: Accessible, performant, and maintainable design patterns

## Detailed Sections

### [shadcn/ui Design System](#shadcnui-design-system)

### [Color System & Design Tokens](#color-system--design-tokens)

### [Component Design Patterns](#component-design-patterns)

### [Mobile-First Guidelines](#mobile-first-guidelines)

### [User Experience Guidelines](#user-experience-guidelines)

---

## shadcn/ui Design System

### Design System Configuration

The project uses **shadcn/ui** with the **New York** style variant for a clean, modern appearance:

```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/src/components",
    "utils": "@/src/helpers/tailwind.helper",
    "ui": "@/src/components/ui"
  }
}
```

### Design Token System

#### CSS Custom Properties

All design tokens are defined as CSS custom properties for consistency:

```css
/* CSS custom properties from shadcn/ui */
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --radius: 0.5rem;
}
```

#### Brand Color Extensions

Additional brand colors that extend the shadcn base:

```javascript
// tailwind.config.js extensions
colors: {
  // Brand Colors
  primary: {
    50: "#eff6ff",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  accent: {
    50: "#ecfdf5",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  // shadcn/ui semantic colors
  border: "var(--border)",
  input: "var(--input)",
  ring: "var(--ring)",
  background: "var(--background)",
  foreground: "var(--foreground)",
  primary: {
    DEFAULT: "var(--primary)",
    foreground: "var(--primary-foreground)",
  },
  secondary: {
    DEFAULT: "var(--secondary)",
    foreground: "var(--secondary-foreground)",
  },
  destructive: {
    DEFAULT: "var(--destructive)",
    foreground: "var(--destructive-foreground)",
  },
  muted: {
    DEFAULT: "var(--muted)",
    foreground: "var(--muted-foreground)",
  },
  accent: {
    DEFAULT: "var(--accent)",
    foreground: "var(--accent-foreground)",
  },
  card: {
    DEFAULT: "var(--card)",
    foreground: "var(--card-foreground)",
  },
}
```

### Component Usage Patterns

#### Card Components

```typescript
// ✅ Proper shadcn Card usage
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

// ❌ Avoid custom card implementations
<div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md">
  {/* Custom card styling */}
</div>
```

#### Button Components

```typescript
// ✅ Standard button variants
import { Button } from "@/src/components/ui/button";

<Button variant="default">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Action</Button>

// ✅ Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><PlusIcon className="h-4 w-4" /></Button>
```

#### Form Components

```typescript
// ✅ Consistent form patterns
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

---

## Color System & Design Tokens

### Semantic Color Usage

#### Text Colors

```typescript
// ✅ Semantic text color usage
<h1 className="text-foreground">Primary heading</h1>
<p className="text-muted-foreground">Secondary text</p>
<span className="text-destructive">Error message</span>
<small className="text-muted-foreground">Helper text</small>
```

#### Background Colors

```typescript
// ✅ Semantic background usage
<div className="bg-background">Main background</div>
<div className="bg-card">Card background</div>
<div className="bg-muted">Muted background</div>
<div className="bg-primary text-primary-foreground">Primary background</div>
```

#### Border Colors

```typescript
// ✅ Consistent border usage
<div className="border-border">Default border</div>
<div className="border-input">Input border</div>
<div className="border-destructive">Error border</div>
```

### Brand Color Applications

#### Primary Brand Usage

```typescript
// ✅ Primary brand color usage
<Button className="bg-primary-600 hover:bg-primary-700">
<Badge className="bg-primary-100 text-primary-900">
<div className="border-l-4 border-primary-500">
```

#### Accent Color Usage

```typescript
// ✅ Accent color usage (success, positive actions)
<Badge className="bg-accent-100 text-accent-900">Success</Badge>
<Button className="bg-accent-600 hover:bg-accent-700">Confirm</Button>
<div className="text-accent-600">Positive message</div>
```

---

## Component Design Patterns

### Layout Components

#### Page Layout Structure

```typescript
// ✅ Standard page layout
<div className='min-h-screen bg-background'>
  <header className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
    {/* Navigation */}
  </header>

  <main className='container mx-auto px-4 py-8'>
    <div className='max-w-4xl mx-auto space-y-8'>{/* Page content */}</div>
  </main>

  <footer className='border-t border-border bg-muted/50'>{/* Footer content */}</footer>
</div>
```

#### Content Containers

```typescript
// ✅ Content container patterns
<div className="container mx-auto px-4 py-8">
  <div className="max-w-2xl mx-auto space-y-6">
    {/* Narrow content (forms, articles) */}
  </div>
</div>

<div className="container mx-auto px-4 py-8">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Grid layouts (cards, listings) */}
    </div>
  </div>
</div>
```

### Interactive Components

#### Loading States

```typescript
// ✅ Loading button states
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <CircleNotchIcon className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save Changes"
  )}
</Button>

// ✅ Loading cards
<Card className="w-full">
  <CardContent className="pt-6">
    <div className="space-y-2">
      <div className="h-4 bg-muted animate-pulse rounded" />
      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
    </div>
  </CardContent>
</Card>
```

#### Error States

```typescript
// ✅ Error handling patterns
<Card className='border-destructive'>
  <CardContent className='pt-6'>
    <div className='flex items-center gap-2 text-destructive'>
      <AlertCircleIcon className='h-4 w-4' />
      <span className='text-sm'>An error occurred</span>
    </div>
    <Button variant='outline' size='sm' className='mt-2' onClick={retry}>
      Try Again
    </Button>
  </CardContent>
</Card>
```

#### Empty States

```typescript
// ✅ Empty state patterns
<Card className='w-full'>
  <CardContent className='pt-6 text-center'>
    <div className='space-y-4'>
      <div className='mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center'>
        <SearchIcon className='h-6 w-6 text-muted-foreground' />
      </div>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>No results found</h3>
        <p className='text-muted-foreground'>Try adjusting your search criteria</p>
      </div>
      <Button variant='outline'>Clear Filters</Button>
    </div>
  </CardContent>
</Card>
```

---

## Mobile-First Guidelines

### Responsive Design Principles

#### Breakpoint Strategy

```typescript
// ✅ Mobile-first responsive classes
<div className="p-4 sm:p-6 lg:p-8">
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

#### Touch-Friendly Design

```typescript
// ✅ Touch target sizing
<Button className="h-12 px-6">Touch-friendly button</Button>
<div className="min-h-[44px] flex items-center">Minimum touch target</div>

// ✅ Spacing for touch
<div className="space-y-4 sm:space-y-2">
  {/* More spacing on mobile */}
</div>
```

### Navigation Patterns

#### Mobile Navigation

```typescript
// ✅ Mobile-responsive navigation
<nav className='flex items-center justify-between p-4'>
  <div className='flex items-center gap-2'>
    <Button variant='ghost' size='icon' className='md:hidden'>
      <MenuIcon className='h-5 w-5' />
    </Button>
    <span className='font-semibold'>Logo</span>
  </div>

  <div className='hidden md:flex items-center gap-4'>{/* Desktop navigation items */}</div>
</nav>
```

---

## User Experience Guidelines

### Interaction Design

#### Focus Management

```typescript
// ✅ Proper focus indicators
<Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
<Input className="focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring" />

// ✅ Focus trapping in modals
<Dialog>
  <DialogContent className="focus:outline-none">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    {/* Modal content with proper focus management */}
  </DialogContent>
</Dialog>
```

#### Loading and Feedback

```typescript
// ✅ Immediate feedback patterns
<Button onClick={handleAction} disabled={isPending} className='relative'>
  {isPending && (
    <div className='absolute inset-0 flex items-center justify-center'>
      <CircleNotchIcon className='h-4 w-4 animate-spin' />
    </div>
  )}
  <span className={isPending ? "opacity-0" : ""}>Submit</span>
</Button>
```

### Form Design Standards

#### Form Layout

```typescript
// ✅ Consistent form structure
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

    <div className='space-y-2'>
      <Label htmlFor='email'>Email</Label>
      <Input id='email' type='email' />
    </div>
  </div>

  <div className='flex justify-end gap-2'>
    <Button variant='outline'>Cancel</Button>
    <Button type='submit'>Save</Button>
  </div>
</form>
```

#### Validation Patterns

```typescript
// ✅ Form validation with shadcn
<div className='space-y-2'>
  <Label htmlFor='email'>Email</Label>
  <Input id='email' type='email' aria-invalid={!!errors.email} className={errors.email ? "border-destructive" : ""} />
  {errors.email && (
    <p className='text-sm text-destructive flex items-center gap-1'>
      <AlertCircleIcon className='h-4 w-4' />
      {errors.email.message}
    </p>
  )}
</div>
```

### Accessibility Requirements

#### ARIA Labels and Descriptions

```typescript
// ✅ Proper ARIA usage
<Button
  aria-label={`Delete ${item.name}`}
  aria-describedby="delete-description"
>
  <TrashIcon className="h-4 w-4" />
</Button>
<div id="delete-description" className="sr-only">
  This action cannot be undone
</div>

// ✅ Form field associations
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
```

#### Keyboard Navigation

```typescript
// ✅ Keyboard-accessible components
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

### Performance Guidelines

#### Efficient Styling

```typescript
// ✅ Using cn utility for conditional classes
import { cn } from "@/src/helpers/tailwind.helper";

<div className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  isActive && "active-classes",
  className
)}>
  Content
</div>

// ❌ Avoid manual string concatenation
<div className={`base-classes ${isActive ? 'active-classes' : ''} ${className}`}>
  Content
</div>
```

#### Component Optimization

```typescript
// ✅ Memoized components with proper dependencies
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

## Icon System

### Icon Library Usage

#### Primary: Phosphor Icons

```typescript
// ✅ Phosphor icons (primary choice)
import { UserIcon, CameraIcon, CheckCircleIcon } from "@phosphor-icons/react";

<UserIcon className="h-5 w-5 text-muted-foreground" weight="duotone" />
<CameraIcon className="h-4 w-4 text-primary" weight="bold" />
```

#### Secondary: Lucide Icons

```typescript
// ✅ Lucide icons (for shadcn compatibility)
import { User, Camera, CheckCircle } from "lucide-react";

<User className="h-5 w-5 text-muted-foreground" />
<Camera className="h-4 w-4 text-primary" />
```

#### Icon Usage Guidelines

- **Sizing**: Use consistent sizes (`h-4 w-4`, `h-5 w-5`)
- **Colors**: Use semantic color classes (`text-muted-foreground`, `text-primary`)
- **Context**: Prefer Phosphor for consistency, Lucide for shadcn components

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management patterns
- [Database Schema](./database-schema.md) - Database design and relationships
- [Component Standards](./component-standards.md) - Development standards and naming conventions
