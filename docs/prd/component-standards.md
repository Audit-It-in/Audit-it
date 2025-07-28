# Component Standards & Development Guidelines

## Quick Reference

| **Standard**       | **Requirement**               | **Details**                                             |
| ------------------ | ----------------------------- | ------------------------------------------------------- |
| **Component Size** | 200 lines max                 | [Component Size Limits](#component-size-limits)         |
| **Naming**         | `ComponentName.component.tsx` | [File Naming Conventions](#file-naming-conventions)     |
| **Mobile-First**   | Always required               | [Mobile-First Requirements](#mobile-first-requirements) |
| **TypeScript**     | Strict mode                   | [Type Safety Requirements](#type-safety-requirements)   |
| **UI Components**  | shadcn/ui required            | [UI Component Standards](#ui-component-standards)       |

## UI Component Standards

### shadcn/ui Configuration

The project uses **shadcn/ui** as the primary UI component library with the following configuration:

```json
// components.json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
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

### UI Component Usage Patterns

#### Import Standards for UI Components

```typescript
// ✅ GOOD: Import shadcn/ui components
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

// ✅ GOOD: Use cn utility for conditional styling
import { cn } from "@/src/helpers/tailwind.helper";

// ❌ BAD: Don't import from index files or external UI libraries
import { Button } from "@/src/components/ui";
import { Button } from "react-bootstrap";
```

#### Component Composition Patterns

```typescript
// ✅ GOOD: Proper shadcn component composition
export const ContactRequestCard = ({ request, className, ...props }: Props) => {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span>{request.subject}</span>
          <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex items-center gap-2'>
          <UserIcon className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>{request.customer_name}</span>
        </div>
      </CardContent>
    </Card>
  );
};

// ❌ BAD: Custom styling that bypasses design system
export const ContactRequestCard = ({ request }: Props) => {
  return (
    <div className='bg-white border border-gray-200 rounded-lg p-4 shadow-md'>
      {/* Custom implementation instead of using Card component */}
    </div>
  );
};
```

### Form Component Standards

All forms must use **react-hook-form** with **zod** validation and shadcn form components:

```typescript
// ✅ GOOD: Standard form pattern
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

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
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
      </div>

      <Button type='submit' disabled={isSubmitting} className='w-full'>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};
```

### Icon Standards

#### Primary: Phosphor Icons with "Icon" Suffix

```typescript
// ✅ GOOD: Phosphor icons (primary choice)
import { UserIcon, CameraIcon, CheckCircleIcon } from "@phosphor-icons/react";

<UserIcon className="h-5 w-5 text-muted-foreground" weight="duotone" />
<CameraIcon className="h-4 w-4 text-primary" weight="bold" />
```

#### Secondary: Lucide Icons (for shadcn compatibility)

```typescript
// ✅ ACCEPTABLE: Lucide icons when needed for shadcn compatibility
import { User, Camera, CheckCircle } from "lucide-react";

<User className="h-5 w-5 text-muted-foreground" />
<Camera className="h-4 w-4 text-primary" />
```

**Icon Usage Guidelines:**

- Prefer Phosphor icons for consistency with existing codebase
- Use Lucide icons only when required by shadcn components
- Always use consistent sizing: `h-4 w-4` or `h-5 w-5`
- Use semantic color classes: `text-muted-foreground`, `text-primary`

## File Naming Conventions

### Component Files

- **Feature Components**: `ComponentName.component.tsx`
- **UI Components (shadcn)**: `component-name.tsx` (kebab-case, no suffix)
- **Page Components**: `page.tsx` (Next.js App Router)

### Examples

```typescript
// ✅ GOOD: Feature component naming
src / components / auth / SignInForm.component.tsx;
src / components / profile / ProfileCard.component.tsx;
src / components / contact - requests / RequestCard.component.tsx;

// ✅ GOOD: UI component naming (shadcn style)
src / components / ui / button.tsx;
src / components / ui / input.tsx;
src / components / ui / card.tsx;

// ✅ GOOD: Type files
src / types / auth.type.ts;
src / types / profile.type.ts;

// ✅ GOOD: Service files
src / services / auth.service.ts;
src / services / profile.service.ts;

// ✅ GOOD: Helper files
src / helpers / tailwind.helper.ts;
src / helpers / supabase.helper.ts;
```

## Folder Structure Standards

### Recommended Project Structure

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components (kebab-case)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── form.tsx
│   ├── auth/                   # Feature-based grouping
│   │   ├── SignInForm.component.tsx
│   │   └── SignUpForm.component.tsx
│   ├── profile/                # Feature-based grouping
│   │   ├── ProfileCard.component.tsx
│   │   └── ProfileForm.component.tsx
│   ├── contact-requests/       # Feature-based grouping
│   │   ├── RequestCard.component.tsx
│   │   └── RequestList.component.tsx
│   └── layout/                 # Layout components
│       ├── Header.component.tsx
│       └── Footer.component.tsx
├── types/
│   ├── auth.type.ts
│   ├── profile.type.ts
│   └── location.type.ts
├── services/
│   ├── auth.service.ts
│   ├── profile.service.ts
│   └── location.service.ts
├── helpers/
│   ├── tailwind.helper.ts
│   └── supabase.helper.ts
├── hooks/
│   └── useAuth.ts
├── store/
│   └── auth.store.ts
└── constants/
    ├── app.constants.ts
    └── storage.constants.ts
```

### Folder Organization Principles

1. **Feature-Based Grouping**: Group components by domain/feature, not by type
2. **UI Components Separate**: Keep shadcn/ui components in dedicated `ui/` folder
3. **No Index Files**: Avoid index.ts files - use explicit imports
4. **Consistent Naming**: Use kebab-case for folders, consistent suffixes for files

## Component Size Limits

### Maximum Component Size: 200 Lines

Every React component must be **under 200 lines** including imports, exports, and comments. This ensures:

- **Maintainability**: Easier to understand and modify
- **Reusability**: Focused components are more reusable
- **Code Review**: Faster and more thorough reviews

### Enforcement Strategy

```typescript
// ✅ GOOD: Focused component under 200 lines
export const ContactRequestCard = ({ request, onStatusUpdate }: Props) => {
  // Single responsibility: Display contact request information
  // Implementation fits comfortably under 200 lines
};

// ❌ BAD: Large component exceeding 200 lines
export const ContactRequestManagement = ({ requests }: Props) => {
  // Multiple responsibilities: filtering, sorting, display, editing
  // Needs decomposition into smaller components
};
```

### Decomposition Strategies

When components exceed 200 lines:

1. **Extract Sub-components**: Move logical sections to separate files
2. **Create Helper Functions**: Move complex logic to utility files
3. **Split by Responsibility**: Each component should have one clear purpose
4. **Compose at Parent Level**: Build complex UIs from simple components

> 💡 **Related**: See [Architecture Guidelines](../prd/architecture-guidelines.md#component-architecture) for composition patterns

## Mobile-First Requirements

### Design Philosophy

All components **must** be designed for mobile devices first, then enhanced for larger screens.

### Implementation Pattern

```typescript
// ✅ GOOD: Mobile-first responsive classes
<div className="p-4 sm:p-6 lg:p-8">
  <h2 className="text-lg sm:text-xl lg:text-2xl">Title</h2>
  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
    {/* Content */}
  </div>
</div>

// ❌ BAD: Desktop-first approach
<div className="p-8 md:p-6 sm:p-4">
  <h2 className="text-2xl md:text-xl sm:text-lg">Title</h2>
</div>
```

### Breakpoint Strategy

- **Base**: Mobile design (320px+)
- **sm**: Small tablets (640px+)
- **md**: Tablets (768px+)
- **lg**: Laptops (1024px+)
- **xl**: Desktops (1280px+)

> 💡 **Related**: See [UI/UX Guidelines](./ui-ux-guidelines.md#responsive-design) for detailed responsive patterns

## Type Safety Requirements

### TypeScript Strict Mode

All components must pass TypeScript strict mode compilation with zero errors.

### Required Typing

```typescript
// ✅ GOOD: Domain-specific type imports
import type { UserRole, AuthUser, SignInFormData } from "@/types/auth.type";
import type { Profile, ProfileDetails, ContactRequest, ContactRequestStatus } from "@/types/profile.type";

// ✅ GOOD: Comprehensive component typing
interface ContactRequestCardProps {
  request: ContactRequest;
  onStatusUpdate: (id: string, status: ContactRequestStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => void;
  className?: string;
}

export const ContactRequestCard = ({ request, onStatusUpdate, onNotesUpdate, className }: ContactRequestCardProps) => {
  // Implementation
};

// ❌ BAD: Missing or incomplete typing
export const ContactRequestCard = ({ request, onStatusUpdate }: any) => {
  // Implementation
};
```

## Styling Standards

### Tailwind CSS with Design System

Use the project's design system tokens defined in `tailwind.config.js`:

```typescript
// ✅ GOOD: Using design system colors
<Button variant="default" className="bg-primary text-primary-foreground">
  Primary Action
</Button>

<Card className="border-border bg-card text-card-foreground">
  <CardContent className="text-muted-foreground">
    Secondary content
  </CardContent>
</Card>

// ❌ BAD: Custom colors that bypass design system
<button className="bg-blue-600 text-white">
  Custom styled button
</button>
```

### CSS Utility Function

Always use the `cn` utility for conditional styling:

```typescript
import { cn } from "@/src/helpers/tailwind.helper";

// ✅ GOOD: Using cn utility
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes",
  className
)}>
  Content
</div>

// ❌ BAD: Manual class concatenation
<div className={`base-classes ${isActive ? 'active-classes' : ''} ${className}`}>
  Content
</div>
```

## Services vs Helpers Architecture

### Clear Separation of Concerns

#### Services (`/src/services/`)

**Purpose**: Handle all data fetching, API calls, and database operations

```typescript
// ✅ Services handle data operations
export const ContactRequestService = {
  fetchContactRequests: async (filters: ContactRequestFilter) => {
    // Supabase queries, error handling, data transformation
  },
  updateContactRequestStatus: async (id: string, status: ContactRequestStatus) => {
    // Database update operations
  },
};
```

#### Helpers (`/src/helper/`)

**Purpose**: Provide pure utility functions, formatting, and validation

```typescript
// ✅ Helpers provide pure utilities
export const contactRequestHelper = {
  formatContactRequestDate: (date: string) => {
    // Pure formatting function
  },
  validateContactRequestData: (data: ContactRequest) => {
    // Pure validation logic
  },
};
```

### Architectural Rules

1. **No Data Fetching in Helpers**: Helpers must be pure functions
2. **Services Own External APIs**: Only services communicate with Supabase/external APIs
3. **Helpers Are Testable**: All helper functions must be easily unit testable
4. **Clear Dependencies**: Services may use helpers, helpers never use services

> 💡 **Related**: See [Architecture Guidelines](./architecture-guidelines.md#service-layer-patterns) for detailed patterns

## Performance Standards

### Bundle Size Optimization

- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only needed utilities and functions
- **Image Optimization**: Use Next.js Image component with proper sizing

### Rendering Performance

```typescript
// ✅ GOOD: Optimized rendering with shadcn components
const ContactRequestCard = memo(({ request, onStatusUpdate }: Props) => {
  const handleStatusUpdate = useCallback((status: ContactRequestStatus) => {
    onStatusUpdate(request.id, status);
  }, [request.id, onStatusUpdate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{request.subject}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => handleStatusUpdate('in_progress')}>
          Update Status
        </Button>
      </CardContent>
    </Card>
  );
});

// ❌ BAD: Unoptimized rendering
const ContactRequestCard = ({ request, onStatusUpdate }: Props) => {
  const handleStatusUpdate = (status: ContactRequestStatus) => {
    onStatusUpdate(request.id, status);
  };

  return (
    // Component re-renders unnecessarily
  );
};
```

> 💡 **Related**: See [Architecture Guidelines](./architecture-guidelines.md#performance-optimization) for advanced patterns

## Error Handling Standards

### Error Boundaries

All major component sections must be wrapped in error boundaries:

```typescript
// ✅ GOOD: Proper error boundary usage
<ErrorBoundary fallback={<ContactRequestErrorFallback />}>
  <ContactRequestCard request={request} />
</ErrorBoundary>
```

### Error State Management

```typescript
// ✅ GOOD: Comprehensive error handling with shadcn components
const ContactRequestCard = ({ request }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (status: ContactRequestStatus) => {
    try {
      await updateStatus(request.id, status);
      setError(null);
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Status update failed:', err);
    }
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setError(null)}
            className="mt-2"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    // Component implementation
  );
};
```

## Accessibility Requirements

### WCAG AA Compliance

All components must meet WCAG AA accessibility standards:

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text
- **Focus Management**: Clear focus indicators and logical tab order

### Implementation Standards

```typescript
// ✅ GOOD: Accessible component with shadcn
<Button
  onClick={handleStatusUpdate}
  aria-label={`Update status for ${request.customerName}`}
  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
>
  Update Status
</Button>

// ❌ BAD: Inaccessible component
<div onClick={handleStatusUpdate} className="cursor-pointer">
  Update Status
</div>
```

> 💡 **Related**: See [UI/UX Guidelines](./ui-ux-guidelines.md#accessibility-standards) for detailed accessibility requirements

---

## Compliance Checklist

Before submitting any component for review, ensure:

- [ ] **Size**: Component is under 200 lines
- [ ] **Naming**: Follows `ComponentName.component.tsx` convention (or shadcn naming for UI components)
- [ ] **UI Components**: Uses shadcn/ui components and design system
- [ ] **Mobile-First**: Uses mobile-first responsive design
- [ ] **TypeScript**: Passes strict mode compilation with proper type safety
- [ ] **Icons**: Uses Phosphor icons with "Icon" suffix (or Lucide for shadcn compatibility)
- [ ] **Styling**: Uses design system tokens and `cn` utility
- [ ] **Forms**: Uses react-hook-form with zod validation
- [ ] **Performance**: Optimized for rendering and bundle size
- [ ] **Accessibility**: Meets WCAG AA standards
- [ ] **Error Handling**: Includes proper error states and boundaries
- [ ] **Folder Structure**: Follows feature-based organization

---

_These standards ensure consistent, maintainable, and high-quality component development across the Audit-it CA Platform using modern best practices with shadcn/ui._
