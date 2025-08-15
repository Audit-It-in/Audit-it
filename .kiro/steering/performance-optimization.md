# Performance & Optimization Guidelines

## Performance Philosophy

The Audit-it platform prioritizes **mobile-first performance** with a focus on fast loading times, smooth interactions, and efficient resource utilization. Our target is to achieve Lighthouse scores of 90+ on mobile devices while maintaining excellent user experience.

## Core Performance Metrics

### Target Performance Goals

- **First Contentful Paint (FCP)**: < 1.5 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms
- **Time to Interactive (TTI)**: < 3.5 seconds
- **Lighthouse Performance Score**: 90+ on mobile

### Mobile-First Optimization

- **Primary Target**: Mobile devices (320px+ screens)
- **Network Conditions**: Optimize for 3G and 4G connections
- **Device Performance**: Optimize for mid-range Android devices
- **Touch Interactions**: Smooth 60fps animations and transitions

## Bundle Optimization

### Code Splitting Strategy

#### Route-Level Splitting

```typescript
// Dynamic imports for page components
const ProfilePage = dynamic(() => import("@/app/profile/page"), {
  loading: () => <Loader action={LoadingAction.LOADING} title='Loading profile...' />,
});

const ContactRequestsPage = dynamic(() => import("@/app/contact-requests/page"), {
  loading: () => <Loader action={LoadingAction.LOADING} title='Loading requests...' />,
});
```

#### Component-Level Splitting

```typescript
// Lazy load heavy components
const ContactRequestModal = lazy(() => import("@/src/components/contact-requests/ContactRequestModal.component"));

const AccountantProfileView = lazy(
  () => import("@/src/components/contact-requests/discovery/AccountantProfileView.component")
);

// Usage with Suspense
<Suspense fallback={<Loader action={LoadingAction.LOADING} />}>
  <ContactRequestModal isOpen={isModalOpen} onClose={closeModal} />
</Suspense>;
```

#### Library Splitting

```typescript
// Split large libraries
const DatePicker = dynamic(() => import("react-day-picker"), {
  ssr: false,
  loading: () => <div className='h-8 w-full bg-neutral-100 animate-pulse rounded' />,
});

// Tree shake large libraries
import { format } from "date-fns/format";
import { parseISO } from "date-fns/parseISO";
// Instead of: import * as dateFns from 'date-fns';
```

### Bundle Analysis

#### Webpack Bundle Analyzer

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Monitor bundle size in CI/CD
npm run build -- --analyze
```

#### Bundle Size Monitoring

```typescript
// Monitor critical bundle sizes
const BUNDLE_SIZE_LIMITS = {
  "pages/_app": "250kb",
  "pages/index": "150kb",
  "pages/profile": "200kb",
  "pages/dashboard": "180kb",
};
```

## Image Optimization

### Next.js Image Component

#### Responsive Images

```typescript
import Image from 'next/image';

// Optimized profile pictures
<Image
  src={profilePictureUrl}
  alt={`${firstName} ${lastName} profile picture`}
  width={120}
  height={120}
  className="rounded-full shadow-neumorphic-md"
  sizes="(max-width: 768px) 80px, 120px"
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>

// Responsive hero images
<Image
  src={heroImageUrl}
  alt="CA discovery hero"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

#### Image Optimization Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", ""),
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};
```

### Avatar Optimization

#### Signed URL Caching

```typescript
// Efficient avatar loading with caching
export function useProfilePictureUrl(path?: string | null) {
  return useQuery({
    queryKey: ["profile-picture-url", path],
    queryFn: () => getSignedProfilePictureUrl(path!),
    enabled: !!path,
    staleTime: 55 * 60 * 1000, // 55 minutes (5 min buffer before expiry)
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  });
}

// Preload critical avatars
export function preloadProfilePicture(path: string) {
  queryClient.prefetchQuery({
    queryKey: ["profile-picture-url", path],
    queryFn: () => getSignedProfilePictureUrl(path),
    staleTime: 55 * 60 * 1000,
  });
}
```

## React Performance Optimization

### Component Memoization

#### React.memo Usage

```typescript
// Memoize components with stable props
export const ProfileCard = memo(({ profile, onUpdate }: ProfileCardProps) => {
  const handleUpdate = useCallback(
    (data: ProfileUpdateData) => {
      onUpdate(profile.id, data);
    },
    [profile.id, onUpdate]
  );

  return (
    <Card className='shadow-neumorphic-md'>
      <CardContent>
        <h3>
          {profile.first_name} {profile.last_name}
        </h3>
        <Button onClick={handleUpdate}>Update</Button>
      </CardContent>
    </Card>
  );
});

