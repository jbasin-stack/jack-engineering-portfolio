# Project Research Summary

**Project:** Jack Basinski Engineering Portfolio
**Domain:** Premium minimalist engineering portfolio (single-page scroll SPA)
**Researched:** 2026-03-20
**Confidence:** HIGH

## Executive Summary

This is a static single-page portfolio targeting two distinct audiences: semiconductor/hardware recruiters and graduate school admissions professors. The research is unambiguous on approach: a Vite 8 + React 19 SPA with no server-side complexity, data-driven content architecture, and a premium motion/scroll experience that immediately signals craft. The competitive gap in the engineering student portfolio space is wide — most student portfolios either use generic templates (Wix/Squarespace) or GitHub-centric software dev layouts. Neither serves an ECE student targeting fab and analog roles. The differentiating opportunities are high-value and low-cost: Lenis smooth scroll (3KB), a bento grid project layout, in-browser PDF viewing for papers, and a typography-driven "Cleanroom White + Silicon Grey" aesthetic with selective glassmorphism.

The recommended stack is well-validated with high-confidence sources across every layer. React 19 + Vite 8 (Rolldown bundler) provides significantly faster builds than any alternative. Motion (formerly Framer Motion, now imported from `motion/react`) is the clear animation choice at 30M+ monthly downloads with native browser animation API support. Tailwind v4's Oxide engine and CSS-first config eliminates build configuration friction. The stack is deliberately minimal — no routing library, no state management, no CMS. Everything is either static data files or local `useState`. Two critical ecosystem renames since late 2024 must be respected: `framer-motion` is deprecated (use `motion`), and `@studio-freight/lenis` is deprecated (use `lenis`).

The primary risks are concentrated in the integration layer, not the technology choices. Three pitfalls dominate: react-pdf's worker configuration under Vite is brittle and breaks in production if misconfigured; the Motion library rename from `framer-motion` causes subtle breakage from stale documentation; and Lenis + Motion scroll events can desync if Lenis is added late or configured incorrectly. All three are preventable with correct project setup order and production build testing throughout development rather than only at the end.

## Key Findings

### Recommended Stack

The stack favors the newest stable versions with a clear rationale for each choice. Vite 8 ships Rolldown (a Rust-based bundler) for 10-30x faster builds, and `@vitejs/plugin-react` v6 uses Oxc instead of Babel. Tailwind v4 runs on the Oxide engine with CSS-first configuration — no `tailwind.config.js` in v4, everything goes in `@theme` directives. Motion v12 leverages native `ScrollTimeline` and `ViewTimeline` browser APIs for zero-JS scroll overhead where supported.

**Core technologies:**
- **React 19.2 + Vite 8 + TypeScript 5.9**: SPA foundation — mature, fast builds, well-supported ecosystem
- **Tailwind CSS v4.2**: Utility-first styling — Oxide engine, CSS-first config via `@import "tailwindcss"`, native glassmorphism utilities
- **Motion 12 (`motion/react`)**: Animation — renamed from Framer Motion, 120fps GPU animations, native browser API integration
- **Lenis 1.3 (`lenis/react`)**: Smooth scroll — 3KB, normalizes cross-browser scroll, premium weighted feel
- **shadcn/ui CLI v4**: Component primitives — Dialog/Drawer for PDF viewer, zero runtime cost for unused components
- **react-pdf 10.4**: In-browser PDF rendering — PDF.js based, read-only viewer for papers and resume
- **Vercel (free tier)**: Deployment — zero-config from Git push, auto-detects Vite projects

**Critical version/import notes:**
- Import from `motion/react`, NOT `framer-motion` (deprecated package name)
- Import from `lenis` and `lenis/react`, NOT `@studio-freight/lenis` (deprecated scope)
- Tailwind v4 uses `@tailwindcss/vite` Vite plugin, NOT PostCSS setup
- react-pdf worker must be configured with `import.meta.url` in the same file as the `<Document>` component

### Expected Features

Both research audiences validate the same core feature set, though their priorities differ. Recruiters prioritize projects and lab/tooling proof; professors prioritize papers and coursework depth. Features serving both audiences equally (navigation, responsive design, fast load, semantic HTML) are table stakes with no debate.

