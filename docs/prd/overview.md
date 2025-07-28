# Audit-it Platform Overview

## Quick Summary

- **Project:** NoBroker-style Chartered Accountant listing platform (audit-it.com)
- **Objective:** Mobile-first, modular CA discovery and contact portal
- **Key Constraint:** All components under 200 lines of code
- **Status:** Active development with Contact Request and Profile systems
- **SEO Strategy:** Display "CA" terminology for SEO, use "accountant" internally for consistency

## Detailed Sections

### [Project Description](#project-description)

### [Business Goals & Objectives](#business-goals--objectives)

### [Target Audience](#target-audience)

### [Success Metrics](#success-metrics)

---

## Project Description

**Project Name:** audit-it.com
**Description:** A NoBroker-style platform where users can discover, filter, and contact Chartered Accountants (CAs).  
**Objective:** Build a mobile-first, modular, and maintainable CA listing portal from scratch. Every UI component must be kept under **200 lines of code** and all progress, context, and guidelines must be meticulously tracked via dedicated documents.

### SEO & Technical Strategy

**Display Strategy:** All user-facing content uses "CA" and "Chartered Accountant" terminology for optimal SEO and user familiarity.
**Internal Architecture:** Uses "accountant" terminology in code (URLs, enums, database) for clarity and consistency.

### Key Documentation Structure

- `docs/prd/` - Product Requirements Documentation (this directory)
- `docs/progress/` - Development progress tracking and implementation status

---

## Business Goals & Objectives

### Primary Goals

1. **User Experience Excellence**

   - Provide intuitive CA discovery and filtering
   - Enable seamless contact and communication flow
   - Ensure mobile-first responsive design

2. **Technical Excellence**

   - Maintain component size limit (200 lines max)
   - Achieve comprehensive test coverage (90%+)
   - Implement robust authentication and security
   - Balance SEO-optimized display with flexible internal architecture

3. **Platform Growth**
   - Support scalable CA onboarding
   - Enable efficient contact request management
   - Provide analytics and insights
   - Future-proof for expansion to other financial experts

---

## Target Audience

### Primary Users

#### 1. Chartered Accountants (CAs)

- **Profile**: Professional CAs seeking client acquisition
- **Goals**: Increase visibility, manage contact requests, build professional profile
- **Pain Points**: Limited online presence, inefficient lead management
- **Features Used**: Profile creation, contact request management, professional showcase
- **Technical Note**: Internally classified as "xpert" role for future extensibility

#### 2. Customers (Individuals & Businesses)

- **Profile**: Individuals and businesses needing CA services
- **Goals**: Find qualified CAs, compare services, establish contact
- **Pain Points**: Difficulty finding reliable CAs, unclear service offerings
- **Features Used**: CA search and filtering, contact requests, service comparison

### Secondary Users

#### 3. Platform Administrators

- **Profile**: Platform operators and content moderators
- **Goals**: Maintain platform quality, moderate content, analyze metrics
- **Features Used**: Admin dashboard, content moderation, analytics

---

## Success Metrics

### Technical Metrics

- ✅ **Component Size Compliance**: 100% of components under 200 lines
- ✅ **Test Coverage**: 90%+ across all critical components
- ✅ **Performance**: Lighthouse scores 90+ on mobile
- ✅ **Accessibility**: WCAG AA compliance

### Business Metrics

- **User Growth**: 50+ verified CAs in first quarter
- **Engagement**: 20+ contact requests per week
- **Conversion**: 15%+ contact-to-engagement conversion rate
- **Quality**: 4.5+ average CA rating
- **SEO Performance**: Top 10 ranking for "CA near me" searches

### Development Metrics

- **Velocity**: 2-week sprint cycles with consistent delivery
- **Quality**: <5% bug escape rate to production
- **Maintainability**: New developer onboarding < 1 week
- **Documentation**: 100% feature coverage in documentation

---

## Technical Implementation Strategy

### Hybrid Terminology Approach

**Rationale:** Balance SEO optimization with technical clarity and consistency.

#### User-Facing Content (SEO Optimized)

- **Display Text**: "CA", "Chartered Accountant", "Find CAs"
- **URLs**: `/accountants` (clean, descriptive)
- **Meta Tags**: "chartered accountant", "CA", "tax filing"
- **Content**: Focus on CA-specific terminology for search visibility

#### Internal Architecture (Consistent)

- **Database Role**: `UserRole.ACCOUNTANT = "accountant"`
- **Code Variables**: `isAccountant`, `accountantProfile`
- **API Endpoints**: `/accountant/register`, `/accountant/dashboard`
- **Storage**: `ACCOUNTANT_CERTIFICATES` bucket

#### Benefits

1. **SEO**: Optimized for "CA" searches (primary market demand)
2. **Clarity**: Clear and descriptive internal terminology
3. **Consistency**: Clean internal code structure
4. **Maintainability**: Easily understood by developers and stakeholders

---

## Related Documentation

- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management patterns
- [Database Schema](./database-schema.md) - Complete database documentation with normalized schema
- [Component Standards](./component-standards.md) - Development standards and naming conventions
- [UI/UX Guidelines](./ui-ux-guidelines.md) - Design system and visual guidelines
- [Testing Standards](./testing-standards.md) - Testing methodologies and requirements
