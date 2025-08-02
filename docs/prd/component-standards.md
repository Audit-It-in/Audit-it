# Component Standards & Development Guidelines

## Quick Reference

| **Standard**       | **Requirement**               | **Details**                                             |
| ------------------ | ----------------------------- | ------------------------------------------------------- |
| **Component Size** | 200 lines max                 | [Component Size Limits](#component-size-limits)         |
| **Naming**         | `ComponentName.component.tsx` | [File Naming Conventions](#file-naming-conventions)     |
| **Mobile-First**   | Always required               | [Mobile-First Requirements](#mobile-first-requirements) |
| **TypeScript**     | Strict mode                   | [Type Safety Requirements](#type-safety-requirements)   |
| **UI Components**  | Neumorphic design required    | [UI Component Standards](#ui-component-standards)       |

## UI Component Standards

### Neumorphic Design Philosophy

The project uses **neumorphic design** with custom components that integrate **brand colors**:

```typescript
// Component imports from unified UI directory
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";
```

### Design Requirements

**All components MUST follow neumorphic design principles:**
- **Soft depth effects** using custom shadow utilities (shadow-neumorphic-*)
- **Brand color integration** in shadows, highlights, and text colors
- **Consistent visual hierarchy** through layered depth (sm → md → lg → xl)
- **Smooth transitions** between interactive states (200-300ms duration)
- **Accessibility compliance** while maintaining neumorphic aesthetics
- **Error state integration** using red-tinted neumorphic effects
- **Form validation** with neumorphic error styling

### Neumorphic Component Requirements

**Visual State Hierarchy:**
1. **Default State**: Base neumorphic shadow (shadow-neumorphic-md)
2. **Hover State**: Enhanced elevation (shadow-neumorphic-lg) 
3. **Active State**: Reduced shadow (shadow-neumorphic-sm) or inset (shadow-neumorphic-inset)
4. **Focus State**: Brand-colored focus ring (shadow-neumorphic-focus)
5. **Error State**: Red-tinted shadows (shadow-neumorphic-error)

**Color Integration:**
- **Text**: Use brand colors (text-primary-700, text-primary-600/70)
- **Borders**: Subtle brand borders (border-primary-200/50)
- **Backgrounds**: Light brand tints (bg-primary-50, bg-accent-50)
- **Icons**: Consistent weight="bold" with brand colors

### Component Composition Patterns

```typescript
// ✅ GOOD: Import neumorphic UI components
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/helpers/tailwind.helper";

// ✅ GOOD: Proper neumorphic component composition with brand colors
export const ContactRequestCard = ({ request, className, ...props }: Props) => {
  return (
    <Card className={cn("w-full shadow-neumorphic-md hover:shadow-neumorphic-lg transition-all duration-300", className)} {...props}>
      <CardHeader className="border-b border-primary-100/50">
        <CardTitle className='flex items-center justify-between text-primary-800'>
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

// ❌ BAD: Don't import from index files or bypass design system
import { Button } from "@/src/components/ui";
import { Button } from "react-bootstrap";
<div className='bg-white border border-gray-200 rounded-lg p-4 shadow-md'>
  {/* Custom implementation instead of using Card component */}
</div>
```

### Form Component Standards

All forms must use **react-hook-form** with **zod** validation:

```typescript
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

## Icon Standards

### Primary: Phosphor Icons with "Icon" Suffix

```typescript
// ✅ GOOD: Phosphor icons (primary choice)
import { UserIcon, CameraIcon, CheckCircleIcon } from "@phosphor-icons/react";

<UserIcon className="h-5 w-5 text-muted-foreground" weight="bold" />
<CameraIcon className="h-4 w-4 text-primary" weight="bold" />
```

### Secondary: Lucide Icons (for shadcn compatibility)

```typescript
// ✅ ACCEPTABLE: Lucide icons when needed for shadcn compatibility
import { User, Camera, CheckCircle } from "lucide-react";

<User className="h-5 w-5 text-muted-foreground" />
<Camera className="h-4 w-4 text-primary" />
```

### Icon Usage Guidelines

- **Primary**: Phosphor icons with "Icon" suffix for consistency
- **Secondary**: Lucide icons only when required by shadcn components
- **Sizing**: Use consistent sizes (`h-4 w-4`, `h-5 w-5`)
- **Weight**: Always use `weight="bold"` for Phosphor icons
- **Colors**: Use semantic classes (`text-muted-foreground`, `text-primary`)

## Contextual Loading System

### Available Loading Actions

```typescript
import { Loader, InlineLoader } from "@/src/components/common/Loader.component";
import { LoadingAction } from "@/src/types/ui.type";

// Full-screen loading states
<Loader action={LoadingAction.SAVING} title="Saving your work..." />
<Loader action={LoadingAction.PROCESSING} title="Processing request..." />

// Inline loading for buttons
<InlineLoader action={LoadingAction.SEARCHING} size={SpinnerSize.SMALL} />
<InlineLoader action={LoadingAction.SYNCING} size={SpinnerSize.MEDIUM} />
```

### Loading Action Types

| Action | Icon | Animation | Use Case |
|--------|------|-----------|----------|
| `SAVING` | FloppyDiskIcon | Pulse | Saving data to server |
| `UPLOADING` | CloudArrowUpIcon | Bounce | File uploads |
| `SEARCHING` | MagnifyingGlassIcon | Scanning | Database searches |
| `PROCESSING` | CpuIcon | Processing | Data processing |
| `LOADING` | HourglassHighIcon | Flip | General loading |
| `SYNCING` | ArrowsClockwiseIcon | Spin | Data synchronization |
| `DOWNLOADING` | DownloadSimpleIcon | Bounce | File downloads |

### Implementation Standards

```typescript
// ✅ GOOD: Contextual loading in forms
export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <form onSubmit={handleSubmit}>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <InlineLoader action={LoadingAction.SAVING} />
            <span>Saving Contact...</span>
          </div>
        ) : (
          "Save Contact"
        )}
      </Button>
    </form>
  );
};

// ✅ GOOD: Full-screen loading with context
<Loader 
  action={LoadingAction.PROCESSING}
  title="Processing your audit request..."
  subtitle="This may take a few moments"
/>

// ❌ BAD: Generic spinner without context
<div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
```

### Accessibility Requirements

```typescript
// ✅ GOOD: Accessible loading state
<InlineLoader 
  action={LoadingAction.SAVING}
  className="text-white"
  // Icon automatically includes aria-label="Saving data" and role="img"
/>

<Button disabled={isLoading} aria-describedby="loading-message">
  {isLoading ? (
    <>
      <InlineLoader action={LoadingAction.PROCESSING} />
      <span id="loading-message">Processing your request...</span>
    </>
  ) : (
    "Submit"
  )}
</Button>
```

## Type Safety Standards

### Enum-First Approach

All components must use enums instead of string literals:

```typescript
// ✅ GOOD: Enum-driven component props
import { StatusMessageType } from "@/src/types/common.type";
import { AuthTab } from "@/src/types/auth.type";
import { LoadingAction } from "@/src/types/ui.type";

const [activeTab, setActiveTab] = useState<AuthTab>(AuthTab.SIGNIN);
const [message, setMessage] = useState<StatusMessage | null>(null);

// Show success message
setMessage({ type: StatusMessageType.SUCCESS, text: "Profile saved!" });

// Contextual loading
<Loader action={LoadingAction.SAVING} title="Saving changes..." />

// ❌ BAD: String literals
const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
setMessage({ type: "success", text: "Profile saved!" });
```

### Type Import Organization

```typescript
// ✅ GOOD: Organize imports by type category
import { StatusMessage, StatusMessageType } from "@/src/types/common.type";
import { AuthTab, AuthErrorType } from "@/src/types/auth.type";
import { LoadingAction } from "@/src/types/ui.type";

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

## File Naming Conventions

### Component Files

- **Feature Components**: `ComponentName.component.tsx`
- **UI Components (shadcn)**: `component-name.tsx` (kebab-case, no suffix)
- **Page Components**: `page.tsx` (Next.js App Router)

### Examples

```typescript
// ✅ GOOD: Feature component naming
src/components/auth/SignInForm.component.tsx
src/components/profile/ProfileCard.component.tsx
src/components/contact-requests/RequestCard.component.tsx

// ✅ GOOD: UI component naming (shadcn style)
src/components/ui/button.tsx
src/components/ui/input.tsx
src/components/ui/card.tsx

// ✅ GOOD: Type files
src/types/auth.type.ts
src/types/profile.type.ts

// ✅ GOOD: Service files
src/services/auth.service.ts
src/services/profile.service.ts

// ✅ GOOD: Helper files
src/helpers/tailwind.helper.ts
src/helpers/supabase.helper.ts
```

## Folder Structure Standards

```
src/
├── components/
│   ├── ui/                     # shadcn/ui components (kebab-case)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── card.tsx
│   ├── auth/                   # Feature-based grouping
│   │   ├── SignInForm.component.tsx
│   │   └── SignUpForm.component.tsx
│   ├── profile/                # Feature-based grouping
│   │   ├── ProfileCard.component.tsx
│   │   └── ProfileForm.component.tsx
│   └── layout/                 # Layout components
│       ├── Header.component.tsx
│       └── Footer.component.tsx
├── types/
│   ├── auth.type.ts
│   ├── profile.type.ts
│   └── location.type.ts
├── services/
│   ├── auth.service.ts
│   └── profile.service.ts
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

### Organization Principles

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

### Decomposition Strategies

When components exceed 200 lines:

1. **Extract Sub-components**: Move logical sections to separate files
2. **Create Helper Functions**: Move complex logic to utility files
3. **Split by Responsibility**: Each component should have one clear purpose
4. **Compose at Parent Level**: Build complex UIs from simple components

## Mobile-First Requirements

All components **must** be designed for mobile devices first, then enhanced for larger screens.

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

## Styling Standards

### Tailwind CSS with Design System

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

### Services (`/src/services/`)

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

### Helpers (`/src/helpers/`)

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

## Error Handling Standards

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

## Performance Standards

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
  // Component re-renders unnecessarily
};
```

### Bundle Size Optimization

- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only needed utilities and functions
- **Image Optimization**: Use Next.js Image component with proper sizing

## Accessibility Requirements

### WCAG AA Compliance

All components must meet WCAG AA accessibility standards:

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text
- **Focus Management**: Clear focus indicators and logical tab order

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

## Compliance Checklist

Before submitting any component for review, ensure:

- [ ] **Size**: Component is under 200 lines
- [ ] **Naming**: Follows `ComponentName.component.tsx` convention (or shadcn naming for UI components)
- [ ] **UI Components**: Uses shadcn/ui components and design system
- [ ] **Mobile-First**: Uses mobile-first responsive design
- [ ] **TypeScript**: Passes strict mode compilation with proper type safety
- [ ] **Icons**: Uses Phosphor icons with "Icon" suffix (or Lucide for shadcn compatibility)
- [ ] **Loading States**: Uses contextual `Loader` or `InlineLoader` with appropriate `LoadingAction`
- [ ] **Styling**: Uses design system tokens and `cn` utility
- [ ] **Forms**: Uses react-hook-form with zod validation
- [ ] **Performance**: Optimized for rendering and bundle size
- [ ] **Accessibility**: Meets WCAG AA standards
- [ ] **Error Handling**: Includes proper error states and boundaries
- [ ] **Folder Structure**: Follows feature-based organization

---

_These standards ensure consistent, maintainable, and high-quality component development across the Audit-it CA Platform using modern best practices with shadcn/ui._
