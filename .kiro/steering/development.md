# Development Guidelines

## Development Philosophy

The Audit-it platform follows a **rapid prototyping approach** focused on delivering a working, user-facing product within a 2-month timeline. This approach prioritizes functional implementation, user experience, and iterative improvement over comprehensive testing infrastructure.

## Current Development Phase: MVP Focus

### Testing Strategy

**Current Status**: Testing is not a priority for the current development phase.

**Rationale**:

- We are focusing on rapid feature development and implementation
- Testing infrastructure will be revisited in a later phase of the project
- Resources are allocated to user-facing features and core functionality
- Manual testing and user feedback drive quality assurance

**Implementation Guidelines**:

- Do not include test creation or test-related tasks in implementation plans
- Do not set up testing infrastructure or testing utilities
- Focus on functional implementation that can be manually validated
- Prioritize end-to-end functionality over test coverage

### Quality Assurance Approach

**Manual Testing Focus**:

- Thorough manual testing of all user flows
- Cross-browser compatibility testing (Chrome, Safari, Firefox)
- Mobile device testing on actual devices
- Accessibility testing with screen readers and keyboard navigation

**Code Quality Measures**:

- TypeScript strict mode for compile-time error detection
- ESLint for code quality and consistency
- Component size limits (200 lines) for maintainability
- Comprehensive error handling with user-friendly messages

## Implementation Priorities

### 1. Core Functionality (Highest Priority)

- **User Authentication**: Sign up, sign in, OAuth integration
- **Profile Management**: Multi-step onboarding, file uploads, verification
- **CA Discovery**: Search, filtering, profile viewing
- **Contact System**: Request submission, status tracking, communication

### 2. User Experience (High Priority)

- **Neumorphic Design**: Consistent visual design system implementation
- **Mobile-First**: Responsive design optimized for mobile devices
- **Performance**: Fast loading times, smooth interactions
- **Accessibility**: WCAG AA compliance for inclusive design

### 3. Data Integration (High Priority)

- **Database Operations**: CRUD operations with proper error handling
- **File Storage**: Secure file upload and retrieval with signed URLs
- **Real-time Updates**: Live updates for contact requests and notifications
- **Data Validation**: Comprehensive input validation with Zod schemas

### 4. Performance Optimization (Medium Priority)

- **Caching Strategy**: TanStack Query caching with appropriate stale times
- **Bundle Optimization**: Code splitting and tree shaking
- **Image Optimization**: Next.js Image component with proper sizing
- **Database Performance**: Optimized queries with proper indexing

### 5. Security & Privacy (Medium Priority)

- **Row Level Security**: Database-level access control
- **Input Sanitization**: Prevent XSS and injection attacks
- **File Upload Security**: MIME type validation and size limits
- **Authentication Security**: Secure session management

## Task Planning Guidelines

### Include in Implementation Plans

- **Component Development**: React components with neumorphic design
- **Service Layer Development**: Data fetching and API integration
- **UI/UX Implementation**: Design system components and layouts
- **Database Schema**: Migration creation and optimization
- **Form Implementation**: react-hook-form with Zod validation
- **File Upload Systems**: Secure file handling with Supabase storage
- **Authentication Flows**: Complete auth system implementation
- **Performance Optimization**: Caching, lazy loading, optimization

### Exclude from Implementation Plans

- **Test Writing**: Unit tests, integration tests, E2E tests
- **Test Setup**: Testing framework configuration
- **Test Infrastructure**: CI/CD testing pipelines
- **Test Coverage Reports**: Coverage analysis and reporting
- **Mock Data Generation**: Test data creation utilities

### Task Structure Guidelines

**Good Task Examples**:

- "Implement ContactRequestModal component with neumorphic styling"
- "Create profile picture upload service with signed URL generation"
- "Build CA discovery page with search and filtering functionality"
- "Develop multi-step profile onboarding with completion tracking"

**Avoid These Task Types**:

- "Write unit tests for ContactRequestModal component"
- "Set up Jest testing environment"
- "Create test utilities for form validation"
- "Implement E2E testing for user registration flow"

## Code Quality Standards

### Component Development

- **Size Limit**: Maximum 200 lines including imports and comments
- **Single Responsibility**: Each component has one clear purpose
- **Composition Pattern**: Build complex UIs from simple components
- **Neumorphic Consistency**: All components follow design system principles

### Component Naming Guidelines

#### Avoid "CA" Prefix in Component Names

When creating components for the contact requests system or any other features, avoid using the "CA" prefix in component names, file names, or function names.

**❌ Incorrect Examples:**

- `CADiscoveryPage.component.tsx`
- `CAProfileCard.component.tsx`
- `CAProfileView.component.tsx`
- `fetchCAs()`
- `useCAs()`

**✅ Correct Examples:**

- `AccountantDiscoveryPage.component.tsx`
- `AccountantProfileCard.component.tsx`
- `AccountantProfileView.component.tsx`
- `fetchAccountants()`
- `useAccountants()`

**Rationale:**

1. **Internal Consistency**: Use "accountant" terminology in code for consistency and clarity
2. **SEO Separation**: Keep "CA" and "Chartered Accountant" terminology for user-facing content and SEO optimization
3. **Code Readability**: "Accountant" is more descriptive and readable in code context
4. **Maintainability**: Consistent naming makes the codebase easier to maintain and understand

**Implementation Guidelines:**

