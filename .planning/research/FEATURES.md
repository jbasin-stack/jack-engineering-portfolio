# Feature Research: v1.2 UI Polish & Interactivity

**Domain:** Animated UI components, theming, and visual cohesion for an engineering portfolio
**Researched:** 2026-03-26
**Confidence:** HIGH

## Context

This research covers the v1.2 milestone: elevating the existing portfolio with animated gradient backgrounds, system-preference dark/light mode, animated glassmorphic tabs, horizontal project carousels, scroll-triggered vertical timelines with glowing SVG nodes, and a refreshed contact/footer layout.

**Existing stack:** Vite 8, React 19, Tailwind v4 (oklch colors), Motion 12 (the library formerly known as Framer Motion), Lenis smooth scroll, shadcn/ui (Base UI, not Radix), lucide-react icons.

**Existing patterns to preserve:**
- `MotionConfig reducedMotion="user"` at the App root (prefers-reduced-motion already handled)
- `sectionVariants` / `fadeUpVariant` / `easing.out` motion presets in `src/styles/motion.ts`
- `NoisyBackground` wrapper with SVG feTurbulence noise textures
- `useScroll` + `useMotionValueEvent` for scroll-driven timeline (already implemented in v1.0)
- oklch color space throughout; all colors defined as CSS custom properties in `app.css`
- `@custom-variant dark (&:is(.dark *))` already defined in CSS but unused
- `next-themes` installed as dependency but not imported anywhere

**Key user preferences:**
- "Less, but better" -- Dieter Rams / Jony Ive minimalism. No bouncy animations, no visual clutter.
- 21st.dev MCP is the primary source for premium React components during execution.
- Hates particle effects, 3D backgrounds, and anything that distracts from content.
- Portfolio targets recruiters AND grad school -- equal weight on both audiences.

---

## Table Stakes

Features visitors expect from a polished 2026 engineering portfolio. Missing these means the site looks dated or incomplete.

| Feature | Why Expected | Complexity | Dependencies on Existing |
|---------|--------------|------------|--------------------------|
| **System-preference dark/light mode** | Every modern portfolio respects OS theme. Recruiters browsing at night in dark mode expect the site to follow. Without it, a light-only site feels like a blast of white in a dark-mode workflow. | MEDIUM | `@custom-variant dark` already defined in `app.css`. `next-themes` already in `package.json`. All shadcn/ui components already have `dark:` utility classes. Requires: defining dark-mode CSS variable values for the oklch cleanroom palette, wiring ThemeProvider around App, NO toggle UI (system-only per PROJECT.md scope). |
| **Unified consistent background** | Hard color breaks between sections (different `gradientFrom`/`gradientTo` per NoisyBackground wrapper) look fragmented. A cohesive background that flows smoothly section-to-section is table stakes for premium portfolios in 2026. | LOW | Currently Skills and Tooling use `NoisyBackground` with different gradient endpoints. Hero has no background. Timeline uses `AnimatedGridPattern`. Contact has a subtle purple gradient. All of these need to blend into one continuous visual. |
| **Horizontal project carousel** | The current bento grid (3-col on desktop, 1-col on mobile) works but doesn't showcase projects as prominently as a Gallery6-style horizontal carousel with featured project in first position. Horizontal carousels are the dominant pattern for project showcases in 2026 portfolios. | MEDIUM | Replaces `ProjectsSection.tsx` grid layout. Must preserve: project detail Dialog/Drawer, data structure (`Project[]` with `featured` boolean), existing Motion fade-up entrance. New dependency: `embla-carousel-react`. References 21st.dev `shadcnblockscom/gallery6` component. |
| **Animated tab interface for Skills & Tooling** | Skills and Tooling are currently two separate sections with identical layouts (title + grid of domain lists). Merging them into a single tabbed section reduces scroll length and lets users explore by domain. Animated tabs with a sliding indicator are the expected UX for this pattern. | MEDIUM | Merges `Skills.tsx` and `Tooling.tsx` into a single component. Data: 4 skill domains + 3 tooling categories = 7 tabs (or group into ~4-5 combined domain tabs). Uses Motion `layoutId` for the sliding active indicator. Replaces two `NoisyBackground`-wrapped sections with one. |
| **Refreshed "Let's Work Together" contact + footer** | The current contact section is functional but centers everything vertically with a CTA-heavy layout. A "Let's Work Together" header with clean direct links (email, LinkedIn, GitHub) and a minimal footer is the 2026 portfolio standard. | LOW | Replaces `Contact.tsx`. Must preserve: resume PDF viewer trigger, email link, social links from `contactData`, `LazyPdfViewer` integration. Layout change only -- no new data structures needed. |

