# Jack Basinski — Engineering Portfolio

## What This Is

A high-performance, minimalist single-page portfolio for Jack Basinski, an Electrical & Computer Engineering student at the University of Washington. The site showcases semiconductor fabrication and system design expertise across analog, RF, and digital domains through interactive project cards, in-browser PDF viewing, and data-driven content sections. Built with Vite 8, React 19, Tailwind v4, and Motion — deployed on Vercel with auto-deploy.

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

### Active

- [ ] Replace placeholder PDFs with real papers and resume
- [ ] Replace placeholder SVG thumbnails with actual project images
- [ ] Replace portrait.jpg placeholder with real photo
- [ ] Browser verification: responsive QA at 375px, 768px, 1280px
- [ ] Browser verification: Lighthouse 90+ score confirmation

### Out of Scope

- Testimonials/quotes section — deferred to v2 (needs content collection)
- Technical blog/notes — deferred to v2 (content creation overhead)
- Certifications section — low priority for v1 launch
- Open source contributions section — deferred to v2
- Dark mode toggle — single cohesive theme for v1
- Contact form backend — direct email link is sufficient
- CMS or admin panel — static content is sufficient
- Hero aurora background — user removed as too distracting
- Coursework section on rendered page — user descoped (component built but excluded)
- Mobile app — web-first approach
- Particle effects / 3D backgrounds — contradicts minimalist philosophy

## Context

Shipped v1.0 with 3,846 LOC TypeScript/TSX/CSS across 171 files.
Tech stack: Vite 8, React 19, Tailwind v4, Motion (framer-motion successor), Lenis, shadcn/ui, react-pdf.
Live at jack-engineering-portfolio.vercel.app with Vercel auto-deploy.
57 requirements defined: 54 complete, 1 deferred (hero aurora), 2 descoped (coursework rendering).
Placeholder static assets need replacement with real content before sharing widely.

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

---
*Last updated: 2026-03-24 after v1.0 milestone*
