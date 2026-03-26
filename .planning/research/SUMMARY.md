# Project Research Summary

**Project:** Jack Engineering Portfolio — v1.2 UI Polish & Interactivity
**Domain:** Animated SPA portfolio with dark mode, carousel, SVG timeline, and glassmorphic tabs
**Researched:** 2026-03-26
**Confidence:** HIGH

## Executive Summary

The v1.2 milestone is a visual polish layer on a well-established Vite 8 + React 19 + Tailwind v4 + Motion 12 stack. The goal is to transform a functional but visually fragmented portfolio into a cohesive, animated experience: a breathing radial gradient hero, system-preference dark/light mode, a horizontal project carousel, merged skills/tooling with animated glassmorphic tabs, a scroll-triggered SVG timeline with glowing nodes, and a refreshed contact footer. The only new runtime dependency is `embla-carousel-react` (~8KB gzipped). All other features are achievable through CSS `@keyframes`, CSS `@property` typed custom properties, and Motion 12 primitives already installed in the project.

The recommended approach centers on two foundational changes that must land first: (1) replacing the oklch cleanroom palette with a blue-primary token system that includes both `:root` light and `.dark` overrides (keeping all values in oklch to preserve Tailwind opacity-modifier compatibility), and (2) replacing the current per-section `NoisyBackground` wrappers with a single `UnifiedBackground` gradient spanning the full page. Every subsequent component rebuild — hero, tabs, carousel, timeline, footer — depends on these two foundations being correct. The architecture is deliberately additive: no new framework, no routing change, no data-structure changes. The admin panel continues to write the same `src/data/*.ts` files and requires zero modifications.

The primary risks are performance and framework-mismatch. Gradient animations, if implemented by animating `background-size` or gradient color stops directly, will cause continuous repaints that drain mobile battery and drop Lighthouse scores. The correct approach is opacity-layered gradients (GPU-composited). The codebase has `next-themes` installed but unused — it must be removed and replaced with a minimal Vite-native ThemeProvider to avoid FOUT and Next.js-specific code path failures. Dark mode flash on page load is prevented by a blocking inline `<script>` in `index.html` that applies the `.dark` class before React renders.

## Key Findings

### Recommended Stack

The existing stack requires only one addition. `embla-carousel-react@^8.6.0` is the de facto carousel for shadcn/ui ecosystems: 3.4KB gzipped, hook-based, zero UI opinions, and explicitly tested against React 19 peer deps. Everything else — animated gradients, dark mode, animated tabs, SVG timeline glow — is achievable with CSS `@property`, CSS `@keyframes`, and Motion 12 APIs already in the codebase.

Two removals are required alongside the addition: remove `next-themes` (Next.js-specific, incompatible with Vite SPA, never imported but a confusion risk) and correct or remove the `@custom-variant dark (&:is(.dark *))` line in `app.css` — the current selector only matches children of `.dark`, not the `.dark` element itself; it must be `(&:is(.dark, .dark *))` for the root `<html>` element to receive dark styles.

**Core technologies:**
- `embla-carousel-react@^8.6.0`: horizontal project carousel — lightweight, React 19 compatible, no CSS opinions, Gallery6 reference uses it directly
- CSS `@property` + `@keyframes` on `<color>` typed stops: animated gradient hero — runs on compositor thread, 96% browser support, no JS frame loop
- Motion 12 `layoutId`: animated tab pill indicator — shared element transition with zero manual position calculation, already installed
- Motion 12 `useScroll` + `motion.path` with `pathLength`: SVG timeline progress line — GPU-composited, directly bound to scroll MotionValue, same pattern as existing Timeline.tsx
- Custom ThemeProvider (40 lines, no npm): dark mode system-preference detection — shadcn/ui Vite dark mode guide pattern, removes the `next-themes` dependency

### Expected Features

**Must have (table stakes):**
- System-preference dark/light mode — every modern portfolio in 2026 respects OS theme; missing it makes the site look unfinished to dark-mode recruiters
- Unified consistent background — hard color breaks between sections (current state) look fragmented and dated
- Horizontal project carousel — Gallery6-style is the dominant project-showcase pattern for 2026 portfolios
- Animated tab interface for Skills and Tooling — merging two identical-layout sections reduces page length and modernizes the UX
- Refreshed "Let's Work Together" contact and footer — current vertically-stacked layout is functional but not premium

**Should have (differentiators):**
- Animated radial gradient hero — sets a "cares about craft" first impression; the existing `AuroraBackground.tsx` was explicitly removed as too distracting; the replacement must be subtler
- Scroll-triggered SVG timeline with glowing nodes — most visually distinctive feature; higher complexity but highest impressiveness per effort ratio
- Glassmorphic tab panels — depth effect via `backdrop-blur` on tab content; pure CSS, near-zero cost
- Featured project visual emphasis in carousel — leverages the existing `featured: boolean` field, reinforces hierarchy