## Differentiators

Features that elevate this portfolio beyond "competent" to "memorable." Not every portfolio has these, and they create a visceral impression.

| Feature | Value Proposition | Complexity | Dependencies on Existing |
|---------|-------------------|------------|--------------------------|
| **Animated radial gradient hero background** | A breathing, pulsing gradient behind the hero text creates an immediate "this person cares about craft" impression. The gradient subtly shifts scale/opacity on an infinite loop, suggesting life without distracting from the typography-first hero. This is the first thing visitors see -- it sets the tone. | MEDIUM | Adds a background layer to `Hero.tsx` (currently has a TODO comment for hero background). Must NOT conflict with the existing `HeroContent` z-index layering. Implementation: CSS `@keyframes` animating `opacity` between two layered radial gradients (NOT animating `background-size` which jitters in Chrome). Blue-themed to match the new palette. Respect `prefers-reduced-motion` via `MotionConfig reducedMotion="user"` already in place. |
| **Vertical timeline with glowing SVG nodes** | The current timeline uses CSS dots and a `scaleY`-driven fill line. Upgrading to SVG path drawing with glowing nodes (box-shadow or SVG filter glow) and scroll-triggered connection lines creates a much more dynamic visual experience. Each node lights up as you scroll past, with the connecting line drawing itself progressively. | HIGH | Replaces the existing `Timeline.tsx`. Must preserve: `milestones[]` data, scroll-driven activation logic (already uses `useScroll` + `useMotionValueEvent`). New: SVG `<path>` with `pathLength` animation driven by `scrollYProgress`, glow effects via `box-shadow` or SVG `feGaussianBlur` filter, animated node transitions. The existing scroll offset logic (`['start 0.8', 'end 0.6']`) can be reused. |
| **Glassmorphic tab panels** | Adding `backdrop-blur` + semi-transparent backgrounds to the tab content panels (not just the tab bar) creates depth without violating minimalism. Content appears to float above the unified background. | LOW | CSS-only on the tab content container: `bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-white/20 rounded-xl`. Must test against the unified background to ensure contrast. |
| **Featured project emphasis in carousel** | The first carousel position shows the featured project with a larger card or visual emphasis (e.g., slightly wider, accent border, "Featured" badge). Uses the existing `featured: boolean` field in the Project type. | LOW | Conditional styling on the first carousel slide based on `project.featured`. Embla's `startIndex` option can ensure featured projects appear first. Sorting `projects[]` by `featured` descending before rendering handles data ordering. |
| **Smooth dark-mode color transitions** | When the OS theme switches (user toggles system dark mode), colors transition smoothly (300ms CSS transition on `background-color`, `color`, `border-color`) rather than snapping instantly. | LOW | CSS `transition` on `:root` and `.dark` class changes. Pure CSS, no JS needed. |

## Anti-Features

Features to explicitly NOT build. These either violate the design philosophy, add disproportionate complexity, or are explicitly out of scope per PROJECT.md.

