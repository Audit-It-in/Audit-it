# Technology Stack

## Framework & Runtime

- **Next.js 15.4.4**: React framework with App Router for server-side rendering and routing
- **React 19.1.0**: UI library with latest features including concurrent rendering
- **TypeScript 5**: Strict mode enabled for maximum type safety across the codebase
- **Node.js**: Runtime environment for development and build processes

## UI & Styling

### Neumorphic Design System

- **Core Philosophy**: Soft depth effects with brand color integration throughout all UI components
- **Tailwind CSS 4**: Utility-first CSS framework with custom neumorphic shadow utilities
- **Custom Shadow System**:
  - `shadow-neumorphic-sm/md/lg/xl` for raised effects
  - `shadow-neumorphic-inset/inset-deep` for pressed effects
  - `shadow-neumorphic-focus/error` for interactive states
- **Brand Colors**: Primary blue (#2563eb) and accent emerald (#10b981) integrated in shadows and highlights
- **No Gradients Policy**: Solid fills only; depth conveyed via shadow utilities, not color transitions

### Component Libraries

- **shadcn/ui**: Component library customized with neumorphic design principles (New York style)
- **Radix UI**: Accessible component primitives as foundation for neumorphic components
- **Class Variance Authority (CVA)**: Component variant management for consistent styling
- **Tailwind Merge**: Utility for merging Tailwind classes without conflicts

### Icon System

- **Phosphor Icons**: Primary icon library (with "Icon" suffix, weight="bold" always)
- **Lucide React**: Secondary icons for shadcn compatibility only
- **Consistent Sizing**: `h-4 w-4` and `h-5 w-5` standard sizes
- **Brand Colors**: Icons use semantic brand color classes

## State Management

### Client State

- **Jotai**: Atomic state management for UI state, form state, and temporary data
- **Auth Store**: Dedicated Jotai atom for authentication state management
- **Minimal Boilerplate**: Atom-based approach with computed derivatives

### Server State

- **TanStack Query v5**: Server state management with automatic caching and background updates
- **Query Keys**: Consistent patterns like `["profile", userId]`, `["contact-requests", filters]`
- **Stale Times**:
  - Static data (languages, specializations): 24 hours
  - User profiles: 30 minutes
  - Contact requests: 5 minutes
  - Real-time data: 0 (always fresh)
- **Cache Invalidation**: Granular invalidation on mutations

### Form Management

- **React Hook Form**: Form state management with performance optimization
- **Zod Integration**: Schema validation with `@hookform/resolvers/zod`
- **Error Handling**: Comprehensive validation with neumorphic error styling

## Backend & Database

### Supabase Infrastructure

- **PostgreSQL**: Normalized database with proper foreign key relationships
- **Row Level Security (RLS)**: Database-level access control for secure data access
- **Real-time Subscriptions**: Live updates for contact requests and profile changes
- **Edge Functions**: Serverless functions for complex business logic

### Database Architecture

- **Normalized Schema**: Foreign keys instead of text arrays for performance
- **Database Views**: Optimized queries with resolved relationships (`profile_details`, `contact_requests_with_details`)
- **Composite Indexes**: Performance-optimized indexes for common query patterns
- **Analytics Functions**: Built-in SQL functions for contact request statistics

### Storage System

- **Private Buckets**:
  - `profile-pictures`: User avatars (5MB limit, signed URLs)
  - `accountant-certificates`: CA verification documents (5MB limit)
- **Signed URL Strategy**: Runtime URL generation with caching and expiry
- **File Validation**: MIME type and size restrictions enforced

### Migration System

- **Sequential Migrations**: `001-base.sql` through `009-contact-requests-view-2025-01-16.sql`
- **Idempotent Design**: Safe to run multiple times without data loss
- **Schema Evolution**: Normalized design evolution with backward compatibility
- **Latest Migration**: Contact requests view with optimized indexes and RLS policies

## Validation & Types

### Type System

- **Strict TypeScript**: Full type coverage with `strict: true` configuration
- **Enum-Driven Development**: Maximum type safety with comprehensive enums
- **Domain-Specific Types**: Organized by business domain (auth, profile, contact-request, ui)
- **Database Alignment**: Types match database schema exactly

### Validation Strategy

- **Zod Schemas**: Runtime validation for forms and API data
- **Enum Validation**: Type-safe enum usage throughout the application
- **Error Handling**: Comprehensive error types with user-friendly messages

## Development Tools

### Code Quality

- **ESLint**: Next.js configuration with strict rules
- **Prettier**: Automated code formatting with specific preferences
- **TypeScript Compiler**: Strict mode compilation with path mapping

### Testing Framework

- **Jest**: Testing framework configured for React components
- **Test Organization**: Separate `ui` and `components` test suites
- **Current Status**: Testing not prioritized in current development phase

### Deployment

- **Vercel**: Primary deployment platform with automatic deployments
- **Firebase**: Alternative deployment option available
- **Environment Management**: Separate dev/prod configurations

## Code Style Standards

### Formatting Rules

- **JSX Quotes**: Single quotes for JSX attributes (`className='w-full'`)
- **String Quotes**: Double quotes for string literals (`const message = "Hello"`)
- **Line Length**: 100 characters maximum for readability
- **Semicolons**: Required for statement termination
- **Trailing Commas**: ES5-compatible trailing commas

### Import Organization

1. **React & Ecosystem**: React hooks and React-specific libraries
2. **Third-Party Libraries**: External dependencies
3. **Internal UI Components**: shadcn/ui and custom components
4. **Types**: TypeScript interfaces and enums (with `type` prefix)
5. **Utilities & Helpers**: Internal utility functions

### Component Standards

- **Maximum Size**: 200 lines including imports and comments
- **Naming Convention**: `ComponentName.component.tsx` for features, `component-name.tsx` for UI
- **Export Pattern**: Named exports preferred over default exports

## Configuration Files

### Core Configuration

- **next.config.ts**: Next.js configuration with dynamic Supabase image domains
- **tailwind.config.js**: Custom neumorphic utilities and brand colors
- **tsconfig.json**: Strict TypeScript with path mapping (`@/*`)
- **components.json**: shadcn/ui configuration (New York style, neutral base)

### Development Configuration

- **eslint.config.mjs**: ESLint rules for code quality
- **package.json**: Comprehensive script collection for all development tasks
- **.env.local**: Environment variables for local development

## Common Commands

```bash
# Development
npm run dev                    # Start development server (localhost:3000)
npm run dev:local             # Local environment with .env.local
npm run dev:prod              # Production environment simulation

# Building & Deployment
npm run build                 # Production build with optimization
npm run build:dev             # Development build for testing
npm run build:prod            # Production build with prod env
npm run vercel-deploy:dev     # Deploy to Vercel development
npm run vercel-deploy:prod    # Deploy to Vercel production

# Testing (Currently Disabled)
npm run test                  # Run Jest test suite
npm run test:watch            # Watch mode for development
npm run test:ui               # UI component tests only
npm run test:components       # Feature component tests only

# Data Management
npm run process-locations     # Process location CSV data
npm run clear-location-imports # Clear location import cache

# Code Quality
npm run lint                  # Run ESLint with auto-fix
```

## Database Migrations

### Migration Management

- **Manual Execution**: Run in Supabase SQL Editor in sequential order
- **Current Latest**: `009-contact-requests-view-2025-01-16.sql`
- **Migration History**:
  - `001-base.sql`: Initial schema with profiles, experiences, educations
  - `002-location-management-simple-2025-01-15.sql`: States and districts normalization
  - `003-profile-completion-tracking-2025-01-15.sql`: Profile completion percentage tracking
  - `004-profile-location-fields-2025-01-15.sql`: Foreign key location references
  - `005-setup-certificate-storage-2025-01-15.sql`: File storage buckets and policies
  - `006-normalize-schema-2025-01-16.sql`: Languages table normalization
  - `007-profile-picture-storage-2025-07-13.sql`: Profile picture storage system
  - `008-specializations-normalization-2025-07-22.sql`: Specializations and categories
  - `009-contact-requests-view-2025-01-16.sql`: Contact requests with optimized views and RLS

## Architecture Patterns

### Service Layer Architecture

- **Pure Functions**: Service functions are pure async functions without React dependencies
- **TanStack Query Integration**: Separate hooks for React integration
- **Error Handling**: Comprehensive try-catch with user-friendly error messages
- **Cache Strategy**: Appropriate stale times based on data volatility

### Component Architecture

- **Feature-Based Organization**: Group by business domain, not technical layer
- **200-Line Limit**: Strict component size limit for maintainability
- **Composition Pattern**: Build complex UIs from simple, focused components
- **Neumorphic Consistency**: All components follow neumorphic design principles

### Performance Optimization

- **Mobile-First**: Responsive design starting from 320px+ screens
- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Next.js Image component with proper sizing
- **Caching Strategy**: Multi-level caching (TanStack Query, signed URLs, browser cache)

### Type Safety

- **Enum-Driven Development**: Comprehensive enums for maximum type safety
- **Database Schema Alignment**: Types match database structure exactly
- **No Magic Strings**: All string literals replaced with typed enums
- **Strict Mode**: TypeScript strict mode enabled throughout

### Security & Privacy

- **Row Level Security**: Database-level access control
- **Private Storage**: Signed URLs for sensitive file access
- **Input Validation**: Zod schemas for all user inputs
- **CSRF Protection**: Built-in Next.js CSRF protection

This technology stack provides a robust, scalable, and maintainable foundation for the Audit-it CA platform with emphasis on type safety, performance, and user experience.
