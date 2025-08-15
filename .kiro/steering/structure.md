# Project Structure

## Root Directory Architecture

```
audit-it/
├── app/                      # Next.js 15 App Router pages and layouts
├── src/                      # Source code organized by domain
├── docs/                     # Comprehensive documentation
├── migrations/               # Sequential database migrations
├── scripts/                  # Data processing and utility scripts
├── public/                   # Static assets and icons
├── location-data/            # CSV data for Indian states/districts
├── .kiro/                    # Kiro AI configuration and steering
└── node_modules/             # Dependencies (managed by npm)
```

## App Router Structure (Next.js 15)

```
app/
├── layout.tsx               # Root layout with QueryProvider and Header/Footer
├── page.tsx                 # Landing page with CA discovery
├── globals.css              # Global styles with neumorphic utilities
├── favicon.ico              # Application favicon
├── auth/
│   ├── page.tsx            # Authentication page (sign in/sign up)
│   └── callback/
│       └── page.tsx        # OAuth callback handler
├── dashboard/
│   └── page.tsx            # User dashboard (role-specific)
├── profile/
│   └── page.tsx            # Profile management and onboarding
├── role-selection/
│   └── page.tsx            # Role selection for new users
└── accountants/
    └── [state]/
        └── [district]/
            └── [username]/
                └── page.tsx # Individual CA profile pages
```

## Source Code Organization

```
src/
├── components/              # React components organized by domain
│   ├── ui/                 # shadcn/ui components (kebab-case naming)
│   │   ├── button.tsx      # Neumorphic button variants
│   │   ├── card.tsx        # Card components with depth effects
│   │   ├── input.tsx       # Form inputs with inset styling
│   │   ├── select.tsx      # Dropdown selects
│   │   └── ...             # Other UI primitives
│   ├── auth/               # Authentication components
│   │   ├── SignInForm.component.tsx
│   │   ├── SignUpForm.component.tsx
│   │   └── GoogleSignInButton.component.tsx
│   ├── profile/            # Profile management components
│   │   ├── accountant/     # CA-specific profile components
│   │   │   ├── PersonalInfoStep.component.tsx
│   │   │   ├── ProfessionalStep.component.tsx
│   │   │   ├── EducationStep.component.tsx
│   │   │   ├── VerificationStep.component.tsx
│   │   │   └── ProfileStepper.component.tsx
│   │   ├── customer/       # Customer profile components
│   │   └── shared/         # Shared profile utilities
│   ├── contact-requests/   # Contact request system
│   │   ├── discovery/      # CA discovery and search
│   │   │   ├── AccountantDiscoveryPage.component.tsx
│   │   │   ├── AccountantGrid.component.tsx
│   │   │   ├── AccountantProfileCard.component.tsx
│   │   │   ├── AccountantProfileView.component.tsx
│   │   │   ├── SearchFilters.component.tsx
│   │   │   └── profile/    # Profile detail subcomponents
│   │   ├── skeletons/      # Loading skeletons
│   │   └── ContactRequestModal.component.tsx
│   ├── common/             # Shared utility components
│   │   ├── Loader.component.tsx        # Contextual loading states
│   │   ├── StatusMessage.component.tsx # Status notifications
│   │   ├── AvatarUpload.component.tsx  # File upload with preview
│   │   └── FileUpload.component.tsx    # Generic file upload
│   └── layout/             # Layout and navigation
│       ├── Header.component.tsx        # Main navigation
│       └── Footer.component.tsx        # Site footer
├── types/                  # TypeScript type definitions
│   ├── auth.type.ts        # Authentication types and enums
│   ├── profile.type.ts     # Profile, experience, education types
│   ├── contact-request.type.ts # Contact request system types
│   ├── location.type.ts    # Geographic data types
│   ├── common.type.ts      # Shared utility types
│   └── ui.type.ts          # UI component types and variants
├── services/               # Data fetching and API integration
│   ├── auth.service.ts     # Authentication operations
│   ├── profile.service.ts  # Profile CRUD operations
│   ├── contact-requests.service.ts # Contact request management
│   ├── accountant-discovery.service.ts # CA search and filtering
│   └── upload.service.ts   # File upload and storage
├── helpers/                # Pure utility functions
│   ├── tailwind.helper.ts  # Tailwind class merging utility
│   ├── supabase.helper.ts  # Supabase client configuration
│   ├── auth.helper.ts      # Authentication utilities
│   ├── date.helper.ts      # Date formatting and manipulation
│   └── validation.helper.ts # Form validation utilities
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Authentication state management
│   ├── useAuthRedirect.ts  # Authentication flow handling
│   ├── useProfileFormState.ts # Profile form state management
│   ├── useArrayForm.ts     # Dynamic array form management
│   ├── useProfilePictureUpload.ts # Avatar upload handling
│   └── useDebouncedUsernameAvailability.ts # Username validation
├── store/                  # Client-side state management
│   └── auth.store.ts       # Jotai atoms for authentication
├── providers/              # React context providers
│   └── QueryProvider.tsx   # TanStack Query configuration
└── constants/              # Application constants
    ├── app.constants.ts    # Application metadata
    ├── auth.constants.ts   # Authentication configuration
    ├── contact.constants.ts # Contact request defaults
    ├── profile-step.constants.ts # Profile onboarding steps
    └── storage.constants.ts # File storage configuration
```

