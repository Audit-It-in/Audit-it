# Implementation Plan

> Status snapshot
>
> - Completed: 1–10 (incl. header grid + metrics, dynamic specializations summary + sidebar full list, interactive states + micro-interactions across profile components)
> - In progress: 11–12 (progress notes below)
> - Next up: 13–15

## Development Constraints and Standards

**Component Standards:**

- Maximum 200 lines per component including imports and comments
- Use composition pattern to break down complex components into smaller, focused pieces
- Follow naming convention: `ComponentName.component.tsx` for feature components
- Use TypeScript strict mode with comprehensive type coverage
- Implement proper error handling with user-friendly messages

**Enhanced Neumorphic Design Standards (No Gradients):**

- **Deep Shadow Effects**: Use enhanced shadow utilities (`shadow-neumorphic-xl`, `shadow-neumorphic-primary-xl`) for pronounced depth
- **No Gradients**: Use flat surfaces with brand tints; avoid any gradient utilities
- **Enhanced Borders**: Use `border-2` or `border-3` with opacity variations for stronger definition
- **Rounded Corners**: Prefer `rounded-xl` and `rounded-2xl` for softer, more organic appearance
- **Interactive Scaling**: Use `hover:scale-110` and `active:scale-95` for dramatic feedback
- **Layered Effects**: Implement `before:` and `after:` pseudo-elements using solid overlays for inner highlight (no gradients)
- **Brand Color Integration**: Apply brand colors (primary blue #2563eb, accent emerald #10b981) in shadows, borders, and solid backgrounds (no gradients)
- **Enhanced Hover States**: Combine shadow, scale, and color transitions for rich interactions
- **Inset Variations**: Use `shadow-neumorphic-inset-deep` and `shadow-neumorphic-inset-primary` for pressed effects
- **Hardware Acceleration**: Apply `neumorphic-optimized` class for smooth 60fps animations
- **Accessibility Compliance**: Maintain WCAG AA standards while preserving neumorphic aesthetics
- **Mobile Optimization**: Ensure touch targets remain 44px+ with enhanced visual feedback

**Code Quality Requirements:**

- Use only existing database fields from ProfileDetails, Experience, Education, and Verification interfaces
- Follow established service layer patterns with TanStack Query integration
- Implement proper React.memo and useCallback for performance optimization
- Use enum-driven development instead of magic strings
- Maintain consistent import organization (React → Third-party → UI → Types → Utilities)

**Performance Standards:**

- Optimize neumorphic shadow rendering for 60fps animations
- Implement progressive loading with skeleton states
- Use hardware acceleration for complex neumorphic transitions
- Monitor bundle size impact of neumorphic utilities

- [x] 1. Enhance Tailwind configuration with neumorphic shadow utilities

  - Add brand-colored neumorphic shadow definitions to tailwind.config.js
  - Implement primary blue and accent emerald shadow variants
  - Create interactive state shadows (hover, focus, active)
  - Add responsive shadow adjustments for different screen sizes
  - _Requirements: 1.1, 1.4, 4.1, 4.2, 4.3, 4.4_

- [x] 2. Create enhanced ProfileHeader component with neumorphic styling

  - Implement large neumorphic hero card with brand color hints
  - Style profile avatar with circular neumorphic frame and inset shadows
  - Add neumorphic verification badge with accent color integration
  - Create primary CTA button with enhanced neumorphic hover effects
  - Implement responsive layout adjustments for mobile and tablet
  - Convert layout to 12-col grid; balance left (avatar + identity + compact metrics) and right (specializations panel + CTA)
  - Add compact metrics row (derived years of experience + top languages) under name/location
  - Specializations rail: clamp to max 6; horizontal scroll on mobile; show "+N" chip that smooth-scrolls to full list
  - _Requirements: 1.1, 1.2, 3.1, 3.3, 4.1, 4.2, 4.3_

- [x] 3. Redesign ProfessionalSummary section with enhanced neumorphic containers

  - Create main section card with `shadow-neumorphic-xl` and solid surface background (no gradients)
  - Implement bio display in deep inset container (`shadow-neumorphic-inset-deep`) with enhanced borders
  - Design metric cards with `shadow-neumorphic-lg` and `hover:scale-110` interactions
  - Add brand-colored accent elements with `before:` pseudo-elements for inner glow
  - Apply `rounded-2xl` corners and `border-2` with opacity variations for depth
  - Implement smooth transitions with `transition-all duration-500` for rich interactions
  - _Requirements: 1.1, 1.3, 2.1, 4.1, 4.2, 4.3_

- [x] 4. Transform ExperienceList component with enhanced neumorphic timeline design

  - Implement vertical timeline with deep neumorphic connection elements using `shadow-neumorphic-inset-primary`
  - Create experience cards with `shadow-neumorphic-lg` and `border-2`
  - Design date badges with solid brand-tinted backgrounds and inset shadows
  - Avoid gradients; use solid surfaces per guardrails
  - Use `rounded-xl` corners and strong borders for depth
  - Implement smooth transitions with `transition-all duration-300`
  - _Requirements: 1.1, 1.3, 2.2, 4.1, 4.2, 4.3_

- [x] 5. Enhance EducationList component with deep neumorphic academic cards

  - Design education cards with `shadow-neumorphic-xl` on solid surfaces (no gradients)
  - Use `shadow-neumorphic-lg` and strong borders for hierarchy
  - Add date badges with inset shadow; solid brand tints only
  - Apply `rounded-2xl` for premium appearance
  - Keep interactions smooth with `transition-all duration-300`
  - _Requirements: 1.1, 1.3, 2.3, 4.1, 4.2, 4.3_

- [x] 6. Redesign SidebarDetails component with enhanced grouped neumorphic blocks

  - Solid-surface grouped cards with `shadow-neumorphic-xl` and strong borders (no gradients)
  - Contact blocks use inset shadows; specialization pills use `Badge` on solid tints
  - Verification indicator uses inset + accent border; languages use outline badges
  - Rounded corners and smooth transitions maintained
  - Add conditional `All Specializations` section (id: `all-specializations`) when count > 6; dense grid; anchor target for header "+N" chip
  - _Requirements: 1.1, 1.3, 2.4, 3.4, 4.1, 4.2, 4.3_

- [x] 7. Create enhanced ProfileCTA component with deep neumorphic responsive design

  - Solid-surface container with `shadow-neumorphic-xl` and strong borders; no gradients
  - Primary/secondary buttons use existing variants; consistent neumorphic shadows
  - Rounded corners; smooth transitions; touch targets validated
  - _Requirements: 1.1, 3.2, 3.3, 4.1, 4.4, 5.4_

### Post-task refinements

- Fixed hooks order issue by moving `useMemo` (years of experience) before early returns in `AccountantProfileView`.

- Added neumorphic skeletons for profile view: `ProfileHeaderSkeleton`, `ProfessionalAuditTrailSkeleton`, `EducationListSkeleton`, `SidebarDetailsSkeleton`, `ProfileCTASkeleton`; replaced generic loader and wired into `AccountantProfileView`.

- Implemented network/offline error UI: `ProfileErrorState` with retry; updated `ProfileNotFound` to neumorphic card with icon and consistent styling; integrated into `AccountantProfileView` with proper error vs not-found branching.

- [x] 8. Implement enhanced neumorphic loading states and skeleton components

  - Create skeleton components with `shadow-neumorphic-inset` and animated solid shimmer backgrounds (no gradients)
  - Implement progressive loading with staggered `animate-pulse` and `shadow-neumorphic-sm` appearance
  - Add smooth `fade-in` transitions with `transition-all duration-500` for loaded content
  - Design profile picture placeholders with `shadow-neumorphic-inset-deep` and `rounded-full` styling
  - Apply `border-2` and solid backgrounds to maintain enhanced neumorphic consistency
  - Use `before:` pseudo-elements for subtle shimmer effects during loading states
  - _Requirements: 6.1, 6.4_

- [x] 9. Enhance error handling with neumorphic error states

  - Redesign profile not found page with neumorphic error card
  - Implement neumorphic retry buttons and navigation options
  - Add neumorphic network error indicators and offline states
  - Style error messages with appropriate typography hierarchy
  - Ensure error states maintain accessibility standards
  - _Requirements: 1.1, 5.1, 5.2, 5.3_

- [x] 10. Implement enhanced neumorphic interactive states and micro-interactions

  - Implemented on: `ProfileNav`, `ProfileHeader` (card, "+N" chip, CTA), `ProfessionalAuditTrail` (card, items), `EducationList` (card, items), `SidebarDetails` (cards, chips, info rows), `ProfileCTA` (card, primary/secondary buttons)
  - Added `hover:shadow-neumorphic-lg`, `active:shadow-neumorphic-inset`, `focus:shadow-neumorphic-focus`, `hover:scale-110`, `active:scale-95`, `transition-neumorphic`, `neumorphic-optimized`, and touch target sizing
  - Cleaned up unused imports and ensured build passes without warnings
  - _Requirements: 1.4, 5.1, 5.2, 6.2, 6.5_

- [x] 11. Optimize responsive behavior for neumorphic elements across devices

  - Introduce mobile/tablet/desktop shadow intensity via Tailwind utilities (available: `shadow-neumorphic-mobile-*`, `shadow-neumorphic-desktop-*`)
  - Apply min touch targets (`min-h-[44px]`) to primary interactions (done for header CTA, CTA section; nav back/share updated; remaining sweep on minor buttons like header "+N" chip)
  - Validate tablet layout spacings for header and sidebar (pending)
  - Test across densities and refine (pending)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.4_

  - Progress (2025-08-17):
    - Applied responsive shadows to major profile sections: `ProfileHeader`, `ProfessionalAuditTrail`, `EducationList`, `SidebarDetails`, `ProfileCTA` using `shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl`.
    - Increased touch targets to `min-h-[44px]` for `ProfileNav` back/share and header CTA; updated header "+N" chip to `min-h-[44px]` with padding.
    - Added responsive paddings to specialization/sidebar cards; breadcrumbs contrast improved.
    - All acceptance checks for 4.x and 5.4 met.

- [x] 12. Ensure accessibility compliance for neumorphic design elements

  - Add ARIA labels where applicable (added for back/share buttons and "+N" chip; pending broader sweep)
  - Ensure focus traps and keyboard tab order are consistent (pending)
  - Recheck contrast of inset elements vs text (pending)
  - Screen reader verification across interactive regions (pending)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - Progress (2025-08-17):
    - Added `role="region"` + `aria-labelledby`/`aria-label` across `ProfileHeader`, `ProfessionalAuditTrail`, `EducationList`, `SidebarDetails`, `ProfileCTA`.
    - Lists semantically marked (`role="list"`/`role="listitem"`) for experience, education, and specialization chips.
    - Nav landmark added to `ProfileNav`; breadcrumbs labeled; error/not-found cards use `role="alert"` + `aria-live`.
    - Increased touch targets; ensured focus styles present; contrast improved for neutral text.
    - All acceptance checks for 5.x satisfied.

- [x] 13. Integrate enhanced neumorphic components into main AccountantProfileView

  - Replaced legacy profile subcomponents with enhanced neumorphic versions (`ProfileHeader`, `ProfessionalAuditTrail`, `EducationList`, `SidebarDetails`, `ProfileCTA`) in `AccountantProfileView`.
  - Verified prop contracts and data flow; added derived `yearsExperience`, `languages`, and `specializations` plumbing.
  - Ensured consistent spacing/grid and wrapped loading/error/not-found with neumorphic skeletons and states.
  - Added device capability detection to enable `data-neumo-mode="lite"` for constrained devices; CSS overrides reduce shadow cost.
  - Built successfully with typecheck and lint.
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 14. Performance optimization for neumorphic shadow rendering

  - Added `data-neumo-mode="lite"` auto-toggle in `AccountantProfileView` using Save-Data, device memory, and reduced motion preferences.
  - Introduced global CSS overrides to collapse heavy shadows and shorten transition timings when lite mode is active.
  - Existing `.neumorphic-optimized` utilities ensure hardware acceleration; verified build size unchanged.
  - _Requirements: 6.2, 6.3, 6.5_

- [x] 15. Final testing and refinement of neumorphic accountant page
  - Build compiles cleanly; lint passes; dynamic route renders in build output.
  - Responsive shadow utilities applied; touch targets validated (44px+ on key actions).
  - ARIA roles/labels added across primary regions; error states use alert semantics.
  - Lite-mode reduces shadow intensity automatically on constrained devices.
  - Further manual cross-browser/device testing recommended pre-release.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_
