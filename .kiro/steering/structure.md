# Project Structure

## Root Directory

```
audit-it/
├── app/                      # Next.js App Router pages
├── src/                      # Source code
├── docs/                     # Documentation
├── migrations/               # Database migrations
├── scripts/                  # Utility scripts
├── public/                   # Static assets
└── location-data/            # Location CSV data
```

## App Router Structure

```
app/
├── layout.tsx               # Root layout
├── page.tsx                 # Home page
├── globals.css              # Global styles
├── auth/
│   ├── page.tsx            # Auth page
│   └── callback/
│       └── page.tsx        # OAuth callback
├── dashboard/
│   └── page.tsx            # User dashboard
├── profile/
│   └── page.tsx            # Profile management
└── role-selection/
    └── page.tsx            # Role selection
```

## Source Code Organization

```
src/
├── components/              # React components
│   ├── ui/                 # shadcn/ui components (kebab-case)
│   ├── auth/               # Authentication components
│   ├── profile/            # Profile management
│   ├── common/             # Shared components
│   └── layout/             # Layout components
├── types/                  # TypeScript type definitions
├── services/               # Data fetching and API calls
├── helpers/                # Pure utility functions
├── hooks/                  # Custom React hooks
├── store/                  # State management
├── providers/              # React context providers
└── constants/              # Application constants
```

## Component Organization

### Feature-Based Structure

- Components grouped by business domain, not by type
- Each feature has its own folder with related components
- Shared components in `common/` directory

### Naming Conventions

- **Feature Components**: `ComponentName.component.tsx`
- **UI Components**: `component-name.tsx` (kebab-case, shadcn style)
- **Pages**: `page.tsx` (Next.js App Router)
- **Types**: `domain.type.ts`
- **Services**: `domain.service.ts`
- **Helpers**: `purpose.helper.ts`

## Database Structure

```
migrations/
├── 001-base.sql                                    # Initial schema
├── 002-location-management-simple-2025-01-15.sql  # States/districts
├── 003-profile-completion-tracking-2025-01-15.sql # Completion tracking
├── 004-profile-location-fields-2025-01-15.sql     # Location foreign keys
├── 005-setup-certificate-storage-2025-01-15.sql   # File storage
├── 006-normalize-schema-2025-01-16.sql            # Languages normalization
├── 007-profile-picture-storage-2025-07-13.sql     # Profile pictures
├── 008-specializations-normalization-2025-07-22.sql # Specializations (LATEST)
└── README.md                                       # Migration documentation
```

### Migration Principles

- **Sequential Naming**: `XXX-descriptive-name-YYYY-MM-DD.sql` format
- **Idempotent Design**: Safe to run multiple times
- **Data Preservation**: Old columns deprecated, not dropped for rollback safety
- **Normalized Schema**: Foreign keys instead of text arrays for performance
- **Evolution Tracking**: Each migration documents schema changes with dates

## Documentation Structure

```
docs/prd/
├── overview.md                    # Project overview
├── architecture-guidelines.md     # Technical architecture
├── component-standards.md         # Development standards
├── database-schema.md            # Database documentation
├── type-system-guide.md          # TypeScript patterns
└── ui-ux-guidelines.md           # Design guidelines
```

## Key Architectural Principles

### No Index Files

- Avoid `index.ts` files for cleaner imports
- Use explicit file imports: `@/components/auth/SignInForm.component`
- Prevents confusion in large projects

### Domain-Driven Organization

- Group by business feature, not technical layer
- `auth/`, `profile/`, `contact-requests/` folders
- Clear boundaries between domains

### Service Layer Pattern

- Pure async functions in service files
- TanStack Query hooks for React integration
- Separation of data fetching from UI logic

### Type Safety First

- Enum-driven development
- Strict TypeScript configuration
- Comprehensive type definitions

## File Size Limits

- **Components**: Maximum 200 lines including imports
- **Services**: Focused single-responsibility functions
- **Types**: Organized by domain with clear separation

## Import Patterns

```typescript
// ✅ Good: Explicit imports
import { SignInForm } from "@/src/components/auth/SignInForm.component";
import { Profile } from "@/src/types/profile.type";
import { fetchProfile } from "@/src/services/profile.service";

// ❌ Bad: Index file imports
import { SignInForm } from "@/src/components/auth";
import { Profile } from "@/src/types";
```

## Configuration Files

- `next.config.ts`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS setup with brand colors and neumorphic utilities
- `tsconfig.json`: TypeScript strict mode configuration
- `eslint.config.mjs`: ESLint rules for code quality
- `components.json`: shadcn/ui configuration (New York style, neutral base)
- `.prettierrc`: Code formatting (single quotes for JSX, double for strings)
- `.env.local`: Environment variables

## Quality Standards

### Component Compliance Checklist

- [ ] Under 200 lines including imports
- [ ] Uses shadcn/ui components where applicable
- [ ] Mobile-first responsive design
- [ ] Enum-driven type safety (no magic strings)
- [ ] Proper accessibility (WCAG AA compliance)
- [ ] Neumorphic design principles applied

### Code Review Focus

- [ ] Architecture patterns followed
- [ ] Database schema alignment
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] TypeScript strict mode passes
