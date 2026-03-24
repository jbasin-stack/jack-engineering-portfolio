# Phase 1: Foundation, Navigation, and Hero - Research

**Researched:** 2026-03-20
**Domain:** React SPA foundation with smooth scroll, animation, glassmorphic UI, and typography-first design
**Confidence:** HIGH

## Summary

Phase 1 scaffolds a greenfield Vite 8 + React 19 + TypeScript single-page application with Tailwind CSS v4, Motion (successor to Framer Motion), and Lenis smooth scroll. The core deliverables are: a working SPA with weighted smooth scroll, a glassmorphic navigation bar with scroll-spy and mobile hamburger, and a typography-first hero section communicating Jack's ECE identity.

The stack is well-established as of March 2026. Vite 8.0 (released March 12, 2026) ships with Rolldown as its unified Rust-based bundler. Tailwind CSS v4.2.2 (released March 18, 2026) officially supports Vite 8 via the `@tailwindcss/vite` plugin. Motion 12.x is the renamed successor to Framer Motion with identical API. Lenis 1.3.19 (released March 18, 2026) is the current version with full React support. All libraries are actively maintained with recent releases.

**Primary recommendation:** Use `npm create vite@latest -- --template react-ts`, then add `motion`, `lenis`, `tailwindcss`, and `@tailwindcss/vite` as the core stack. Sync Lenis with Motion's frame loop via `autoRaf: false` and `frame.update()`. Define all design tokens (colors, fonts, spacing) via Tailwind v4's CSS-first `@theme` directive. Use Inter as the geometric sans-serif font family.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero height: 70-80vh, centered horizontally and vertically within hero area
- Text hierarchy: three tiers -- large name, medium subtitle, short narrative line
- Entrance animation: staggered fade-up (name -> subtitle -> narrative, ~200ms delay between each, weighted easing, no bounce)
- Background: subtle gradient from white to barely-there warm grey (not pure flat white)
- Scroll indicator: subtle animated chevron at bottom that gently pulses, disappears on scroll
- Social icons: small GitHub + LinkedIn outline icons below narrative text, minimal stroke style, hover darkens
- Name displayed as uppercase via CSS text-transform ("JACK BASINSKI")
- Subtitle: "Electrical & Computer Engineering . UW" (medium size)
- Narrative line: placeholder text, "semiconductor manufacturing and design" direction -- user will finalize exact copy later via data file
- Font family: geometric & precise sans-serif -- single font family throughout, differentiate with weight and size
- Hero name size: clamp range ~3-5rem, fluid between mobile and desktop
- Letter spacing: wide tracking (~0.05-0.1em) on uppercase text (hero name); default tracking on body text
- Section headings: natural case, bold weight (not uppercase) -- contrasts with uppercase hero
- Body text weight: regular (400)
- Background ("Cleanroom White"): Claude selects shade
- Grey tone ("Silicon Grey"): Claude selects
- Accent color: single subtle accent for links, active nav states, hover effects -- Claude selects hue
- Primary text color: near-black preferred over pure black for readability
- 0.5px border system with 1px fallback for non-Retina
- Nav style: light frost -- backdrop-blur(12px) with ~80% white opacity
- Four grouped nav items: Background (dropdown: Skills, Coursework, Lab/Tooling), Projects, Papers, Contact
- "Background" has hover dropdown revealing sub-sections
- Left side: "JB" initials as compact text mark -- clicking scrolls to top
- Nav visibility: hidden on initial load, appears with fade-in after user scrolls past hero section
- Active section highlighted via Intersection Observer scroll-spy
- Nav links smooth-scroll to targets via Lenis
- Hamburger icon triggers full-screen overlay menu at mobile breakpoints
- All nav items listed vertically in mobile, grouped sub-items shown indented

