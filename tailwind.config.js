/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand Colors from UI/UX Guidelines
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a", // Primary brand color (Deep Blue)
        },
        accent: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981", // Accent brand color (Emerald Green)
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        neutral: {
          50: "#f9fafb", // White backgrounds
          100: "#f3f4f6", // Light gray (secondary backgrounds)
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280", // Muted gray (secondary text)
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937", // Dark slate (primary text)
          900: "#111827",
        },
        // Existing shadcn colors for compatibility
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      // Mobile-first breakpoints from UI/UX Guidelines
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      // Simple background patterns (no gradients)
      backgroundImage: {
        "pattern-dots":
          "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        pattern: "20px 20px",
      },
      // Enhanced Neumorphic Shadow System
      boxShadow: {
        // Standard Neumorphic Shadows
        "neumorphic-sm": "2px 2px 6px rgba(0, 0, 0, 0.06), -2px -2px 6px rgba(255, 255, 255, 0.8)",
        "neumorphic-md": "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)",
        "neumorphic-lg": "6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)",
        "neumorphic-xl": "8px 8px 20px rgba(0, 0, 0, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.95)",

        // Brand-Colored Creative Shadows - Primary Blue
        "neumorphic-primary":
          "4px 4px 12px rgba(37, 99, 235, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(37, 99, 235, 0.05)",
        "neumorphic-primary-lg":
          "6px 6px 16px rgba(37, 99, 235, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(37, 99, 235, 0.08)",
        "neumorphic-primary-xl":
          "8px 8px 20px rgba(37, 99, 235, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(37, 99, 235, 0.1)",

        // Brand-Colored Creative Shadows - Accent Emerald
        "neumorphic-accent":
          "4px 4px 12px rgba(16, 185, 129, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), inset 0 0 0 1px rgba(16, 185, 129, 0.05)",
        "neumorphic-accent-lg":
          "6px 6px 16px rgba(16, 185, 129, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(16, 185, 129, 0.08)",
        "neumorphic-accent-xl":
          "8px 8px 20px rgba(16, 185, 129, 0.15), -8px -8px 20px rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(16, 185, 129, 0.1)",

        // Inset Effects for Pressed Appearance
        "neumorphic-inset": "inset 4px 4px 12px rgba(0, 0, 0, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7)",
        "neumorphic-inset-deep":
          "inset 6px 6px 16px rgba(0, 0, 0, 0.15), inset -3px -3px 10px rgba(255, 255, 255, 0.8)",
        "neumorphic-inset-primary":
          "inset 4px 4px 12px rgba(37, 99, 235, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7), 0 0 0 1px rgba(37, 99, 235, 0.1)",
        "neumorphic-inset-accent":
          "inset 4px 4px 12px rgba(16, 185, 129, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.1)",

        // Interactive State Shadows
        "neumorphic-hover": "6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)",
        "neumorphic-active": "inset 2px 2px 8px rgba(0, 0, 0, 0.08), inset -1px -1px 4px rgba(255, 255, 255, 0.6)",

        // Focus State Shadows with Brand Colors
        "neumorphic-focus":
          "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), 0 0 0 3px rgba(37, 99, 235, 0.2)",
        "neumorphic-focus-accent":
          "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), 0 0 0 3px rgba(16, 185, 129, 0.2)",

        // Error State Shadows
        "neumorphic-error":
          "4px 4px 12px rgba(239, 68, 68, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8), 0 0 0 3px rgba(239, 68, 68, 0.2)",
        "neumorphic-inset-error":
          "inset 4px 4px 12px rgba(239, 68, 68, 0.1), inset -2px -2px 8px rgba(255, 255, 255, 0.7), 0 0 0 1px rgba(239, 68, 68, 0.1)",
      },
      // Enhanced Animation System for Neumorphic Elements
      animation: {
        "neumorphic-pulse": "neumorphic-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neumorphic-bounce": "neumorphic-bounce 1s infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      keyframes: {
        "neumorphic-pulse": {
          "0%, 100%": {
            boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)",
          },
          "50%": {
            boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)",
          },
        },
        "neumorphic-bounce": {
          "0%, 100%": {
            transform: "translateY(0)",
            boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.8)",
          },
          "50%": {
            transform: "translateY(-4px)",
            boxShadow: "6px 6px 16px rgba(0, 0, 0, 0.12), -6px -6px 16px rgba(255, 255, 255, 0.9)",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      // Enhanced Transition System
      transitionTimingFunction: {
        neumorphic: "cubic-bezier(0.4, 0, 0.2, 1)",
        "neumorphic-bounce": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "neumorphic-elastic": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      transitionDuration: {
        neumorphic: "200ms",
        "neumorphic-slow": "300ms",
        "neumorphic-fast": "150ms",
      },
    },
  },
  plugins: [
    // Hardware Acceleration and Performance Utilities for Neumorphic Elements
    function ({ addUtilities, addComponents }) {
      // Performance optimization utilities
      const performanceUtilities = {
        ".neumorphic-optimized": {
          transform: "translate3d(0, 0, 0)",
          willChange: "box-shadow, transform",
          backfaceVisibility: "hidden",
        },
        ".transition-neumorphic": {
          transition: "box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        },
        ".transition-neumorphic-bounce": {
          transition: "all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        },
        ".transition-neumorphic-elastic": {
          transition: "all 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        },
      };

      // Mobile-optimized shadow variants (reduced intensity for performance)
      const mobileShadowUtilities = {
        ".shadow-neumorphic-mobile-sm": {
          boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.05), -1px -1px 4px rgba(255, 255, 255, 0.7)",
        },
        ".shadow-neumorphic-mobile-md": {
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.06), -2px -2px 8px rgba(255, 255, 255, 0.7)",
        },
        ".shadow-neumorphic-mobile-lg": {
          boxShadow: "3px 3px 12px rgba(0, 0, 0, 0.08), -3px -3px 12px rgba(255, 255, 255, 0.8)",
        },
        ".shadow-neumorphic-mobile-primary": {
          boxShadow:
            "2px 2px 8px rgba(37, 99, 235, 0.06), -2px -2px 8px rgba(255, 255, 255, 0.7), inset 0 0 0 1px rgba(37, 99, 235, 0.04)",
        },
        ".shadow-neumorphic-mobile-accent": {
          boxShadow:
            "2px 2px 8px rgba(16, 185, 129, 0.06), -2px -2px 8px rgba(255, 255, 255, 0.7), inset 0 0 0 1px rgba(16, 185, 129, 0.04)",
        },
      };

      // Desktop-enhanced shadow variants (full intensity)
      const desktopShadowUtilities = {
        ".shadow-neumorphic-desktop-xl": {
          boxShadow: "10px 10px 24px rgba(0, 0, 0, 0.18), -10px -10px 24px rgba(255, 255, 255, 0.98)",
        },
        ".shadow-neumorphic-desktop-primary": {
          boxShadow:
            "10px 10px 24px rgba(37, 99, 235, 0.18), -10px -10px 24px rgba(255, 255, 255, 0.98), inset 0 0 0 1px rgba(37, 99, 235, 0.12)",
        },
        ".shadow-neumorphic-desktop-accent": {
          boxShadow:
            "10px 10px 24px rgba(16, 185, 129, 0.18), -10px -10px 24px rgba(255, 255, 255, 0.98), inset 0 0 0 1px rgba(16, 185, 129, 0.12)",
        },
      };

      addUtilities(performanceUtilities);
      addUtilities(mobileShadowUtilities);
      addUtilities(desktopShadowUtilities);
    },
  ],
};