**Defer to v2+:**
- Manual dark/light toggle — explicitly descoped in PROJECT.md
- Project filtering in carousel — only 4 projects; filter is overkill
- Blog or notes system — content creation overhead
- Testimonials — needs content to exist first

### Architecture Approach

The v1.2 architecture is an in-place upgrade of the existing SPA. The component tree adds a `ThemeProvider` at the root (above `MotionConfig`), replaces per-section background wrappers with a single `UnifiedBackground`, and swaps five components (Skills, Tooling, Timeline, ProjectsSection, Contact) for five replacements. The admin panel, data layer, SmoothScroll, Navigation, and all surviving sections remain unchanged. No new routing, no new framework, no data-structure changes.

**Major components and their status:**
1. `ThemeProvider.tsx` (NEW) — applies `.dark` class to `<html>` based on `matchMedia` system preference; ~40 lines, no deps
2. `UnifiedBackground.tsx` (NEW) — single page-spanning gradient, replaces per-section NoisyBackground wrappers
3. `AnimatedGradientBg.tsx` (NEW) — opacity-layered radial gradients for hero breathing animation; pure CSS
4. `AnimatedTabs.tsx` + `SkillsAndTooling.tsx` (NEW) — Motion `layoutId` pill indicator, merges Skills + Tooling data
5. `ProjectCarousel.tsx` (NEW) — embla-carousel replacing bento grid; preserves ProjectDetail Dialog/Drawer
6. `TimelineV2.tsx` (NEW) — SVG `<path>` with `pathLength` driven by `scrollYProgress`, glow nodes
7. `ContactFooter.tsx` (NEW) — "Let's Work Together" layout, same data sources, same LazyPdfViewer integration
8. `app.css` (MODIFIED) — blue-primary oklch variable system with `:root` light and `.dark` blocks
9. `NoisyBackground.tsx`, `AnimatedGridPattern.tsx` (DEPRECATED) — no longer used after unified bg lands

### Critical Pitfalls

1. **Lenis hijacks Embla carousel scroll events** — Add `data-lenis-prevent` attribute to the Embla viewport div plus `overscroll-behavior: contain` and `touch-action: pan-y pinch-zoom` CSS. Test with a trackpad, not just a mouse — mouse wheel testing masks this bug entirely because it has no horizontal component.

2. **Animated gradient triggers continuous repaints** — Never animate `background-size`, `background-position`, or gradient color stops directly. Layer two gradient divs and animate `opacity` on the top layer. `opacity` is GPU-composited; gradient property animation is not. Use `IntersectionObserver` to pause animation when hero exits viewport.

3. **oklch/hex color space mismatch breaks Tailwind opacity modifiers** — Keep ALL theme variables in oklch. Do not copy hex values from 21st.dev reference components. `bg-accent/50` breaks when the underlying variable is hex inside an `oklch()` function. Convert any hex references to oklch equivalents before use.

4. **Dark mode flash of unstyled theme (FOUT) on page load** — Add a blocking inline `<script>` in `index.html` `<head>` that reads `matchMedia` and sets `document.documentElement.classList.toggle("dark", isDark)` synchronously. This must execute before React loads. The existing `body { opacity: 0 }` hydration gate then reveals the correctly-themed page.

5. **21st.dev components assume Next.js patterns** — Treat all 21st.dev references as visual-only. Strip `"use client"`, replace `next/image` with `<img loading="lazy" decoding="async">`, remove `next-themes` imports, replace `next/link` with `<a>`. Create an adaptation checklist on the first component and reuse it for each subsequent one.

## Implications for Roadmap

Based on the dependency graph in ARCHITECTURE.md and the feature criticality from FEATURES.md, a 4-phase structure is recommended. Phases 1 and 2 are strictly ordered foundations; Phases 3 and 4 items are parallelizable after Phase 2 completes.

### Phase 1: Theme Foundation and Unified Background

**Rationale:** Every subsequent component must know what colors to render and what background it sits on. These two changes are prerequisites for all visual work. Pitfalls 3 (oklch/hex mismatch), 5 (FOUT), 9 (existing effects invisible in dark mode), and 12 (body color not overriding) all must be resolved here before anything else is touched.

**Delivers:** Working system-preference dark mode across the entire site; removal of per-section background fragmentation; a clean foundation for all component rebuilds.

**Addresses:** System-preference dark/light mode (table stakes P0), unified consistent background (table stakes P0).

**Avoids:** FOUT flash via blocking script in `index.html`; oklch/hex mismatch by keeping all variables in oklch; existing visual effects breaking in dark mode by auditing every effect against the `.dark` class during this phase; admin panel going dark by wrapping admin in `<div class="light">` force-override.

**Does not need research-phase:** Tailwind v4 dark mode and CSS custom property patterns are HIGH-confidence from official docs.

