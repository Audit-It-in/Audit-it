# Design: Landing Page Neumorphic Revamp (No Gradients)

## Overview

Revamp the landing page into a premium, conversion-focused experience that showcases value for both customers and Chartered Accountants. Apply strict neumorphic guardrails (no gradients) with brand primary blue and accent emerald. Keep data model unchanged; only UI/UX and routing.

## Goals

- Increase engagement and CTR to discovery (`/accountants`) and CA onboarding (`/auth?join=ca`)
- Communicate trust: verification, speed, coverage, Made in India
- Keep performance smooth with responsive shadow utilities and lite mode

## Component Structure

```
app/page.tsx
└── LandingPage
    ├── LandingHero
    ├── TrustBar
    ├── ServicesRail
    ├── HowItWorks
    └── BottomCTA
```

## Visual System (No Gradients)

- Containers: `shadow-neumorphic-xl`, `border-2`, `bg-white`, `rounded-2xl`, `transition-all duration-500`, `neumorphic-optimized`
- Interactive: `shadow-neumorphic-lg hover:shadow-neumorphic-xl active:shadow-neumorphic-inset`, `hover:scale-110 active:scale-95`
- Tints: use solid brand-tinted surfaces (`bg-primary-50`, `bg-emerald-50`) and strong borders (`border-primary-100/60`)
- Focus: branded rings via `focus:shadow-neumorphic-focus`
- Icons: Phosphor with `Icon` suffix
- Touch: 44px+ targets

## Sections

### LandingHero

- Bold headline: “Find Your Perfect Chartered Accountant”
- Subcopy focused on verified experts and key services
- Search affordance (non-functional here; deep link to discovery) in a neumorphic card
- Primary CTA: “Search CAs” → `/accountants`
- Secondary CTA: “Join as CA” → `/auth?join=ca`

### TrustBar

- Metrics row: rating, verified CAs, Made in India
- Neumorphic icon chips

### ServicesRail

- 4 service tiles: Tax Filing, GST Services, Audit Services, Business Setup
- Each tile: icon + short line; deep link to discovery with a preselected filter (future enhancement)

### HowItWorks

- 3-step story: Search → Connect → Get It Done
- Numbered badges with neumorphic depth

### BottomCTA

- Conversion band with two actions; mirrors hero

## Accessibility

- Landmarks and aria-labels on sections
- Keyboard focus visible; 44px+ touch targets

## Performance

- Use responsive shadow utilities: `shadow-neumorphic-mobile-lg md:shadow-neumorphic-xl lg:shadow-neumorphic-desktop-xl`
- Respect `data-neumo-mode="lite"` to reduce shadow cost on constrained devices

## Risks / Notes

- Maintain “no gradients” rule strictly; flat surfaces only
- Future enhancement: hook hero search into discovery filters
