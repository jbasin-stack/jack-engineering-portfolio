# Stack Research: v1.2 UI Polish & Interactivity

**Domain:** Portfolio visual upgrade -- animated gradient hero, dark/light mode, carousel, animated timeline, glassmorphic tabs
**Researched:** 2026-03-26
**Confidence:** HIGH

## Context

This research covers ONLY the new libraries, CSS techniques, and configuration changes needed for v1.2. The existing validated stack (Vite 8, React 19, Tailwind v4, Motion 12, Lenis, shadcn/ui with Base UI, react-pdf, Zod v4, react-resizable-panels, sonner, Vercel) is not re-evaluated. The v1.1 admin panel additions (react-hook-form, @hookform/resolvers, react-dropzone, busboy) are also not revisited.

## Recommended Stack Additions

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| embla-carousel-react | ^8.6.0 | Horizontal project carousel (Gallery6 pattern) | Lightweight (3.4KB gzipped), hook-based API (`useEmblaCarousel`), zero UI opinions so it pairs seamlessly with existing Tailwind + Motion styling. Explicitly supports React 19 in peer deps (`^19.0.0`). 6M+ weekly downloads, the de facto carousel for shadcn/ui ecosystems. The project needs swipe-capable horizontal scroll with dot navigation and featured-first ordering -- Embla's snap-point system handles this perfectly. |
| embla-carousel | ^8.6.0 | Core engine (auto-installed as dependency of embla-carousel-react) | Not installed directly -- pulled in as a dependency. Listed here for version awareness. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| embla-carousel-autoplay | ^8.6.0 | Optional auto-advance for project carousel | Only if the design calls for auto-scrolling between project cards. The Gallery6 reference does not require it -- omit unless user requests it. Can be added later without API changes. |

### CSS-Only Capabilities (No New Libraries)

The remaining v1.2 features require **zero new npm packages**. They are achievable with the existing stack:

| Feature | Approach | Why No Library Needed |
|---------|----------|----------------------|
| Animated radial gradient hero | CSS `@property` + `@keyframes` on oklch color stops | CSS `@property` has 96% browser support. Animating registered custom properties (typed as `<color>`) produces smooth gradient color interpolation on the compositor thread -- no JS frame loop. The existing oklch color system maps directly. |
| System-preference dark/light mode | Tailwind v4 default `dark:` variant (media strategy) + CSS variable overrides in `:root` / `@media (prefers-color-scheme: dark)` | Tailwind v4 uses `prefers-color-scheme` by default with zero config. The current `@custom-variant dark (&:is(.dark *))` line must be **removed** to restore the default media-query behavior. No JS theme provider needed -- PROJECT.md explicitly scopes out manual toggle. |
| Animated glassmorphic tabs | Motion `layoutId` for active tab indicator + CSS `backdrop-filter: blur()` | Motion 12 (already installed) provides `layoutId` for shared layout animations. `backdrop-filter` has 95%+ browser support. No tab library needed -- build with Base UI or raw `<button>` + `role="tablist"`. |
| Scroll-triggered timeline with glowing SVG nodes | Motion `useScroll`, `useTransform`, `motion.path` with `pathLength`, SVG `filter` for glow | Motion 12 already provides all scroll-linked animation primitives (`useScroll`, `useTransform`, `useMotionValueEvent`). SVG glow uses `<filter>` with `feGaussianBlur` + `feColorMatrix` -- same pattern as existing `feTurbulence` noise texture. Zero new dependencies. |
| Unified blended background | CSS gradients with shared color variables across sections | Pure CSS. Sections share `--background` variable values that transition through the page. No library. |

### Development Tools

No new development tools required. Existing Vite 8, TypeScript 5.9, Vitest 4.1, and ESLint cover all needs.

## Installation

```bash
# Single new runtime dependency
npm install embla-carousel-react@^8.6.0

# Optional (only if auto-scroll is desired)
# npm install embla-carousel-autoplay@^8.6.0
```

That is the entire install. Everything else is CSS and existing Motion APIs.

## Configuration Changes

### Dark Mode: Switch from Selector to Media Strategy

**Current state** in `src/styles/app.css`:
```css
@custom-variant dark (&:is(.dark *));
```

**Required change:** Remove this line entirely. Tailwind v4's built-in `dark:` variant defaults to `@media (prefers-color-scheme: dark)`, which is exactly what the project needs (system-preference only, no toggle).

**Then add** dark theme CSS variables:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.145 0.01 250);
    --foreground: oklch(0.93 0.005 250);
    --card: oklch(0.18 0.01 250);
    --card-foreground: oklch(0.93 0.005 250);
    /* ... remaining token overrides */
  }
}
```

This approach:
- Uses zero JavaScript (no flash of wrong theme)
- Requires no ThemeProvider wrapper
- Works with SSR/prerender (Vercel)
- Leverages the existing oklch color system
- Is the Tailwind v4 documented default behavior

### Remove next-themes

`next-themes` is currently installed but never imported or used anywhere in the codebase. It is a Next.js-specific library and is incompatible with Vite's architecture (requires Next.js `<Script>` injection to prevent flash). Since v1.2 uses pure CSS media queries for dark mode (no manual toggle), `next-themes` should be removed.

```bash
npm uninstall next-themes
```

### Animated Gradient: CSS @property Registration

Register custom properties for gradient color stops so the browser can interpolate them:

```css
@property --gradient-start {
  syntax: "<color>";
  initial-value: oklch(0.55 0.15 250);
  inherits: false;
}