### Claude's Discretion
- Exact font family selection (geometric sans-serif)
- Exact color values for cleanroom white, silicon grey, accent, and text colors
- 0.5px border placement strategy
- Loading skeleton and error state handling
- Scroll chevron animation timing and style
- Glassmorphic nav appearance animation (fade, slide, etc.)
- Mobile overlay animation (slide direction, timing)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDN-01 | Vite 8 + React 19 + TypeScript + Tailwind v4 + Motion | Standard Stack section covers all package versions and installation |
| FNDN-02 | All content in typed TypeScript data files, not hardcoded in JSX | Architecture Patterns: data layer pattern with typed interfaces |
| FNDN-03 | Lenis smooth scroll with weighted easing and physical feel | Lenis integration pattern with ReactLenis and useLenis |
| FNDN-04 | Lenis and Motion frame loops synced (autoRaf disabled, Motion frame.update) | Code Example: Lenis-Motion frame sync pattern |
| FNDN-05 | Motion weighted animations on section entries and hover states -- no bounce/spring | Motion transition configuration with tween easing, no spring |
| FNDN-06 | 0.5px border system with 1px fallback for non-Retina via HiDPI media query | Architecture Patterns: HiDPI border system |
| FNDN-07 | prefers-reduced-motion support disables Lenis smooth scroll and non-essential animations | Motion useReducedMotion hook + Lenis configuration |
| FNDN-08 | 21st.dev MCP server used as primary source for premium React components | Don't Hand-Roll section covers component sourcing strategy |
| NAV-01 | Fixed glassmorphic header with backdrop-blur, visible at all scroll positions | Glassmorphism CSS pattern with backdrop-filter |
| NAV-02 | Navigation links to grouped sections with Background dropdown | Architecture Patterns: nav data structure |
| NAV-03 | Active section highlighted via Intersection Observer scroll-spy | Code Example: Intersection Observer scroll-spy hook |
| NAV-04 | Clicking nav link smooth-scrolls via Lenis | Lenis scrollTo API pattern |
| NAV-05 | Nav collapses to mobile hamburger menu at small breakpoints | Architecture Patterns: responsive nav with Tailwind breakpoints |
| HERO-01 | Typography-first hero section as landing view | Architecture Patterns: hero layout with clamp() typography |
| HERO-02 | Hero communicates Jack's identity: ECE at UW, semiconductor fabrication x system design | Data file pattern for hero content |
| HERO-03 | High-quality sans-serif typography with generous whitespace | Font selection (Inter) + Tailwind @theme typography tokens |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vite | ^8.0.0 | Build tool + dev server | Rolldown-based unified Rust bundler, 10-30x faster builds, ESM-only |
| @vitejs/plugin-react | ^6.0.1 | React integration for Vite | Oxc-based React Refresh transform, no Babel dependency |
| React | ^19.0.0 | UI framework | Latest stable, required for Motion 12.x compatibility |
| React DOM | ^19.0.0 | DOM renderer | Paired with React 19 |
| TypeScript | ^5.7.0 | Type safety | Included in Vite react-ts template |
| Tailwind CSS | ^4.2.2 | Utility-first CSS | CSS-first config via @theme, auto content detection, Vite 8 support |
| @tailwindcss/vite | ^4.2.2 | Vite plugin for Tailwind v4 | Official Vite integration, no PostCSS config needed |
| motion | ^12.38.0 | Animation library | Renamed successor to Framer Motion, identical API, 30M+ monthly downloads |
| lenis | ^1.3.19 | Smooth scroll | Industry standard smooth scroll, React bindings via lenis/react |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Inter (Google Fonts) | Variable | Primary typeface | Geometric sans-serif, variable font, optimized for screens |
| lucide-react | latest | Icon library | Outline-style icons for social links and UI elements |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inter | Satoshi, General Sans | Inter is free via Google Fonts with variable font, zero hosting cost, widely tested at all sizes; Satoshi/General Sans require self-hosting |
| lucide-react | react-icons, heroicons | lucide-react has consistent stroke-width icons matching the minimal aesthetic; lighter than react-icons bundle |

**Installation:**
```bash
npm create vite@latest jack-portfolio -- --template react-ts
cd jack-portfolio
npm install
npm install motion lenis
npm install -D tailwindcss @tailwindcss/vite
```