// Memoize expensive list items
export const ContactRequestItem = memo(({ request }: { request: ContactRequest }) => {
  return (
    <div className='p-4 shadow-neumorphic-sm'>
      <h4>{request.subject}</h4>
      <p>{request.message}</p>
    </div>
  );
});
```

#### useCallback and useMemo

```typescript
// Memoize event handlers
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query);
  // Debounced search logic
}, []);

// Memoize expensive calculations
const filteredResults = useMemo(() => {
  return results.filter((result) => result.name.toLowerCase().includes(searchQuery.toLowerCase()));
}, [results, searchQuery]);

// Memoize complex objects
const filterConfig = useMemo(
  () => ({
    location: selectedLocation,
    specializations: selectedSpecializations,
    languages: selectedLanguages,
  }),
  [selectedLocation, selectedSpecializations, selectedLanguages]
);
```

### Virtual Scrolling for Large Lists

#### React Window Implementation

```typescript
import { FixedSizeList as List } from "react-window";

// Virtual scrolling for large CA lists
export const VirtualizedCAList = ({ items }: { items: ProfileDetails[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <AccountantProfileCard profile={items[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={items.length} itemSize={200} width='100%'>
      {Row}
    </List>
  );
};
```

### Intersection Observer for Lazy Loading

#### Infinite Scroll Implementation

```typescript
import { useInView } from "react-intersection-observer";

export const InfiniteScrollTrigger = ({ onLoadMore, hasMore, isLoading }: Props) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px", // Load more when 100px from bottom
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <div ref={ref} className='py-4'>
      {isLoading && <Loader action={LoadingAction.LOADING} title='Loading more results...' />}
    </div>
  );
};
```

## Database Performance

### Query Optimization

#### Efficient Supabase Queries

```typescript
// Use database views for complex joins
export async function fetchCAsForDiscovery(filters: CADiscoveryFilters) {
  // Use pre-computed view instead of complex joins
  let query = supabase
    .from("profile_details") // Optimized view with resolved relationships
    .select("*", { count: "exact" })
    .eq("role", "accountant")
    .eq("is_active", true);

  // Use GIN indexes for array operations
  if (filters.specializations?.length > 0) {
    query = query.overlaps("specialization_ids", filters.specializations);
  }

  // Use composite indexes for common filter combinations
  if (filters.location?.stateId) {
    query = query.eq("state_id", filters.location.stateId);
  }

  return query;
}
```

#### Pagination with Count Optimization

```typescript
// Efficient pagination with total count
export async function fetchContactRequestsWithCount(filters: ContactRequestFilters, pagination: PaginationParams) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  // Use exact count only when needed
  const shouldCount = page === 1; // Only count on first page

  const query = supabase
    .from("contact_requests_with_details")
    .select("*", { count: shouldCount ? "exact" : undefined })
    .range(offset, offset + limit - 1);

  return query;
}
```

### Caching Strategy

#### TanStack Query Configuration

```typescript
// Optimized cache configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time based on data volatility
      staleTime: 5 * 60 * 1000, // 5 minutes default

      // Garbage collection time
      gcTime: 10 * 60 * 1000, // 10 minutes default

      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.message?.includes("4")) return false;
        return failureCount < 3;
      },

      // Refetch configuration
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Domain-specific cache times
const CACHE_TIMES = {
  STATIC_DATA: 24 * 60 * 60 * 1000, // 24 hours (languages, specializations)
  PROFILE_DATA: 30 * 60 * 1000, // 30 minutes (user profiles)
  CONTACT_REQUESTS: 5 * 60 * 1000, // 5 minutes (contact requests)
  SEARCH_RESULTS: 10 * 60 * 1000, // 10 minutes (CA discovery)
  ANALYTICS: 15 * 60 * 1000, // 15 minutes (analytics data)
};
```

#### Prefetching Strategy

```typescript
// Prefetch critical data
export function usePrefetchCriticalData() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch static lookup data
    queryClient.prefetchQuery({
      queryKey: ["languages"],
      queryFn: fetchLanguages,
      staleTime: CACHE_TIMES.STATIC_DATA,
    });

    queryClient.prefetchQuery({
      queryKey: ["specializations"],
      queryFn: fetchSpecializations,
      staleTime: CACHE_TIMES.STATIC_DATA,
    });
  }, [queryClient]);
}
```

## Network Optimization

### Request Batching

#### Batch Multiple Requests

```typescript
// Batch related requests
export async function fetchProfileWithRelatedData(userId: string) {
  const [profile, experiences, educations, verification] = await Promise.all([
    fetchProfile(userId),
    fetchExperiences(userId),
    fetchEducations(userId),
    fetchVerification(userId),
  ]);

  return {
    profile,
    experiences,
    educations,
    verification,
  };
}
```

### Request Deduplication

#### Automatic Deduplication with TanStack Query

```typescript
// TanStack Query automatically deduplicates identical requests
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => fetchProfile(userId),
    // Multiple components calling this hook with same userId
    // will only trigger one network request
  });
}
```

## CSS and Animation Performance

### Efficient Neumorphic Shadows

#### Hardware Acceleration

```css
/* Enable hardware acceleration for shadows */
.shadow-neumorphic-md {
  transform: translate3d(0, 0, 0);
  will-change: box-shadow, transform;
  backface-visibility: hidden;
}