### Phase 2: Hero and Navigation Migration

**Rationale:** The hero is the first thing visitors see and must be correct before the portfolio is demoable. Navigation section IDs must be updated once Skills and Tooling are known to be merged (the merge happens in Phase 3). The GPU-composited gradient animation technique established here informs the pattern used throughout the rest of v1.2.

**Delivers:** Animated radial gradient hero background; updated navigation with correct section IDs for the v1.2 merged section layout; migrated color classes on WhoAmI and HeroContent from oklch custom classes to semantic tokens.

**Addresses:** Animated gradient hero (differentiator P1), section color-class migration clean-up.

**Avoids:** GPU repaint from wrong gradient animation technique (opacity-layering pattern, not background-size animation).

**Does not need research-phase:** GPU-composited opacity animation is documented in Motion performance guides and CSS specs. Standard pattern.

### Phase 3: High-Impact Component Rebuilds

**Rationale:** All three rebuilds are independent of each other after the foundation is set. Sequenced by visual impact and complexity: AnimatedTabs first (reduces page length, establishes Motion layoutId pattern), Gallery6 carousel second (most prominent new interaction, adds the one new dependency), timeline third (most complex SVG work, benefits from patterns established above).

**Delivers:** AnimatedTabs merging Skills and Tooling with glassmorphic panels; Gallery6 horizontal project carousel with featured-first ordering; scroll-triggered SVG timeline with glowing nodes.

**Addresses:** Animated tab interface (table stakes P1), horizontal project carousel (table stakes P1), SVG timeline (differentiator P1), featured project emphasis (differentiator P1), glassmorphic panels (differentiator P1).

**Avoids:** Lenis/Embla scroll conflict via `data-lenis-prevent`; Motion LayoutGroup conflict with Embla by removing LayoutGroup from carousel scope; SVG timeline jank by using `useTransform` derived values not `useState` per scroll frame; AnimatedTabs height layout shift via fixed `min-height` or Motion animated height; Embla not respecting `prefers-reduced-motion` via custom hook returning `{ duration: 0 }`.

**Needs research-phase for timeline:** The SVG `pathLength` + `useScroll` + per-node glow transition combination — specifically minimizing React re-renders per scroll frame — warrants a focused research-phase before implementation. The carousel and tabs do not need it.

### Phase 4: Contact Footer and Cleanup

**Rationale:** Contact/footer is the lowest-risk change (layout-only, same data sources, no new dependencies). Cleanup — removing deprecated components, removing `next-themes`, verifying tree-shaking, running `vite build` — must be last to confirm the final production bundle is correct.

**Delivers:** "Let's Work Together" contact footer layout; removal of NoisyBackground, AnimatedGridPattern, and `next-themes` from the codebase; verified production bundle with no admin chunk contamination; passing tests and typecheck.

**Addresses:** Contact/footer refresh (table stakes P2), deprecation obligations from replacing five major components.

**Avoids:** ThemeProvider breaking tree-shaking (verify `dist/assets/` after build), stale imports from removed components causing build errors.

**Does not need research-phase:** Layout-only change with no new dependencies. Cleanup is mechanical.

### Phase Ordering Rationale

- Phases 1 and 2 are strictly ordered: CSS variable foundation and background must be in place before any component touches colors or layout
- Phase 3 items (tabs, carousel, timeline) are mutually independent after Phase 2 and can be built in any order or in parallel by multiple contributors
- Phase 4 cannot begin until all deprecated components are confirmed replaced, and cleanup must close the milestone before `vite build` is the final verification
- The 21st.dev adaptation checklist should be created in Phase 3 (first component adapted from a reference) and reused for each subsequent component

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (timeline only):** SVG `pathLength` + `useScroll` + per-node glow state without per-frame React re-renders is moderately underdocumented for this exact combination. Run a research-phase on SVG animation performance before implementing TimelineV2.
- **Phase 1 (dark variant audit):** The existing `@custom-variant dark (&:is(.dark *))` has a confirmed bug — it does not match the root `.dark` element itself. Inspect and correct this before writing any dark-mode CSS. This is a 5-minute fix but easy to overlook.