**Note:** React 19 may need manual upgrade if the Vite template still scaffolds React 18:
```bash
npm install react@latest react-dom@latest
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── layout/
│   │   ├── Navigation.tsx       # Glassmorphic nav bar
│   │   ├── MobileMenu.tsx       # Full-screen mobile overlay
│   │   └── SmoothScroll.tsx     # Lenis + Motion frame sync provider
│   ├── hero/
│   │   ├── Hero.tsx             # Hero section container
│   │   ├── HeroContent.tsx      # Text hierarchy + stagger animation
│   │   └── ScrollIndicator.tsx  # Animated chevron
│   └── ui/
│       └── (21st.dev components as needed)
├── data/
│   ├── navigation.ts            # Nav items + dropdown structure
│   ├── hero.ts                  # Hero text content + social links
│   ├── projects.ts              # (placeholder for Phase 2+)
│   ├── skills.ts                # (placeholder for Phase 2+)
│   ├── courses.ts               # (placeholder for Phase 2+)
│   ├── tooling.ts               # (placeholder for Phase 2+)
│   └── timeline.ts              # (placeholder for Phase 2+)
├── hooks/
│   ├── useActiveSection.ts      # Intersection Observer scroll-spy
│   └── useScrollVisibility.ts   # Track if user scrolled past hero
├── styles/
│   └── app.css                  # Tailwind @import + @theme tokens
├── types/
│   └── data.ts                  # TypeScript interfaces for all data
├── App.tsx                      # Root component
└── main.tsx                     # Entry point
```

### Pattern 1: Typed Data Files (FNDN-02)
**What:** All content stored as typed TypeScript objects in `src/data/` files, imported into components.
**When to use:** Every piece of text, link, or structured content. Never hardcode strings in JSX.
**Example:**
```typescript
// src/types/data.ts
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeroData {
  name: string;
  subtitle: string;
  narrative: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // lucide icon name
}

// src/data/navigation.ts
import type { NavItem } from '../types/data';

export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#background',
    children: [
      { label: 'Skills', href: '#skills' },
      { label: 'Coursework', href: '#coursework' },
      { label: 'Lab & Tooling', href: '#tooling' },
    ],
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
];

// src/data/hero.ts
import type { HeroData } from '../types/data';

export const heroData: HeroData = {
  name: 'Jack Basinski',
  subtitle: 'Electrical & Computer Engineering \u00B7 UW',
  narrative: 'Bridging semiconductor manufacturing and system design',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/jackbasinski', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/jackbasinski', icon: 'Linkedin' },
  ],
};
```

### Pattern 2: Lenis + Motion Frame Sync Provider (FNDN-03, FNDN-04)
**What:** A wrapper component that initializes Lenis with `autoRaf: false` and drives it from Motion's frame loop.
**When to use:** Wrap the entire app once in this provider.
**Example:**
```typescript
// src/components/layout/SmoothScroll.tsx
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'motion/react';
import { useEffect, useRef } from 'react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }

    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
```
**Source:** [Lenis React README - Framer Motion integration](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md)

### Pattern 3: Weighted Motion Transitions (FNDN-05)
**What:** All animations use tween (duration-based) easing with custom cubic-bezier curves. No spring or bounce physics.
**When to use:** Every `<motion.div>` transition. Set globally via easing tokens.
**Example:**
```typescript
// src/styles/motion.ts -- shared animation config

// Weighted easing curves -- smooth, no bounce
export const easing = {
  // "Ease out quart" -- fast start, gentle deceleration
  out: [0.25, 1, 0.5, 1] as const,
  // "Ease in-out cubic" -- smooth both directions
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: easing.out },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, ease: easing.out },
};

// Stagger container for hero text
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Individual stagger child
export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.out },
  },
};
```

### Pattern 4: Intersection Observer Scroll-Spy (NAV-03)
**What:** Custom hook tracking which section is currently in the viewport, used to highlight the active nav item.
**When to use:** Navigation component reads `activeSection` from this hook.
**Example:**
```typescript
// src/hooks/useActiveSection.ts
import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: '-20% 0px -70% 0px', // top 20-30% of viewport triggers
          threshold: 0,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds]);

  return activeSection;
}
```

### Pattern 5: HiDPI 0.5px Border System (FNDN-06)
**What:** CSS utility for hairline borders that render at 0.5px on Retina displays and fall back to 1px on standard displays.
**When to use:** Nav borders, section dividers, card edges -- wherever the design calls for subtle separation.
**Example:**
```css
/* In app.css, after @import "tailwindcss" */
@layer utilities {
  .border-hairline {
    border-width: 1px;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .border-hairline {
      border-width: 0.5px;
    }
  }
}
```