## Component Organization Principles

### Feature-Based Architecture

- **Domain Grouping**: Components organized by business feature, not technical type
- **Clear Boundaries**: Each domain has dedicated folder with related components
- **Shared Resources**: Common components in `common/` directory for reuse
- **UI Primitives**: shadcn/ui components in dedicated `ui/` folder

### Naming Conventions

- **Feature Components**: `ComponentName.component.tsx` (PascalCase with suffix)
- **UI Components**: `component-name.tsx` (kebab-case, shadcn style)
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Types**: `domain.type.ts` (domain-specific type definitions)
- **Services**: `domain.service.ts` (data layer operations)
- **Helpers**: `purpose.helper.ts` (pure utility functions)
- **Hooks**: `usePurpose.ts` (custom React hooks)
- **Constants**: `domain.constants.ts` (application constants)

### Component Size Standards

- **Maximum Size**: 200 lines including imports and comments
- **Decomposition Strategy**: Extract sub-components when limit exceeded
- **Single Responsibility**: Each component has one clear purpose
- **Composition Pattern**: Build complex UIs from simple components

## Database Structure & Migrations

```
migrations/
├── 001-base.sql                                    # Initial schema (profiles, experiences, educations)
├── 002-location-management-simple-2025-01-15.sql  # States and districts normalization
├── 003-profile-completion-tracking-2025-01-15.sql # Profile completion percentage tracking
├── 004-profile-location-fields-2025-01-15.sql     # Foreign key location references
├── 005-setup-certificate-storage-2025-01-15.sql   # File storage buckets and RLS policies
├── 006-normalize-schema-2025-01-16.sql            # Languages table normalization
├── 007-profile-picture-storage-2025-07-13.sql     # Profile picture storage system
├── 008-specializations-normalization-2025-07-22.sql # Specializations and categories
├── 009-contact-requests-view-2025-01-16.sql       # Contact requests with optimized views (LATEST)
└── README.md                                       # Migration documentation and guidelines
```

### Migration Management Principles

- **Sequential Execution**: Run in numerical order through Supabase SQL Editor
- **Idempotent Design**: Safe to run multiple times without data corruption
- **Data Preservation**: Old columns deprecated, not dropped for rollback safety
- **Normalized Schema**: Foreign keys replace text arrays for performance
- **Evolution Tracking**: Each migration documents schema changes with timestamps
- **Rollback Strategy**: Maintain backward compatibility during schema evolution

### Current Database Schema

- **Core Tables**: `profiles`, `experiences`, `educations`, `contact_requests`
- **Lookup Tables**: `languages`, `specializations`, `specialization_categories`, `states`, `districts`
- **Verification**: `ca_verifications`, `social_profile`
- **Optimized Views**: `profile_details`, `contact_requests_with_details`, `specializations_with_categories`
- **Storage Buckets**: `profile-pictures`, `accountant-certificates` (private with signed URLs)

## Documentation Architecture

```
docs/
├── prd/                     # Product Requirements Documentation
│   ├── README.md           # Navigation and quick reference
│   ├── overview.md         # Project vision and objectives
│   ├── architecture-guidelines.md # Service layer and state management
│   ├── component-standards.md # Development standards and patterns
│   ├── database-schema.md  # Complete database documentation
│   ├── type-system-guide.md # TypeScript patterns and enums
│   ├── ui-ux-guidelines.md # Neumorphic design system
│   └── code-style-guide.md # Formatting and style preferences
├── progress/               # Development progress tracking
│   ├── README.md          # Progress documentation naming convention
│   ├── 001-Avatar-Revamp-2025-08-10.md # Avatar system overhaul
│   ├── 002-Profile-Refactor-2025-08-10.md # Profile component refactoring
│   └── 003-ContactRequests-UI-Overhaul-2025-08-10.md # Contact request UI redesign
└── .kiro/                  # Kiro AI configuration
    ├── specs/              # Feature specifications
    └── steering/           # Development guidelines and standards
```

## Key Architectural Principles

### No Index Files Policy

- **Explicit Imports**: Direct file imports prevent confusion in large projects
- **Clear Dependencies**: Easy to trace component relationships and dependencies
- **Better IDE Support**: Improved autocomplete and refactoring capabilities
- **Reduced Bundle Size**: Tree shaking works more effectively

