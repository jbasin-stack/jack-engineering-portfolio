# Architecture Research: v1.2 UI Polish & Interactivity

**Domain:** Animated UI features integration into existing Vite 8 + React 19 + Tailwind v4 + Motion + Lenis portfolio SPA
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

The v1.2 milestone adds six visual/interaction features to the existing portfolio: animated gradient hero, system-preference dark/light theming, AnimatedTabs for merged skills/tooling, embla-carousel for projects, scroll-triggered SVG timeline, and a redesigned contact/footer. Every feature integrates with the current architecture through the same Motion animation system and Tailwind v4 styling. No new frameworks are needed. The only new dependency is `embla-carousel-react`.

The critical architectural decision is the theming system. The current codebase uses oklch color variables in `:root` with a `@custom-variant dark` already declared in `app.css`. The v1.2 plan replaces the oklch-based cleanroom palette with a hex-based blue-primary variable system that serves two values per token (light and dark). This is a CSS-layer change that propagates to every component through existing Tailwind utility classes -- no component-level theme prop-drilling needed.

The second significant decision is replacing the bento grid project layout with a horizontal embla-carousel. This requires careful handling of the Lenis smooth scroll integration (horizontal carousel inside a vertical scroll page) and replacement of Motion's LayoutGroup expand/collapse pattern with a slide-based navigation pattern.

## System Overview

### Current Architecture (v1.1)

```
+-------------------------------------------------------------------+
|  App.tsx                                                          |
|  MotionConfig reducedMotion="user"                                |
|    +-------------------------------------------------------------+|
|    | SmoothScroll (Lenis + Motion frame sync)                    ||
|    |   +-------------------------------------------------------+ ||
|    |   | Navigation (scroll-spy + AnimatePresence)             | ||
|    |   +-------------------------------------------------------+ ||
|    |   | <main>                                                | ||
|    |   |   Hero (HeroContent + ScrollIndicator)                | ||
|    |   |   WhoAmI (NoisyBackground + portrait + bio)           | ||
|    |   |   Skills (NoisyBackground + skill groups grid)        | ||
|    |   |   Tooling (NoisyBackground + tooling groups grid)     | ||
|    |   |   Timeline (AnimatedGridPattern + useScroll nodes)    | ||
|    |   |   ProjectsSection (LayoutGroup + bento grid + cards)  | ||
|    |   |   PapersSection                                       | ||
|    |   | </main>                                               | ||
|    |   | <footer>                                              | ||
|    |   |   Contact (gradient + email + resume + social)        | ||
|    |   | </footer>                                             | ||
|    |   +-------------------------------------------------------+ ||
|    +-------------------------------------------------------------+||
+-------------------------------------------------------------------+
```

### Target Architecture (v1.2)

```
+-------------------------------------------------------------------+
|  App.tsx                                                          |
|  ThemeProvider defaultTheme="system"                              |
|    MotionConfig reducedMotion="user"                              |
|      +-----------------------------------------------------------+|
|      | SmoothScroll (Lenis + Motion frame sync)                  ||
|      |   +----------------------------------------------------- +||
|      |   | Navigation (scroll-spy -- UPDATED section IDs)       |||
|      |   +------------------------------------------------------+||
|      |   | UnifiedBackground (single gradient across all)       |||
|      |   |   <main>                                             |||
|      |   |     Hero (AnimatedGradientBg + HeroContent)          |||
|      |   |     WhoAmI (transparent bg, inherits unified)        |||
|      |   |     SkillsAndTooling (AnimatedTabs + merged data)    |||
|      |   |     Timeline (SVG path + glow nodes + useScroll)     |||
|      |   |     ProjectCarousel (embla + featured-first)         |||
|      |   |     PapersSection (minor style updates)              |||
|      |   |   </main>                                            |||
|      |   |   <footer>                                           |||
|      |   |     ContactFooter ("Let's Work Together" layout)     |||
|      |   |   </footer>                                          |||
|      |   +------------------------------------------------------+||
|      +-----------------------------------------------------------+||
+-------------------------------------------------------------------+
```

### Component Change Map