### Pattern 6: Glassmorphic Navigation (NAV-01)
**What:** Fixed navigation bar with backdrop-blur frost effect, appearing after user scrolls past hero.
**When to use:** The primary navigation component.
**Example:**
```css
/* Glassmorphic nav styling via Tailwind utilities */
/* nav element classes: */
/* fixed top-0 inset-x-0 z-50 */
/* bg-white/80 backdrop-blur-[12px] */
/* border-b border-hairline border-silicon-grey/20 */
```

### Pattern 7: prefers-reduced-motion Support (FNDN-07)
**What:** Disable Lenis smooth scroll and non-essential Motion animations when the user's OS preference is set.
**When to use:** Global configuration -- wrap MotionConfig around the app and conditionally disable Lenis.
**Example:**
```typescript
// In SmoothScroll.tsx or App.tsx
import { useReducedMotion } from 'motion/react';

// useReducedMotion() returns true when the user prefers reduced motion
// When true:
// 1. Pass `enabled: false` to Lenis options to disable smooth scroll
// 2. Wrap app in <MotionConfig reducedMotion="user"> to let Motion handle its own
```

### Anti-Patterns to Avoid
- **Hardcoding text in JSX:** Every string must come from data files, even hero content. This enables future CMS migration and keeps components pure.
- **Using spring animations:** The design philosophy explicitly rejects bounce/spring. Always use tween with cubic-bezier easing.
- **Multiple RAF loops:** Never let Lenis and Motion each run their own requestAnimationFrame. Always sync via `frame.update()`.
- **Importing from 'framer-motion':** Use `motion/react` for all imports. The `framer-motion` package works but is the legacy name.
- **Using postcss.config.js or tailwind.config.js:** Tailwind v4 uses CSS-first configuration via `@theme`. No JS config files needed.
- **Overusing backdrop-filter:** Only one element (the nav bar) should use backdrop-filter. Stacking multiple blurred layers degrades performance.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll | Custom RAF scroll interpolation | Lenis | Touch support, momentum, anchor links, accessibility, edge cases with nested scrollable areas |
| Animation library | Custom keyframe/transition system | Motion (motion/react) | GPU-accelerated, gesture support, layout animations, variants system, reduced motion built-in |
| CSS framework | Custom utility classes | Tailwind CSS v4 | Auto content detection, @theme design tokens, purging, responsive variants |
| Icon set | Custom SVG components | lucide-react | Consistent stroke width, tree-shakeable, TypeScript types |
| Premium components | Custom from scratch | 21st.dev MCP | Pre-built, tested, premium aesthetic, fast iteration |
| Font loading | Manual @font-face | Google Fonts via `<link>` or fontsource | Subsetting, display swap, variable font optimization |

**Key insight:** Phase 1 establishes the foundation patterns that every subsequent phase inherits. Getting Lenis+Motion sync, Tailwind @theme tokens, and data file patterns right here prevents rewrites later.

## Common Pitfalls

### Pitfall 1: Lenis-Motion Frame Desync
**What goes wrong:** Smooth scroll feels jittery or animations stutter because Lenis and Motion run separate RAF loops.
**Why it happens:** Lenis defaults to `autoRaf: true`, running its own requestAnimationFrame. Motion also has its own frame scheduling.
**How to avoid:** Always set `autoRaf: false` on Lenis and drive it via `frame.update(update, true)` from `motion/react`. The `true` second argument makes it a keep-alive (fires every frame).
**Warning signs:** Scroll position jumps, visible tearing between scroll and animations.

### Pitfall 2: Tailwind v4 Config Confusion
**What goes wrong:** Developer creates `tailwind.config.js` or `postcss.config.js` files that conflict with v4's CSS-first approach.
**Why it happens:** Most online tutorials still reference Tailwind v3 patterns. The v4 approach is fundamentally different.
**How to avoid:** Use only `@import "tailwindcss"` and `@theme { ... }` in CSS. No JS config files. The `@tailwindcss/vite` plugin handles everything.
**Warning signs:** Classes not generating, duplicate config errors, PostCSS warnings.

