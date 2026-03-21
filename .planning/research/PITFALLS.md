# Domain Pitfalls

**Domain:** Premium minimalist engineering portfolio (single-page scroll SPA)
**Researched:** 2026-03-20

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or fundamentally undermine the project goals.

### Pitfall 1: react-pdf Worker Misconfiguration in Vite
**What goes wrong:** PDF viewer renders blank or crashes with "Setting up fake worker" or "GlobalWorkerOptions.workerSrc not found" errors.
**Why it happens:** react-pdf requires PDF.js's Web Worker to be configured correctly. With Vite, the worker file path must use `import.meta.url` for proper resolution, AND the configuration must happen in the same module where `<Document>` is rendered (not in `main.tsx` or a separate config file) due to ES module execution order.
**Consequences:** In-browser PDF viewing completely non-functional. A core feature of the portfolio is broken.
**Prevention:**
1. Configure `pdfjs.GlobalWorkerOptions.workerSrc` in the same file as the `<Document>` component
2. Use `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()`
3. Install `vite-plugin-static-copy` to copy cMap and standard font files to the build output
4. Test production build (`npm run build && npm run preview`) -- the worker path often works in dev but breaks in production
**Detection:** Test PDF viewing in production build locally before deploying. If PDFs load in dev but not in preview/production, the worker path is wrong.

### Pitfall 2: Importing from `framer-motion` Instead of `motion/react`
**What goes wrong:** You install the `motion` package but import from `framer-motion` (which is either not installed or is the deprecated package). Or you install `framer-motion` and get the legacy API without new features like native ScrollTimeline.
**Why it happens:** Every tutorial, Stack Overflow answer, and AI training data from before late 2024 uses `framer-motion`. The rename to Motion is relatively recent. Old imports still "work" if you install the legacy package, but you miss performance improvements and new APIs.
**Consequences:** Using deprecated APIs that may break. Missing native browser animation APIs (ScrollTimeline, ViewTimeline) that Motion 12.x leverages for better scroll performance. Potential bundle size issues from installing both packages.
**Prevention:** Install `motion` (not `framer-motion`). Import from `motion/react`. Search-and-replace any `framer-motion` imports.
**Detection:** `grep -r "framer-motion" src/` should return zero results.

### Pitfall 3: Lenis + Motion Scroll Animation Conflicts
**What goes wrong:** Lenis intercepts native scroll events to create smooth interpolation. Motion's `useScroll` and `whileInView` may not fire correctly because Lenis virtualizes the scroll position.
**Why it happens:** Both libraries touch scroll behavior. Lenis wraps the native scroll in a virtual smooth layer. Motion's IntersectionObserver (used by `whileInView`) reads from the browser's actual scroll position, which can desync from Lenis's interpolated position.
**Consequences:** Animations fire at wrong scroll positions, or `whileInView` triggers too early/late.
**Prevention:**
1. Use Lenis's native wrapper mode (not virtual scroll) -- this keeps IntersectionObserver working correctly
2. For `useScroll`-linked animations, use the `container` option pointing to the Lenis scroll container if needed
3. Test scroll-triggered animations with Lenis enabled early in development -- don't add Lenis as an afterthought
**Detection:** Scroll the page slowly and verify each `whileInView` animation fires when the element becomes visible, not before or after.

### Pitfall 4: Lighthouse Performance Killed by Unoptimized Images and PDFs
**What goes wrong:** Portfolio loads slowly (Lighthouse < 90). Largest Contentful Paint (LCP) is a project image. Total Blocking Time (TBT) spikes from PDF.js initialization.
**Why it happens:** Project images saved as PNG at full resolution. PDFs loaded eagerly instead of lazily. No image optimization pipeline.
**Consequences:** Violates the project's 90+ Lighthouse constraint. Slow portfolios undermine credibility with technical recruiters.
**Prevention:**
1. Convert all images to WebP format, serve at appropriate sizes (not 4000px originals)
2. Lazy-load images below the fold with `loading="lazy"` or Motion's viewport detection
3. Lazy-load the entire PdfViewer component with `React.lazy()` -- don't import react-pdf at the top level
4. Keep hero section lightweight (text + minimal graphics, no heavy images above the fold)
**Detection:** Run Lighthouse in Chrome DevTools before every deploy. Check Network tab for resource sizes.

