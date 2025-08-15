# Unified Design System

## Design Philosophy

The Audit-it platform uses a **creative neumorphic design system** that creates depth, visual hierarchy, and vibrant user experiences through innovative use of soft shadows, strategic color application, and dynamic elevation effects. Our approach is **strictly brand-color focused** while maximizing creative potential within these constraints.

## Core Creative Principles

### Vibrant Depth Effects

- **Dynamic Elevation**: Multi-layered shadows create floating, interactive surfaces
- **Color-Infused Shadows**: Brand colors subtly integrated into shadow systems for vibrancy
- **Contextual Depth**: Different shadow intensities and colors based on element importance
- **Micro-Interactions**: Smooth, delightful transitions that enhance user engagement
- **Creative Layering**: Overlapping elements with varying depths create visual interest

### Strict Brand Color Mastery

- **Primary Blue Spectrum**: #2563eb as core with creative tints and shades for variety
- **Accent Emerald Spectrum**: #10b981 strategically used for energy and success states
- **Creative Neutral Palette**: Sophisticated grays (#f9fafb to #1f2937) for depth and contrast
- **Color Psychology**: Strategic color placement to guide user attention and emotion
- **No Gradients Policy**: Pure solid colors create clean, modern aesthetic without dated effects

### Creative Constraints as Innovation

- **Monochromatic Creativity**: Maximum visual impact using single-color families
- **Shadow as Color**: Colored shadows replace gradients for depth and vibrancy
- **Texture Through Depth**: Surface variations created through shadow manipulation
- **Brand Color Storytelling**: Colors convey meaning, status, and user journey progression

### Accessibility First

- **WCAG AA Compliance**: Maintain 4.5:1 contrast ratios while preserving neumorphic aesthetics
- **Focus Indicators**: Clear, branded focus rings for keyboard navigation
- **Touch Targets**: Minimum 44px touch targets for mobile usability
- **Screen Reader Support**: Proper ARIA labels and semantic HTML structure

## Enhanced Shadow System

### Creative Shadow Utilities

```css
/* Standard Neumorphic Shadows */
.shadow-neumorphic-sm     /* Subtle elevation - 2px depth */
/* Subtle elevation - 2px depth */
.shadow-neumorphic-md     /* Standard elevation - 4px depth */
.shadow-neumorphic-lg     /* High elevation - 6px depth */
.shadow-neumorphic-xl     /* Maximum elevation - 8px depth */

/* Brand-Colored Creative Shadows */
.shadow-neumorphic-primary        /* Primary blue infused shadows */
.shadow-neumorphic-primary-lg     /* Enhanced primary shadows */
.shadow-neumorphic-accent         /* Accent emerald infused shadows */
.shadow-neumorphic-accent-lg      /* Enhanced accent shadows */

/* Inset Effects */
.shadow-neumorphic-inset          /* Standard inset - pressed appearance */
.shadow-neumorphic-inset-primary  /* Primary colored inset */
.shadow-neumorphic-inset-accent   /* Accent colored inset */
.shadow-neumorphic-inset-deep     /* Deep inset - strong pressed effect */

/* Interactive States */
.shadow-neumorphic-focus          /* Focus state with brand colors */
.shadow-neumorphic-focus-accent   /* Accent focus state */
.shadow-neumorphic-hover          /* Hover enhancement */
.shadow-neumorphic-active         /* Active/pressed state */

/* Error States */
.shadow-neumorphic-error          /* Error focus state with red tint */
.shadow-neumorphic-inset-error; /* Error inset state */
```

### Creative Shadow Implementation

```css
/* Enhanced shadow definitions with brand color integration */
.shadow-neumorphic-md {
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8),
    inset 0 0 0 1px rgba(37, 99, 235, 0.05);
}

.shadow-neumorphic-primary {
  box-shadow: 4px 4px 12px rgba(37, 99, 235, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8),
    inset 0 0 0 1px rgba(37, 99, 235, 0.05);
}

.shadow-neumorphic-accent {
  box-shadow: 4px 4px 12px rgba(16, 185, 129, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8),
    inset 0 0 0 1px rgba(16, 185, 129, 0.05);
}

.shadow-neumorphic-inset-primary {
  box-shadow: inset 4px 4px 12px rgba(37, 99, 235, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7),
    0 0 0 1px rgba(37, 99, 235, 0.1);
}
```

## Creative Brand Color Applications

### Primary Blue Spectrum - Creative Mastery

```typescript
// Dynamic text hierarchy with creative blue variations
<h1 className="text-primary-900 font-bold tracking-tight">Main Heading</h1>
<h2 className="text-primary-800 font-semibold">Section Heading</h2>
<p className="text-primary-700">Important text</p>
<span className="text-primary-600/70">Secondary text</span>
<small className="text-primary-500/60 uppercase tracking-wide font-medium">Metadata</small>

// Creative background compositions with depth
<div className="bg-primary-50 border border-primary-200/50 rounded-xl p-6 shadow-neumorphic-md relative overflow-hidden">
  {/* Creative accent elements */}
  <div className="absolute top-0 right-0 w-20 h-20 bg-primary-100/30 rounded-full shadow-neumorphic-inset-deep transform translate-x-8 -translate-y-8" />
  <div className="absolute bottom-0 left-0 w-12 h-12 bg-primary-200/40 rounded-lg shadow-neumorphic-sm transform -translate-x-4 translate-y-4" />

  <h3 className="text-primary-900 font-medium relative z-10">Creative Primary Section</h3>
  <p className="text-primary-700/80 text-sm mt-1 relative z-10">With layered brand elements</p>
</div>

// Multi-state interactive buttons with creative depth
<Button className={cn(
  "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white",
  "shadow-neumorphic-md hover:shadow-neumorphic-lg active:shadow-neumorphic-sm",
  "transform hover:scale-[1.02] active:scale-[0.98]",
  "transition-all duration-200 ease-out",
  "relative overflow-hidden",
  "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100",
  "before:transition-opacity before:duration-200"
)}>
  <span className="relative z-10">Creative Primary Action</span>
</Button>
```

### Accent Emerald Spectrum - Energy & Success

```typescript
// Creative success states with dynamic emerald applications
<div className="bg-accent-50 border border-accent-200/50 rounded-xl p-6 shadow-neumorphic-md relative">
  {/* Creative success indicator */}
  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full shadow-neumorphic-lg border-4 border-white" />

  <div className="flex items-start gap-4">
    <div className="p-3 rounded-xl shadow-neumorphic-inset bg-accent-100/80 border border-accent-200/40">
      <CheckCircleIcon className="h-6 w-6 text-accent-600" weight="bold" />
    </div>
    <div className="flex-1">
      <h4 className="text-accent-800 font-semibold mb-1">Success Achievement</h4>
      <p className="text-accent-700/80 text-sm">Operation completed with creative visual feedback</p>
    </div>
  </div>
</div>

// Creative accent buttons with energy
<Button className={cn(
  "bg-accent-600 hover:bg-accent-700 active:bg-accent-800 text-white",
  "shadow-neumorphic-md hover:shadow-neumorphic-xl active:shadow-neumorphic-sm",
  "transform hover:scale-105 active:scale-95",
  "transition-all duration-200 ease-out",
  "relative overflow-hidden",
  "after:absolute after:inset-0 after:bg-white/20 after:opacity-0 hover:after:opacity-100",
  "after:transition-opacity after:duration-200"
)}>
  <span className="relative z-10 flex items-center gap-2">
    <SparklesIcon className="h-4 w-4" weight="bold" />
    Energetic Action
  </span>
</Button>
```

### Creative Neutral Palette - Sophisticated Depth

```typescript
// Creative neutral compositions for balance and sophistication
<div className='bg-neutral-50 border border-neutral-200/50 rounded-xl p-6 shadow-neumorphic-lg'>
  <div className='grid grid-cols-4 gap-3 mb-6'>
    {[50, 100, 200, 300].map((shade) => (
      <div
        key={shade}
        className={cn(
          "h-12 rounded-lg shadow-neumorphic-inset border",
          `bg-neutral-${shade} border-neutral-${Math.min(shade + 100, 400)}/30`
        )}
      />
    ))}
  </div>

  <h3 className='text-neutral-800 font-semibold mb-2'>Sophisticated Neutral Design</h3>
  <p className='text-neutral-600 text-sm'>Creative depth without overwhelming brand colors</p>
</div>
```

## Creative Component Patterns

### Enhanced Button Components

```typescript
// Creative primary button with dynamic effects
<Button className={cn(
  "bg-primary-600 hover:bg-primary-700 text-white px-6 py-3",
  "shadow-neumorphic-primary hover:shadow-neumorphic-primary-lg",
  "transform hover:scale-105 active:scale-95",
  "transition-all duration-300 ease-bounce",
  "relative overflow-hidden group"
)}>
  <span className="relative z-10 flex items-center gap-2">
    <SearchIcon className="h-4 w-4" weight="bold" />
    Primary Action
  </span>
  <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
</Button>

// Creative outline button with brand color integration
<Button variant="outline" className={cn(
  "border-2 border-primary-300 text-primary-700 hover:bg-primary-50",
  "shadow-neumorphic-sm hover:shadow-neumorphic-primary",
  "transform hover:scale-105 active:scale-95",
  "transition-all duration-200"
)}>
  Secondary Action
</Button>

// Creative ghost button with subtle hover effects
<Button variant="ghost" className={cn(
  "text-neutral-700 hover:bg-neutral-100 hover:text-primary-700",
  "hover:shadow-neumorphic-sm transition-all duration-200"
)}>
  Tertiary Action
</Button>
```

### Creative Card Components

```typescript
// Enhanced interactive card with creative hover effects
<Card className={cn(
  "group cursor-pointer overflow-hidden transition-all duration-500",
  "shadow-neumorphic-md hover:shadow-neumorphic-xl",
  "transform hover:scale-[1.02] hover:-rotate-1",
  "border border-primary-200/30 hover:border-primary-300/50"
)}>
  {/* Creative header with dynamic background */}
  <div className="h-24 bg-gradient-to-br from-primary-50 to-primary-100/50 relative overflow-hidden">
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-2 right-4 w-8 h-8 bg-primary-200/40 rounded-full shadow-neumorphic-inset" />
      <div className="absolute bottom-2 left-6 w-6 h-6 bg-accent-200/40 rounded-lg shadow-neumorphic-sm transform rotate-12" />
    </div>
  </div>

  <CardContent className="p-6 relative">
    {/* Hover overlay effect */}
    <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    <div className="relative z-10">
      <h3 className="text-primary-800 group-hover:text-primary-900 font-semibold transition-colors duration-300">
        Creative Card Title
      </h3>
      <p className="text-primary-600/70 group-hover:text-primary-700 transition-colors duration-300 mt-2">
        Enhanced with creative hover effects and brand color integration
      </p>
    </div>
  </CardContent>
</Card>

// Creative feature card with layered elements
<Card className="shadow-neumorphic-lg bg-white border border-primary-200/30 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-20 h-full bg-primary-200/20 transform skew-x-12 translate-x-8" />

  <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200/40 relative">
    <CardTitle className="text-primary-800 relative z-10 flex items-center gap-3">
      <div className="w-8 h-8 bg-primary-600 rounded-lg shadow-neumorphic-inset flex items-center justify-center">
        <SparklesIcon className="h-4 w-4 text-white" weight="bold" />
      </div>
      Feature Card
    </CardTitle>
  </CardHeader>

  <CardContent className="p-6 space-y-4 relative z-10">
    <div className="grid grid-cols-3 gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-primary-100/60 rounded-lg shadow-neumorphic-inset border border-primary-200/30" />
      ))}
    </div>
  </CardContent>
</Card>
```

### Creative Form Components

```typescript
// Enhanced input with creative focus states
<div className="space-y-2">
  <Label htmlFor="email" className="text-primary-700 font-medium">Email Address</Label>
  <Input
    id="email"
    type="email"
    placeholder="Enter your email"
    className={cn(
      "shadow-neumorphic-inset focus:shadow-neumorphic-focus",
      "border-primary-200/50 focus:border-primary-400",
      "transition-all duration-200"
    )}
  />
</div>

// Creative select with brand color integration
<Select>
  <SelectTrigger className={cn(
    "shadow-neumorphic-sm hover:shadow-neumorphic-primary focus:shadow-neumorphic-focus",
    "border-primary-200/50 hover:border-primary-300 focus:border-primary-400",
    "transition-all duration-200"
  )}>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent className="shadow-neumorphic-lg border border-primary-200/50">
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>

// Creative error state with enhanced visual feedback
<Input
  className={cn(
    "transition-all duration-200",
    hasError
      ? "shadow-neumorphic-inset-error border-red-300 focus:shadow-neumorphic-error bg-red-50/50"
      : "shadow-neumorphic-inset focus:shadow-neumorphic-focus"
  )}
/>
```

## Creative Layout Patterns

### Dynamic Container Hierarchies

```typescript
// Creative page-level containers with layered depth
<div className='min-h-screen bg-neutral-50 relative overflow-hidden'>
  {/* Creative background elements */}
  <div className='absolute inset-0 opacity-30'>
    <div className='absolute top-20 left-10 w-32 h-32 bg-primary-100/40 rounded-full shadow-neumorphic-inset' />
    <div className='absolute bottom-32 right-16 w-24 h-24 bg-accent-100/40 rounded-lg shadow-neumorphic-sm transform rotate-12' />
    <div className='absolute top-1/2 left-1/3 w-16 h-16 bg-primary-200/30 rounded-xl shadow-neumorphic-inset' />
  </div>

  <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10'>
    <div className='max-w-4xl mx-auto space-y-8'>
      <section className='relative'>
        <div className='absolute -inset-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-neumorphic-xl' />
        <div className='relative z-10 p-8'>
          <h1 className='text-4xl font-bold text-primary-900 mb-4'>Creative Section</h1>
          <p className='text-primary-700/80'>With layered background elements</p>
        </div>
      </section>
    </div>
  </div>
</div>
```

### Creative Grid Compositions

```typescript
// Dynamic masonry-style grid with creative elements
<div className='columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'>
  {items.map((item, index) => (
    <Card
      key={item.id}
      className={cn(
        "break-inside-avoid shadow-neumorphic-md hover:shadow-neumorphic-xl transition-all duration-500",
        "border border-primary-200/30 relative overflow-hidden",
        "transform hover:scale-[1.02] hover:-rotate-1"
      )}
    >
      {/* Creative card header with dynamic colors */}
      <div
        className={cn(
          "h-2 w-full",
          index % 3 === 0 ? "bg-primary-500" : index % 3 === 1 ? "bg-accent-500" : "bg-neutral-400"
        )}
      />

      <CardContent className='p-6'>
        <div className='flex items-start gap-4 mb-4'>
          <div
            className={cn(
              "w-12 h-12 rounded-xl shadow-neumorphic-inset flex items-center justify-center",
              index % 3 === 0 ? "bg-primary-100" : index % 3 === 1 ? "bg-accent-100" : "bg-neutral-100"
            )}
          >
            <div
              className={cn(
                "w-6 h-6 rounded-lg shadow-neumorphic-sm",
                index % 3 === 0 ? "bg-primary-500" : index % 3 === 1 ? "bg-accent-500" : "bg-neutral-400"
              )}
            />
          </div>
          <div className='flex-1'>
            <h3 className='text-primary-800 font-semibold mb-1'>{item.title}</h3>
            <p className='text-primary-600/70 text-sm'>{item.description}</p>
          </div>
        </div>

        {/* Creative progress indicators */}
        <div className='flex items-center gap-2 mt-4'>
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={cn(
                "w-2 h-2 rounded-full shadow-neumorphic-sm transition-all duration-200",
                dot <= (index % 5) + 1
                  ? index % 3 === 0
                    ? "bg-primary-500"
                    : index % 3 === 1
                    ? "bg-accent-500"
                    : "bg-neutral-400"
                  : "bg-neutral-200"
              )}
            />
          ))}
          <span className='ml-auto text-xs text-primary-500 font-medium'>
            {Math.round(((index % 5) + 1) * 20)}% Complete
          </span>
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

## Interactive States & Animations

### Enhanced State Hierarchy

1. **Default State**: Base neumorphic shadow with subtle brand color hints
2. **Hover State**: Enhanced elevation with brand color integration
3. **Active State**: Inset shadow with brand color emphasis
4. **Focus State**: Brand-colored focus ring with enhanced shadow
5. **Disabled State**: Reduced opacity with muted brand colors
6. **Error State**: Red-tinted shadows with proper contrast
7. **Success State**: Accent-colored shadows for positive feedback

### Creative Transition Standards

```css
/* Enhanced transitions for creative interactions */
.transition-neumorphic {
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-neumorphic-bounce {
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.transition-neumorphic-elastic {
  transition: all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### Creative Loading States

```typescript
// Animated brand color loading indicators
<div className="flex items-center justify-center p-8">
  <div className="relative">
    <div className="absolute inset-0 w-16 h-16 border-4 border-primary-200 rounded-full animate-ping" />
    <div className="absolute inset-2 w-12 h-12 border-4 border-accent-300 rounded-full animate-ping animation-delay-1000" />
    <div className="relative w-16 h-16 bg-primary-600 rounded-full shadow-neumorphic-lg flex items-center justify-center">
      <SparklesIcon className="h-8 w-8 text-white animate-pulse" weight="bold" />
    </div>
  </div>
</div>

// Creative skeleton with brand color pulses
<Card className="shadow-neumorphic-sm">
  <CardContent className="p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-primary-200 rounded-full animate-pulse shadow-neumorphic-inset" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-primary-200 rounded animate-pulse shadow-neumorphic-inset" />
        <div className="h-3 bg-accent-200 rounded w-2/3 animate-pulse shadow-neumorphic-inset animation-delay-1000" />
      </div>
    </div>
  </CardContent>
</Card>
```

## Accessibility Implementation

### Enhanced Focus Management

```typescript
// Creative focus indicators with brand colors
<Button
  className={cn(
    "shadow-neumorphic-md transition-all duration-200",
    "focus:outline-none focus:shadow-neumorphic-focus",
    "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
  )}
>
  Accessible Creative Button
</Button>

// Custom focus styles for complex creative components
<div
  tabIndex={0}
  role="button"
  className={cn(
    "shadow-neumorphic-primary transition-all duration-200",
    "focus:outline-none focus:shadow-neumorphic-focus",
    "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
  )}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleAction();
    }
  }}
>
  Creative Interactive Element
</div>
```

### Screen Reader Support

```typescript
// Enhanced ARIA labels for creative components
<Button
  aria-label="Send contact request with priority handling"
  aria-describedby="priority-description"
  className="shadow-neumorphic-accent hover:shadow-neumorphic-accent-lg"
>
  <MessageCircleIcon className="h-4 w-4 mr-2" weight="bold" />
  Priority Contact
</Button>
<div id="priority-description" className="sr-only">
  This will mark your request as high priority for faster response
</div>
```

## Performance Optimization

### Efficient Creative Shadow Rendering

```css
/* Hardware acceleration for creative shadows */
.shadow-neumorphic-primary {
  transform: translate3d(0, 0, 0);
  will-change: box-shadow, transform;
  backface-visibility: hidden;
}

/* Optimized creative transitions */
.transition-creative {
  transition: box-shadow 200ms ease-out, transform 200ms ease-out, background-color 200ms ease-out;
}
```

### Conditional Creative Enhancement

```typescript
// Apply creative enhancements based on context
const CreativeCard = ({ isHero = false, isInteractive = false, children }) => (
  <Card
    className={cn(
      "transition-all duration-300",
      isHero ? "shadow-neumorphic-xl bg-primary-600 text-white" : "shadow-neumorphic-md",
      isInteractive
        ? "hover:shadow-neumorphic-lg cursor-pointer transform hover:scale-[1.02]"
        : "hover:shadow-neumorphic-md"
    )}
  >
    {children}
  </Card>
);
```

## Creative Design Tokens

### Enhanced Shadow System

```javascript
// tailwind.config.js - Creative shadow definitions with brand color integration
const creativeShadows = {
  // Standard neumorphic shadows
  "neumorphic-sm": "2px 2px 6px rgba(0, 0, 0, 0.06), -2px -2px 6px rgba(255, 255, 255, 0.8)",
  "neumorphic-md": "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)",
  "neumorphic-lg": "6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)",
  "neumorphic-xl": "8px 8px 20px rgba(0, 0, 0, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.95)",

  // Brand-colored shadows for creative depth
  "neumorphic-primary":
    "4px 4px 12px rgba(37, 99, 235, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(37, 99, 235, 0.05)",
  "neumorphic-primary-lg":
    "6px 6px 16px rgba(37, 99, 235, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(37, 99, 235, 0.08)",
  "neumorphic-accent":
    "4px 4px 12px rgba(16, 185, 129, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(16, 185, 129, 0.05)",
  "neumorphic-accent-lg":
    "6px 6px 16px rgba(16, 185, 129, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(16, 185, 129, 0.08)",

  // Enhanced inset shadows
  "neumorphic-inset": "inset 4px 4px 12px rgba(0, 0, 0, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7)",
  "neumorphic-inset-primary":
    "inset 4px 4px 12px rgba(37, 99, 235, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7), 0 0 0 1px rgba(37, 99, 235, 0.1)",
  "neumorphic-inset-accent":
    "inset 4px 4px 12px rgba(16, 185, 129, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.1)",

  // Interactive states
  "neumorphic-focus":
    "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), 0 0 0 3px rgba(37, 99, 235, 0.2)",
  "neumorphic-focus-accent":
    "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), 0 0 0 3px rgba(16, 185, 129, 0.2)",
};
```

### Enhanced Brand Color System

```javascript
// Creative brand color system for maximum creative potential
const creativeColors = {
  // Primary Blue Spectrum - Core brand identity
  primary: {
    25: "#f8faff", // Ultra-light backgrounds, subtle accents
    50: "#eff6ff", // Light backgrounds, card surfaces
    100: "#dbeafe", // Subtle accents, hover states
    150: "#c7ddfe", // Custom intermediate shade
    200: "#bfdbfe", // Borders, dividers, disabled backgrounds
    300: "#93c5fd", // Disabled states, placeholder text
    400: "#60a5fa", // Hover states, secondary actions
    500: "#3b82f6", // Default primary, active states
    600: "#2563eb", // PRIMARY BRAND COLOR - main actions
    700: "#1d4ed8", // Text, icons, strong emphasis
    800: "#1e40af", // Headings, important text
    900: "#1e3a8a", // High contrast text, dark themes
    950: "#172e77", // Ultra-dark, maximum contrast
  },

  // Accent Emerald Spectrum - Energy and success
  accent: {
    25: "#f0fdf9", // Ultra-light success backgrounds
    50: "#ecfdf5", // Success backgrounds, notification areas
    100: "#d1fae5", // Success accents, positive feedback
    200: "#a7f3d0", // Success borders, progress indicators
    300: "#6ee7b7", // Success hover states
    400: "#34d399", // Success active states
    500: "#10b981", // ACCENT BRAND COLOR - success actions
    600: "#059669", // Success primary, confirmation buttons
    700: "#047857", // Success text, strong positive emphasis
    800: "#065f46", // Success headings, important positive text
    900: "#064e3b", // High contrast success text
    950: "#022c22", // Ultra-dark success, maximum contrast
  },

  // Enhanced Neutral Spectrum - Sophisticated balance
  neutral: {
    25: "#fdfdfd", // Pure white alternatives
    50: "#f9fafb", // Main background, card surfaces
    100: "#f3f4f6", // Secondary backgrounds, input fields
    200: "#e5e7eb", // Borders, dividers, subtle separators
    300: "#d1d5db", // Disabled backgrounds, placeholder areas
    400: "#9ca3af", // Disabled text, secondary information
    500: "#6b7280", // Body text, standard content
    600: "#4b5563", // Headings, emphasized text
    700: "#374151", // Strong text, navigation items
    800: "#1f2937", // High contrast text, dark elements
    900: "#111827", // Maximum contrast, dark themes
    950: "#0a0e1a", // Ultra-dark, absolute contrast
  },
};
```

This unified design system combines the best of both neumorphic principles and creative innovation, providing a comprehensive toolkit for building visually striking, accessible, and brand-consistent interfaces throughout the Audit-it platform.
