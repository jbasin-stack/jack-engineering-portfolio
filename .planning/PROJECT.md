# Jack Basinski — Engineering Portfolio

## What This Is

A high-performance, minimalist single-page portfolio for Jack Basinski, an Electrical & Computer Engineering student at the University of Washington. The site showcases semiconductor fabrication and system design expertise across analog, RF, and digital domains through an animated hero gradient, glassmorphic tabbed Expertise section, horizontal project carousel, editorial timeline, and in-browser PDF viewing. Features automatic dark/light mode with a blue-primary oklch color system and a local dev-mode admin panel. Built with Vite 8, React 19, Tailwind v4, Motion, and Embla — deployed on Vercel with auto-deploy.

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

- ✓ Animated radial gradient hero with breathing effect and blue-themed palette — v1.2
- ✓ System-preference dark/light mode with blue-primary oklch CSS variable theme — v1.2
- ✓ Unified consistent background across all sections (no hard color breaks) — v1.2
- ✓ Merged Skills & Tooling section with animated glassmorphic tabs per domain — v1.2
- ✓ Horizontal carousel for projects (featured project first position) — v1.2
- ✓ Editorial-style timeline with year anchors, connector line, and scroll animations — v1.2
- ✓ Clean contact layout with direct links, hover animations, and minimal footer — v1.2

### Active

- [ ] Replace placeholder PDFs with real papers and resume
- [ ] Replace placeholder SVG thumbnails with actual project images
- [ ] Replace portrait.jpg placeholder with real photo

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
- Project filtering in carousel — deferred to v2 (only 4 projects currently)
- Manual accent color selection — deferred to v2
- Timeline entry images/categories — deferred (data model supports optional images)

## Context

Shipped v1.2 with 8,253 LOC TypeScript/TSX/CSS.
Tech stack: Vite 8, React 19, Tailwind v4, Motion, Lenis, shadcn/ui, react-pdf, Zod v4, react-resizable-panels, sonner, embla-carousel-react.
Live at jack-engineering-portfolio.vercel.app with Vercel auto-deploy.
v1.0 requirements: 54/57 complete. v1.1 requirements: 23/23 complete. v1.2 requirements: 32/32 complete.
204 tests passing across 28 test files, zero TypeScript errors.
Placeholder static assets still need replacement with real content before sharing widely.
4 orphaned files from Phase 14 component replacements remain as tech debt.

## Constraints

- **Tech stack**: Vite 8 + React 19 with Motion, Lenis, shadcn/ui, Tailwind v4, Embla
- **Content**: All project content swappable without code changes via typed data files
- **Performance**: Lighthouse 90+ target (optimizations implemented, awaiting browser verification)
- **Accessibility**: Semantic HTML, prefers-reduced-motion support, 4-layer reduced-motion strategy
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
| oklch color space for blue-primary palette | Perceptual uniformity, visible blue chroma in neutrals | ✓ Good — consistent across displays, distinct from generic gray |
| shadcn/ui with Base UI (not Radix) | shadcn v4 default, compatible API | ✓ Good — lighter bundle |
| PDF worker in public/ (not import.meta.url) | Stable production path | ✓ Good — works in both dev and prod |
| Custom Vite plugin over external CMS | Zero cost, 9 small files don't justify CMS overhead | ✓ Good — lightweight, fast dev cycle |
| Zero-JS dark mode (blocking script + matchMedia) | No React state, no FOUT, no next-themes dependency | ✓ Good — instant dark mode, zero runtime cost |
| CSS-only hero gradient animation | GPU-composited opacity, no JS per-frame cost | ✓ Good — smooth 7s breathing without jank |
| Vercel-style CSS transitions over Motion layoutId for tabs | Smoother, simpler, no spring physics | ✓ Good — approved after user comparison |
| Embla carousel over custom drag implementation | Battle-tested, accessible, TypeScript-first | ✓ Good — drag/swipe/arrow/keyboard out of the box |
| CSS div connector line over SVG path for timeline | Simpler, Tailwind-styled, no scroll calculations | ✓ Good — editorial feel without scroll-binding complexity |
| Center-aligned carousel with 55%/38% card sizing | One card visually dominant at a time | ✓ Good — premium feel without infinite loop |
| overscrollBehaviorX instead of data-lenis-prevent | Root cause fix for scroll jitter | ✓ Good — Lenis and Embla coexist without event conflicts |
| import.meta.env.DEV ternary for admin tree-shaking | Vite dead-code elimination at build time | ✓ Good — zero admin code in dist/ |

---
*Last updated: 2026-03-30 after v1.2 milestone completion*
