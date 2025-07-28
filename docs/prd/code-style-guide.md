# Code Style Guide

## Overview

This document outlines the specific code formatting and style preferences for the Audit-it project, complementing the broader [Component Standards](./component-standards.md).

## TypeScript & React Formatting

### Quote Preferences

```typescript
// ✅ GOOD: Single quotes for JSX attributes
<Button className='w-full' onClick={handleClick}>
  Submit
</Button>

// ✅ GOOD: Double quotes for string literals in logic
const message = "Hello, world!";
const apiUrl = "https://api.example.com";

// ❌ BAD: Double quotes for JSX attributes
<Button className="w-full" onClick={handleClick}>
  Submit
</Button>
```

### Object and Function Formatting

```typescript
// ✅ GOOD: Compact single-line when reasonable
const config = { theme: 'dark', size: 'lg' };

// ✅ GOOD: Multi-line for complex objects
const formSchema = z.object({
  email: z.string().pipe(z.email('Please enter a valid email')),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// ✅ GOOD: Multi-line callback formatting
const handleUpdate = useCallback(
  (data: ProfileUpdateData) => {
    onUpdate(profile.id, data);
  },
  [profile.id, onUpdate]
);

// ✅ GOOD: Compact JSX when simple
return <Card>{/* Component content */}</Card>;

// ✅ GOOD: Multi-line JSX when complex
return (
  <Card className='w-full'>
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>
    </CardHeader>
    <CardContent className='space-y-4'>
      <p className='text-muted-foreground'>Profile details</p>
    </CardContent>
  </Card>
);
```

### Import Organization

```typescript
// ✅ GOOD: Import order and formatting
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

import type { Profile, ProfileUpdateData } from '@/types/profile.type';
import { cn } from '@/src/helpers/tailwind.helper';
```

**Import Groups (in order):**
1. React and React ecosystem
2. Third-party libraries
3. Internal UI components
4. Types (with `type` prefix)
5. Internal utilities and helpers

### Component Structure

```typescript
// ✅ GOOD: Component structure pattern
interface ProfileCardProps {
  profile: Profile;
  onUpdate: (data: ProfileUpdateData) => void;
  className?: string;
}

export const ProfileCard = ({ profile, onUpdate, className }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = useCallback(
    (data: ProfileUpdateData) => {
      onUpdate(data);
      setIsEditing(false);
    },
    [onUpdate]
  );

  if (isEditing) {
    return <ProfileEditForm profile={profile} onSubmit={handleUpdate} />;
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{profile.bio}</p>
      </CardContent>
    </Card>
  );
};
```

## Prettier Configuration

### Recommended `.prettierrc`

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

**Key Settings Explained:**
- `singleQuote: false` - Double quotes for JS/TS string literals
- `jsxSingleQuote: true` - Single quotes for JSX attributes
- `printWidth: 100` - Reasonable line length for modern displays
- `trailingComma: "es5"` - Trailing commas where valid in ES5

## Naming Conventions

### Files and Directories

```
// ✅ GOOD: Feature components
src/components/auth/SignInForm.component.tsx
src/components/profile/ProfileCard.component.tsx

// ✅ GOOD: UI components (shadcn style)
src/components/ui/button.tsx
src/components/ui/card.tsx

// ✅ GOOD: Services and types
src/services/auth.service.ts
src/types/profile.type.ts

// ✅ GOOD: Directory names
src/components/contact-requests/
src/helpers/
```

### Variables and Functions

```typescript
// ✅ GOOD: Descriptive naming
const isLoading = true;
const userProfile = await fetchProfile(userId);
const handleSubmit = useCallback(() => {}, []);

// ✅ GOOD: Event handlers
const handleClick = () => {};
const handleFormSubmit = () => {};
const handleProfileUpdate = () => {};

// ✅ GOOD: Boolean variables
const isActive = profile.is_active;
const hasPermission = checkPermission(user);
const canEdit = user.role === 'admin';

// ❌ BAD: Unclear naming
const data = await fetch();
const onClick = () => {};
const flag = true;
```

## ESLint Rules

### Key Rules to Enforce

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

## Comments and Documentation

### Component Documentation

```typescript
/**
 * ProfileCard displays user profile information with editing capabilities.
 * 
 * @param profile - The user profile data
 * @param onUpdate - Callback fired when profile is updated
 * @param className - Additional CSS classes
 */
export const ProfileCard = ({ profile, onUpdate, className }: ProfileCardProps) => {
  // Component implementation
};
```

### Inline Comments

```typescript
// ✅ GOOD: Explain complex logic
const completionPercentage = Math.round(
  (completedFields / totalFields) * 100
); // Calculate profile completion as percentage

// ✅ GOOD: Document non-obvious behavior
useEffect(() => {
  // Debounce search to avoid excessive API calls
  const timer = setTimeout(() => {
    performSearch(query);
  }, 300);

  return () => clearTimeout(timer);
}, [query]);

// ❌ BAD: Obvious comments
const user = getUser(); // Get the user
```

## Performance Considerations

### Bundle Size

```typescript
// ✅ GOOD: Specific imports
import { format } from 'date-fns/format';
import { Button } from '@/src/components/ui/button';

// ❌ BAD: Barrel imports that bloat bundle
import * as dateFns from 'date-fns';
import * as Components from '@/src/components';
```

### Memoization

```typescript
// ✅ GOOD: Memoize expensive computations
const profileStats = useMemo(() => {
  return calculateProfileStats(profile);
}, [profile]);

// ✅ GOOD: Memoize callback functions
const handleUpdate = useCallback((data: ProfileUpdateData) => {
  onUpdate(profile.id, data);
}, [profile.id, onUpdate]);
```

## Related Documentation

- [Component Standards](./component-standards.md) - Component development guidelines
- [Architecture Guidelines](./architecture-guidelines.md) - Service layer patterns
- [UI/UX Guidelines](./ui-ux-guidelines.md) - Design system usage

---

*This style guide should be enforced through automated tooling (Prettier, ESLint) and code review processes.* 