/* Optimize transitions for 60fps */
.transition-neumorphic {
  transition: box-shadow 200ms ease-out, transform 200ms ease-out;
}
```

#### Conditional Shadow Application

```typescript
// Apply expensive shadows only when needed
const Card = ({ isInteractive = false, children }: CardProps) => (
  <div
    className={cn(
      "rounded-lg bg-white",
      isInteractive
        ? "shadow-neumorphic-md hover:shadow-neumorphic-lg transition-neumorphic cursor-pointer"
        : "shadow-neumorphic-sm"
    )}
  >
    {children}
  </div>
);
```

### Animation Performance

#### Efficient Animations

```css
/* Use transform and opacity for smooth animations */
@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Avoid animating layout properties */
.animate-slide-in {
  animation: slideIn 300ms ease-out;
}

/* Use will-change for complex animations */
.complex-animation {
  will-change: transform, opacity;
}
```

## Loading States and Perceived Performance

### Skeleton Loading

#### Neumorphic Skeletons

```typescript
// Skeleton components that match actual content
export const ProfileCardSkeleton = () => (
  <Card className='shadow-neumorphic-sm'>
    <CardContent className='p-6 space-y-4'>
      <div className='flex items-center space-x-4'>
        <div className='w-16 h-16 bg-neutral-200 rounded-full animate-pulse shadow-neumorphic-inset' />
        <div className='space-y-2 flex-1'>
          <div className='h-4 bg-neutral-200 rounded animate-pulse shadow-neumorphic-inset' />
          <div className='h-3 bg-neutral-200 rounded w-2/3 animate-pulse shadow-neumorphic-inset' />
        </div>
      </div>
      <div className='space-y-2'>
        <div className='h-3 bg-neutral-200 rounded animate-pulse shadow-neumorphic-inset' />
        <div className='h-3 bg-neutral-200 rounded w-4/5 animate-pulse shadow-neumorphic-inset' />
      </div>
    </CardContent>
  </Card>
);
```

### Progressive Loading

#### Incremental Content Loading

```typescript
// Load critical content first, then enhance
export const ProfilePage = ({ userId }: { userId: string }) => {
  const { data: profile, isLoading: profileLoading } = useProfile(userId);
  const { data: experiences } = useExperiences(userId);
  const { data: educations } = useEducations(userId);

  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className='space-y-6'>
      {/* Critical content loads first */}
      <ProfileHeader profile={profile} />

      {/* Secondary content loads progressively */}
      <Suspense fallback={<ExperienceSkeleton />}>
        <ExperienceSection experiences={experiences} />
      </Suspense>

      <Suspense fallback={<EducationSkeleton />}>
        <EducationSection educations={educations} />
      </Suspense>
    </div>
  );
};
```

## Monitoring and Analytics

### Performance Monitoring

#### Web Vitals Tracking

```typescript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function trackWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}

// Usage in _app.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Send to analytics service
  analytics.track("Web Vital", {
    name: metric.name,
    value: metric.value,
    id: metric.id,
  });
}
```

#### Performance Budget

```typescript
// Performance budget monitoring
const PERFORMANCE_BUDGET = {
  FCP: 1500, // First Contentful Paint (ms)
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  TTI: 3500, // Time to Interactive (ms)
};

export function checkPerformanceBudget(metrics: WebVitalsMetric[]) {
  return metrics.every((metric) => metric.value <= PERFORMANCE_BUDGET[metric.name as keyof typeof PERFORMANCE_BUDGET]);
}
```

### Bundle Size Monitoring

#### Automated Bundle Analysis

```typescript
// Monitor bundle size in CI/CD
const bundleSizeConfig = {
  files: [
    {
      path: ".next/static/chunks/pages/_app-*.js",
      maxSize: "250kb",
    },
    {
      path: ".next/static/chunks/pages/index-*.js",
      maxSize: "150kb",
    },
  ],
};
```

This comprehensive performance optimization guide ensures the Audit-it platform delivers excellent user experience across all devices while maintaining code quality and maintainability.