**Must have (table stakes):**
- Responsive design (mobile-first, bento grid collapse) — 50%+ mobile traffic, non-negotiable
- Clear fixed navigation with active section highlighting — recruiters spend 30-60 seconds per page
- Hero section with 3-second identity statement — name, discipline, semiconductor/systems intersection
- Projects section with 3-5 projects, visuals, and contribution detail — this is the core product
- Resume download + in-browser PDF viewer — #1 action item for both audiences
- Skills section grouped by domain (Fab, RF, Analog, Digital) — quick competency scan
- Contact section (email, LinkedIn, GitHub) — direct `mailto:` link, no backend form needed
- Lighthouse 90+ performance — slow portfolio undermines technical credibility
- Semantic HTML + OpenGraph meta tags — AI scrapers, search, and accessibility baseline
- Lenis smooth scroll + Motion entry/hover animations — premium feel, consistent with aesthetic

**Should have (competitive differentiators):**
- Bento grid project cards with inline expansion (not modal routing) — flagship projects get visual priority
- Papers/publications section with in-browser PDF viewer — gold for grad school, rare on student portfolios
- Lab and tooling proficiency section — proves hands-on fabrication, critical for semiconductor roles
- Coursework section — signals domain depth, low-effort for high signal
- Glassmorphic nav + overlay design — selective application (nav, PDF overlay) creates signature aesthetic
- Data-driven content architecture (TypeScript data files) — content updates require no code changes
- `prefers-reduced-motion` support — accessibility compliance, quality signal for technical audiences
- 0.5px border design system — intentional detail that creates visual cohesion

**Defer (v2+):**
- Timeline/journey section — add when career progression is substantial enough to visualize
- Blog/technical notes — only with a sustained writing commitment
- Dark mode — single cohesive light theme is stronger brand statement; toggle undermines it
- Testimonials — collect organically from professors/mentors before adding the section
- Analytics, custom OG images, project filtering — add after v1 is live with real feedback

**Confirmed anti-features (do not build):**
- Skill percentage bars — industry-mocked, meaningless self-assessments
- Particle effects/3D backgrounds — performance killer, contradicts minimalist philosophy
- Custom cursor — accessibility nightmare
- Contact form with backend — unnecessary complexity; direct email is better for personal portfolios
- React Router — single-page scroll site has no routing needs

### Architecture Approach

The architecture is a flat single-page composition: one `App.tsx` that composes sections in scroll order, wrapped in a `ReactLenis` provider. All content lives in `data/*.ts` TypeScript files that section components import directly. No state management library is needed — the only interactive state is PDF viewer open/close (`useState` in a custom hook) and active navigation section (`IntersectionObserver` in `useActiveSection`). Animation variants are centralized in `lib/motion.ts` to enforce the consistent "weighted, no bounce" feel across all components.

**Major components:**
1. `data/*.ts` — Single source of truth for all content (projects, papers, skills, timeline, coursework, navigation)
2. `App.tsx` — Root: ReactLenis provider wrapping all sections in scroll order
3. `Navigation.tsx` — Fixed glassmorphic nav, scroll-to-anchor via Lenis, active section via IntersectionObserver
4. `Section.tsx` — Reusable section wrapper with id anchor, consistent padding, optional entry animation
5. `ProjectCard.tsx` — Bento card with expansion logic using Motion `layoutId` for smooth expand/collapse
6. `PdfViewer.tsx` — Responsive: shadcn Dialog on desktop, Drawer on mobile; react-pdf rendering
7. `lib/motion.ts` — Centralized Motion variants (fadeInUp, staggerContainer, weightedSpring) for consistent easing
8. `AnimatedEntry.tsx` — Reusable `whileInView` wrapper applied to section children

**Key data flow:** `data/*.ts` → section components → shared components (`Section`, `AnimatedEntry`) → `App.tsx` → Lenis (scroll interpolation) → Motion (viewport entry animations)

### Critical Pitfalls

1. **react-pdf worker misconfiguration in Vite** — Configure `pdfjs.GlobalWorkerOptions.workerSrc` with `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)` in the same file as `<Document>`. Install `vite-plugin-static-copy` for cMap files. Always test production build (`npm run build && npm run preview`) before deploying — worker path often works in dev but fails in production.

2. **Importing from `framer-motion` instead of `motion/react`** — Every tutorial predating late 2024 uses the deprecated package name. Install `motion`, import from `motion/react`. Run `grep -r "framer-motion" src/` and expect zero results.

3. **Lenis + Motion scroll event desync** — Both libraries touch scroll behavior; if Lenis is added late or configured incorrectly, Motion's `whileInView` fires at wrong positions. Add Lenis first, test scroll animations immediately after integration. Use Lenis native wrapper mode (not virtual scroll) to keep IntersectionObserver working correctly.

