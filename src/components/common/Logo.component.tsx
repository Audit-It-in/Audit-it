"use client";

import { cn } from "@/src/helpers/tailwind.helper";

interface LogoProps {
  className?: string;
}

/**
 * Renders the "Audit Lens" logo icon for Audit-it.
 * This SVG combines a magnifying glass (for search/audit) and a checkmark (for verification).
 * It's a pure icon without a container, meant to be sized by its parent.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn("w-8 h-8 text-primary", className)}
      aria-label='Audit-it logo'
    >
      <title>Audit-it Logo</title>
      <path
        d='M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M21 21L16.65 16.65'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M9 11.5L10.5 13L13.5 10'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