| Component | Status | What Changes |
|-----------|--------|-------------|
| `App.tsx` | **MODIFIED** | Wrap with ThemeProvider; replace Skills+Tooling with SkillsAndTooling; replace ProjectsSection with ProjectCarousel; replace Contact with ContactFooter |
| `src/styles/app.css` | **MODIFIED** | Replace oklch palette with blue-primary hex variables; add `:root` and `.dark` variable blocks; update `@theme inline` mappings; add gradient keyframes |
| `src/styles/motion.ts` | **UNCHANGED** | Existing variants and easing work as-is |
| `src/components/hero/Hero.tsx` | **MODIFIED** | Add AnimatedGradientBg as background layer |
| `src/components/hero/HeroContent.tsx` | **MODIFIED** | Update color classes from oklch to semantic tokens |
| `src/components/layout/Navigation.tsx` | **MODIFIED** | Update section IDs array (Skills+Tooling merged); update color classes for dark mode |
| `src/components/layout/SmoothScroll.tsx` | **UNCHANGED** | Lenis config stays the same |
| `src/components/sections/WhoAmI.tsx` | **MODIFIED** | Remove NoisyBackground wrapper; use transparent bg over unified background; update color classes |
| `src/components/sections/Skills.tsx` | **REMOVED** | Merged into SkillsAndTooling |
| `src/components/sections/Tooling.tsx` | **REMOVED** | Merged into SkillsAndTooling |
| `src/components/sections/Timeline.tsx` | **REPLACED** | New vertical SVG timeline with glow nodes and scroll-triggered path drawing |
| `src/components/sections/Contact.tsx` | **REPLACED** | New "Let's Work Together" layout with redesigned footer |
| `src/components/projects/ProjectsSection.tsx` | **REPLACED** | New embla-carousel horizontal layout |
| `src/components/projects/ProjectCard.tsx` | **MODIFIED** | Adapted for carousel slide context (no LayoutGroup expand) |
| `src/components/effects/NoisyBackground.tsx` | **DEPRECATED** | No longer used by any section (unified bg replaces per-section backgrounds) |
| `src/components/effects/AnimatedGridPattern.tsx` | **DEPRECATED** | Replaced by SVG timeline effect |
| `src/components/effects/AuroraBackground.tsx` | **ALREADY UNUSED** | Was descoped in v1.0 |
| `src/data/navigation.ts` | **MODIFIED** | Update section refs (skills+tooling merged into one) |
| `src/data/skills.ts` | **UNCHANGED** | Data structure stays, consumed by new component |
| `src/data/tooling.ts` | **UNCHANGED** | Data structure stays, consumed by new component |
| `src/types/data.ts` | **UNCHANGED** | No type changes needed |
| `src/hooks/useActiveSection.ts` | **MODIFIED** | Update section IDs (remove 'tooling', keep 'skills' or rename to 'expertise') |

### New Components

| Component | Purpose | Key Dependencies |
|-----------|---------|-----------------|
| `src/components/theme/ThemeProvider.tsx` | React context for system-preference theme detection; applies `.dark` class to `<html>` | React context, matchMedia API |
| `src/components/effects/AnimatedGradientBg.tsx` | Radial gradient with breathing animation for hero section | CSS keyframes, opacity layering |
| `src/components/effects/UnifiedBackground.tsx` | Single smooth gradient background spanning all sections | CSS variables for theme-aware colors |
| `src/components/sections/SkillsAndTooling.tsx` | Merged section with AnimatedTabs switching between domain groups | Motion layoutId, skills+tooling data |
| `src/components/ui/AnimatedTabs.tsx` | Glassmorphic tab bar with Motion sliding pill indicator | Motion layoutId, backdrop-filter |
| `src/components/sections/TimelineV2.tsx` | Vertical SVG timeline with glow nodes and scroll-triggered path | Motion useScroll, useTransform, SVG pathLength |
| `src/components/projects/ProjectCarousel.tsx` | Embla-carousel horizontal project showcase with featured-first ordering | embla-carousel-react, existing ProjectCard |
| `src/components/sections/ContactFooter.tsx` | "Let's Work Together" heading + direct links + minimal footer | Existing contact data |

## Data Flow

### Theme Switching Flow

```
System preference changes (OS level)
    |
    v
matchMedia("(prefers-color-scheme: dark)") fires event
    |
    v
ThemeProvider listener receives change
    |
    v
ThemeProvider updates <html> class: add/remove "dark"
    |
    v
CSS variables in :root vs .dark selectors activate
    |
    v
All Tailwind dark: utilities and CSS var() references
re-resolve automatically (zero React re-renders for color changes)
```

