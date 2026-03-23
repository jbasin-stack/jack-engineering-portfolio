# Phase 4: Polish and Deployment - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the existing site production-ready: responsive QA across all breakpoints, Lighthouse 90+ performance score, semantic HTML with proper heading hierarchy, OpenGraph meta tags for social previews, and live deployment on Vercel with auto-deploy on push. No new features or sections — polish what exists and ship it.

</domain>

<decisions>
## Implementation Decisions

### Social preview branding
- OG title: "Jack Basinski | ECE at UW" — matches current page title, concise and professional
- OG description: shorter and punchier than the current meta description — direction: "Semiconductor fabrication × system design. Projects, papers, and resume."
- OG image: custom designed 1200x630 card — minimal text-only design on cleanroom white background, name in Inter uppercase (matching hero), subtitle below. Pure typography, consistent with Dieter Rams aesthetic
- Twitter card type: summary_large_image for maximum share card real estate

### Deployment setup
- Platform: Vercel free tier (Hobby plan), default vercel.app URL for now
- GitHub repo: "jack-engineering-portfolio", public visibility (required for Vercel free tier)
- Need to create GitHub repo and push — currently no remote exists
- Auto-deploy on push to main branch
- Build command: `tsc -b && vite build` (existing npm build script)

### Responsive refinements
- Bento grid: stay 3-column through tablet, collapse to single-column only at mobile (<768px)
- Skills (4-col) and Tooling (3-col) grids: keep full columns through tablet, collapse to single-column at mobile
- PDF viewer: Dialog on tablet (enough screen real estate), Drawer only on mobile
- Full responsive audit by Claude — no manual testing done yet, fix all issues found across mobile/tablet/desktop

### Performance optimization
- react-pdf: lazy load on demand via React.lazy + dynamic import — only load when user opens a PDF viewer
- Images: convert to WebP format, add loading="lazy" to all images below the fold
- Fonts: self-host Inter locally — eliminate render-blocking external request to fonts.googleapis.com, bundle font files in the project
- Body fade-in: hide content until hydrated, then fade in to prevent any flash of unstyled content
- JB monogram favicon: create a clean SVG favicon with "JB" initials matching the nav text mark

### Semantic HTML
- Add proper `<header>` and `<footer>` semantic wrappers (currently only `<main>` exists)
- Audit heading hierarchy (H1 > H2 > H3) across all sections
- Ensure all sections use proper `<section>` elements with accessible labels

### Claude's Discretion
- Animation deferral strategy — audit current whileInView usage and optimize only where measurable impact
- Exact WebP compression quality settings
- Heading hierarchy fixes (specific h-tag adjustments)
- Semantic element placement and ARIA labels
- Vercel configuration details (headers, redirects if needed)
- OG description exact wording (direction provided: short and punchy)
- Favicon "JB" monogram design details (font weight, sizing)
- Body fade-in implementation approach (CSS vs JS)

</decisions>

<specifics>
## Specific Ideas

- OG card should be pure typography on cleanroom white — no geometric elements, no illustrations. Name in uppercase Inter matching the hero treatment
- Self-hosting Inter is specifically to eliminate the render-blocking Google Fonts CDN request, not just for offline support
- Body fade-in is a polish detail — prevents FOUC during React hydration, keeps the first impression clean
- The favicon "JB" monogram matches the nav text mark, creating consistent branding across browser tabs and bookmarks
- Responsive philosophy: keep desktop layouts as long as possible, only collapse at mobile breakpoints. Don't add intermediate tablet-specific layouts

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useIsMobile.ts`: Hook for mobile/desktop breakpoint detection — used by PdfViewer for Dialog vs Drawer switching
- `src/styles/motion.ts`: `sectionVariants` and `fadeUpVariant` — all section animations use these consistently
- `src/components/ui/dialog.tsx` and `drawer.tsx`: shadcn v4 components already set up
- `MotionConfig reducedMotion="user"`: Already wrapping app — prefers-reduced-motion handled globally

### Established Patterns
- Section pattern: `<section id="...">` with `px-6 py-24` padding, `mx-auto max-w-5xl` container
- Data-driven rendering from `src/data/*.ts` files with typed interfaces in `src/types/data.ts`
- Tailwind v4 custom tokens: `text-ink`, `bg-cleanroom`, `bg-silicon-50`, accent color
- Weighted tween-only animations (no spring/bounce) enforced by unit tests
- Lenis scroll lock pattern via `useLenis()` hook for overlays (MobileMenu, Dialog, Drawer)

### Integration Points
- `index.html`: Add OG meta tags, self-hosted font links (replace Google Fonts CDN), favicon update
- `App.tsx`: Wrap sections in semantic `<header>`/`<footer>` elements
- `src/components/pdf/PdfViewer.tsx`: Wrap in React.lazy for code splitting
- `package.json`: Add `@fontsource-variable/inter` or copy font files for self-hosting
- Project root: Add `vercel.json` if custom config needed

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-polish-and-deployment*
*Context gathered: 2026-03-23*