4. **Lighthouse performance killed by unoptimized assets** — Convert project images to WebP, use `loading="lazy"` for below-fold images with explicit `width`/`height` attributes, and `React.lazy()` the entire PdfViewer component so react-pdf is never in the initial bundle.

5. **Tailwind v4 config confusion from v3 tutorials** — No `tailwind.config.js` in v4. Use `@tailwindcss/vite` plugin (not PostCSS). Custom tokens go in CSS `@theme {}` blocks. Do not follow any tutorial that creates a JS config file.

## Implications for Roadmap

The dependency graph from research strongly dictates phase order. Data architecture must come first because nearly every content section depends on TypeScript interfaces and data files. Animation infrastructure must be installed and tested before content sections are built — Lenis added as an afterthought causes the scroll conflict pitfall. The most complex feature (bento project cards with expansion) should come after animation infrastructure is validated. PDF viewing can be isolated to its own phase because its primary risk is independent of other features. Polish and performance validation is last because it requires all sections to exist.

### Phase 1: Foundation — Project Setup + Data Architecture + Core Infrastructure
**Rationale:** Data architecture is foundational — every content section depends on TypeScript interfaces and data files. Project scaffolding with correct tool versions (Vite 8, Tailwind v4, Motion) must be validated before any content work begins. Getting package imports correct (especially `motion/react` and `lenis`) prevents cascading breakage throughout the project.
**Delivers:** Working Vite 8 + React 19 + TypeScript + Tailwind v4 project; all TypeScript interfaces defined (`Project`, `Paper`, `Skill`, `Course`, `NavItem`); all data files populated with real content; `lib/motion.ts` with centralized animation variants; `Section.tsx` and `AnimatedEntry.tsx` shared components; `ReactLenis` root wrapper; fixed glassmorphic navigation with active section detection via IntersectionObserver.
**Addresses:** Data-driven content architecture (P1), fixed glassmorphic nav (P1), Lenis smooth scroll (P1)
**Avoids:** Tailwind v4 config confusion (Pitfall 7), deprecated package imports (Pitfall 2), Lenis added as afterthought (Pitfall 3)

### Phase 2: Hero + Static Content Sections
**Rationale:** With data architecture and shared components in place, all content sections can be built rapidly by mapping over data arrays. Build them statically first (no animation beyond section entry), then apply `AnimatedEntry` wrappers. Hero comes first since it establishes the visual language for the entire page.
**Delivers:** Hero section with identity statement; Skills section (domain-grouped); Lab and Tooling section; Coursework section; Contact section. All sections using `Section.tsx` wrapper with proper id anchors. All content sourced from data files. Font loading configured with preload and `font-display: swap`.
**Uses:** Tailwind v4 glassmorphism utilities (`bg-white/30 backdrop-blur-lg`), 0.5px border system, Motion `fadeInUp` + `staggerContainer` variants from `lib/motion.ts`
**Addresses:** Hero (P1), Skills (P1), Lab and Tooling (P1), Coursework (P1), Contact (P1), semantic HTML + SEO (P1)
**Avoids:** Over-animation (Pitfall 6) — static-first then animate; font flash (Pitfall 12) — font preloading configured at this phase

### Phase 3: Projects Section — Bento Grid + Inline Expansion
**Rationale:** The bento grid with inline expansion is the most complex feature. It requires both data architecture (Phase 1) and Motion animation infrastructure (also Phase 1) to be validated. Building it in its own phase allows the Motion `layoutId` expand/collapse transition to be developed and tuned without pressure from other open work. This is the centrepiece of the portfolio.
**Delivers:** Bento grid layout with variable card sizes for visual hierarchy; ProjectCard component with static and expanded states; smooth Motion `layoutId` expand/collapse animation; `AnimatePresence` for unmount transitions; responsive grid collapse for mobile; hover states on interactive elements only.
**Uses:** Motion `layoutId` and `AnimatePresence`; CSS Grid with Tailwind responsive variants; `data/projects.ts` for content
**Implements:** `ProjectCard.tsx` architecture component
**Avoids:** Global state for expansion (Anti-Pattern 1 — use `useState` in Projects section); Router for per-project pages (Anti-Pattern 5)