- **User-Facing Content**: Continue using "CA" and "Chartered Accountant" for SEO and user interface
- **Internal Code**: Use "accountant" in component names, function names, and internal logic
- **Database**: Keep `role: 'accountant'` for technical implementation
- **URLs**: Use descriptive paths like `/accountants` for clean routing

This approach maintains SEO benefits while keeping the codebase clean and consistent.

### TypeScript Standards

- **Strict Mode**: Full TypeScript strict mode compliance
- **Enum-Driven**: Use comprehensive enums instead of magic strings
- **Type Coverage**: 100% type coverage across the codebase
- **Database Alignment**: Types match database schema exactly

### Performance Standards

- **Mobile-First**: Optimize for mobile devices (320px+ screens)
- **Bundle Size**: Monitor and optimize bundle size
- **Rendering**: Use React.memo and useCallback for optimization
- **Caching**: Implement appropriate caching strategies

### Accessibility Standards

- **WCAG AA**: Full compliance with accessibility guidelines
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text

## Development Workflow

### Feature Development Process

1. **Requirements Analysis**: Understand user needs and business requirements
2. **Design Review**: Ensure neumorphic design system compliance
3. **Component Planning**: Break down into manageable components (<200 lines)
4. **Implementation**: Build with TypeScript strict mode and error handling
5. **Manual Testing**: Thorough testing across devices and browsers
6. **Code Review**: Peer review for quality and consistency
7. **Deployment**: Deploy to staging for stakeholder review

### Code Review Checklist

- [ ] **Component Size**: Under 200 lines including imports
- [ ] **TypeScript**: Strict mode compliance with proper typing
- [ ] **Neumorphic Design**: Consistent with design system
- [ ] **Mobile Responsive**: Works on mobile devices (320px+)
- [ ] **Accessibility**: WCAG AA compliance
- [ ] **Error Handling**: Comprehensive error states and messages
- [ ] **Performance**: Optimized rendering and bundle impact
- [ ] **Security**: Proper input validation and sanitization

### Git Workflow

- **Branch Naming**: `feature/component-name` or `fix/issue-description`
- **Commit Messages**: Clear, descriptive commit messages
- **Pull Requests**: Include description, screenshots, and testing notes
- **Code Review**: At least one reviewer before merging

## Error Handling Strategy

### User-Friendly Error Messages

```typescript
// Good: User-friendly error messages
try {
  await createContactRequest(requestData);
} catch (error) {
  setError("Unable to send your request. Please check your information and try again.");
}

// Bad: Technical error messages
try {
  await createContactRequest(requestData);
} catch (error) {
  setError(error.message); // May show technical database errors
}
```

### Comprehensive Error Boundaries

```typescript
// Implement error boundaries for graceful failure handling
export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryComponent
      fallback={
        <div className='p-8 text-center'>
          <h2 className='text-lg font-semibold text-primary-800 mb-2'>Something went wrong</h2>
          <p className='text-primary-600 mb-4'>
            We're sorry for the inconvenience. Please refresh the page and try again.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      }
    >
      {children}
    </ErrorBoundaryComponent>
  );
};
```

## Performance Guidelines

### Bundle Optimization

- **Dynamic Imports**: Use dynamic imports for large components
- **Code Splitting**: Split code at route level
- **Tree Shaking**: Ensure unused code is eliminated
- **Bundle Analysis**: Regular bundle size monitoring

### Rendering Optimization

- **React.memo**: Memoize components that receive stable props
- **useCallback**: Memoize event handlers and functions
- **useMemo**: Memoize expensive calculations
- **Lazy Loading**: Implement lazy loading for images and components

### Caching Strategy

- **TanStack Query**: Appropriate stale times based on data volatility
- **Browser Caching**: Leverage browser caching for static assets
- **CDN**: Use CDN for static asset delivery
- **Service Worker**: Consider service worker for offline functionality

## Security Best Practices

### Input Validation

- **Zod Schemas**: Comprehensive validation for all user inputs
- **Sanitization**: Sanitize user inputs to prevent XSS
- **File Upload**: Validate file types and sizes
- **Rate Limiting**: Implement rate limiting for API endpoints

### Authentication Security

- **Secure Sessions**: Use secure, httpOnly cookies
- **Token Management**: Proper JWT token handling
- **Password Security**: Enforce strong password requirements
- **OAuth Security**: Secure OAuth implementation

### Data Protection

- **Row Level Security**: Database-level access control
- **Private Storage**: Secure file storage with signed URLs
- **Data Encryption**: Encrypt sensitive data at rest
- **HTTPS**: Enforce HTTPS for all communications

## Deployment Strategy

### Environment Management

- **Development**: Local development with hot reloading
- **Staging**: Staging environment for stakeholder review
- **Production**: Production environment with monitoring

### Deployment Process

1. **Code Review**: Peer review and approval
2. **Manual Testing**: Comprehensive testing on staging
3. **Stakeholder Approval**: Business stakeholder sign-off
4. **Production Deployment**: Deploy to production with monitoring
5. **Post-Deployment Testing**: Verify functionality in production

### Monitoring and Maintenance

- **Error Monitoring**: Track and respond to production errors
- **Performance Monitoring**: Monitor page load times and user experience
- **User Feedback**: Collect and respond to user feedback
- **Regular Updates**: Keep dependencies updated and secure

This development approach ensures rapid delivery of a high-quality, user-focused product while maintaining code quality and security standards.