```typescript
// ✅ Good: Explicit imports with clear paths
import { SignInForm } from "@/src/components/auth/SignInForm.component";
import { Profile } from "@/src/types/profile.type";
import { fetchProfile } from "@/src/services/profile.service";

// ❌ Bad: Index file imports that obscure dependencies
import { SignInForm } from "@/src/components/auth";
import { Profile } from "@/src/types";
```

### Domain-Driven Organization

- **Business Logic Grouping**: Features organized by business domain, not technical layer
- **Clear Boundaries**: `auth/`, `profile/`, `contact-requests/` represent distinct business areas
- **Scalable Structure**: Easy to add new domains without restructuring existing code
- **Team Collaboration**: Different teams can work on different domains independently

### Service Layer Architecture

- **Pure Functions**: Service functions are pure async functions without React dependencies
- **TanStack Query Integration**: Separate hooks provide React integration layer
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Caching Strategy**: Appropriate cache times based on data volatility and usage patterns

### Type Safety First

- **Enum-Driven Development**: Comprehensive enums replace magic strings throughout
- **Strict TypeScript**: Full type coverage with strict mode enabled
- **Database Alignment**: Types match database schema exactly for consistency
- **Runtime Validation**: Zod schemas provide runtime type checking for forms and APIs

## Configuration Files

### Core Configuration

- **next.config.ts**: Next.js configuration with dynamic Supabase image domains
- **tailwind.config.js**: Custom neumorphic utilities, brand colors, and responsive breakpoints
- **tsconfig.json**: TypeScript strict mode with path mapping (`@/*` → workspace root)
- **components.json**: shadcn/ui configuration (New York style, neutral base color)

### Development Tools

- **eslint.config.mjs**: ESLint rules for code quality and consistency
- **package.json**: Comprehensive script collection for development, building, and deployment
- **.env.local**: Environment variables for local development (not committed)
- **.gitignore**: Git ignore patterns for Node.js, Next.js, and IDE files

### Build & Deployment

- **netlify.toml**: Netlify deployment configuration (alternative to Vercel)
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS processing
- **test-types.ts**: TypeScript configuration for testing environment

## Import Organization Standards

### Import Order (Enforced by ESLint)

1. **React & Ecosystem**: React hooks, Next.js utilities, React-specific libraries
2. **Third-Party Libraries**: External dependencies (TanStack Query, Zod, etc.)
3. **Internal UI Components**: shadcn/ui components and custom UI components
4. **Types**: TypeScript interfaces and enums (with `type` prefix for type-only imports)
5. **Utilities & Helpers**: Internal utility functions and configuration

### Path Mapping Configuration

```typescript
// tsconfig.json path mapping
{
  "paths": {
    "@/*": ["./*"]  // Maps @/ to workspace root
  }
}
```

### Import Examples

```typescript
// 1. React & Ecosystem
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// 2. Third-Party Libraries
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";

// 3. Internal UI Components
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

// 4. Types (with type prefix)
import type { Profile, ProfileDetails } from "@/src/types/profile.type";
import type { ContactRequest } from "@/src/types/contact-request.type";

// 5. Utilities & Helpers
import { cn } from "@/src/helpers/tailwind.helper";
import { fetchProfile } from "@/src/services/profile.service";
```

## Quality Standards & Compliance

### Component Compliance Checklist

- [ ] **Size Limit**: Under 200 lines including imports and comments
- [ ] **UI Components**: Uses shadcn/ui components where applicable
- [ ] **Responsive Design**: Mobile-first responsive design (320px+)
- [ ] **Type Safety**: Enum-driven type safety with no magic strings
- [ ] **Accessibility**: WCAG AA compliance with proper ARIA labels
- [ ] **Neumorphic Design**: Consistent neumorphic design principles applied
- [ ] **Error Handling**: Comprehensive error states and user feedback
- [ ] **Performance**: Optimized rendering with proper memoization

### Code Review Focus Areas

- [ ] **Architecture Patterns**: Service layer, component composition, state management
- [ ] **Database Alignment**: Types match schema, proper query optimization
- [ ] **Performance**: Bundle size, rendering optimization, caching strategy
- [ ] **Error Handling**: User-friendly error messages, proper fallbacks
- [ ] **TypeScript**: Strict mode compliance, comprehensive type coverage
- [ ] **Security**: Input validation, secure file handling, proper authentication
- [ ] **Accessibility**: Keyboard navigation, screen reader support, color contrast

### File Organization Rules

- **Single Responsibility**: Each file has one clear purpose and responsibility
- **Consistent Naming**: Follow established naming conventions across all file types
- **Logical Grouping**: Related files are grouped together in appropriate directories
- **Clear Dependencies**: Import relationships are explicit and easy to follow
- **Documentation**: Complex logic is documented with clear comments

This comprehensive project structure provides a scalable, maintainable foundation for the Audit-it platform with clear separation of concerns, consistent patterns, and robust quality standards.
