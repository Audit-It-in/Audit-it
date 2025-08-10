# Component Naming Guidelines

## Avoid "CA" Prefix in Component Names

When creating components for the contact requests system or any other features, avoid using the "CA" prefix in component names, file names, or function names.

### ❌ Incorrect Examples:

- `CADiscoveryPage.component.tsx`
- `CAProfileCard.component.tsx`
- `CAProfileView.component.tsx`
- `fetchCAs()`
- `useCAs()`

### ✅ Correct Examples:

- `AccountantDiscoveryPage.component.tsx`
- `AccountantProfileCard.component.tsx`
- `AccountantProfileView.component.tsx`
- `fetchAccountants()`
- `useAccountants()`

## Rationale

1. **Internal Consistency**: Use "accountant" terminology in code for consistency and clarity
2. **SEO Separation**: Keep "CA" and "Chartered Accountant" terminology for user-facing content and SEO optimization
3. **Code Readability**: "Accountant" is more descriptive and readable in code context
4. **Maintainability**: Consistent naming makes the codebase easier to maintain and understand

## Implementation

- **User-Facing Content**: Continue using "CA" and "Chartered Accountant" for SEO and user interface
- **Internal Code**: Use "accountant" in component names, function names, and internal logic
- **Database**: Keep `role: 'accountant'` for technical implementation
- **URLs**: Use descriptive paths like `/accountants` for clean routing

This approach maintains SEO benefits while keeping the codebase clean and consistent.
