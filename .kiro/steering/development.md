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

## Implementation Insights from Professional Audit Trail Redesign

### Key Development Lessons Learned

#### 1. User Feedback Integration During Development

**Insight**: Real-time user feedback during implementation leads to significantly better outcomes than post-implementation reviews.

**Best Practices**:

- **Iterative Refinement**: Make changes based on immediate user feedback
- **Visual Inspection**: Always review actual rendered output, not just code
- **Spacing Issues**: Double-check padding/margin relationships in browser
- **Content Relevance**: Question whether each element serves user needs

**Example Process**:

```
1. Implement initial design
2. User identifies issues (double padding, decorative clutter)
3. Immediately refactor based on feedback
4. User confirms improvements
5. Document lessons learned for future implementations
```

#### 2. Component Naming and Content Strategy

**Insight**: Creative, domain-relevant naming improves both developer experience and user understanding.

**Guidelines**:

- **Avoid generic names**: "Professional Summary" → "Professional Audit Trail"
- **Reflect combined purpose**: When combining sections, name should indicate the unified function
- **Domain relevance**: Use terminology that resonates with the business domain (audit, trail, etc.)
- **Developer clarity**: Names should make the component's purpose immediately clear

#### 3. Conditional Rendering Strategy

**Implementation Pattern**:

```typescript
// ✅ Smart conditional rendering
{
  experiences.length > 0 && <ExperienceSection experiences={experiences.slice(0, 3)} />;
}

{
  experiences.length > 3 && <ShowMoreIndicator count={experiences.length - 3} />;
}

{
  isVerified && <VerificationBadge />;
}

// ❌ Always rendering empty sections
<ExperienceSection experiences={experiences || []} />;
```

**Benefits**:

- Cleaner UI for users with minimal data
- Better performance (fewer DOM nodes)
- Reduced cognitive load
- More professional appearance

#### 4. CSS Architecture for Neumorphic Design

**Padding Hierarchy System**:

```typescript
// Establish clear, non-overlapping padding levels
const PADDING_SYSTEM = {
  // Never combine these - choose ONE level per element
  CONTAINER: "p-6", // Main card containers
  CONTENT: "p-4", // Content sections within containers
  ELEMENT: "p-3", // Icon containers, small interactive elements
  TEXT: "p-2", // Text content, descriptions
};

// ✅ Correct implementation
<Card className='shadow-neumorphic-xl'>
  {" "}
  {/* No padding on Card */}
  <div className='p-6 space-y-6'>
    {" "}
    {/* Container padding */}
    <div className='p-4 shadow-neumorphic-inset'>
      {" "}
      {/* Content padding */}
      <p className='text-primary-800'>{text}</p> {/* No additional padding */}
    </div>
  </div>
</Card>;
```

#### 5. Performance Considerations for Neumorphic Design

**Hardware Acceleration**:

```css
/* Always include for neumorphic components */
.neumorphic-optimized {
  transform: translate3d(0, 0, 0);
  will-change: box-shadow, transform;
  backface-visibility: hidden;
}
```

**Transition Optimization**:

```typescript
// ✅ Optimized transitions
className = "transition-all duration-300 neumorphic-optimized";

// ❌ Avoid excessive transition properties
className = "transition-shadow transition-transform transition-colors transition-opacity duration-300";
```

### Development Process Improvements

#### 1. Real-Time Feedback Loop

**Process**:

1. Implement feature/component
2. Immediate visual review with stakeholder
3. Identify specific issues (spacing, relevance, consistency)
4. Make targeted fixes
5. Confirm improvements
6. Document insights for future reference

**Benefits**:

- Faster iteration cycles
- Better final outcomes
- Reduced rework
- Improved developer-stakeholder communication

#### 2. Component Quality Checklist

Before marking any neumorphic component as complete:

**Visual Quality**:

- [ ] No double padding issues
- [ ] Consistent shadow depth hierarchy
- [ ] Proper spacing relationships
- [ ] No unnecessary decorative elements

**Content Quality**:

- [ ] Only shows relevant information
- [ ] Conditional rendering for empty states
- [ ] Meaningful section names
- [ ] Clear information hierarchy

**Technical Quality**:

- [ ] Hardware acceleration applied
- [ ] Smooth 60fps interactions
- [ ] Proper TypeScript typing
- [ ] Accessible markup and interactions

**User Experience**:

- [ ] Mobile-responsive design
- [ ] Clear visual hierarchy
- [ ] Intuitive interaction patterns
- [ ] Professional appearance

#### 3. Documentation-Driven Development

**Insight**: Capturing insights immediately after implementation prevents knowledge loss and improves future development.

**Process**:

1. Complete implementation
2. Document key decisions and rationale
3. Record lessons learned and mistakes avoided
4. Update design system guidelines
5. Share insights with team

**Documentation Targets**:

- **Spec Documents**: Update design decisions and implementation notes
- **Steering Documents**: Add best practices and guidelines
- **Code Comments**: Explain complex neumorphic implementations
- **README Files**: Document component usage patterns

### Future Development Guidelines

#### 1. Always Start with User Needs

- Question every design element: "Does this help users accomplish their goals?"
- Prioritize content over decoration
- Test with real data, not placeholder content

#### 2. Implement Iteratively with Feedback

- Build in small increments
- Get visual feedback early and often
- Be prepared to refactor based on user insights
- Document decisions and rationale

#### 3. Maintain Consistency

- Follow established padding hierarchy
- Use consistent neumorphic shadow depths
- Apply naming conventions consistently
- Reuse proven patterns

#### 4. Optimize for Performance

- Always include hardware acceleration for neumorphic elements
- Limit simultaneous shadow effects
- Use efficient transition properties
- Test on actual mobile devices

These insights ensure that future development maintains the high quality and user-focused approach established during the Professional Audit Trail implementation.