## Moderate Pitfalls

### Pitfall 5: Glassmorphism `backdrop-filter` Performance on Mobile
**What goes wrong:** Fixed glassmorphic nav with `backdrop-blur-lg` causes janky scrolling on older mobile devices.
**Why it happens:** `backdrop-filter: blur()` is GPU-intensive, especially when applied to fixed-position elements that the browser must recomposite on every frame during scroll.
**Prevention:**
1. Use the lightest blur that looks acceptable (`backdrop-blur-sm` or `backdrop-blur-md` instead of `backdrop-blur-lg`)
2. Add `will-change: transform` to the nav element to hint GPU compositing
3. Consider `@media (prefers-reduced-motion: reduce)` to disable blur on devices that request it
4. Test on a real mid-tier Android phone, not just iPhone Pro

### Pitfall 6: Over-Animating and the "Bounce" Problem
**What goes wrong:** Animations feel bouncy, playful, or excessive rather than weighted and physical. The site feels like a demo of Framer Motion rather than a professional portfolio.
**Why it happens:** Motion's default spring config has noticeable bounce (`stiffness: 100, damping: 10`). Developers add animations to every element because they can.
**Prevention:**
1. Use high-damping springs: `{ type: 'spring', stiffness: 300, damping: 30 }` -- these feel weighted, not bouncy
2. Or use custom easing curves: `[0.25, 0.1, 0.25, 1.0]` (a smooth deceleration)
3. Define animation variants in ONE central file and reuse everywhere -- enforces consistency
4. Rule: if an element is not interactive and not entering the viewport for the first time, it should NOT animate
5. Use `viewport: { once: true }` so elements only animate on first appearance, not every scroll pass

### Pitfall 7: Tailwind v4 Configuration Confusion
**What goes wrong:** Developers create a `tailwind.config.js` file, use PostCSS setup, or try to use Tailwind v3 patterns with Tailwind v4.
**Why it happens:** Nearly all existing tutorials and Stack Overflow answers describe Tailwind v3 configuration. Tailwind v4 fundamentally changed to CSS-first configuration with `@theme` directives.
**Prevention:**
1. Use `@tailwindcss/vite` plugin (NOT PostCSS) -- this is the Vite-native approach for v4
2. Custom theme values go in CSS: `@theme { --color-cleanroom-white: #fafafa; }` -- not in a JS config file
3. Consult the Tailwind v4 docs specifically, not generic "Tailwind" tutorials

### Pitfall 8: Broken Anchor Scroll on Dynamic Content
**What goes wrong:** Clicking a nav link scrolls to the wrong position, or the target section isn't found.
**Why it happens:** If section heights change after initial render (images loading, fonts swapping, animations expanding content), the scroll target position calculated at click time may be stale. Also, Lenis's `scrollTo` needs the section's `id` attribute to match exactly.
**Prevention:**
1. Ensure all section `id` attributes match navigation href anchors exactly
2. Use Lenis's `scrollTo('#section-id')` method rather than native `element.scrollIntoView()`
3. Add a small scroll offset to account for the fixed nav height
4. Ensure images have explicit `width`/`height` attributes to prevent layout shift