### Pitfall 3: backdrop-filter Not Visible
**What goes wrong:** The glassmorphic nav appears as a solid white bar instead of frosted glass.
**Why it happens:** The element's background is fully opaque, or there's no content scrolling behind it to blur.
**How to avoid:** Use `bg-white/80` (80% opacity) combined with `backdrop-blur-[12px]`. The element MUST have a semi-transparent background for backdrop-filter to show through.
**Warning signs:** Nav looks like a solid bar, no blur effect visible when scrolling.

### Pitfall 4: Intersection Observer Flicker
**What goes wrong:** Active nav item rapidly switches between sections while scrolling.
**Why it happens:** Default rootMargin/threshold causes multiple sections to intersect simultaneously.
**How to avoid:** Use asymmetric rootMargin like `-20% 0px -70% 0px` so only the section near the top ~20-30% of viewport registers as active.
**Warning signs:** Nav highlight bouncing between items during scroll.

### Pitfall 5: 0.5px Border Rendering on Non-Retina
**What goes wrong:** Borders disappear entirely on non-HiDPI screens because the browser rounds 0.5px to 0px.
**Why it happens:** Not all browsers/screens support sub-pixel rendering. Some round down.
**How to avoid:** Use the media query approach: default to `border-width: 1px`, then override to `0.5px` only inside `@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)`.
**Warning signs:** Borders invisible on some monitors, inconsistent appearance across devices.

### Pitfall 6: Variable Font Not Loading
**What goes wrong:** Font appears as fallback system font, or FOUT (flash of unstyled text) is noticeable.
**Why it happens:** Google Fonts variable font URL not configured correctly, or `font-display` not set.
**How to avoid:** Use the Inter variable font URL from Google Fonts with `display=swap`. Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com`. Alternatively, self-host via `@fontsource-variable/inter`.
**Warning signs:** System font visible on first load, text reflow after font loads.

### Pitfall 7: Mobile Menu Not Preventing Background Scroll
**What goes wrong:** When the mobile hamburger overlay is open, the page behind still scrolls.
**Why it happens:** Lenis continues processing scroll events even when a full-screen overlay is visible.
**How to avoid:** Use Lenis's `stop()` and `start()` methods to pause/resume scroll when the mobile menu opens/closes. Alternatively, add `data-lenis-prevent` attribute to the overlay element.
**Warning signs:** Background scrolls while menu is open, scroll position lost when menu closes.

## Code Examples

### Tailwind v4 Theme Configuration
```css
/* src/styles/app.css */
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Colors -- Cleanroom palette */
  --color-cleanroom: oklch(0.985 0.002 90);        /* warm off-white background */
  --color-silicon-50: oklch(0.97 0.005 250);        /* lightest grey */
  --color-silicon-100: oklch(0.94 0.008 250);       /* light grey */
  --color-silicon-200: oklch(0.88 0.01 250);        /* medium-light grey */
  --color-silicon-400: oklch(0.70 0.015 250);       /* medium grey */
  --color-silicon-600: oklch(0.50 0.02 250);        /* dark grey */
  --color-silicon-800: oklch(0.30 0.015 250);       /* very dark grey */
  --color-ink: oklch(0.15 0.01 250);                /* near-black text */
  --color-accent: oklch(0.55 0.15 250);             /* subtle blue-grey accent */

  /* Tracking */
  --tracking-architectural: 0.08em;                  /* wide tracking for uppercase */

  /* Custom easing */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-smooth: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### Hero Section with Stagger Animation
```typescript
// src/components/hero/Hero.tsx
import { motion } from 'motion/react';
import { heroData } from '../../data/hero';

const easing = [0.25, 1, 0.5, 1]; // out-quart

export function Hero() {
  return (
    <section
      id="hero"
      className="flex min-h-[75vh] items-center justify-center px-6"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
        className="text-center"
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
          }}
          className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-architectural text-ink"
        >
          {heroData.name}
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
          }}
          className="mt-4 text-[clamp(1rem,2vw,1.5rem)] text-silicon-600"
        >
          {heroData.subtitle}
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easing } },
          }}
          className="mt-3 text-[clamp(0.875rem,1.5vw,1.125rem)] font-light text-silicon-400"
        >
          {heroData.narrative}
        </motion.p>
      </motion.div>
    </section>
  );
}
```