This is critical: the theme switch happens entirely in CSS. The ThemeProvider only manages the `.dark` class on `<html>`. Components do NOT need a `theme` prop or `useTheme()` hook for styling -- they use Tailwind's `dark:` variant and CSS `var()` references. The only time `useTheme()` would be called is if a component needs to know the current theme for logic (not styling), which is unlikely in this portfolio.

### CSS Variable Architecture

```css
/* Light mode (default) */
:root {
  --blue-primary: #3b82f6;
  --blue-primary-soft: #60a5fa;
  --bg-base: #ffffff;
  --bg-surface: #f8fafc;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #94a3b8;
  --border-default: #e2e8f0;
  --gradient-hero-from: #dbeafe;
  --gradient-hero-to: #ffffff;
}

/* Dark mode */
.dark {
  --blue-primary: #60a5fa;
  --blue-primary-soft: #93c5fd;
  --bg-base: #0f172a;
  --bg-surface: #1e293b;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --border-default: #334155;
  --gradient-hero-from: #1e3a5f;
  --gradient-hero-to: #0f172a;
}

@theme inline {
  --color-primary: var(--blue-primary);
  --color-surface: var(--bg-surface);
  /* ...etc */
}
```

This replaces the current oklch cleanroom palette. The `@custom-variant dark (&:is(.dark *))` line already in `app.css` enables `dark:` utilities, but the current CSS has no `.dark` variable overrides. v1.2 adds them.

### Animated Gradient Hero Data Flow

```
CSS keyframes (breathing animation)
    |
    v
Two layered radial-gradient divs
    |
    Layer 1: Static gradient (always visible)
    Layer 2: Offset gradient, opacity oscillates 0 -> 0.6 -> 0 via keyframes
    |
    v
Composited by GPU (opacity is compositor-friendly -- no repaints)
    |
    v
prefers-reduced-motion: reduce -> animation: none (CSS only)
```

No JavaScript drives the gradient animation. Pure CSS with `@keyframes`. This aligns with the existing `animate-aurora` keyframe pattern already in `app.css` (which will be replaced). The breathing effect uses the opacity-layering technique because animating `background-position` or `background-size` on gradients triggers expensive repaints. Opacity animation is GPU-composited.

### AnimatedTabs State Flow

```
User clicks tab "RF" or "Digital"
    |
    v
SkillsAndTooling: setActiveTab("rf")
    |
    v
AnimatedTabs renders:
  - All tab buttons with layoutId-aware pill indicator
  - motion.div with layoutId="active-pill" animates to new position
    |
    v
Tab panel content:
  - AnimatePresence crossfades between domain content
  - Skill list for active domain renders with fadeUpVariant
    |
    v
Data source: merged skillGroups + toolingGroups from existing data files
  - Each tab = one engineering domain
  - Tab content = skills + tools for that domain
```

The AnimatedTabs pattern uses Motion's `layoutId` for the sliding pill indicator -- the standard approach documented by Motion and used by buildui.com. No external tab library needed. The glassmorphic effect is achieved with `backdrop-filter: blur()` + semi-transparent background + border, all in Tailwind utilities.

### Embla Carousel Integration Flow

```
ProjectCarousel mounts
    |
    v
useEmblaCarousel({ loop: false, align: 'start' })
  returns [emblaRef, emblaApi]
    |
    v
Carousel DOM:
  <div ref={emblaRef} class="overflow-hidden">   (viewport)
    <div class="flex touch-action-pan-y">         (container)
      {sortedProjects.map(p => (
        <div class="flex-[0_0_80%] md:flex-[0_0_45%]">  (slide)
          <ProjectCard project={p} />
        </div>
      ))}
    </div>
  </div>
    |
    v
Navigation: prev/next buttons call emblaApi.scrollPrev()/scrollNext()
Dots: emblaApi.scrollSnapList() + onSelect event for active dot
    |
    v
Featured project sorting: projects.sort((a,b) => b.featured - a.featured)
  ensures featured projects appear in the first slide positions
```

Key Lenis interaction: Embla handles horizontal touch/drag internally via `touch-action: pan-y pinch-zoom` on the container, which tells the browser "vertical scrolling is handled by the page (Lenis), horizontal gestures belong to the carousel." This is the standard embla CSS. No special Lenis configuration needed.

