# Design System, UI/UX, Component Standards, Code Style

## Quick Summary

- Neumorphic design with brand primary blue and accent emerald
- No gradients; depth is created using custom shadow utilities
- shadcn/ui components with New York style and Tailwind design tokens
- Forms: react-hook-form + zod; Components ≤ 200 lines
- Icons: Phosphor (with 'Icon' suffix) primary; Lucide secondary

---

## Neumorphic Design Guidelines

### Principles

- Soft Depth: raised/inset effects via brand-colored shadows
- Brand Color Integration: primary blue and accent emerald throughout depth effects
- Accessibility: WCAG AA
- Responsive: effects scale across devices
- No Gradients: solid backgrounds only; depth via shadows

### Shadow Utilities

```css
/* Raised */
.shadow-neumorphic-sm
.shadow-neumorphic-md
.shadow-neumorphic-lg
.shadow-neumorphic-xl
/* Inset */
.shadow-neumorphic-inset
.shadow-neumorphic-inset-deep
/* Interactive */
.shadow-neumorphic-focus
.shadow-neumorphic-hover
.shadow-neumorphic-active
/* Error */
.shadow-neumorphic-error
.shadow-neumorphic-inset-error;
```

### Usage Examples

```tsx
<Button className='shadow-neumorphic-md hover:shadow-neumorphic-lg'>Click me</Button>
<Input className='shadow-neumorphic-inset focus:shadow-neumorphic-focus' />
<Card className='shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm transition-all duration-200'>...</Card>
```

---

## Brand Color System

### CSS Custom Properties

```css
:root {
  --primary: oklch(0.445 0.165 264.092); /* Blue-600 */
  --accent: oklch(0.724 0.137 161.327); /* Emerald-500 */
  --ring: oklch(0.445 0.165 264.092);
}
```

### Tailwind Colors (excerpt)

```js
// tailwind.config.js
colors: {
  primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
  accent: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
  neutral: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
}
```

---

## Component Standards

### Composition

```tsx
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
```

Visual state hierarchy:

1. Default: `shadow-neumorphic-md`
2. Hover: `shadow-neumorphic-lg`
3. Active: `shadow-neumorphic-sm` or `shadow-neumorphic-inset`
4. Focus: `shadow-neumorphic-focus`
5. Error: `shadow-neumorphic-error`

Color integration:

- Text: brand colors (e.g., `text-primary-700`)
- Borders: subtle brand borders (`border-primary-200/50`)
- Backgrounds: brand tints (`bg-primary-50`, `bg-accent-50`)
- Icons: consistent with brand colors; `weight='bold'` for Phosphor

### Size Limit

- Each component must be ≤ 200 lines. Extract sub-components/helpers when needed.

### Mobile-First Design

- Base: mobile, then `sm`, `md`, `lg`, `xl` progressive enhancement
- Touch targets: min 44px height

---

## Forms: react-hook-form + zod

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().pipe(z.email("Please enter a valid email")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });
  return (
    <form onSubmit={handleSubmit(() => {})} className='space-y-4'>
      <Input
        id='email'
        type='email'
        {...register("email")}
        aria-invalid={!!errors.email}
        className='shadow-neumorphic-inset focus:shadow-neumorphic-focus'
      />
      <Button type='submit' disabled={isSubmitting} className='w-full shadow-neumorphic-md hover:shadow-neumorphic-lg'>
        {isSubmitting ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
};
```

---

## Icon System

- Primary: Phosphor Icons with 'Icon' suffix and `weight='bold'`
- Secondary: Lucide Icons for shadcn compatibility
- Sizing: `h-4 w-4`, `h-5 w-5`

```tsx
import { UserIcon, CameraIcon, CheckCircleIcon } from '@phosphor-icons/react';
import { User, Camera, CheckCircle } from 'lucide-react';

<UserIcon className='h-5 w-5 text-primary-700' weight='bold' />
<User className='h-5 w-5 text-muted-foreground' />
```

---

## Code Style

### Quotes

- JSX attributes: single quotes
- JS/TS strings: double quotes

### Import Organization

1. React and ecosystem
2. Third-party libs
3. Internal UI components
4. Types (with `type`)
5. Utilities/helpers

### Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "jsxSingleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

---

### ESLint (key rules)

```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/prefer-const": "error",
    "react/jsx-key": "error",
    "react/no-unescaped-entities": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## Loading States

- Use contextual loaders with action-specific icons.

```tsx
import { Loader, InlineLoader } from '@/src/components/common/Loader.component';
import { LoadingAction } from '@/src/types/ui.type';

// Button loading
<Button disabled={isSaving} className='shadow-neumorphic-md'>
  {isSaving ? (
    <span className='flex items-center gap-2'>
      <InlineLoader action={LoadingAction.SAVING} />
      <span>Saving…</span>
    </span>
  ) : (
    'Save'
  )}
  </Button>

// Full-screen loading
<Loader action={LoadingAction.PROCESSING} title='Processing your request…' subtitle='This may take a few moments' />
```

Available actions: SAVING, UPLOADING, SEARCHING, PROCESSING, LOADING, SYNCING, DOWNLOADING

---

## Status Messages

```tsx
import { StatusMessage } from '@/src/components/common/StatusMessage.component';
import { StatusMessageType } from '@/src/types/common.type';

<StatusMessage message={{ type: StatusMessageType.SUCCESS, text: 'Profile updated successfully!' }} />
<StatusMessage message={{ type: StatusMessageType.WARNING, text: 'Session expires in 5 minutes' }} />
<StatusMessage message={{ type: StatusMessageType.ERROR, text: 'Failed to save changes' }} />
<StatusMessage message={{ type: StatusMessageType.INFO, text: 'New features available' }} />
```

---

## Layout Patterns

```tsx
// Page layout
<div className='min-h-screen bg-background'>
  <header className='border-b border-border bg-background/95 backdrop-blur' />
  <main className='container mx-auto px-4 py-8'>
    <div className='max-w-4xl mx-auto space-y-8'>...</div>
  </main>
  <footer className='border-t border-border bg-muted/50' />
</div>

// Grid
<div className='container mx-auto px-4 py-8'>
  <div className='max-w-6xl mx-auto'>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>...</div>
  </div>
</div>

// Mobile navigation shell
<nav className='flex items-center justify-between p-4'>
  <div className='flex items-center gap-2'>
    <Button variant='ghost' size='icon' className='md:hidden'>
      <MenuIcon className='h-5 w-5' />
    </Button>
    <span className='font-semibold'>Logo</span>
  </div>
  <div className='hidden md:flex items-center gap-4' />
</nav>
```

---

## Accessibility Requirements

- Keyboard navigation on all interactive elements
- Proper ARIA labels and associations
- Color contrast ≥ 4.5:1
- Clear focus rings using brand `--ring`

---

## Performance Guidelines

- Prefer transform/opacity transitions; avoid layout thrash
- `.neumorphic-optimized` where applicable
- Memoize callbacks and expensive computations; virtualize long lists

---

## Related Documentation

- [10-Product](./10-Product.md)
- [20-Architecture](./20-Architecture.md)
- [30-Data-and-Integration](./30-Data-and-Integration.md)