| Anti-Feature | Why It Seems Useful | Why Avoid | What to Do Instead |
|--------------|---------------------|-----------|-------------------|
| **Manual dark/light toggle button** | Users might want to override system preference. | Explicitly descoped in PROJECT.md: "Dark mode toggle -- replaced by automatic system-preference matching in v1.2." Adds UI complexity (dropdown menu, icon button in nav) for a feature the user decided against. System-preference-only is simpler and more opinionated. | Let `prefers-color-scheme` drive everything. If a toggle is wanted later, it's a v2 addition. |
| **Aurora/mesh gradient background** | Aceternity-style aurora gradients are trendy and eye-catching. | Previously built (`AuroraBackground.tsx` exists) and explicitly removed: "Hero aurora removed -- user found too distracting." The animated radial gradient is the replacement -- subtler, less movement, content stays in focus. | Radial gradient with opacity-based breathing animation. Two overlapping radial gradients, one fading in/out. |
| **Particle effects or 3D backgrounds** | Three.js / react-three-fiber backgrounds look impressive. | Explicitly in PROJECT.md out-of-scope: "Particle effects / 3D backgrounds -- contradicts minimalist philosophy." Also: `Particles.tsx` component exists but is unused. The user hates visual clutter. | Keep the hero background to a single subtle gradient animation. Let typography carry the design. |
| **GSAP ScrollTrigger for timeline** | GSAP has more precise scrubbing control and supports complex SVG sequences. | The project already uses Motion (framer-motion) for ALL animations. Adding GSAP would introduce a second animation library, doubling bundle size for animation (~15KB gzipped for GSAP core + ScrollTrigger). Motion's `useScroll` + `pathLength` can achieve the same SVG path drawing effect with the existing dependency. | Use Motion's `useScroll` to drive `pathLength` on SVG paths. The existing scroll infrastructure is already proven in the current Timeline component. |
| **Carousel autoplay** | Auto-advancing slides seem professional. | Autoplay on project carousels is an accessibility issue (WCAG requires pause control), annoys users who read at their own pace, and conflicts with the "physical-feeling" interaction philosophy. Projects deserve intentional viewing, not a slideshow. | Manual drag/swipe + arrow navigation. Let visitors control their own pace. |
| **Per-section background effects** | Each section could have its own unique background (grid, noise, gradient, etc.). | This is exactly what v1.0 does and what v1.2 is trying to fix. Per-section backgrounds create the "hard color breaks" mentioned in the requirements. The unified background is the goal. | One continuous background treatment that flows behind all sections. Individual sections contribute subtle variations (like the noise overlay on Skills) but don't define their own ground color. |
| **Framer Motion page transitions** | Animate content entering/exiting as you scroll between sections. | This is a single-page scroll app, not a routed multi-page app. There are no page transitions because there are no pages. Section entrance animations (fade-up via `whileInView`) already handle content revelation. | Keep existing `sectionVariants` + `fadeUpVariant` for section entrances. These are already tuned and working. |
| **Complex SVG morphing on timeline** | Timeline nodes could morph shapes (circle to checkmark, etc.) as they activate. | Over-engineered for the content. Timeline milestones are academic/professional events, not status indicators. Shape morphing requires `flubber` or similar library and adds visual noise. | Simple opacity/scale/glow transitions on fixed-shape nodes. A dot that glows when active is more elegant than a dot that transforms. |
| **Infinite loop carousel** | Projects could loop endlessly so users never hit an end. | With only 4 projects, infinite loop means seeing the same content repeat immediately. It's disorienting for small collections. Loop makes sense for 10+ items, not 4. | `loop: false` in Embla options. Show clear start/end states with disabled navigation arrows. |

## Feature Dependencies

```
[System Dark/Light Mode]
    |-- foundational -- CSS variables for dark theme must exist before components can use dark: utilities
    |-- requires --> dark oklch palette values in app.css
    |-- requires --> ThemeProvider wrapping App (custom, NOT next-themes for system-only)
    |-- enables --> all component dark mode styling

[Unified Background]
    |-- foundational -- must be in place before individual sections look right
    |-- replaces --> per-section NoisyBackground wrappers in Skills, Tooling
    |-- replaces --> AnimatedGridPattern background in Timeline
    |-- replaces --> gradient overlay in Contact
    |-- enables --> glassmorphic tab panels (need a visible background behind the blur)

[Animated Gradient Hero]
    |-- independent -- only touches Hero.tsx
    |-- requires --> [Unified Background] (gradient should blend into page background)
    |-- respects --> MotionConfig reducedMotion="user" (disable animation when reduced motion preferred)

[AnimatedTabs for Skills & Tooling]
    |-- requires --> [Unified Background] (glassmorphic panels need consistent ground)
    |-- merges --> Skills.tsx + Tooling.tsx data and components
    |-- uses --> Motion layoutId for sliding tab indicator
    |-- independent of --> dark mode (works in both, just needs dark: utility classes)

[Gallery6 Horizontal Carousel]
    |-- independent -- replaces ProjectsSection.tsx
    |-- new dependency --> embla-carousel-react
    |-- preserves --> ProjectDetail Dialog/Drawer (full detail view unchanged)
    |-- preserves --> Project data structure (featured boolean, images, links)
    |-- benefits from --> [Unified Background] (carousel cards float on consistent ground)

[Vertical Animated Timeline]
    |-- independent -- replaces Timeline.tsx
    |-- requires --> [Unified Background] (removes own AnimatedGridPattern background)
    |-- uses --> existing Motion useScroll infrastructure
    |-- new --> SVG path with pathLength animation
    |-- new --> Glow effects (CSS box-shadow or SVG filter)

[Contact/Footer Refresh]
    |-- independent -- replaces Contact.tsx
    |-- preserves --> LazyPdfViewer for resume viewing
    |-- preserves --> contactData structure
    |-- benefits from --> [Unified Background] (removes own gradient overlay)
```

