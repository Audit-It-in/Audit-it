# Technology Stack

## Framework & Runtime

- **Next.js 15.4.4**: React framework with App Router
- **React 19.1.0**: UI library with latest features
- **TypeScript 5**: Strict mode enabled for type safety
- **Node.js**: Runtime environment

## UI & Styling

- **Neumorphic Design**: Core design philosophy with soft depth effects and brand color integration
- **Tailwind CSS 4**: Utility-first CSS framework with custom neumorphic shadow utilities
- **shadcn/ui**: Component library customized with neumorphic design principles
- **Radix UI**: Accessible component primitives as foundation for neumorphic components
- **Brand Colors**: Primary blue and accent emerald colors integrated throughout depth effects
- **Custom Shadow System**: Neumorphic utilities (shadow-neumorphic-sm/md/lg/xl, inset, focus, error)
- **Phosphor Icons**: Primary icon library (with "Icon" suffix, weight="bold")
- **Lucide React**: Secondary icons for shadcn compatibility

## State Management

- **TanStack Query (React Query)**: Server state, caching, background updates
- **Jotai**: Client-side state management for UI state
- **React Hook Form**: Form state management with Zod validation
- **Zustand**: Auth store management

## Backend & Database

- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Row Level Security (RLS)**: Database-level access control
- **Database Views**: Optimized queries with resolved relationships
- **Storage Buckets**: File uploads (profile pictures, certificates)
- **Migration System**: Sequential SQL migrations with idempotent design
- **Schema Evolution**: Normalized design with foreign keys (languages, specializations, locations)

## Validation & Types

- **Zod**: Schema validation for forms and API data
- **Enum-driven types**: Maximum type safety with comprehensive enums
- **Strict TypeScript**: Full type coverage across codebase

## Development Tools

- **ESLint**: Code linting with Next.js config
- **Prettier**: Code formatting with specific JSX quote preferences
- **Jest**: Testing framework with component and UI test separation
- **Vercel**: Primary deployment platform
- **Firebase**: Alternative deployment option

## Code Style Standards

- **JSX Quotes**: Single quotes for JSX attributes (`className='w-full'`)
- **String Quotes**: Double quotes for string literals (`const message = "Hello"`)
- **Import Order**: React → Third-party → Internal UI → Types → Utilities
- **Component Size**: Maximum 200 lines including imports and comments
- **shadcn/ui Config**: New York style with neutral base color and CSS variables

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run dev:local             # Local environment
npm run dev:prod              # Production environment

# Building
npm run build                 # Production build
npm run build:dev             # Development build
npm run build:prod            # Production build

# Testing
npm run test                  # Run tests
npm run test:watch            # Watch mode
npm run test:ui               # UI tests only
npm run test:components       # Component tests only

# Deployment
npm run vercel-deploy:dev     # Deploy to Vercel (dev)
npm run vercel-deploy:prod    # Deploy to Vercel (prod)

# Data Processing
npm run process-locations     # Process location data
npm run clear-location-imports # Clear location imports

# Database Migrations
# Run migrations manually in Supabase SQL Editor
# Follow sequential order: 001 → 002 → ... → 008 (latest)
# Latest: 008-specializations-normalization-2025-07-22.sql

# Linting
npm run lint                  # Run ESLint
```

## Architecture Patterns

- **Service Layer**: Pure async functions with TanStack Query hooks
- **Component Architecture**: Feature-based organization, 200-line limit
- **Mobile-First**: Responsive design starting from mobile (320px+)
- **Normalized Database**: Foreign keys instead of text arrays
- **Type Safety**: Enum-driven development with strict TypeScript
- **No Index Files**: Explicit imports only, avoid index.ts/index.js files
- **Domain-Driven**: Group by business feature, not technical layer
- **Performance**: Memoization, bundle optimization, efficient caching strategies
