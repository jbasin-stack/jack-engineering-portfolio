# Phase 4: Polish and Deployment - Research

**Researched:** 2026-03-23
**Domain:** Responsive polish, performance optimization, semantic HTML, OpenGraph, Vercel deployment
**Confidence:** HIGH

## Summary

Phase 4 is a pure polish and shipping phase -- no new features, only production-readiness work on an existing Vite 8 + React 19 + Tailwind v4 single-page portfolio. The work spans five distinct areas: responsive QA across breakpoints, Lighthouse performance optimization (the current single JS bundle is ~956KB due to react-pdf being bundled monolithically), semantic HTML improvements (header/footer wrappers, heading hierarchy audit), OpenGraph/Twitter Card meta tags with a custom OG image, and Vercel deployment with auto-deploy from GitHub.

The critical performance bottleneck is clear: react-pdf and its pdfjs-dist dependency constitute the bulk of the JS bundle and are only used when a user opens a PDF viewer. Lazy loading PdfViewer via React.lazy + Suspense will split this into a separate chunk loaded on demand, dramatically reducing the initial bundle. Combined with self-hosting Inter via @fontsource-variable/inter (eliminating a render-blocking Google Fonts CDN request), converting images to WebP, and adding a body fade-in to prevent FOUC, achieving Lighthouse 90+ is highly attainable.

Deployment is straightforward -- Vercel auto-detects Vite projects, requires no vercel.json for basic SPA hosting, and the existing `tsc -b && vite build` script is the correct build command. The main prerequisite is creating a public GitHub repo and pushing the codebase.

**Primary recommendation:** Code-split react-pdf via React.lazy first (biggest performance win), then self-host Inter, add semantic HTML + OG tags, and deploy to Vercel last.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- OG title: "Jack Basinski | ECE at UW"
- OG description direction: "Semiconductor fabrication x system design. Projects, papers, and resume." (short and punchy)
- OG image: custom 1200x630 card, pure typography on cleanroom white background, name in uppercase Inter matching hero, subtitle below. No geometric elements or illustrations
- Twitter card type: summary_large_image
- Deployment: Vercel free tier (Hobby plan), default vercel.app URL
- GitHub repo: "jack-engineering-portfolio", public visibility
- Need to create GitHub repo and push (no remote exists currently)
- Auto-deploy on push to main branch
- Build command: `tsc -b && vite build` (existing npm build script)
- Bento grid: stay 3-column through tablet, single-column only at mobile (<768px)
- Skills (4-col) and Tooling (3-col): keep full columns through tablet, single-column at mobile
- PDF viewer: Dialog on tablet, Drawer only on mobile
- react-pdf: lazy load via React.lazy + dynamic import
- Images: convert to WebP, add loading="lazy" below the fold
- Fonts: self-host Inter locally via npm package, eliminate Google Fonts CDN
- Body fade-in: hide content until hydrated, then fade in
- JB monogram favicon: SVG with "JB" initials matching nav text mark
- Semantic HTML: add `<header>` and `<footer>` wrappers, audit heading hierarchy, ensure `<section>` elements with accessible labels

### Claude's Discretion
- Animation deferral strategy -- audit whileInView usage and optimize only where measurable impact
- Exact WebP compression quality settings
- Heading hierarchy fixes (specific h-tag adjustments)
- Semantic element placement and ARIA labels
- Vercel configuration details (headers, redirects if needed)
- OG description exact wording (direction provided: short and punchy)
- Favicon "JB" monogram design details (font weight, sizing)
- Body fade-in implementation approach (CSS vs JS)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | Site is fully responsive at mobile, tablet, and desktop breakpoints | Responsive audit of existing Tailwind breakpoints; grid collapse strategy documented; PdfViewer Dialog/Drawer breakpoint logic already exists via useIsMobile hook |
| PERF-02 | Semantic HTML with proper heading hierarchy and semantic elements | Current codebase audit reveals: H1 in HeroContent, H2 in all sections, H3 in Skills/Tooling/Timeline/ProjectCard; missing `<header>` and `<footer>` wrappers; all sections already use `<section>` with aria-label |
| PERF-03 | OpenGraph meta tags for polished social previews | OG tag format documented from official spec; requires og:title, og:type, og:image, og:url, og:description in index.html; Twitter Card tags for summary_large_image; OG image must be PNG/JPG (not WebP) |
| PERF-04 | Lighthouse performance score 90+ | Current bundle is 956KB single JS file; react-pdf code splitting via React.lazy is the primary fix; self-hosting Inter eliminates render-blocking request; image lazy loading and WebP conversion for additional gains |
| PERF-05 | Site deployed on Vercel free tier with auto-deploy on push | Vercel auto-detects Vite; GitHub repo creation required; no vercel.json needed for basic SPA; Hobby plan supports unlimited projects with 100GB bandwidth |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| vite | ^8.0.1 | Build tool with code splitting | Installed |
| react | ^19.2.4 | UI framework | Installed |
| tailwindcss | ^4.2.2 | Utility CSS (Tailwind v4) | Installed |
| react-pdf | ^10.4.1 | PDF viewer (lazy load target) | Installed |
| vitest | ^4.1.0 | Test framework | Installed |