### Scroll-Triggered SVG Timeline Flow

```
TimelineV2 mounts
    |
    v
useScroll({ target: containerRef, offset: ['start 0.7', 'end 0.5'] })
  returns { scrollYProgress }  (MotionValue<number> from 0 to 1)
    |
    v
SVG structure:
  <svg viewBox="0 0 24 {totalHeight}">
    <!-- Track line (faint, always visible) -->
    <path d="M 12 0 V {totalHeight}" stroke="var(--border-default)" />

    <!-- Animated progress line (draws on scroll) -->
    <motion.path
      d="M 12 0 V {totalHeight}"
      stroke="var(--blue-primary)"
      strokeWidth={2}
      pathLength={scrollYProgress}  // directly bound to scroll
      style={{ pathLength: scrollYProgress }}
    />

    <!-- Glow nodes at milestone positions -->
    {milestones.map((m, i) => (
      <TimelineNode
        y={nodePositions[i]}
        isActive={scrollProgress >= threshold[i]}
        milestone={m}
      />
    ))}
  </svg>
    |
    v
Glow effect on nodes:
  - CSS box-shadow with blue-primary color
  - Opacity/scale transition on isActive state change
  - SVG <circle> with filter: drop-shadow() for glow
```

This replaces the current div-based timeline. The key difference: the current timeline uses a `motion.div` with `scaleY` for the progress line. The new version uses an actual SVG `<path>` with `pathLength` driven by `scrollYProgress`, giving smoother rendering and enabling the glow-node effect. Motion's `pathLength` animation is GPU-composited.

Lenis compatibility: Motion's `useScroll` works with Lenis because both use the same `scrollY` value from the Lenis-managed scroll position. The existing codebase already has this working (current Timeline.tsx uses `useScroll` with Lenis active).

## Architectural Patterns

### Pattern 1: CSS-Only Theme Switching

**What:** All theme-dependent colors are CSS custom properties. Theme changes toggle a class on `<html>`, causing all `var()` references to re-resolve. Zero React re-renders for color changes.

**When to use:** Always for visual theming. Components should never use `useTheme()` for deciding colors -- use `dark:` Tailwind utilities or `var(--token-name)` in style props.

**Trade-offs:**
- Pro: Near-instant theme switch with no VDOM diffing
- Pro: CSS variables compose with Tailwind's `dark:` variant naturally
- Pro: Works with `prefers-color-scheme` media query at the CSS level too
- Con: Cannot do complex logic based on theme (but this portfolio does not need to)

**Example:**
```tsx
// Good -- uses Tailwind dark: variant
<h2 className="text-primary dark:text-primary">Title</h2>

// Good -- uses CSS variables that change with theme
<div style={{ background: 'var(--bg-surface)' }}>...</div>

// Bad -- unnecessary JS coupling
const { theme } = useTheme();
<h2 className={theme === 'dark' ? 'text-white' : 'text-black'}>Title</h2>
```

### Pattern 2: GPU-Composited Gradient Animation

**What:** Animate gradient breathing by layering two gradient divs and oscillating the top layer's `opacity`, rather than animating `background-position` or `background-size`.

**When to use:** Animated gradient hero background, and any future animated gradient effects.

**Trade-offs:**
- Pro: `opacity` is composited on the GPU without triggering repaints
- Pro: Smooth 60fps even on mobile
- Con: Requires two DOM elements instead of one

**Example:**
```tsx
function AnimatedGradientBg() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Base gradient -- always visible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--gradient-hero-from),var(--gradient-hero-to))]" />
      {/* Breathing layer -- opacity pulses */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--blue-primary-soft)/20,transparent_70%)] animate-breathe" />
    </div>
  );
}
```

```css
@keyframes breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
.animate-breathe {
  animation: breathe 8s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .animate-breathe { animation: none; opacity: 0.5; }
}
```

### Pattern 3: Motion layoutId for Tab Indicators

**What:** Use Motion's `layoutId` prop on the active tab's pill/underline element. When the active tab changes, Motion automatically animates the indicator from old position to new position.

**When to use:** AnimatedTabs component for skills/tooling section.

**Trade-offs:**
- Pro: Smooth, spring-based animation with zero manual position calculation
- Pro: The `layoutId` system is built into Motion (already a dependency)
- Con: Requires AnimatePresence or LayoutGroup ancestor for proper cleanup