### Pitfall 9: Vite 8 Rolldown Compatibility with Older Plugins
**What goes wrong:** Third-party Vite plugins that relied on Rollup-specific internals may break under Vite 8's Rolldown bundler.
**Why it happens:** Vite 8 replaced Rollup with Rolldown (a Rust-based bundler). While plugin compatibility is maintained for the standard API, edge cases exist.
**Prevention:**
1. Use `vite-plugin-static-copy` (well-maintained, likely compatible) -- test immediately after setup
2. If a plugin breaks, check its GitHub issues for Vite 8 compatibility notes
3. Have a fallback plan: Vite 7 is still supported if a critical plugin fails under Vite 8

## Minor Pitfalls

### Pitfall 10: shadcn/ui CLI v4 Init with Wrong Defaults
**What goes wrong:** Running `npx shadcn@latest init` picks wrong defaults for Tailwind v4 or selects Radix when you wanted Base UI (or vice versa).
**Prevention:** Run the init interactively and select: Tailwind CSS v4, your preferred primitive library (Radix is the safer default with more components), and your path aliases. Review the generated `components.json` before proceeding.

### Pitfall 11: Missing `@import "tailwindcss"` in CSS
**What goes wrong:** Tailwind classes don't apply at all. The site renders as unstyled HTML.
**Why it happens:** Tailwind v4's CSS-first approach requires `@import "tailwindcss"` in your main CSS file. Without this, the Vite plugin has nothing to process.
**Prevention:** Verify `globals.css` starts with `@import "tailwindcss"` immediately after project setup.

### Pitfall 12: Font Loading Flash (FOUT)
**What goes wrong:** Text flashes from fallback system font to the custom font after page load.
**Prevention:** Use `font-display: swap` for custom fonts. Preload the primary font in `<head>` with `<link rel="preload">`. Consider using a system font stack as fallback that closely matches the custom font's metrics.

### Pitfall 13: 0.5px Border Rendering Inconsistency
**What goes wrong:** The signature 0.5px borders render differently across browsers and screen densities. On 1x displays, 0.5px may round to 0px (invisible) or 1px (too thick).
**Prevention:** Test on both Retina (2x) and standard (1x) displays. On 1x displays, use `border-[1px]` as a fallback. Consider a CSS `@media (min-resolution: 2dppx)` query to conditionally apply 0.5px borders only on high-DPI screens.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project setup | Tailwind v4 config confusion (Pitfall 7) | Follow Tailwind v4 + Vite docs specifically. No `tailwind.config.js`. |
| Project setup | Vite 8 plugin compat (Pitfall 9) | Test vite-plugin-static-copy immediately. |
| Smooth scroll integration | Lenis + Motion scroll conflicts (Pitfall 3) | Add Lenis first, test scroll animations immediately after. |
| Animation system | Over-animation / bounce (Pitfall 6) | Define central variants file first. High-damping springs only. |
| PDF viewer | Worker misconfiguration (Pitfall 1) | Configure worker in same file as Document. Test prod build. |
| Image assets | Lighthouse performance (Pitfall 4) | WebP format, lazy loading, explicit dimensions. |
| Glassmorphic nav | Mobile scroll jank (Pitfall 5) | Light blur, test on real Android devices. |
| Design details | 0.5px border rendering (Pitfall 13) | Test on both 1x and 2x displays. Media query fallback. |
| Deployment | Production build differences | Always test `npm run build && npm run preview` locally before deploying. |

## Sources

- [react-pdf Vite worker issues](https://github.com/wojtekmaj/react-pdf/issues/1843) - Worker config must be in same module
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) - framer-motion to motion/react migration
- [Lenis smooth scroll blog](https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis) - Integration patterns and gotchas
- [Glassmorphism performance](https://www.jobhuntley.com/blog/web-design-trends-for-2026-the-rise-of-glassmorphism-and-how-to-achieve-it-with-css) - backdrop-filter GPU considerations
- [Tailwind CSS v4 migration](https://sitegrade.io/en/blog/tailwind-css-v4-2026-migration-guide/) - CSS-first config changes
- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) - Rolldown bundler, plugin compatibility
- [Vite static deployment](https://vite.dev/guide/static-deploy) - Build and preview testing