Phases with standard patterns (skip research-phase):
- **Phase 1 (CSS variables, ThemeProvider, unified background):** Tailwind v4 dark mode and shadcn/ui Vite ThemeProvider are HIGH-confidence with official documentation.
- **Phase 2 (hero gradient):** Opacity-layered gradient animation is a documented compositor-safe pattern.
- **Phase 3 (carousel):** Embla setup and Lenis coexistence are documented with HIGH-confidence sources. Gallery6 is a known reference.
- **Phase 3 (AnimatedTabs):** Motion `layoutId` sliding pill is extensively documented on motion.dev and buildui.com.
- **Phase 4 (contact footer, cleanup):** Layout-only and mechanical. No research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All recommendations verified against official npm, Tailwind, and Motion docs. Single new dependency (embla) has confirmed React 19 peer dep compatibility via `npm view`. |
| Features | HIGH | Feature scope tightly defined in PROJECT.md. Research confirmed table-stakes vs differentiator classification for 2026 portfolios against multiple HIGH-confidence sources. |
| Architecture | HIGH | Build order derived from explicit dependency analysis. Lenis/Embla coexistence confirmed via GitHub issues. ThemeProvider pattern from shadcn official Vite docs. CSS variable architecture validated against Tailwind v4 `@theme inline` behavior. |
| Pitfalls | HIGH | Five critical pitfalls verified against official docs, GitHub issues, and performance literature. Recovery costs and detection methods are specific, not generic. |

**Overall confidence:** HIGH

### Gaps to Address

- **oklch dark palette values:** Research identifies the strategy but does not supply finalized oklch values for every existing custom token (cleanroom, silicon-*, ink, accent, uw-purple-*). These must be derived during Phase 1 execution using oklch.com or DevTools color picker. A side-by-side light/dark visual comparison is needed before tokens are locked.
- **AnimatedTabs domain grouping:** Research proposes two strategies (7 individual tabs vs 4 domain-merged tabs). The optimal grouping depends on content density and visual rhythm. Defer the final tab structure to Phase 3 implementation — render both options before committing.
- **Admin panel dark mode override:** The "wrap admin in `<div class='light'>`" strategy is identified but not fully designed. Whether admin's iframe preview should respect dark mode or be forced light is a product decision. Raise with user before Phase 1 ships.
- **embla v9 migration readiness:** Embla v9 RC1 exists with renamed methods. Research recommends v8 for production. Flag for when v9 goes stable — migration is documented as method renames only.

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Dark Mode](https://tailwindcss.com/docs/dark-mode) — dark variant configuration, media strategy, custom-variant syntax
- [Tailwind v4 Theme Variables](https://tailwindcss.com/docs/theme) — `@theme inline`, CSS variable integration
- [shadcn/ui Vite Dark Mode guide](https://ui.shadcn.com/docs/dark-mode/vite) — ThemeProvider implementation for Vite apps
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) — scroll-linked animation hooks
- [Motion SVG Animation docs](https://motion.dev/docs/react-svg-animation) — pathLength, line drawing
- [Motion Layout Animations docs](https://motion.dev/docs/react-layout-animations) — layoutId shared element transitions
- [Motion Animation Performance guide](https://motion.dev/docs/performance) — compositor-friendly properties
- [Embla Carousel React setup](https://www.embla-carousel.com/docs/get-started/react) — hook API, DOM structure, CSS
- [embla-carousel-react npm](https://www.npmjs.com/package/embla-carousel-react) — v8.6.0 is `latest`, React 19 peer dep confirmed
- [Web Animation Performance Tier List (Motion Magazine)](https://motion.dev/magazine/web-animation-performance-tier-list) — compositor property tier list
- [BuildUI Animated Tabs recipe](https://buildui.com/recipes/animated-tabs) — layoutId pill pattern

### Secondary (MEDIUM confidence)
- [21st.dev Gallery6](https://21st.dev/community/components/shadcnblockscom/gallery6) — horizontal carousel pattern with featured cards
- [21st.dev Animated Tabs](https://21st.dev/s/tabs) — 38 tab component examples including animated shifting
- [Lenis horizontal scroll trackpad conflict (Issue #446)](https://github.com/darkroomengineering/lenis/issues/446) — data-lenis-prevent pattern confirmed
- [Embla + Framer Motion conflict (Issue #317)](https://github.com/davidjerleke/embla-carousel/issues/317) — LayoutGroup conflict documentation
- [CSS gradient animation performance](https://digitalthriveai.com/en-us/resources/web-development/the-state-of-changing-gradients-with-css-transitions-and-animations/) — opacity-swap vs background-size technique
- [Fixing dark mode flickering in React](https://notanumber.in/blog/fixing-react-dark-mode-flickering) — blocking script FOUT prevention pattern
- [Tailwind v4 dark mode CSS variables discussion (#15083)](https://github.com/tailwindlabs/tailwindcss/discussions/15083) — `:root` / `.dark` variable pattern with `@theme inline`

### Tertiary (LOW confidence — verify during implementation)
- [Aceternity UI Background Gradient Animation](https://ui.aceternity.com/components/background-gradient-animation) — breathing gradient examples; verify technique matches compositor-safe pattern
- [Scroll SVG Path with Framer Motion (dev.to)](https://dev.to/heres/scroll-svg-path-with-framer-motion-54el) — pathLength + useScroll combination; verify against official Motion SVG docs before use

---
*Research completed: 2026-03-26*
*Ready for roadmap: yes*