### Critical Path

1. **Dark mode CSS variables** -- everything else needs to know what colors to use
2. **Unified background** -- every section redesign depends on a consistent ground
3. **Individual component rebuilds** (can be parallelized after 1 and 2):
   - Animated gradient hero
   - AnimatedTabs for Skills/Tooling
   - Gallery6 carousel for Projects
   - Animated timeline
   - Contact/footer refresh

## MVP Recommendation

### Launch With (v1.2 Core)

All seven features are in-scope for v1.2. Prioritize in this order based on dependencies and visual impact:

1. **System dark/light mode + dark CSS variables** -- foundational; unblocks `dark:` utilities everywhere
2. **Unified background** -- foundational; removes per-section color breaks
3. **Animated gradient hero** -- highest visual impact, sets the tone
4. **AnimatedTabs (Skills + Tooling merge)** -- reduces page length, modern interaction pattern
5. **Gallery6 carousel (Projects)** -- showcases projects more prominently
6. **Vertical animated timeline** -- most complex rebuild, benefits from established patterns
7. **Contact/footer refresh** -- simplest change, polish last

### Defer to v2+

- Manual dark/light toggle (if user requests it later)
- Testimonials/quotes section (needs content)
- Blog/notes system (content creation overhead)
- Project filtering in carousel (only 4 projects -- filter is overkill)

## Technical Implementation Notes

### 1. Animated Radial Gradient Hero

**Pattern:** Two overlapping radial gradients with staggered `opacity` animation via CSS `@keyframes`. This is the performance-safe approach -- animating `opacity` runs on the compositor thread (GPU-accelerated), unlike animating `background-size` which triggers layout recalculation and jitters in Chrome.