**Example:**
```tsx
function AnimatedTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="relative flex gap-1 rounded-xl bg-surface/50 p-1 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative z-10 px-4 py-2 text-sm"
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab-pill"
              className="absolute inset-0 rounded-lg bg-white/80 dark:bg-white/10 shadow-sm backdrop-blur"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

### Pattern 4: Embla Carousel with Lenis Coexistence

**What:** Use `touch-action: pan-y pinch-zoom` on the embla container to delegate vertical scrolling to Lenis while embla handles horizontal drag gestures. No Lenis configuration changes needed.

**When to use:** Any horizontal carousel embedded in the vertical scroll page.

**Trade-offs:**
- Pro: Browser-native gesture disambiguation (no JS conflict resolution)
- Pro: Embla's wheel-gestures plugin is NOT needed (avoid it -- it would conflict with Lenis's wheel handling)
- Con: Mouse wheel does not scroll the carousel horizontally (by design -- wheel stays vertical for page scroll)

### Pattern 5: Scroll-Linked SVG pathLength

**What:** Bind an SVG path's `pathLength` style property directly to a `useScroll` motion value. The path draws progressively as the user scrolls through the timeline section.

**When to use:** Timeline progress visualization.

**Trade-offs:**
- Pro: Zero JavaScript per-frame -- Motion optimizes to CSS or native ScrollTimeline where available
- Pro: Silky smooth because pathLength is compositor-friendly
- Con: SVG path must have `pathLength="1"` attribute and `stroke-dasharray="1"` + `stroke-dashoffset="1"` for the technique to work correctly

**Example:**
```tsx
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start 0.7', 'end 0.5'],
});

<motion.path
  d={`M 12 0 V ${totalHeight}`}
  stroke="var(--blue-primary)"
  strokeWidth={2}
  fill="none"
  pathLength="1"
  style={{
    pathLength: scrollYProgress,
    strokeDasharray: 1,
    strokeDashoffset: 0,
  }}
