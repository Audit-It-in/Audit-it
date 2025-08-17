# PRD Index

## Quick Navigation

| Document                                                | Purpose                                                       | When to Use                                |
| ------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| [10-Product](./10-Product.md)                           | Vision, goals, success metrics, MVP scope                     | Onboarding, scope/priority checks          |
| [20-Architecture](./20-Architecture.md)                 | State mgmt, service layer, type system, performance           | Implementing features, data flow decisions |
| [30-Data-and-Integration](./30-Data-and-Integration.md) | Supabase, signed URLs, query keys, pagination, DB schema      | Data integration, queries, storage         |
| [40-Design-System](./40-Design-System.md)               | Neumorphic UI, component standards, code style, accessibility | Building UI, forms, icons, styling         |

---

## Quick Reference Checklists

### 🚀 New Developer Onboarding

1. Read [10-Product](./10-Product.md)
2. Review [20-Architecture](./20-Architecture.md)
3. Study [40-Design-System](./40-Design-System.md)

### 📝 Before Creating Components

- [ ] Component under 200 lines? → [40-Design-System](./40-Design-System.md#component-standards--size)
- [ ] Using shadcn/ui patterns (no gradients) → [40-Design-System](./40-Design-System.md#neumorphic-design-guidelines)
- [ ] Proper file naming? → [40-Design-System](./40-Design-System.md#naming-conventions)
- [ ] Mobile-first design? → [40-Design-System](./40-Design-System.md#mobile-first-design)
- [ ] Using enums over strings? → [20-Architecture](./20-Architecture.md#type-system-and-enums)

### 🏗️ Architecture Decisions

- [ ] Service vs Helper logic? → [20-Architecture](./20-Architecture.md#service-layer-architecture)
- [ ] State management choice? → [20-Architecture](./20-Architecture.md#state-management-strategy)
- [ ] Database schema alignment? → [30-Data-and-Integration](./30-Data-and-Integration.md#database-schema)
- [ ] Proper type organization? → [20-Architecture](./20-Architecture.md#type-organization)

### 🎨 UI Development

- [ ] Using design tokens (no gradients) → [40-Design-System](./40-Design-System.md#brand-color-system)
- [ ] Accessibility compliance? → [40-Design-System](./40-Design-System.md#accessibility-requirements)
- [ ] Proper icon usage? → [40-Design-System](./40-Design-System.md#icon-system)

---

## Standards Summary

### Technology Stack

- Frontend: Next.js 15, React 19, TypeScript (strict)
- UI Library: shadcn/ui (New York)
- Styling: Tailwind CSS with design tokens
- Forms: react-hook-form + zod
- Icons: Phosphor (primary, 'Icon' suffix) + Lucide (compat)
- State: Jotai (client) + TanStack Query (server)
- Database: Supabase, normalized schema

### Key Conventions

- Component Size: Max 200 lines
- File Naming: `ComponentName.component.tsx` (features), `component-name.tsx` (UI)
- Folder Structure: Feature-based
- Import Style: Explicit imports, no index files
- Quote Style: Single quotes for JSX attributes
- Type Safety: Enum-first, no magic strings

### Project Terminology

- Display: "CA", "Chartered Accountant" (SEO)
- Internal: "accountant" (clarity)
- Database: `role: 'accountant'`

---

## Compliance Verification

### Pre-Commit Checklist

- [ ] TypeScript strict passes
- [ ] All components under 200 lines
- [ ] Using shadcn/ui components where applicable
- [ ] Naming conventions followed
- [ ] Mobile-first responsive design
- [ ] Accessibility requirements met

### Code Review Focus Areas

- [ ] Architecture patterns followed
- [ ] Database schema alignment
- [ ] Performance optimizations applied
- [ ] Error handling implemented
- [ ] Accessibility standards met

---

## Documentation Maintenance

### When to Update

- New features → update relevant standards and examples
- Architecture changes → review impact across documents
- Tool changes → update technology stack references
- Standards evolution → maintain consistency across documents

### Cross-Document Dependencies

- Design System ↔ Component Standards
- Architecture ↔ Database Schema & Types
- Product ↔ All supporting docs

### Progress Docs Naming Convention

- Strict filename format: `Serial-TaskName-YYYY-MM-DD.md`
  - Serial: zero-padded sequential number (e.g., `001`)
  - TaskName: concise PascalCase
  - Date: `YYYY-MM-DD` IST

Examples:

- `001-Avatar-Revamp-2025-08-10.md`
- `002-Profile-Refactor-2025-08-10.md`

Rules:

- No vague names or undated files
- No index files; explicit imports/links only

---

## Getting Help

1. Check relevant PRD document
2. Search existing code examples
3. Ask team for clarification
4. Propose documentation update if needed

---

Last Updated: January 2025
PRD Version: 1.2 (Consolidated)