### New Dependencies
| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| @fontsource-variable/inter | latest | Self-hosted Inter variable font | Eliminates render-blocking Google Fonts CDN request; locked decision |

### To Remove
| Library | Reason |
|---------|--------|
| @fontsource-variable/geist | Leftover from shadcn init; never imported anywhere; can be removed from package.json |

**Installation:**
```bash
npm install @fontsource-variable/inter
npm uninstall @fontsource-variable/geist
```

## Architecture Patterns

### Font Self-Hosting Pattern
**What:** Replace Google Fonts CDN link with locally bundled font files via @fontsource-variable/inter
**Steps:**
1. Install `@fontsource-variable/inter`
2. Import in `src/main.tsx`: `import '@fontsource-variable/inter/wght.css'`
3. Update CSS `font-family` from `'Inter'` to `'Inter Variable'` in `app.css`
4. Remove Google Fonts `<link>` tags from `index.html` (preconnect + stylesheet)

**Source:** [Fontsource Inter Install](https://fontsource.org/fonts/inter/install)

```typescript
// src/main.tsx
import '@fontsource-variable/inter/wght.css';
import './styles/app.css';
import App from './App.tsx';
```

```css
/* src/styles/app.css -- update both @theme blocks */
--font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
```

### React.lazy Code Splitting for PdfViewer
**What:** Lazy load the PdfViewer component (and its heavy react-pdf dependency) only when a user opens a PDF
**Why:** react-pdf + pdfjs-dist is the largest chunk of the 956KB bundle; users who never open a PDF should never download it

**Pattern:**
```typescript
// src/components/pdf/LazyPdfViewer.tsx
import { lazy, Suspense } from 'react';

const PdfViewer = lazy(() => import('./PdfViewer'));

interface LazyPdfViewerProps {
  file: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LazyPdfViewer(props: LazyPdfViewerProps) {
  // Only render (and thus load) when open
  if (!props.open) return null;
  return (
    <Suspense fallback={null}>
      <PdfViewer {...props} />
    </Suspense>
  );
}
```

**Critical:** PdfViewer.tsx must use `export default` (not named export) for `React.lazy(() => import(...))` to work. Currently it uses a named export `export function PdfViewer` -- this needs to change to `export default function PdfViewer` or the lazy import needs to use destructuring: `lazy(() => import('./PdfViewer').then(m => ({ default: m.PdfViewer })))`.

**Consumers to update:** `PapersSection.tsx`, `Contact.tsx` -- both import PdfViewer directly; switch to LazyPdfViewer.

### Body Fade-In Anti-FOUC Pattern
**What:** Prevent flash of unstyled/unhydrated content by hiding body until React mounts, then fading in
**Approach (CSS-only, simplest):**

```css
/* In app.css */
body {
  opacity: 0;
  transition: opacity 0.3s ease-out;
}
body.hydrated {
  opacity: 1;
}
```

```typescript
// In main.tsx, after createRoot().render()
document.body.classList.add('hydrated');
```

This is the cleanest approach: pure CSS handles the transition, one line of JS triggers it after React renders.

### Semantic HTML Wrapper Pattern
**What:** Wrap nav in `<header>`, contact in `<footer>`, ensure proper heading hierarchy

**Current structure (App.tsx):**
```
<Navigation />    <!-- currently just motion.header inside AnimatePresence -->
<main>
  <Hero />        <!-- section#hero with H1 -->
  <WhoAmI />      <!-- section#about with H2 -->
  <Skills />      <!-- section#skills with H2, H3 children -->
  <Tooling />     <!-- section#tooling with H2, H3 children -->
  <Timeline />    <!-- section#timeline with H2, H3 children -->
  <ProjectsSection /> <!-- section#projects with H2, H3 children -->
  <PapersSection />   <!-- section#papers with H2 -->
  <Contact />     <!-- section#contact with H2 -->
</main>
```

**Analysis of current heading hierarchy:**
- H1: "JACK BASINSKI" in HeroContent -- correct, single H1
- H2: "Who I Am", "Skills", "Lab & Tooling", "Timeline", "Projects", "Papers", "Get in Touch" -- correct, all section headings
- H3: skill domains, tooling categories, timeline milestones, project titles -- correct, subsection headings
- **Hierarchy is already clean.** No skipped levels, no duplicate H1s.

**Semantic gaps to fix:**
1. Navigation already uses `<motion.header>` in Navigation.tsx -- this is semantically correct since `<header>` wraps the nav. However, it conditionally renders (hidden until scroll > 400px). The Hero section has no header wrapper. This is acceptable for a single-page scroll site.
2. Contact section should be wrapped in `<footer>` (or a `<footer>` placed after `</main>` in App.tsx)
3. All `<section>` elements already have `aria-label` attributes -- good

### OpenGraph Meta Tags Pattern
**What:** Add OG and Twitter Card meta tags to index.html for social sharing previews

```html
<!-- index.html <head> additions -->
<!-- OpenGraph -->
<meta property="og:title" content="Jack Basinski | ECE at UW" />
<meta property="og:description" content="Semiconductor fabrication x system design. Projects, papers, and resume." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://jack-engineering-portfolio.vercel.app" />
<meta property="og:image" content="https://jack-engineering-portfolio.vercel.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Jack Basinski - ECE at UW" />
<meta property="og:locale" content="en_US" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Jack Basinski | ECE at UW" />
<meta name="twitter:description" content="Semiconductor fabrication x system design. Projects, papers, and resume." />
<meta name="twitter:image" content="https://jack-engineering-portfolio.vercel.app/og-image.png" />
```

**Critical notes:**
- OG image MUST be PNG or JPG (not WebP/AVIF) -- social platforms don't support modern formats for OG images
- OG image URL must be absolute (full https:// URL), not relative
- OG image goes in `public/og-image.png` so Vite copies it to dist root
- The OG image should be designed as a 1200x630 PNG: cleanroom white background, "JACK BASINSKI" in uppercase Inter (matching hero), subtitle below
- og:url should be updated to the actual Vercel URL after deployment

### JB Monogram Favicon
**What:** Replace the current Vite lightning bolt favicon with a clean "JB" SVG matching the nav text mark

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#FAFAF8"/>
  <text x="16" y="22" text-anchor="middle"
    font-family="Inter, system-ui, sans-serif"
    font-weight="600" font-size="16" fill="#1C1E26"
    letter-spacing="0.08em">JB</text>
</svg>
```

Note: SVG text in favicons has limited font support across browsers. A safer approach is to convert the text to SVG paths. The implementer should trace the "JB" letterforms as `<path>` elements rather than relying on `<text>`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font self-hosting | Manual @font-face declarations | @fontsource-variable/inter | Handles woff2 subsetting, weight ranges, proper font-display automatically |
| Code splitting | Manual dynamic import orchestration | React.lazy + Suspense wrapper | Built into React, Vite handles chunk creation automatically |
| OG image creation | Complex canvas/image generation | Static PNG in public/ | Single-page site only needs one OG image; static file is simplest |
| Deployment config | Custom CI/CD pipeline | Vercel GitHub integration | Zero-config for Vite SPAs; auto-detects framework and build settings |
| Image format conversion | Build-time image processing pipeline | Pre-convert to WebP manually | Only a few SVG project thumbnails exist; no raster images to convert currently |

**Key insight:** The project only has SVG images (project thumbnails, favicon, icons). The "convert to WebP" decision applies to any future raster images. Current SVGs are already optimal. The Vite build doesn't need an image processing plugin.

## Common Pitfalls

### Pitfall 1: OG Image Format
**What goes wrong:** Using WebP or AVIF for og:image causes blank/broken social previews
**Why it happens:** Facebook, Twitter/X, LinkedIn crawlers only reliably support PNG and JPG for OG images
**How to avoid:** Always use PNG for og:image. Keep the file size reasonable (<300KB) with modest compression.
**Warning signs:** Social preview debuggers show blank image

### Pitfall 2: OG Image Relative URL
**What goes wrong:** Using a relative path like `/og-image.png` for og:image
**Why it happens:** Social crawlers need the full absolute URL to fetch the image; they don't know your domain from a relative path
**How to avoid:** Use full absolute URL: `https://your-domain.vercel.app/og-image.png`
**Warning signs:** Image not appearing in Facebook Sharing Debugger or Twitter Card Validator

### Pitfall 3: React.lazy Requires Default Export
**What goes wrong:** `React.lazy(() => import('./PdfViewer'))` fails with "is not a module" or renders nothing
**Why it happens:** React.lazy expects the dynamic import to resolve to a module with a `default` export. PdfViewer currently uses named export.
**How to avoid:** Either add `export default` to PdfViewer, or wrap the import: `lazy(() => import('./PdfViewer').then(m => ({ default: m.PdfViewer })))`
**Warning signs:** Runtime error about missing default export, blank render

### Pitfall 4: Font-Family Name Mismatch
**What goes wrong:** Fonts don't load after switching to @fontsource-variable/inter
**Why it happens:** The CSS font-family name for the variable font is `'Inter Variable'` (not `'Inter'`). If the CSS still references `'Inter'`, the bundled font won't be used and the system fallback renders instead.
**How to avoid:** Update ALL font-family declarations in app.css to use `'Inter Variable'`
**Warning signs:** Different font rendering, layout shifts from fallback font metrics

### Pitfall 5: Body Fade-In Blocking Lighthouse FCP
**What goes wrong:** Setting `opacity: 0` on body delays First Contentful Paint because the browser considers no content "painted" at opacity 0
**Why it happens:** Lighthouse measures when the first pixel of content is painted. If body starts at opacity 0, FCP is delayed until the fade-in begins.
**How to avoid:** Keep the transition duration very short (200-300ms) and trigger `hydrated` class immediately in main.tsx after render. Alternatively, use `visibility: hidden` to `visibility: visible` which doesn't affect paint timing, but this doesn't give a smooth fade.
**Warning signs:** FCP metric in Lighthouse jumps significantly after adding fade-in

### Pitfall 6: Vercel SPA Routing Without Rewrites
**What goes wrong:** Direct URL access (e.g., refreshing or sharing a deep link) returns 404
**Why it happens:** Vercel serves static files and has no server-side routing; without rewrites, any URL that doesn't match a file returns 404
**How to avoid:** For this single-page scroll site with hash anchors (#contact, #projects), this is NOT an issue since all navigation uses hash fragments which don't trigger server requests. No vercel.json rewrites needed.
**Warning signs:** N/A for this project (no client-side routing)

### Pitfall 7: Google Fonts Link Left in index.html
**What goes wrong:** Self-hosted font loads but Google Fonts CDN still loads too, doubling font download
**Why it happens:** Forgetting to remove the `<link>` tags for Google Fonts after adding @fontsource-variable/inter
**How to avoid:** Remove ALL Google Fonts references from index.html: the two preconnect links AND the stylesheet link
**Warning signs:** Network tab shows requests to fonts.googleapis.com and fonts.gstatic.com

## Code Examples

### Verified: @fontsource-variable/inter Import
```typescript
// Source: https://fontsource.org/fonts/inter/install
// In src/main.tsx -- import BEFORE app.css so font is available when styles load
import '@fontsource-variable/inter/wght.css';
import './styles/app.css';
```

### Verified: React.lazy with Named Export Workaround
```typescript
// Source: React docs - React.lazy
// For components with named exports
const PdfViewer = lazy(() =>
  import('./PdfViewer').then((module) => ({
    default: module.PdfViewer,
  }))
);
```

### Verified: Vite manualChunks for react-pdf (Optional)
```typescript
// vite.config.ts -- only if React.lazy doesn't produce desired split
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-pdf': ['react-pdf', 'pdfjs-dist'],
        },
      },
    },
  },
});
```
Note: React.lazy already triggers Vite's automatic code splitting. manualChunks is only needed if you want explicit control over chunk boundaries.

### Verified: OpenGraph Meta Tags
```html
<!-- Source: https://ogp.me/ -->
<meta property="og:title" content="Jack Basinski | ECE at UW" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://jack-engineering-portfolio.vercel.app/og-image.png" />
<meta property="og:url" content="https://jack-engineering-portfolio.vercel.app" />
<meta property="og:description" content="Semiconductor fabrication x system design. Projects, papers, and resume." />
```

### Verified: Twitter Card Tags
```html
<!-- Source: https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Jack Basinski | ECE at UW" />
<meta name="twitter:description" content="Semiconductor fabrication x system design. Projects, papers, and resume." />
<meta name="twitter:image" content="https://jack-engineering-portfolio.vercel.app/og-image.png" />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Fonts CDN | Self-hosted via @fontsource | Ongoing trend (2022+) | Eliminates render-blocking request, better privacy, version locking |
| Single JS bundle | Code splitting via React.lazy | React 16.6+ / Vite native | Dramatic initial load reduction for heavy optional dependencies |
| FID (First Input Delay) | INP (Interaction to Next Paint) | March 2024 | New Core Web Vital; measures worst-case interaction delay |
| `<div>` soup | Semantic HTML5 elements | Established standard | Better accessibility, SEO, screen reader support |

**Existing project strengths:**
- Already uses `<section>` with `aria-label` on all sections
- Already has `prefers-reduced-motion` support via `MotionConfig reducedMotion="user"`
- Already uses Tailwind v4 utility-first CSS (zero runtime CSS overhead)
- Already has vitest with jsdom configured and 10 test files passing

## Open Questions

1. **Actual Vercel URL**
   - What we know: Will be `jack-engineering-portfolio.vercel.app` (or similar based on repo name)
   - What's unclear: Exact URL won't be known until first deploy
   - Recommendation: Use placeholder URL in OG tags, then update after first deploy and re-deploy. Or deploy first (without OG image URL), note the URL, update, and push again.

2. **Project thumbnail images**
   - What we know: All thumbnails reference paths like `/projects/lna-design.svg` but no `/public/projects/` directory exists
   - What's unclear: Whether placeholder SVGs need to be created or if this was addressed in a prior phase
   - Recommendation: Check if project images exist or create placeholders; this affects responsive testing and image optimization scope

3. **OG image design**
   - What we know: User wants pure typography, cleanroom white, uppercase Inter
   - What's unclear: Whether to generate programmatically or create manually
   - Recommendation: Create a static SVG converted to PNG at 1200x630; use Inter font paths (not text element) for cross-platform consistency

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PERF-01 | Responsive breakpoints render correctly | manual-only | N/A (visual QA across breakpoints) | N/A |
| PERF-02 | Semantic HTML heading hierarchy | unit | `npx vitest run src/tests/semantic-html.test.ts -x` | Wave 0 |
| PERF-03 | OG meta tags present in index.html | unit | `npx vitest run src/tests/og-tags.test.ts -x` | Wave 0 |
| PERF-04 | Bundle size / code splitting verification | unit | `npx vitest run src/tests/bundle.test.ts -x` | Wave 0 |
| PERF-05 | Build succeeds without errors | smoke | `npm run build` | Existing |

**Manual-only justification for PERF-01:** Responsive layout testing requires visual inspection across breakpoints; automated DOM testing cannot verify visual rendering, overflow, or touch target sizing. The planner should verify responsive behavior by running `npm run dev` and testing at mobile (375px), tablet (768px), and desktop (1280px) widths.

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run && npm run build`
- **Phase gate:** Full suite green + successful build + manual responsive check before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/tests/og-tags.test.ts` -- verify OG meta tags exist in index.html (can read file as string)
- [ ] Build smoke test: `npm run build` must exit 0 with code-split chunks

## Sources

### Primary (HIGH confidence)
- [Fontsource Inter Install](https://fontsource.org/fonts/inter/install) -- exact import syntax, CSS font-family name, weight range
- [Open Graph Protocol](https://ogp.me/) -- required OG tags, image properties, HTML format
- [X/Twitter Summary Large Image Card](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image) -- twitter:card meta tags
- [Vercel Hobby Plan docs](https://vercel.com/docs/plans/hobby) -- limits, features, pricing
- Project codebase direct inspection -- all component files, package.json, build output

### Secondary (MEDIUM confidence)
- [Vite Code Splitting](https://vite.dev/guide/features) -- automatic code splitting via dynamic import
- [React.lazy documentation](https://react.dev/reference/react/lazy) -- lazy loading pattern
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring) -- metric weights and targets

### Tertiary (LOW confidence)
- Body fade-in technique -- assembled from multiple sources; specific Lighthouse FCP impact of opacity:0 needs validation during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified, versions confirmed from package.json
- Architecture: HIGH -- patterns verified against React/Vite docs, code splitting confirmed working with Vite
- Pitfalls: HIGH -- OG image format/URL issues and React.lazy export requirements well-documented
- Responsive strategy: MEDIUM -- breakpoint decisions locked by user, but visual verification needs manual QA
- Body fade-in FCP impact: LOW -- theoretical concern, needs testing

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable ecosystem, no fast-moving dependencies)