### Lenis scrollTo for Nav Links
```typescript
// Inside Navigation.tsx
import { useLenis } from 'lenis/react';

function NavLink({ href, label }: { href: string; label: string }) {
  const lenis = useLenis();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    lenis?.scrollTo(href, {
      offset: -80, // account for fixed nav height
      duration: 1.2,
    });
  };

  return (
    <a href={href} onClick={handleClick}>
      {label}
    </a>
  );
}
```

### Nav Visibility Hook (appears after scrolling past hero)
```typescript
// src/hooks/useScrollVisibility.ts
import { useLenis } from 'lenis/react';
import { useState } from 'react';

export function useScrollVisibility(threshold: number = 300) {
  const [isVisible, setIsVisible] = useState(false);

  useLenis(({ scroll }) => {
    setIsVisible(scroll > threshold);
  });

  return isVisible;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion package (import from motion/react) | 2024 | Same API, new package name, broader platform support |
| tailwind.config.js + postcss.config.js | @theme directive in CSS, @tailwindcss/vite plugin | Tailwind v4 (Jan 2025) | No JS config, CSS-first, auto content detection |
| @studio-freight/lenis | lenis (single package) | 2024 | Old package deprecated, React bindings now at lenis/react |
| Vite with esbuild+Rollup dual bundler | Vite 8 with Rolldown unified Rust bundler | March 2026 | 10-30x faster builds, single bundler model |
| @vitejs/plugin-react with Babel | @vitejs/plugin-react v6 with Oxc | March 2026 | No Babel dependency, faster transforms |

**Deprecated/outdated:**
- `framer-motion` package: Still works but new projects should use `motion` with `motion/react` imports
- `@studio-freight/lenis` and `@studio-freight/react-lenis`: Deprecated, replaced by `lenis` package
- `tailwind.config.js`: Not needed in Tailwind v4; use `@theme` in CSS
- `postcss.config.js` for Tailwind: Not needed when using `@tailwindcss/vite` plugin

## Open Questions

1. **Exact Motion import path for frame/cancelFrame**
   - What we know: The Lenis README shows importing `{ cancelFrame, frame }` from `'framer-motion'`. Multiple sources confirm these are also available from `'motion/react'`.
   - What's unclear: Whether `frame` and `cancelFrame` are exported from `'motion/react'` or from `'motion'` directly in v12.x.
   - Recommendation: Try importing from `'motion/react'` first. If not available, import from `'motion'`. Both should work since the motion package re-exports.

2. **21st.dev MCP Component Availability**
   - What we know: 21st.dev is a community-driven registry for premium React components, accessible via MCP.
   - What's unclear: Whether specific components needed for Phase 1 (nav dropdown, mobile menu overlay) are available.
   - Recommendation: Check 21st.dev MCP during implementation for nav and menu components. Fall back to custom implementation if nothing suitable exists. The nav is specialized enough that custom may be needed.

3. **Font Loading Strategy**
   - What we know: Inter is available via Google Fonts as a variable font and via @fontsource-variable/inter as an npm package for self-hosting.
   - What's unclear: Whether Google Fonts link tag or self-hosted @fontsource is better for this project's performance goals.
   - Recommendation: Start with Google Fonts `<link>` tag with `display=swap` and preconnect hints. It's simpler and CDN-cached. Switch to @fontsource only if Lighthouse flags font loading as an issue in Phase 4.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (included with Vite 8 ecosystem) |
| Config file | none -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FNDN-01 | Vite+React+TS+Tailwind+Motion all resolve | smoke | `npx vite build` (build succeeds) | N/A -- build test |
| FNDN-02 | Data files export typed objects | unit | `npx vitest run src/data/ -x` | Wave 0 |
| FNDN-03 | Lenis initializes with smooth scroll | manual-only | Manual: scroll page, verify smooth momentum | N/A -- visual |
| FNDN-04 | Lenis+Motion frame sync works | manual-only | Manual: scroll while animations play, no stutter | N/A -- visual |
| FNDN-05 | Animations use tween easing, no spring | unit | `npx vitest run src/styles/motion -x` | Wave 0 |
| FNDN-06 | 0.5px border renders correctly | manual-only | Manual: inspect on Retina vs non-Retina display | N/A -- visual |
| FNDN-07 | Reduced motion disables animations | manual-only | Manual: toggle OS reduced motion, verify | N/A -- a11y |
| FNDN-08 | 21st.dev used for components | manual-only | Manual: verify during code review | N/A -- process |
| NAV-01 | Glassmorphic nav with blur | manual-only | Manual: scroll and verify frosted glass effect | N/A -- visual |
| NAV-02 | Nav contains correct links with dropdown | unit | `npx vitest run src/data/navigation -x` | Wave 0 |
| NAV-03 | Scroll-spy highlights active section | manual-only | Manual: scroll through sections, verify highlight | N/A -- visual |
| NAV-04 | Nav click smooth-scrolls to section | manual-only | Manual: click nav link, verify smooth scroll | N/A -- visual |
| NAV-05 | Hamburger menu at mobile breakpoints | manual-only | Manual: resize to mobile, verify hamburger appears | N/A -- visual |
| HERO-01 | Hero renders as landing view | smoke | `npx vite build` + manual verify | N/A |
| HERO-02 | Hero displays Jack's identity info | unit | `npx vitest run src/data/hero -x` | Wave 0 |
| HERO-03 | Typography uses Inter with whitespace | manual-only | Manual: verify font loads and spacing | N/A -- visual |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose` (where applicable)
- **Per wave merge:** `npx vite build && npx vitest run`
- **Phase gate:** Build succeeds + all unit tests green + manual visual checks pass

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- test framework configuration
- [ ] `tests/data/navigation.test.ts` -- validates nav data structure and types
- [ ] `tests/data/hero.test.ts` -- validates hero data exports
- [ ] `tests/styles/motion.test.ts` -- validates animation config uses tween, not spring
- [ ] Framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