### Phase 4: PDF Viewer — Papers Section + Resume
**Rationale:** PDF viewing is an isolated feature with its own specific pitfall (worker misconfiguration). Isolating it to its own phase allows focused testing of the production build. The shadcn Dialog/Drawer pattern and react-pdf worker setup are the only non-standard integrations in the stack, and they must be tested in a production build before proceeding to final polish.
**Delivers:** Papers section with paper metadata and abstract display; in-browser PDF viewer using shadcn Dialog (desktop) and Drawer (mobile); resume download link with in-browser preview option; `React.lazy()` wrapping for PdfViewer to exclude react-pdf from the initial bundle.
**Uses:** react-pdf 10.4 with correct Vite worker config; `vite-plugin-static-copy` for PDF.js cMap files; shadcn `Dialog` and `Drawer` components; `useMediaQuery` hook for responsive overlay selection
**Avoids:** Worker misconfiguration (Pitfall 1 — test production build immediately after implementation); heavy PDF preloading (Anti-Pattern 4)

### Phase 5: Polish, Performance, and Accessibility
**Rationale:** Responsive QA, Lighthouse optimization, and accessibility compliance must be validated after all sections exist. Responsive design cannot be fully tested until all content is present. Lighthouse score depends on final image assets and lazy-loading configuration. `prefers-reduced-motion` should be wired up after all animation infrastructure is confirmed working, not bolted on afterward.
**Delivers:** Lighthouse 90+ score; WebP image optimization with explicit dimensions; `prefers-reduced-motion` support disabling Lenis and Motion animations; responsive design validated at mobile/tablet/desktop breakpoints; `backdrop-blur` performance tested on real Android devices; OpenGraph meta tags and structured data; 0.5px border media query fallback for 1x displays.
**Addresses:** Lighthouse performance (P1), responsive design (P1), `prefers-reduced-motion` (P1), semantic HTML + SEO (P1)
**Avoids:** Glassmorphism mobile scroll jank (Pitfall 5); Lighthouse killed by assets (Pitfall 4); 0.5px border rendering inconsistency (Pitfall 13); broken anchor scroll on dynamic content (Pitfall 8)

### Phase 6: Deployment + Validation
**Rationale:** Vercel deployment is zero-config for Vite projects, but production builds differ from the dev server in worker path resolution, asset hashing, and lazy-loading behavior. Running `npm run build && npm run preview` locally before every Vercel deploy is the primary defense against production-only breakage.
**Delivers:** Live Vercel deployment with automatic HTTPS and global CDN; production build validated locally first; PDF viewer confirmed working in production; final Lighthouse audit on the live URL.
**Uses:** Vercel free tier; Git-push auto-deploy pipeline

### Phase Ordering Rationale

- Data architecture must precede all content sections — TypeScript interfaces and data files are the dependency graph root for the entire project
- Motion infrastructure (centralized variants, `ReactLenis` root wrapper) must precede content sections to avoid retrofitting Lenis onto an existing page, which causes the scroll conflict pitfall
- Static content sections precede complex interactive features (bento expansion, PDF viewer) — validate data flow before adding interaction complexity
- PDF viewer is isolated because its primary risk (worker misconfiguration) is testable independently of other features and must be validated in a production build
- Polish and performance cannot be meaningfully validated until all sections exist
- Deployment is last but a production build test should be run after Phase 4 to catch PDF worker issues before final polish begins

### Research Flags

Phases likely needing deeper research or a spike during planning:
- **Phase 3 (Bento Grid):** Motion `layoutId` expansion from a variable-size bento cell to a full-width or full-screen expanded state has limited tutorial coverage for this exact pattern. The CSS Grid interaction with Motion layout animations during expand/collapse will likely need a prototype spike before committing to the implementation approach.
- **Phase 4 (PDF Viewer):** shadcn CLI v4 introduced Base UI as an alternative to Radix UI primitives. The choice affects Dialog/Drawer component API details. Verify the current shadcn Dialog and Drawer API at implementation time against the CLI v4 changelog.

Phases with standard patterns (skip additional research):
- **Phase 1 (Foundation):** Vite 8 + Tailwind v4 + Motion setup is thoroughly documented in official sources. Follow STACK.md configuration notes exactly.
- **Phase 2 (Content Sections):** Standard React component patterns. Data-mapping and Motion `whileInView` are well-documented with no known edge cases for this use case.
- **Phase 5 (Polish):** Standard web performance patterns. WebP conversion, lazy loading, and Lighthouse auditing are established workflows.
- **Phase 6 (Deployment):** Vercel auto-detects Vite. Zero research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies verified against official docs and recent release notes (March 2026). Package names, import paths, and version numbers confirmed against npm and library announcements. |
| Features | HIGH | Cross-validated against MIT CommLab, NYU Tandon, MIT EECS admissions, and industry semiconductor career sources. Audience-specific feature value is well-evidenced from authoritative sources. |
| Architecture | HIGH | Patterns derived from official library documentation (Lenis React integration, Motion layout animations, shadcn responsive dialog pattern). No speculative or untested patterns. |
| Pitfalls | HIGH | Each critical pitfall traced to a specific GitHub issue, library upgrade guide, or official migration doc. Prevention steps are concrete and testable. |