@property --gradient-end {
  syntax: "<color>";
  initial-value: oklch(0.385 0.136 295);
  inherits: false;
}

@keyframes breathe {
  0%, 100% { --gradient-start: oklch(0.55 0.15 250); --gradient-end: oklch(0.385 0.136 295); }
  50% { --gradient-start: oklch(0.45 0.12 270); --gradient-end: oklch(0.50 0.10 280); }
}
```

This runs on the compositor thread and respects the existing `prefers-reduced-motion: reduce` guard.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| embla-carousel-react v8.6.0 | Swiper.js | If you need 3D effects, parallax, or virtual slides for 100+ items. Swiper is 42KB gzipped vs Embla's 3.4KB. Overkill for 5-8 project cards. |
| embla-carousel-react v8.6.0 | shadcn/ui Carousel component | shadcn/ui's Carousel wraps Embla anyway. Using Embla directly gives full control over the Gallery6 layout pattern without shadcn's opinionated wrapper markup. |
| embla-carousel-react v8.6.0 (stable) | embla-carousel-react v9.0.0-rc01 | v9 RC adds SSR-first APIs and renamed methods (`scrollNext` -> `goToNext`). Not yet stable. Use v8 for production -- migration to v9 will be straightforward when stable (method renames only). |
| CSS `@property` gradient animation | Motion `animate` on gradient background | Motion cannot interpolate CSS gradients (it would need to parse the gradient string). `@property` is the correct CSS-native approach for smooth gradient color animation. |
| CSS `@media (prefers-color-scheme)` | next-themes ThemeProvider | next-themes requires a JS ThemeProvider, adds flash-prevention complexity, and is designed for Next.js. The project only needs system preference (no toggle), so pure CSS is simpler, faster, and has zero runtime cost. |
| CSS `@media (prefers-color-scheme)` | Manual `matchMedia` listener + React context | Only needed if adding a manual toggle. PROJECT.md explicitly descopes dark mode toggle. Pure CSS is sufficient. |
| Motion `layoutId` tabs | Headless UI / Radix Tabs | Would add a dependency for something achievable with 20 lines of accessible HTML + Motion animation. The project already has Motion installed. |
| SVG `<filter>` for glow | CSS `box-shadow` with large spread | SVG filters produce authentic neon/glow rendering that `box-shadow` cannot match (color bleed, Gaussian falloff). The project already uses SVG filters for noise textures, so this is a consistent pattern. |
| SVG `<filter>` for glow | Canvas 2D glow rendering | Canvas requires imperative drawing, breaks accessibility, and doesn't compose with React's declarative model. SVG filters are declarative and work inside JSX. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| next-themes | Next.js-specific. Already installed but unused. Requires JS ThemeProvider. Project needs system-preference only (CSS handles this natively). | Remove it. Use Tailwind v4 default `dark:` media strategy. |
| react-spring / @react-spring/web | Would duplicate Motion's capabilities. The project already uses Motion 12 extensively. Adding a second animation library creates bundle bloat and API inconsistency. | Motion 12 (already installed) handles all animation needs. |
| GSAP / anime.js | Heavyweight animation libraries (GSAP is 30KB+ gzipped). Licensing complexity (GSAP has commercial restrictions). Motion already covers scroll-linked animations, layout transitions, and SVG path animation. | Motion 12 `useScroll` + `useTransform` + `motion.path`. |
| Swiper.js | 42KB gzipped. Includes its own CSS framework, touch handling, and virtual DOM -- all redundant with the existing Tailwind + Motion + React setup. | embla-carousel-react (3.4KB gzipped, hook-based, no CSS opinions). |
| keen-slider | Smaller than Swiper but less maintained than Embla. Missing TypeScript-first API. Embla has 10x the weekly downloads and is shadcn/ui's chosen carousel engine. | embla-carousel-react. |
| @radix-ui/react-tabs | Would add a Radix dependency when the project standardized on Base UI (via shadcn v4). Mixing Radix and Base UI creates maintenance confusion. | Build tabs with Base UI Tabs or manual `role="tablist"` + Motion `layoutId`. |
| tailwindcss-animate | Already replaced by tw-animate-css in the project. Don't re-add. | tw-animate-css (already installed). |
| CSS `background-size` animation for gradient | Animating `background-size` forces layout recalculation (not composited). Causes jank on lower-end devices. | `@property` typed custom properties for color stop animation (runs on compositor). |
| JavaScript `requestAnimationFrame` gradient loop | Unnecessary runtime cost. CSS animations run on the compositor thread without JS involvement. | Pure CSS `@keyframes` with `@property` registered color stops. |

## Integration Points with Existing Stack

### Embla + Motion
Embla handles the carousel scroll mechanics (snap points, drag, swipe). Motion handles entry/exit animations on individual slides. Do not animate the Embla container with Motion -- let Embla own the horizontal scroll and use Motion only for per-slide fade/scale effects.

### Embla + Tailwind
Embla requires minimal CSS: `overflow: hidden` on the viewport, `display: flex` on the container. All other styling (gaps, widths, responsive breakpoints) is handled with Tailwind utility classes.

### Dark Mode + oklch Colors
The existing oklch color system maps perfectly to dark mode. oklch perceptual uniformity means you can derive dark variants by adjusting lightness values while keeping chroma and hue constant. Example: `oklch(0.985 0.002 90)` (light bg) becomes `oklch(0.145 0.01 250)` (dark bg).

### Motion + SVG Timeline
The existing Timeline component already uses `useScroll` + `useMotionValueEvent` + `motion.div` for progressive fill. The v1.2 upgrade adds `motion.path` for SVG connection lines and `motion.circle` for glowing nodes -- same scroll-linked pattern, just SVG elements instead of divs.

### Glassmorphic Tabs + Tailwind
`backdrop-filter: blur()` maps to Tailwind's `backdrop-blur-md` utility. The glassmorphic effect is: `bg-white/10 backdrop-blur-md border border-white/20` (light) or `bg-black/10 backdrop-blur-md border border-white/10` (dark). Use `dark:` variants for the dark theme overrides.

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| embla-carousel-react@8.6.0 | React 19.2.x | Peer dep: `^16.8.0 \|\| ^17.0.1 \|\| ^18.0.0 \|\| ^19.0.0 \|\| ^19.0.0-rc`. Verified via npm. |
| embla-carousel@8.6.0 | embla-carousel-react@8.6.0 | Auto-installed as dependency. Versions are always matched (mono-repo release). |
| embla-carousel-autoplay@8.6.0 | embla-carousel@8.6.0 | Same mono-repo, same version. Only install if auto-scroll needed. |
| motion@12.38.0 | React 19.2.x, Vite 8 | Already installed and working. No changes needed. Provides `useScroll`, `useTransform`, `layoutId`, `motion.path`. |
| Tailwind CSS 4.2.2 | CSS `@property`, `dark:` media variant | `@property` is processed by the browser (not Tailwind). Tailwind's `dark:` variant defaults to `prefers-color-scheme` media query when no `@custom-variant dark` is defined. |
| CSS `@property` | 96% global browser support | Supported in Chrome 85+, Edge 85+, Firefox 128+, Safari 16.4+. The portfolio's target audience (tech recruiters, professors) overwhelmingly uses modern browsers. |
| CSS `backdrop-filter` | 95%+ global browser support | Supported in all modern browsers. Include `-webkit-backdrop-filter` for older Safari versions (pre-16). |

## Sources

- [embla-carousel-react npm](https://www.npmjs.com/package/embla-carousel-react) -- v8.6.0 is `latest` tag, v9.0.0-rc01 is `next` tag (HIGH confidence, verified via `npm view`)
- [embla-carousel-react peerDependencies](https://www.npmjs.com/package/embla-carousel-react) -- React `^19.0.0` confirmed via `npm view embla-carousel-react@8.6.0 peerDependencies` (HIGH confidence)
- [Embla Carousel React docs](https://www.embla-carousel.com/docs/get-started/react) -- Hook-based API, plugin system (HIGH confidence)
- [Embla v9 RC release notes](https://github.com/davidjerleke/embla-carousel/discussions/1271) -- v9 breaking changes, SSR improvements (MEDIUM confidence)
- [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode) -- Default media strategy, `@custom-variant` override mechanism (HIGH confidence)
- [Tailwind v4 dark mode custom variant guide](https://schoen.world/n/tailwind-dark-mode-custom-variant) -- Combined media + selector approach (MEDIUM confidence)
- [CSS @property browser support](https://caniuse.com/mdn-css_at-rules_property) -- 96% global coverage (HIGH confidence)
- [CSS @property gradient animation guide](https://frontend-hero.com/how-to-animate-gradients-css) -- `@property` typed color stops for smooth gradient transitions (MEDIUM confidence)
- [Motion scroll animations docs](https://www.framer.com/motion/scroll-animations/) -- `useScroll`, `useTransform`, scroll-linked patterns (HIGH confidence)
- [Motion SVG path animation](https://dev.to/heres/scroll-svg-path-with-framer-motion-54el) -- `pathLength` + scroll progress pattern (MEDIUM confidence)
- [Glassmorphism implementation guide](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide) -- Performance best practices, blur limits (MEDIUM confidence)
- [SVG glow with feGaussianBlur](https://vectosolve.com/blog/svg-filter-effects-guide) -- Filter primitive performance characteristics (MEDIUM confidence)
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) -- Next.js-specific, not designed for Vite (HIGH confidence)

---
*Stack research for: v1.2 UI Polish & Interactivity*
*Researched: 2026-03-26*
