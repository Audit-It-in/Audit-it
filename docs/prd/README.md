# Product Requirements Documentation (PRD)

## Overview

This directory contains comprehensive product requirements and development standards for the Audit-it CA Platform. These documents serve as the single source of truth for architecture decisions, coding standards, and design patterns.

## Quick Navigation

| Document                                                | Purpose                                            | When to Use                                 |
| ------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------- |
| [Overview](./overview.md)                               | Project vision and objectives                      | Project onboarding, stakeholder alignment   |
| [Architecture Guidelines](./architecture-guidelines.md) | Service layer, state management, type organization | Setting up services, data flow architecture |
| [Component Standards](./component-standards.md)         | Component development, naming, folder structure    | Building any React component                |
| [UI/UX Guidelines](./ui-ux-guidelines.md)               | Design system, shadcn/ui patterns, accessibility   | UI development, design implementation       |
| [Type System Guide](./type-system-guide.md)             | Enum-driven types, organization, best practices    | Type definitions, enum usage, type safety  |
| [Database Schema](./database-schema.md)                 | Complete database documentation                    | Database queries, type definitions          |
| [Code Style Guide](./code-style-guide.md)               | Formatting, naming, and code organization          | Code formatting, PR reviews, tool setup     |

## Quick Reference Checklists

### 🚀 New Developer Onboarding

1. Read [Overview](./overview.md) for project context
2. Review [Architecture Guidelines](./architecture-guidelines.md) for service patterns
3. Study [Component Standards](./component-standards.md) for development conventions
4. Familiarize with [UI/UX Guidelines](./ui-ux-guidelines.md) for design system

### 📝 Before Creating Components

- [ ] Component under 200 lines? → [Component Standards](./component-standards.md#component-size-limits)
- [ ] Using shadcn/ui patterns? → [UI/UX Guidelines](./ui-ux-guidelines.md#shadcnui-design-system)
- [ ] Proper file naming? → [Component Standards](./component-standards.md#file-naming-conventions)
- [ ] Mobile-first design? → [UI/UX Guidelines](./ui-ux-guidelines.md#mobile-first-guidelines)
- [ ] Using enums over strings? → [Component Standards](./component-standards.md#type-safety-standards)

### 🏗️ Architecture Decisions

- [ ] Service vs Helper logic? → [Architecture Guidelines](./architecture-guidelines.md#service-layer-architecture)
- [ ] State management choice? → [Architecture Guidelines](./architecture-guidelines.md#state-management-strategy)
- [ ] Database schema alignment? → [Database Schema](./database-schema.md#typescript-integration)
- [ ] Proper type organization? → [Architecture Guidelines](./architecture-guidelines.md#type-organization-strategy)

### 🎨 UI Development

- [ ] Using design tokens? → [UI/UX Guidelines](./ui-ux-guidelines.md#color-system--design-tokens)
- [ ] Accessibility compliance? → [UI/UX Guidelines](./ui-ux-guidelines.md#accessibility-requirements)
- [ ] Proper icon usage? → [UI/UX Guidelines](./ui-ux-guidelines.md#icon-system)

## Standards Summary

### Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript (strict)
- **UI Library**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS with design tokens
- **Forms**: react-hook-form + zod validation
- **Icons**: Phosphor (primary) + Lucide (shadcn compatibility)
- **State**: Jotai (client) + TanStack Query (server)
- **Database**: Supabase with normalized schema

### Key Conventions

- **Component Size**: Maximum 200 lines
- **File Naming**: `ComponentName.component.tsx` (features), `component-name.tsx` (UI)
- **Folder Structure**: Feature-based organization
- **Import Style**: Explicit imports, no index files
- **Quote Style**: Single quotes for JSX attributes
- **Type Safety**: Enum-first approach, no magic strings
- **Database**: Normalized schema with proper foreign keys

### Project Terminology

- **Display**: "CA", "Chartered Accountant" (for SEO)
- **Internal**: "accountant" (for clarity)
- **Database**: `role: 'accountant'` (technical implementation)

## Compliance Verification

### Pre-Commit Checklist

Before committing code, verify:

- [ ] TypeScript strict mode passes
- [ ] All components under 200 lines
- [ ] Using shadcn/ui components where applicable
- [ ] Following naming conventions
- [ ] Mobile-first responsive design
- [ ] Accessibility requirements met

### Code Review Focus Areas

When reviewing PRs, check:

- [ ] Architecture patterns followed
- [ ] Database schema alignment
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] Accessibility standards met

## Documentation Maintenance

### When to Update

- **New features**: Update relevant standards and examples
- **Architecture changes**: Review impact across all documents
- **Tool changes**: Update technology stack references
- **Standards evolution**: Maintain consistency across documents

### Cross-Document Dependencies

- Component Standards ↔ UI/UX Guidelines (design system usage)
- Architecture Guidelines ↔ Database Schema (type alignment)
- All documents ↔ Overview (project objectives)

## Getting Help

### Common Scenarios

**"How do I structure a new feature?"**
→ [Component Standards - Folder Structure](./component-standards.md#folder-structure-standards)

**"Which state management should I use?"**
→ [Architecture Guidelines - State Management](./architecture-guidelines.md#state-management-strategy)

**"How do I style this component?"**
→ [UI/UX Guidelines - Component Usage](./ui-ux-guidelines.md#component-usage-patterns)

**"What's the database structure?"**
→ [Database Schema - Core Tables](./database-schema.md#core-tables)

**"How do I handle forms?"**
→ [Component Standards - Form Standards](./component-standards.md#form-component-standards)

### Escalation Path

1. Check relevant PRD document
2. Search existing code examples
3. Ask team for clarification
4. Propose documentation update if needed

---

_Last Updated: January 2025_
_Version: 1.1 (Normalized Schema + shadcn/ui)_
