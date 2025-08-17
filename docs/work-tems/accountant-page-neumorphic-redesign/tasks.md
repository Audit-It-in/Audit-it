# Implementation Plan

> Status snapshot
>
> - Completed: 1–7 (incl. header grid + metrics, dynamic specializations summary + sidebar full list)
> - Next up: 8–15

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

- [ ] 8. Implement enhanced neumorphic loading states and skeleton components

  - Create skeleton components with `shadow-neumorphic-inset` and animated solid shimmer backgrounds (no gradients)
  - Implement progressive loading with staggered `animate-pulse` and `shadow-neumorphic-sm` appearance
  - Add smooth `fade-in` transitions with `transition-all duration-500` for loaded content
  - Design profile picture placeholders with `shadow-neumorphic-inset-deep` and `rounded-full` styling
  - Apply `border-2` and solid backgrounds to maintain enhanced neumorphic consistency
  - Use `before:` pseudo-elements for subtle shimmer effects during loading states
  - _Requirements: 6.1, 6.4_

- [ ] 9. Enhance error handling with neumorphic error states

  - Redesign profile not found page with neumorphic error card
  - Implement neumorphic retry buttons and navigation options
  - Add neumorphic network error indicators and offline states
  - Style error messages with appropriate typography hierarchy
  - Ensure error states maintain accessibility standards
  - _Requirements: 1.1, 5.1, 5.2, 5.3_

- [ ] 10. Implement enhanced neumorphic interactive states and micro-interactions

  - Add `hover:scale-110` and `shadow-neumorphic-lg` hover effects for all interactive elements
  - Implement `focus:shadow-neumorphic-focus` indicators with brand-colored neumorphic rings
  - Create active states with `shadow-neumorphic-inset-deep` and `active:scale-95` for button presses
  - Apply `transition-all duration-300` with `before:` and `after:` pseudo-element animations
  - Use `neumorphic-optimized` class and hardware acceleration for 60fps performance
  - Add enhanced border opacity changes (no gradient transitions)
  - _Requirements: 1.4, 5.1, 5.2, 6.2, 6.5_

- [ ] 11. Optimize responsive behavior for neumorphic elements across devices

  - Implement mobile-first responsive neumorphic shadow adjustments
  - Ensure proper touch target sizes for mobile neumorphic buttons
  - Add tablet-specific layout optimizations for neumorphic cards
  - Test and refine neumorphic effects across different screen densities
  - Validate responsive behavior maintains visual hierarchy
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.4_

- [ ] 12. Ensure accessibility compliance for neumorphic design elements

  - Implement WCAG AA compliant focus indicators with neumorphic styling
  - Add proper ARIA labels for all neumorphic interactive elements
  - Test color contrast ratios for neumorphic text and background combinations
  - Validate keyboard navigation works properly with neumorphic elements
  - Ensure screen reader compatibility with neumorphic design patterns
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 13. Integrate enhanced neumorphic components into main AccountantProfileView

  - Replace existing components with new neumorphic versions
  - Ensure proper data flow and prop passing to enhanced components
  - Implement consistent spacing and layout using neumorphic containers
  - Add proper TypeScript types for new neumorphic component props
  - Test integration maintains all existing functionality
  - _Requirements: 1.1, 1.2, 1.3, 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 14. Performance optimization for neumorphic shadow rendering

  - Optimize CSS for efficient neumorphic shadow rendering
  - Implement hardware acceleration for neumorphic animations
  - Add conditional neumorphic enhancement based on device capabilities
  - Monitor and optimize bundle size impact of neumorphic utilities
  - Ensure smooth performance across different browsers and devices
  - _Requirements: 6.2, 6.3, 6.5_

- [ ] 15. Final testing and refinement of neumorphic accountant page
  - Conduct comprehensive cross-browser testing for neumorphic effects
  - Validate responsive behavior across all target devices
  - Test accessibility compliance with assistive technologies
  - Verify performance meets established benchmarks
  - Ensure all existing functionality works with new neumorphic design
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5_