```css
@keyframes breathe {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

The two gradient layers use different animation durations (e.g., 8s and 12s) to create organic, non-repeating visual rhythm. Colors should use the new blue-primary palette at low saturation to avoid overwhelming the hero text.

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables the keyframe, leaving a static gradient. Already covered by `MotionConfig reducedMotion="user"` for Motion-driven animations, but this is pure CSS so needs its own media query.

**Confidence:** HIGH -- this pattern is well-documented and used by Aceternity UI, Vercel, and many premium portfolio sites.

### 2. System-Preference Dark/Light Mode

**Pattern:** Custom ThemeProvider (NOT next-themes) that defaults to `"system"` and uses `window.matchMedia("(prefers-color-scheme: dark)")` to detect preference. The shadcn/ui Vite dark mode guide provides the exact implementation pattern.

**Why not next-themes:** Although `next-themes` is installed, it's designed for Next.js and adds unnecessary complexity for a system-only Vite app. The custom ThemeProvider from the shadcn Vite docs is ~40 lines, does exactly what's needed, and can be stripped down further since there's no toggle (remove `localStorage` persistence, remove `setTheme` exposure).

**Dark palette strategy:** Map the existing oklch cleanroom palette to dark equivalents:
- `--color-cleanroom` (near-white) --> dark surface (oklch ~0.15)
- `--color-ink` (near-black) --> dark foreground (oklch ~0.95)
- `--color-accent` remains the same or slightly brighter for dark mode contrast
- `--color-silicon-*` scale inverts (600 becomes body text, 200 becomes borders)

The `@custom-variant dark (&:is(.dark *))` is already defined in `app.css`, so Tailwind's `dark:` utilities will work as soon as the `.dark` class is applied to `<html>`.

**Confidence:** HIGH -- this is the exact pattern from shadcn/ui official Vite dark mode docs.

### 3. AnimatedTabs for Skills & Tooling

**Pattern:** Motion `layoutId` on a background pill element that slides between tabs. When the active tab changes, the pill animates from the old tab position to the new one automatically -- no manual position calculation needed.

**Data merge strategy:** Skills has 4 domain groups (Fabrication, RF, Analog, Digital). Tooling has 3 category groups (EDA Tools, Lab Equipment, Fabrication Processes). These can be presented as 7 tabs, or more naturally merged into domain-aligned tabs:
- Fabrication (skills + processes)
- RF (skills + equipment)
- Analog (skills + EDA tools)
- Digital (skills + EDA tools)

The exact grouping should be decided during implementation based on content fit.

**Tab content:** Each tab panel shows a list of skills/tools for that domain, styled with glassmorphic container (`backdrop-blur-xl`, semi-transparent background, subtle border).

**Confidence:** HIGH -- Motion `layoutId` tab pattern is extensively documented on buildui.com, motion.dev tutorials, and 21st.dev component examples.

### 4. Gallery6 Horizontal Carousel

**Pattern:** Embla Carousel with horizontal axis, `dragFree: false` for snap points, `align: 'start'` to left-align the active slide. Each slide is a project card with image, title, brief, and domain tag. Navigation via prev/next arrow buttons with disabled states at boundaries.

**Featured project:** Sort `projects[]` to place `featured: true` items first. The featured card can have a slightly wider `flex-basis` or accent border to differentiate visually.

**Slide sizing:** `flex: 0 0 80%` on mobile (peek at next slide), `flex: 0 0 33.33%` on desktop (3 visible at once with partial peek of 4th). Adjust based on project count -- with 4 projects, desktop might show all without scrolling, which is fine.

**Integration with detail view:** Clicking a carousel card opens the same `ProjectDetail` Dialog/Drawer that the current bento grid uses. No change to the detail view itself.

**New dependency:** `embla-carousel-react` (~3.5KB gzipped, zero dependencies). Lightweight, headless, and the standard choice for React carousels in 2026.

**Confidence:** HIGH -- Embla is the most popular headless carousel for React, with ~800K weekly npm downloads. The Gallery6 pattern from 21st.dev uses Embla directly.

### 5. Vertical Animated Timeline with Glowing SVG Nodes

**Pattern:** Replace the CSS-dot-based timeline with an SVG-based layout:
- A vertical SVG `<path>` (straight line or slight curve) that draws itself progressively via `pathLength` animated from 0 to 1, driven by `useScroll`'s `scrollYProgress`.
- Circular SVG nodes at each milestone position that glow (via `box-shadow` on a positioned div, or `feGaussianBlur` SVG filter) when their threshold is reached.
- Content beside each node fades in with the existing `translate-y-2 opacity-0` --> `translate-y-0 opacity-100` transition.

**Scroll integration:** The existing pattern (`useScroll` with `target: containerRef`, `useMotionValueEvent` to derive per-node activation) is directly reusable. The key change is replacing `motion.div` with `scaleY` with `motion.path` with `pathLength`.

```tsx
<motion.path
  d="M 0 0 L 0 500"
  style={{ pathLength: scrollYProgress }}
  strokeWidth={2}
  stroke="currentColor"
  fill="none"