/>
```

## Anti-Patterns

### Anti-Pattern 1: JavaScript-Driven Theme Colors

**What people do:** Use `useTheme()` in every component to conditionally set colors based on the current theme string.

**Why it's wrong:** Creates unnecessary React re-renders on every theme change. Every component that calls `useTheme()` re-renders when theme toggles, even though CSS variables handle this automatically.

**Do this instead:** Define all theme-dependent colors as CSS custom properties with `:root` and `.dark` blocks. Use Tailwind's `dark:` variant or `var()` in styles. The ThemeProvider only manages the `.dark` class on `<html>`.

### Anti-Pattern 2: Animating background-image or background-size for Gradient Effects

**What people do:** Use CSS `@keyframes` that animate `background-size: 200% 200%` or `background-position` on a gradient.

**Why it's wrong:** Forces the browser to recalculate and repaint the gradient every frame. This runs on the main thread, not the GPU compositor. Causes jank on mobile and lower-powered devices.

**Do this instead:** Layer two gradient elements and animate `opacity` on the top layer. Opacity animation is GPU-composited and runs at 60fps without main thread involvement.

### Anti-Pattern 3: Using embla-carousel-wheel-gestures with Lenis

**What people do:** Install `embla-carousel-wheel-gestures` plugin to allow mouse wheel to scroll the carousel horizontally.

**Why it's wrong:** The wheel-gestures plugin intercepts wheel events, which directly conflicts with Lenis's wheel event handling for smooth vertical scroll. This creates a fight between two scroll handlers, resulting in janky scroll and inconsistent behavior.

**Do this instead:** Let the carousel be navigable only via touch/drag and navigation buttons. Mouse wheel scrolls the page vertically (handled by Lenis). This is the expected UX for a horizontal carousel in a vertical page.

### Anti-Pattern 4: Wrapping Each Section in its Own Background Component

**What people do:** Give each section (WhoAmI, Skills, Timeline, etc.) its own gradient/noise background component with different colors.

**Why it's wrong:** Creates visible "seams" between sections where background gradients meet. The v1.2 design goal is a unified, seamless background across all sections.

**Do this instead:** Use a single `UnifiedBackground` component that spans the entire page, with one smooth gradient that responds to theme changes. Individual sections have transparent backgrounds and sit on top of the unified layer.

### Anti-Pattern 5: Using next-themes in a Vite SPA

**What people do:** The `next-themes` package is in `package.json` (installed by shadcn). Developers try to use `ThemeProvider` from `next-themes`.

**Why it's wrong:** `next-themes` has Next.js-specific code paths (for App Router, script injection into `_document`, etc.) that do not work correctly in a Vite SPA. It will either crash or produce unexpected behavior (theme flash, missing system preference detection).

**Do this instead:** Use the custom ThemeProvider pattern from shadcn/ui's Vite dark mode guide. It is 40 lines of code, uses `createContext` + `matchMedia`, and has no framework dependencies. Remove `next-themes` from `package.json` to avoid confusion.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| ThemeProvider <-> Components | CSS class on `<html>` + CSS variables | One-way: provider sets class, CSS handles the rest |
| AnimatedTabs <-> Data files | Direct import of `skillGroups` + `toolingGroups` | Same data files, new presentation |
| Embla carousel <-> Lenis | `touch-action` CSS | No JavaScript bridge needed |
| SVG Timeline <-> Motion useScroll | MotionValue binding to SVG pathLength | Same pattern as existing Timeline.tsx |
| UnifiedBackground <-> Sections | CSS stacking context (z-index) | Background is z-0, content is z-10 |
| Navigation <-> Merged sections | Updated section IDs in nav data | `navigation.ts` must update section refs |

### Admin Panel Impact

The v1.1 admin panel writes to `src/data/*.ts` files. v1.2 changes:

| Admin Editor | Impact | Action Needed |
|-------------|--------|---------------|
| Skills editor | Data structure unchanged | No admin changes |
| Tooling editor | Data structure unchanged | No admin changes |
| Timeline editor | Data structure unchanged | No admin changes |
| Contact editor | Data structure unchanged; UI layout changes | No admin changes (data drives new layout) |
| Navigation editor | Section IDs change (skills+tooling merged) | Update default navigation data after merge |
| Hero editor | Data structure unchanged | No admin changes |

The admin panel's live preview (iframe) will automatically show v1.2 changes because it loads the portfolio through Vite HMR. No admin code modifications required for v1.2 features.

## Recommended Build Order

Build order is driven by dependency chains and testability. Each phase can be verified before proceeding.

| Order | Component/Task | Depends On | Rationale |
|-------|---------------|------------|-----------|
| **1** | **CSS theme system** -- Replace oklch palette with hex-based blue-primary variables in `app.css`; add `:root` and `.dark` blocks; update `@theme inline` | Nothing | Foundation. Every subsequent component references these variables. Can be tested by manually adding `.dark` class to `<html>` in devtools. |
| **2** | **ThemeProvider** -- Create `ThemeProvider.tsx` with system-preference detection; wrap App.tsx | CSS theme system (#1) | Activates the `.dark` class toggle. Immediately testable by changing OS preference. |
| **3** | **UnifiedBackground** -- Single gradient background replacing per-section NoisyBackground | CSS theme system (#1) | Removes visual seams between sections. Must be in place before touching individual sections. |
| **4** | **AnimatedGradientBg** -- Hero breathing gradient | CSS theme system (#1), UnifiedBackground (#3) | Hero is the first thing visitors see. Establishes the visual identity. |
| **5** | **Update existing sections** -- Migrate Hero, HeroContent, WhoAmI, Navigation color classes from oklch to semantic tokens; remove NoisyBackground wrappers | CSS theme system (#1), UnifiedBackground (#3) | Ensures all surviving sections work with new theme before adding new components. |
| **6** | **AnimatedTabs + SkillsAndTooling** -- Build tab component, merge skills+tooling into single section | Motion (existing), skills/tooling data (existing) | Self-contained feature. Removes two sections, adds one. Update navigation data. |
| **7** | **ProjectCarousel** -- Replace bento grid with embla-carousel | embla-carousel-react (new dep), existing ProjectCard | Significant layout change. Requires removing LayoutGroup and expand/collapse behavior from ProjectCard. |
| **8** | **TimelineV2** -- SVG path timeline with glow nodes and scroll-triggered drawing | Motion useScroll (existing) | Replaces existing Timeline.tsx. Can reuse scroll offset tuning from current implementation. |
| **9** | **ContactFooter** -- "Let's Work Together" redesign | CSS theme system (#1), existing contact data | Footer is low-risk, independent of other features. |
| **10** | **Cleanup** -- Remove deprecated components (NoisyBackground references, AnimatedGridPattern, old Skills/Tooling/Timeline/Contact); remove `next-themes` from package.json; update tests | All above | Final sweep. Run `vite build` to verify production bundle. |

### Phase Dependency Graph

```
[1] CSS Theme System
 |
 +---> [2] ThemeProvider
 |
 +---> [3] UnifiedBackground ---> [4] AnimatedGradientBg (hero)
 |          |
 |          +---> [5] Migrate existing sections
 |                     |
 |                     +---> [6] AnimatedTabs + SkillsAndTooling
 |                     |
 |                     +---> [7] ProjectCarousel (new dep: embla)
 |                     |
 |                     +---> [8] TimelineV2
 |                     |
 |                     +---> [9] ContactFooter
 |
 +---> [10] Cleanup (after all above)
```

Steps 6, 7, 8, and 9 are independent of each other and can be built in any order after step 5 completes. The recommended order (6 -> 7 -> 8 -> 9) is based on visual impact and complexity.

## Scaling Considerations

| Concern | Current Scale | Notes |
|---------|--------------|-------|
| Carousel slide count | 4 projects | Embla handles 50+ slides without performance issues. No concern. |
| Timeline node count | 8 milestones | SVG with 8 circles + one path. Trivial. Could handle 100+ nodes. |
| Theme switch performance | Instant | CSS variable resolution is O(1). No React re-renders for color changes. |
| Animation frame budget | 60fps target | All animations use compositor-friendly properties (opacity, transform, pathLength). No layout-triggering properties animated. |
| Bundle size impact | +~8KB (embla-carousel-react) | Embla is the only new dependency. ThemeProvider is ~40 lines. Everything else uses existing Motion + Tailwind. |

## New Dependency

| Package | Version | Size | Purpose | Why This One |
|---------|---------|------|---------|-------------|
| `embla-carousel-react` | ^8.x | ~8KB gzip | Horizontal project carousel | Lightweight, zero-dependency, perfect touch handling, widely adopted. shadcn/ui uses embla for its carousel component. Already aligned with project's dependency philosophy. |

**Remove:** `next-themes` from `package.json` (installed by shadcn init but never imported; incompatible with Vite SPA)

## Sources

- [Tailwind v4 Dark Mode documentation](https://tailwindcss.com/docs/dark-mode) -- custom-variant, prefers-color-scheme, class strategy -- HIGH confidence
- [Tailwind v4 Theme Variables](https://tailwindcss.com/docs/theme) -- @theme inline, CSS variable integration -- HIGH confidence
- [Tailwind v4 dark mode CSS variables discussion](https://github.com/tailwindlabs/tailwindcss/discussions/15083) -- :root / .dark variable pattern with @theme inline -- MEDIUM confidence
- [shadcn/ui Vite Dark Mode guide](https://ui.shadcn.com/docs/dark-mode/vite) -- ThemeProvider implementation for Vite apps -- HIGH confidence
- [Motion SVG animation docs](https://motion.dev/docs/react-svg-animation) -- pathLength, line drawing -- HIGH confidence
- [Motion scroll animations docs](https://motion.dev/docs/react-scroll-animations) -- useScroll, useTransform, scroll-linked -- HIGH confidence
- [Embla Carousel React setup](https://www.embla-carousel.com/docs/get-started/react) -- hook API, DOM structure, CSS -- HIGH confidence
- [Embla + Framer Motion integration issues](https://github.com/davidjerleke/embla-carousel/issues/317) -- potential animation conflicts -- MEDIUM confidence
- [CSS gradient animation performance](https://digitalthriveai.com/en-us/resources/web-development/the-state-of-changing-gradients-with-css-transitions-and-animations/) -- opacity layering technique -- MEDIUM confidence
- [Web Animation Performance Tier List (Motion)](https://motion.dev/magazine/web-animation-performance-tier-list) -- compositor-friendly properties -- HIGH confidence
- [BuildUI Animated Tabs recipe](https://buildui.com/recipes/animated-tabs) -- layoutId pill pattern -- HIGH confidence
- [Lenis smooth scroll](https://github.com/darkroomengineering/lenis) -- Lenis + Motion integration -- HIGH confidence

---
*Architecture research for: v1.2 UI Polish & Interactivity*
*Researched: 2026-03-26*