## Sources

### Primary (HIGH confidence)
- [Lenis React README](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md) -- ReactLenis, useLenis, autoRaf, frame sync with Framer Motion
- [Tailwind CSS v4 @theme docs](https://tailwindcss.com/docs/theme) -- CSS-first configuration, @theme directive, variable namespaces
- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) -- Rolldown bundler, Node.js requirements, plugin-react v6
- [Motion official site](https://motion.dev/) -- motion/react imports, animation API
- [Inter typeface](https://rsms.me/inter/) -- Variable font, OpenType features

### Secondary (MEDIUM confidence)
- [Motion stagger docs](https://motion.dev/docs/stagger) -- stagger function API with delay and easing
- [Motion transitions docs](https://motion.dev/docs/react-transitions) -- tween, spring, easing configuration
- [@tailwindcss/vite + Vite 8 discussion](https://github.com/tailwindlabs/tailwindcss/discussions/19624) -- v4.2.2 adds official Vite 8 support
- [Lenis npm](https://www.npmjs.com/package/lenis) -- v1.3.19 latest, React bindings at lenis/react
- [Motion npm](https://www.npmjs.com/package/motion) -- v12.38.0 latest

### Tertiary (LOW confidence)
- [0.5px border techniques](http://dieulot.net/css-retina-hairline) -- HiDPI media query approach, older article but technique remains valid
- [21st.dev MCP](https://github.com/21st-dev/magic-mcp) -- component availability for specific nav/menu patterns unclear

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified with recent npm releases (within days), Vite 8 + Tailwind v4.2.2 + Motion 12.x + Lenis 1.3.x all confirmed compatible
- Architecture: HIGH -- Lenis+Motion frame sync pattern is documented in official Lenis README with exact code example; Tailwind @theme is documented in official docs
- Pitfalls: HIGH -- based on official documentation warnings and widely-reported community issues
- Font selection: MEDIUM -- Inter is the strongest candidate in the geometric sans-serif space, but exact color values are Claude's discretion and subjective
- 0.5px border system: MEDIUM -- technique is well-established but based on older sources; modern browser support is broader

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable ecosystem, 30-day validity)