/>
```

**Glow effect:** CSS `box-shadow: 0 0 12px 4px oklch(0.55 0.15 250 / 0.6)` on the active node creates a soft glow in the accent color. For dark mode: increase glow opacity/spread since glow is more visible on dark backgrounds.

**Confidence:** HIGH -- Motion's SVG pathLength + useScroll is officially documented with examples on motion.dev.

### 6. Unified Background

**Pattern:** Remove per-section background wrappers. Apply a single gradient background to `<body>` or the `<main>` element that transitions smoothly from hero gradient through neutral mid-tones to a subtle footer tone. Individual sections contribute transparent overlays (noise texture, subtle tint) but never define their own base color.

**Implementation:**
- Remove `NoisyBackground` wrappers from Skills and Tooling sections
- Remove `AnimatedGridPattern` from Timeline section
- Remove gradient overlay from Contact section
- Apply a continuous vertical gradient to the page body
- Optionally keep noise texture as a global overlay at very low opacity

**Dark mode:** The unified background gradient shifts from light neutral tones to dark neutral tones. Same gradient structure, different color stops.

**Confidence:** HIGH -- standard CSS gradient on body/main element.

### 7. Contact/Footer Refresh

**Pattern:** "Let's Work Together" heading with a more horizontal layout: email prominently displayed, social links (GitHub, LinkedIn) as icon buttons, resume view/download buttons. Clean footer below with copyright and a subtle "Built with React" or similar minimal attribution.

**Layout change:** Current layout is vertically stacked and centered. New layout should be wider, possibly two-column on desktop (call-to-action left, links right), single-column centered on mobile.

**Preserved functionality:** Resume PDF viewer (LazyPdfViewer), email link, social links, download button. All data-driven from `contactData`.

**Confidence:** HIGH -- layout-only change with no new dependencies.

## Feature Prioritization Matrix

| Feature | Visual Impact | Implementation Cost | Risk | Priority |
|---------|--------------|---------------------|------|----------|
| System dark/light mode | HIGH | MEDIUM | LOW | P0 (foundational) |
| Unified background | HIGH | LOW | LOW | P0 (foundational) |
| Animated gradient hero | HIGH | LOW | LOW | P1 |
| AnimatedTabs (Skills/Tooling) | MEDIUM | MEDIUM | LOW | P1 |
| Gallery6 carousel (Projects) | HIGH | MEDIUM | MEDIUM | P1 |
| Vertical animated timeline | MEDIUM | HIGH | MEDIUM | P2 |
| Contact/footer refresh | LOW | LOW | LOW | P2 |

**Priority key:**
- P0: Foundational -- must ship before any other feature looks correct
- P1: High-impact visual features that define the v1.2 experience
- P2: Polish features that complete the milestone but don't block others

## Complexity Budget

Total estimated complexity for v1.2 (all 7 features): **MEDIUM-HIGH**

| Feature | New Code (est.) | Modified Files | New Dependencies |
|---------|----------------|----------------|------------------|
| Dark mode | ~60 LOC (ThemeProvider + CSS vars) | `app.css`, `App.tsx`, `main.tsx` | None (drop unused `next-themes`) |
| Unified background | ~20 LOC (CSS changes) | `app.css`, `Skills.tsx`, `Tooling.tsx`, `Timeline.tsx`, `Contact.tsx` | None |
| Gradient hero | ~40 LOC (CSS keyframes + wrapper div) | `Hero.tsx`, `app.css` | None |
| AnimatedTabs | ~120 LOC (new component) | New file, removes `Skills.tsx` + `Tooling.tsx`, `App.tsx` | None |
| Gallery6 carousel | ~150 LOC (new component) | New file, replaces `ProjectsSection.tsx`, `App.tsx` | `embla-carousel-react` |
| Animated timeline | ~130 LOC (rewrite) | `Timeline.tsx` | None |
| Contact refresh | ~80 LOC (rewrite) | `Contact.tsx` | None |
| **Total** | **~600 LOC** | **~12 files** | **1 new (embla)** |

This is a moderate scope increase to the existing ~7,700 LOC codebase (~8% growth).

## Sources

### HIGH Confidence (Official Documentation)
- [Motion SVG Animation -- pathLength](https://motion.dev/docs/react-svg-animation) -- SVG line drawing with pathLength, pathSpacing, pathOffset
- [Motion useScroll](https://motion.dev/docs/react-use-scroll) -- scroll-linked animation hooks for timeline
- [Motion Layout Animations -- layoutId](https://motion.dev/docs/react-layout-animations) -- shared element transitions for animated tabs
- [Embla Carousel React Setup](https://www.embla-carousel.com/docs/get-started/react) -- useEmblaCarousel hook API
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode) -- dark variant configuration
- [shadcn/ui Vite Dark Mode](https://ui.shadcn.com/docs/dark-mode/vite) -- custom ThemeProvider for Vite apps

### MEDIUM Confidence (Verified Patterns)
- [21st.dev Gallery6](https://21st.dev/community/components/shadcnblockscom/gallery6) -- horizontal carousel pattern using Embla with featured cards
- [21st.dev Animated Tabs](https://21st.dev/s/tabs) -- 38 tab components including animated shifting patterns
- [Build UI Animated Tabs Recipe](https://buildui.com/recipes/animated-tabs) -- layoutId-based sliding indicator
- [Melanie Richards: Fun with Animated Gradients](https://melanie-richards.com/blog/animating-gradients/) -- opacity-based gradient animation performance guidance
- [CSS-Tricks: prefers-reduced-motion](https://css-tricks.com/almanac/rules/m/media/prefers-reduced-motion/) -- accessibility for animated content

### LOW Confidence (Community Patterns, Verify During Implementation)
- [Aceternity UI Background Gradient Animation](https://ui.aceternity.com/components/background-gradient-animation) -- breathing gradient examples
- [Scroll SVG Path with Framer Motion](https://dev.to/heres/scroll-svg-path-with-framer-motion-54el) -- combining useScroll with SVG pathLength

---
*Feature research for: v1.2 UI Polish & Interactivity milestone*
*Researched: 2026-03-26*
