# Jack Basinski — Engineering Portfolio

## What This Is

A high-performance, minimalist single-page portfolio for Jack Basinski, an Electrical & Computer Engineering student at the University of Washington. The site showcases semiconductor fabrication and system design expertise across analog, RF, and digital domains through interactive project cards, in-browser PDF viewing, and data-driven content sections. Includes a local dev-mode admin panel with live preview for managing all content and assets without hand-editing code. Built with Vite 8, React 19, Tailwind v4, and Motion — deployed on Vercel with auto-deploy.

## Core Value

Every visitor — recruiter, professor, or peer — immediately understands Jack's range and depth as an electrical engineer, and can access the evidence (projects, papers, resume) without friction.

## Requirements

### Validated

- ✓ Typography-first hero with Lenis smooth scroll and glassmorphic navigation — v1.0
- ✓ Skills, Tooling, and WhoAmI sections with responsive grids and semantic HTML — v1.0
- ✓ Interactive bento grid project cards with Motion layout expansion — v1.0
- ✓ In-browser PDF viewer for papers and resume (Dialog/Drawer) — v1.0
- ✓ Scroll-driven Timeline with progressive fill animation — v1.0
- ✓ Contact section with email, LinkedIn, GitHub, and resume download — v1.0
- ✓ UW Purple visual design with noise textures, card spotlight, animated grid — v1.0
- ✓ Performance-optimized (self-hosted fonts, code-split PDF, Lighthouse 90+) — v1.0
- ✓ Deployed on Vercel free tier with auto-deploy on push — v1.0
- ✓ All content data-driven from typed TypeScript data files — v1.0
- ✓ Semantic HTML with proper heading hierarchy and OG meta tags — v1.0
- ✓ prefers-reduced-motion accessibility support — v1.0

- ✓ Local dev-mode admin panel with form-based editors for all 9 content types — v1.1
- ✓ Live split-pane preview (side-by-side editor + rendered view) — v1.1
- ✓ Drag-drop asset upload (images, PDFs) with validation and normalization — v1.1
- ✓ Direct file writes to src/data/*.ts and public/ assets via Vite dev middleware — v1.1
- ✓ Zero admin code in production builds (DEV-gated lazy imports) — v1.1

### Active

- [ ] Animated radial gradient hero with breathing effect and blue-themed palette
- [ ] System-preference dark/light mode with new blue-primary CSS variable theme
- [ ] Unified consistent background across all sections (no hard color breaks)
- [ ] Merged Skills & Tooling section with animated glassmorphic tabs per domain
- [ ] Horizontal carousel for projects (featured project first position)
- [ ] Vertical animated timeline with glowing nodes and scroll-triggered connection lines
- [ ] "Let's Work Together" contact layout with direct links and clean footer
- [ ] Replace placeholder PDFs with real papers and resume
- [ ] Replace placeholder SVG thumbnails with actual project images
- [ ] Replace portrait.jpg placeholder with real photo

## Current Milestone: v1.2 UI Polish & Interactivity

**Goal:** Elevate the portfolio's visual experience with cohesive theming, animated interactions, and modern component patterns inspired by 21st.dev references.

**Target features:**
- Animated gradient hero with breathing effect
- System-preference light/dark mode with blue-primary theme
- Unified background that blends smoothly across all sections
- AnimatedTabs for merged Skills & Tooling (one tab per domain)
- Gallery6 horizontal carousel for projects
- Vertical animated timeline with glowing nodes and scroll-triggered paths
- "Let's Work Together" contact section and clean footer

### Out of Scope

- Testimonials/quotes section — deferred to v2 (needs content collection)
- Technical blog/notes — deferred to v2 (content creation overhead)
- Certifications section — low priority for v1 launch
- Open source contributions section — deferred to v2
- Dark mode toggle — replaced by automatic system-preference matching in v1.2
- Contact form backend — direct email link is sufficient
- Hero aurora background — replaced by animated radial gradient in v1.2
- Coursework section on rendered page — user descoped (component built but excluded)
- Mobile app — web-first approach
- Particle effects / 3D backgrounds — contradicts minimalist philosophy

## Context

Shipped v1.1 with 7,737 LOC TypeScript/TSX/CSS.
Tech stack: Vite 8, React 19, Tailwind v4, Motion, Lenis, shadcn/ui, react-pdf, Zod v4, react-resizable-panels, sonner.
Live at jack-engineering-portfolio.vercel.app with Vercel auto-deploy.
v1.0 requirements: 54/57 complete (1 deferred, 2 descoped). v1.1 requirements: 23/23 complete.
153 tests passing across 23 test files, zero TypeScript errors.
Placeholder static assets still need replacement with real content before sharing widely.

## Constraints

- **Tech stack**: Vite 8 + React 19 with Motion, Lenis, shadcn/ui, Tailwind v4
- **Content**: All project content swappable without code changes via typed data files
- **Performance**: Lighthouse 90+ target (optimizations implemented, awaiting browser verification)
- **Accessibility**: Semantic HTML, prefers-reduced-motion support
- **Budget**: Zero cost — Vercel free tier, no paid services

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page scroll over multi-page routing | Minimalist philosophy; seamless flow | ✓ Good — natural reading experience |
| Inline card expansion over modal detail | Keeps user in context; physical feel | ✓ Good — smooth Motion layout animations |
| Typography-driven skills list over chips | Cleaner, more editorial feel | ✓ Good — matches minimalist aesthetic |
| In-browser PDF viewer over external links | Keeps visitors on-site | ✓ Good — Dialog/Drawer works well |
| Lenis smooth scroll | Premium weighted scroll feel | ✓ Good — sets professional tone immediately |
| Inter self-hosted via @fontsource | Zero external font requests | ✓ Good — eliminates FOUT, faster load |
| oklch color space for cleanroom palette | Perceptual uniformity | ✓ Good — consistent across displays |
| shadcn/ui with Base UI (not Radix) | shadcn v4 default, compatible API | ✓ Good — lighter bundle |
| PDF worker in public/ (not import.meta.url) | Stable production path | ✓ Good — works in both dev and prod |
| SVG feTurbulence for noise textures | Zero JS runtime cost | ✓ Good — static grain, no canvas overhead |
| Coursework section descoped | User decision during visual checkpoint | ✓ Good — cleaner page, component preserved |
| Hero aurora removed | User found too distracting | ✓ Good — typography-first hero is cleaner |
| Uniform bento grid tiles | Cleaner than featured col-span-2 | ✓ Good — equal visual weight per project |
| Custom Vite plugin over external CMS | Zero cost, 9 small files don't justify CMS overhead | ✓ Good — lightweight, fast dev cycle |
| react-resizable-panels v4 directly (not shadcn wrapper) | shadcn Resizable has bug #9136 with v4 | ✓ Good — stable split-pane layout |
| Parallel Zod schemas (not modifying v1.0 code) | Keep v1.0 data files untouched | ✓ Good — clean separation of concerns |
| Atomic writes with Windows EPERM/EBUSY retry | Prevent file corruption on rapid saves | ✓ Good — no corruption in testing |
| import.meta.env.DEV ternary for admin tree-shaking | Vite dead-code elimination at build time | ✓ Good — zero admin code in dist/ |
| useKeyboardShortcuts inside AdminShell (not App.tsx) | Direct access to save/dirty state without prop-drilling | ✓ Good — clean integration, no production leak |

---
*Last updated: 2026-03-26 after v1.2 milestone start*