**Overall confidence:** HIGH

### Gaps to Address

- **Bento grid + Motion `layoutId` expansion specifics:** The exact interaction between CSS Grid layout and Motion's `layoutId` animate-from-bento-cell pattern is not covered in depth in official docs. A prototype spike is recommended during Phase 3 planning before committing to the implementation approach.
- **shadcn CLI v4 Base UI vs Radix choice for Dialog/Drawer:** CLI v4 introduced Base UI as an alternative primitive. The choice affects mobile Drawer behavior. Evaluate at implementation time; Radix is the safer default with broader component coverage.
- **react-pdf v10.4 multi-page navigation UX:** Research confirmed read-only rendering works, but multi-page navigation (prev/next controls for longer academic papers) was not researched in depth. Design a simple page counter component during Phase 4 if papers exceed one page.
- **Font selection:** PROJECT.md specifies "precision typography" but no specific typefaces. Font choice (Inter, Instrument Serif, or similar) will need to be decided in Phase 1. Suggest researching engineering-appropriate faces that complement the "Cleanroom White" aesthetic.
- **0.5px border cross-browser behavior on 1x displays:** Research flagged inconsistency. The `@media (min-resolution: 2dppx)` fallback approach is the standard mitigation but should be validated on a range of actual devices during Phase 5.

## Sources

### Primary (HIGH confidence)
- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) — Rolldown bundler, `@vitejs/plugin-react` v6, Vite 8 configuration
- [Motion official docs](https://motion.dev/) — Renamed from Framer Motion, import from `motion/react`, scroll animations
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) — framer-motion to motion/react migration
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) — Oxide engine, CSS-first configuration, no `tailwind.config.js`
- [Lenis npm](https://www.npmjs.com/package/lenis) — v1.3.19, unified package replacing `@studio-freight/lenis`, React integration
- [React 19.2 blog post](https://react.dev/blog/2025/10/01/react-19-2) — Stable release line
- [TypeScript 5.9 docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html) — Latest stable
- [MIT CommLab — Portfolio Guide](https://mitcommlab.mit.edu/meche/commkit/portfolio/) — Engineering portfolio structure authority
- [MIT EECS — What Faculty Look For](https://www.eecs.mit.edu/academics/graduate-programs/admission-process/what-faculty-members-are-looking-for-in-a-grad-school-application-essay/) — Grad school admissions perspective
- [react-pdf Vite worker issues](https://github.com/wojtekmaj/react-pdf/issues/1843) — Worker config must be in same module
- [NYU Tandon — Building a Portfolio](https://engineering.nyu.edu/life-tandon/experiential-learning-center/building-portfolio) — University career services perspective
- [Pope Tech — Accessible Animation](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) — prefers-reduced-motion guidance

### Secondary (MEDIUM confidence)
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) — Tailwind v4 support, Base UI option
- [Built In — Hardware Engineering Portfolio](https://builtin.com/hardware/hardware-engineering-portfolio) — Industry perspective on hardware portfolios
- [Semiconductor Jobs — Portfolio Projects](https://semiconductorjobs.co.uk/career-advice/portfolio-projects-that-get-you-hired-for-semiconductor-jobs-with-real-github-examples-) — Domain-specific hiring advice
- [Lenis integration blog](https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis) — Lenis + Motion integration gotchas
- [Tailwind v4 migration guide](https://sitegrade.io/en/blog/tailwind-css-v4-2026-migration-guide/) — CSS-first config changes
- [Landdding — Bento Grid Design Guide 2026](https://landdding.com/blog/blog-bento-grid-design-guide) — Bento grid adoption data
- [SiteBuilder Report — Engineer Portfolios](https://www.sitebuilderreport.com/inspiration/engineer-portfolios) — Curated examples
- [Glassmorphism performance](https://www.jobhuntley.com/blog/web-design-trends-for-2026-the-rise-of-glassmorphism-and-how-to-achieve-it-with-css) — backdrop-filter GPU considerations

### Tertiary (LOW confidence)
- [Medium — Glassmorphism 2026](https://medium.com/design-bootcamp/ui-design-trend-2026-2-glassmorphism-and-liquid-design-make-a-comeback-50edb60ca81e) — Single source, corroborated by Apple WWDC 2025 Liquid Glass announcement

---
*Research completed: 2026-03-20*
*Ready for roadmap: yes*
