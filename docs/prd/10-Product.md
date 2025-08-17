# Product Overview & MVP Scope

## Quick Summary

- Project: NoBroker-style Chartered Accountant listing platform (audit-it.com)
- Objective: Mobile-first, modular CA discovery and contact portal
- Key Constraint: All components under 200 lines of code
- Status: Active development with Contact Request and Profile systems
- SEO Strategy: Display "CA"; use "accountant" internally for consistency

---

## Project Description

**Project Name:** audit-it.com  
**Description:** A platform where users can discover, filter, and contact Chartered Accountants (CAs).  
**Objective:** Build a mobile-first, maintainable CA listing portal from scratch with strict component size limits and comprehensive documentation.

### SEO & Technical Strategy

**Display Strategy:** All user-facing content uses "CA" and "Chartered Accountant" for SEO.  
**Internal Architecture:** Uses "accountant" terminology in code (URLs, enums, database) for clarity and consistency.

### Terminology

- Display: "CA", "Chartered Accountant" (SEO)
- Internal: `accountant`
- Database Role: `UserRole.ACCOUNTANT = "accountant"`

---

## Business Goals & Objectives

### Primary Goals

1. User Experience Excellence
   - Intuitive CA discovery and filtering
   - Seamless contact and communication flow
   - Mobile-first responsive design
2. Technical Excellence
   - Component size limit (200 lines max)
   - Robust authentication and security
   - Enum-first type system and normalized data
3. Platform Growth
   - Scalable CA onboarding
   - Efficient contact request management
   - Analytics and insights

---

## Target Audience

### Primary Users

1. Chartered Accountants (CAs)
   - Profile: Professionals seeking client acquisition
   - Goals: Visibility, manage requests, showcase profile
   - Features: Profile creation, request management, professional showcase
2. Customers (Individuals & Businesses)
   - Profile: Needs CA services
   - Goals: Find qualified CAs, compare services, establish contact
   - Features: Search/filter CAs, contact requests, service comparison

### Secondary Users

3. Platform Administrators
   - Goals: Platform quality, moderation, analytics

---

## Success Metrics

### Technical Metrics

- Component Size Compliance: 100% under 200 lines
- Performance: Lighthouse 90+ on mobile
- Accessibility: WCAG AA compliance

### Business Metrics

- User Growth: 50+ verified CAs in first quarter
- Engagement: 20+ contact requests per week
- Conversion: 15%+ contact-to-engagement rate
- SEO: Top 10 for "CA near me"

### Development Metrics

- Velocity: 2-week sprints with consistent delivery
- Quality: <5% bug escape rate
- Maintainability: Onboarding < 1 week
- Documentation: 100% feature coverage in docs

---

## MVP Development Phase

We prioritize shipping core UX and data paths over tests during MVP.

### Testing Strategy (Temporarily Deprioritized)

- Testing is not required during MVP. Do not add unit/integration/E2E tests.
- Perform manual QA across Chrome/Safari/Firefox and mobile devices.
- Rely on strict TypeScript + ESLint as guardrails.

### Implementation Priorities

1. Core functionality: auth, profile onboarding, discovery, contact requests
2. UX polish: neumorphic consistency, mobile-first, accessibility
3. Data integration: Supabase CRUD, storage signed URLs, basic realtime invalidation
4. Performance: caching, image optimization, code splitting

### What Not To Do Now

- Do not introduce test infra or CI gate on tests
- Avoid premature abstractions; keep components <200 lines

---

## Technical Implementation Strategy

### Hybrid Terminology Approach

Rationale: Balance SEO with technical clarity.

#### User-Facing Content (SEO Optimized)

- Display Text: "CA", "Chartered Accountant", "Find CAs"
- URLs: `/accountants`
- Meta: "chartered accountant", "CA", "tax filing"

#### Internal Architecture (Consistent)

- Database Role: `accountant`
- Code Variables: `isAccountant`, `accountantProfile`
- API Endpoints: `/accountant/register`, `/accountant/dashboard`
- Storage: `ACCOUNTANT_CERTIFICATES` bucket

#### Benefits

1. SEO: Optimized for "CA" searches
2. Clarity: Descriptive internal terminology
3. Consistency: Clean internal code structure
4. Maintainability: Easy for developers and stakeholders

---

## Related Documentation

- [20-Architecture](./20-Architecture.md)
- [30-Data-and-Integration](./30-Data-and-Integration.md)
- [40-Design-System](./40-Design-System.md)
