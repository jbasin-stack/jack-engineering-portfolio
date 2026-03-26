# Domain Pitfalls

**Domain:** Adding animated gradient hero, dark/light theming, embla-carousel, AnimatedTabs, scroll-triggered SVG timeline, and refreshed contact/footer to an existing Vite 8 + React 19 + Tailwind v4 + Motion + Lenis portfolio
**Researched:** 2026-03-26
**Confidence:** HIGH (verified against official docs, GitHub issues, codebase inspection, and community patterns)

---

## Critical Pitfalls

Mistakes that cause rewrites, visual regression, or fundamental architecture problems.

### Pitfall 1: Lenis Hijacks Embla Carousel Scroll Events

**What goes wrong:**
The horizontal carousel (Gallery6 / embla-carousel) becomes impossible to navigate via trackpad swipe. Users attempt to swipe horizontally, but Lenis intercepts the slight vertical component of every trackpad gesture and scrolls the page instead. The carousel feels "stuck" or "fighting" the page. On touch devices, the same conflict makes the carousel drag feel sluggish or cause the page to jump vertically.

**Why it happens:**
Lenis hooks into the wheel event globally (via `smoothWheel: true` on the `<ReactLenis root>` wrapper). Trackpad horizontal swipes always include a small vertical delta. Lenis reads that vertical delta and applies smooth scrolling to the page, consuming the event before Embla can process the horizontal component. The current SmoothScroll component uses `autoRaf: false` with Motion's frame loop, which makes Lenis particularly aggressive about processing every scroll event synchronously.

**Consequences:**
- Trackpad users cannot swipe the carousel at all
- Touch users experience page jumping while trying to drag carousel slides
- Mouse wheel users may have no issue (wheel is purely vertical), masking the bug during dev testing with a mouse

**Prevention:**
1. Add `data-lenis-prevent` attribute to the Embla viewport container element. This tells Lenis to completely skip scroll processing inside that element, letting Embla handle all pointer/touch/wheel events natively.
2. Pair with `overscroll-behavior: contain` CSS on the carousel viewport to prevent scroll propagation from leaking back to the page.
3. Set `touch-action: pan-y pinch-zoom` on the carousel viewport for horizontal carousels -- this tells the browser "vertical panning is for the page, horizontal is for this element."
4. Test with a trackpad, not just a mouse. Mouse wheel testing will not catch this bug.

**Detection:**
- Test on a MacBook trackpad or Windows precision touchpad with two-finger horizontal swipe
- Page scrolls vertically when user intends to scroll the carousel horizontally
- Carousel drag feels "sticky" or unresponsive on touch devices

**Phase to address:** The phase that implements the Gallery6 horizontal carousel. Must be solved during carousel integration, not after.

---

### Pitfall 2: Animated Gradient Triggers Continuous Repaints, Destroys Mobile Battery

**What goes wrong:**
The animated radial gradient hero background causes constant GPU repaints at 60fps, even when the hero section is off-screen. Mobile users see significant battery drain. Lower-end Android devices and older iPhones show visible jank when scrolling past the hero. Lighthouse Performance score drops below 90.

**Why it happens:**
Directly animating `background-size`, `background-position`, or gradient color stops in CSS triggers a repaint on every frame. Unlike `transform` and `opacity` (which are compositor-only properties), gradient changes require the browser to re-rasterize the entire element. A "breathing" effect that continuously animates `background-size` of a radial-gradient is the worst case -- it forces the GPU to recalculate the gradient every frame, consuming significant power. The `will-change` property does not help here because gradient painting cannot be promoted to a compositor layer the way transforms can.

**Consequences:**
- 15-25% CPU usage just from the hero background on desktop
- Visible frame drops when scrolling on mobile
- Battery drain on mobile devices (users close the tab)
- Lighthouse flags "Avoid excessive DOM size" or "Reduce main-thread work"

**Prevention:**
1. Do NOT animate `background-size` or gradient color stops directly. Instead, create two gradient layers and animate `opacity` between them using `@keyframes`. Opacity is a compositor-only property and is hardware-accelerated.
2. Alternative: create an oversized gradient (300-400% of the element) and animate `background-position` using a very slow `@keyframes` (60s+ cycle). Position animation on a promoted layer is cheaper than size animation.
3. Use CSS `@property` to register custom properties for color stops, enabling the browser to interpolate them efficiently. Browser support: Chrome 85+, Edge 85+, Firefox 128+, Safari 16.4+.
4. Pause or reduce animation when the hero is off-screen. Use `IntersectionObserver` to toggle an `animation-play-state: paused` class.
5. Respect `prefers-reduced-motion: reduce` by disabling the animation entirely (the existing app already has a pattern for this in `app.css`).
6. On mobile, simplify to a static gradient or dramatically reduce animation frequency via `@media (max-width: 768px)`.

**Detection:**
- Chrome DevTools > Performance tab shows constant "Paint" events from the hero section
- `will-change: background` or `will-change: background-size` in the CSS (this is a red flag, not a fix)
- Battery drain complaints from mobile users

**Phase to address:** The phase that implements the animated gradient hero. Must use the correct animation technique from day one -- retrofitting is a full rewrite of the effect.

---

### Pitfall 3: oklch-to-Hex Theme Migration Breaks Existing Color References

**What goes wrong:**
The portfolio's existing cleanroom palette uses oklch color space throughout (e.g., `oklch(0.985 0.002 90)` for `--color-cleanroom`, `oklch(0.55 0.15 250)` for `--color-accent`). Introducing a dark/light theme that redefines CSS variables with hex values (e.g., `--background: #0a0a0a`) creates a mixed color space. Components that use `oklch()` functions directly in their styles clash with theme variables that are now hex. Tailwind v4's color utilities compute differently depending on whether the underlying variable is oklch or hex, causing subtle color mismatches, broken opacity modifiers (e.g., `bg-accent/50`), and gradient banding.

**Why it happens:**
Tailwind v4 uses CSS custom properties for colors. When you write `bg-accent/50`, Tailwind generates `oklch(var(--color-accent) / 0.5)` if the original value is oklch, or `rgb(var(--color-accent) / 0.5)` if the value looks like RGB. Mixing oklch and hex/rgb values in the same theme breaks the opacity modifier syntax because the browser cannot apply `/0.5` alpha to a hex color inside an `oklch()` function. The 21st.dev reference components (AnimatedTabs, Gallery6) ship with hex-based HSL or RGB theme variables -- copy-pasting these into an oklch codebase creates immediate conflicts.

**Consequences:**
- `bg-accent/50` produces `oklch(#1a56db / 0.5)` which is invalid CSS
- Colors render as black or transparent in dark mode
- Gradient transitions between oklch and hex colors produce unexpected intermediate values
- The entire shadcn component theme breaks because it relies on consistent variable format

**Prevention:**
1. Keep ALL theme variables in oklch format. Do not switch to hex just because the reference components use hex. Convert hex values to oklch equivalents (use oklch.com or browser DevTools color picker).
2. Define the complete dark mode theme under `.dark` in `app.css` using oklch values for every variable: `--background`, `--foreground`, `--primary`, `--accent`, etc.
3. The existing `@custom-variant dark (&:is(.dark *))` in app.css already declares the dark variant. Extend this by adding `:root.dark` (or `.dark`) style block with oklch overrides for all shadcn theme tokens.
4. Do NOT copy hex values from 21st.dev reference components. Translate them to oklch first.
5. Test opacity modifiers (`bg-accent/50`, `text-primary/80`) in both light and dark mode after migration.

**Detection:**
- Browser console shows "Invalid property value" for color CSS properties
- Elements appear black, transparent, or wrong-colored in dark mode only
- Tailwind opacity modifiers (`/50`, `/80`) stop working on theme colors
- Color picker in DevTools shows "invalid" for computed color values

**Phase to address:** The phase that implements the dark/light theme system. Must be the FIRST thing built in that phase, before any component color changes. All subsequent component work depends on a correct theme foundation.

---

### Pitfall 4: 21st.dev Reference Components Assume Next.js Patterns That Break in Vite

**What goes wrong:**
Components copied from 21st.dev (AnimatedTabs, Gallery6, gradient backgrounds) use Next.js-specific imports (`next/image`, `next/link`), directives (`"use client"`), and framework assumptions (`next-themes` for theming) that either error, silently fail, or produce incorrect behavior in a Vite + React SPA.

**Why it happens:**
21st.dev components are built for the Next.js App Router ecosystem. Specific patterns that break:
- `"use client"` directive: harmless in Vite (ignored as a string literal), but indicates the component was designed for a server/client boundary that does not exist in a SPA. Logic that relies on being "client-only" (like checking `typeof window !== 'undefined'`) is unnecessary overhead.
- `next/image`: provides automatic image optimization, lazy loading, blur placeholders, and srcset generation. A plain `<img>` tag replacement loses all of these. Using `next/image` directly causes a build error.
- `next-themes`: the package is already in `package.json` but never imported. It has deep Next.js dependencies and will not work correctly without a Next.js context provider. Its `useTheme()` hook returns undefined values without the proper provider.
- `next/link`: uses client-side routing that does not exist in a single-page scroll app.

**Consequences:**
- Build errors from unresolved `next/image` or `next/link` imports
- `next-themes` `useTheme()` returns `undefined` for theme, causing conditional rendering bugs
- Images lose optimization (no srcset, no lazy loading, no blur placeholder)
- Unnecessary `"use client"` directives clutter the codebase

**Prevention:**
1. Never copy 21st.dev components verbatim. Treat them as visual references only.
2. Replace `next/image` with `<img loading="lazy" decoding="async" />` plus explicit `width`/`height` attributes. For responsive images, add `srcSet` and `sizes` manually.
3. Remove `next-themes` from `package.json`. Build a lightweight theme provider using shadcn's official Vite dark mode pattern: a React Context + `localStorage` + `window.matchMedia("(prefers-color-scheme: dark)")` listener. The shadcn docs provide the exact implementation at `ui.shadcn.com/docs/dark-mode/vite`.
4. Strip `"use client"` directives -- they are no-ops in Vite but signal that the component needs adaptation.
5. Replace `next/link` with `<a href="#section">` for same-page scroll navigation or plain `<a>` for external links.
6. For each 21st.dev component, make a checklist: imports, hooks, context providers, and framework assumptions. Adapt each one.

**Detection:**
- Build errors referencing `next/image`, `next/link`, or other `next/*` modules
- `useTheme()` returns `{ theme: undefined, setTheme: undefined }` at runtime
- Components render but have no interactivity (theme switching does nothing)
- The string `"use client"` appears in .tsx files (search the codebase)

**Phase to address:** Every phase that adapts a 21st.dev reference component. Create a "Next.js adaptation checklist" as a reusable pattern in the first phase that uses a reference component.

---

### Pitfall 5: Dark Mode Flash of Unstyled Theme (FOUT) on Page Load

**What goes wrong:**
The portfolio loads in light mode for 200-500ms, then snaps to dark mode. Users with `prefers-color-scheme: dark` see a bright white flash before the dark theme applies. This is physically uncomfortable (eye strain) and looks unprofessional.

**Why it happens:**
The existing app has `body { opacity: 0; }` with `body.hydrated { opacity: 1; }` -- this was designed to prevent FOUT for fonts. But if the theme provider applies the `.dark` class after React hydration (in a `useEffect`), there is a window where the DOM is visible but the wrong theme is applied. The hydration gate (`opacity: 0` until `body.hydrated`) partially masks this, but if the theme class is applied AFTER the hydrated class, there is still a flash. This is worse on slow networks or slow devices where the React bundle takes longer to execute.

**Consequences:**
- Bright white flash before dark mode applies (painful for dark-mode users)
- Visible color transition as CSS variables switch from light to dark values
- Perceived as a performance bug by recruiters viewing the portfolio

**Prevention:**
1. Apply the theme class BEFORE React renders. Add a blocking `<script>` in `index.html` `<head>` that reads `localStorage` and `window.matchMedia("(prefers-color-scheme: dark)")`, then sets `document.documentElement.classList.add("dark")` synchronously. This script runs before any CSS or React code.
2. Use `color-scheme: dark light` meta tag in `<head>` to tell the browser about supported schemes, enabling correct scrollbar and form control colors before JS loads.
3. For system-preference-only (no toggle), use CSS `@media (prefers-color-scheme: dark)` to define dark mode variables. This requires zero JavaScript and has zero flash. But it means no manual toggle.
4. Keep the existing `body { opacity: 0 }` gate. Ensure the theme class is applied BEFORE `body.hydrated` is added. Sequence: blocking script sets `.dark` class -> React mounts -> hydrated class added -> page fades in with correct theme.
5. Test by throttling CPU 6x in Chrome DevTools and reloading with dark system preference.

**Detection:**
- Set system to dark mode, hard-refresh the page (Ctrl+Shift+R), watch for a white flash
- Throttle CPU in Chrome DevTools > Performance tab, reload -- the flash becomes more visible
- The `<html>` element lacks the `.dark` class during the first 100ms of page load

**Phase to address:** The phase that implements dark/light theming. The blocking script in `index.html` must be the FIRST thing implemented, before any React-side theme logic.

---

## Moderate Pitfalls

### Pitfall 6: Motion LayoutGroup in ProjectsSection Conflicts with Embla Carousel

**What goes wrong:**
The current `ProjectsSection` uses Motion's `<LayoutGroup>` and `<motion.div>` with layout animations for the bento grid. Replacing the grid with an Embla carousel while keeping `LayoutGroup` causes slides to "jump" or "teleport" during transitions. Embla manages its own internal scroll position and transforms, but Motion's layout system tries to animate the same elements, creating a visual tug-of-war.

**Why it happens:**
Motion's layout animations work by measuring an element's position before and after a React render, then applying a `transform` to animate between the two states. Embla also applies `transform: translate3d()` to position slides. When both systems try to control the same element's transform, they overwrite each other. Additionally, `LayoutGroup` triggers measurement on ALL grouped components when ANY one re-renders, causing unnecessary recalculations across the carousel.

**Prevention:**
1. Remove `<LayoutGroup>` from the carousel implementation. Embla manages its own layout.
2. Do not use `motion.div` with the `layout` prop on carousel slides or the carousel viewport. Use plain `<div>` elements for the Embla structure.
3. Motion animations INSIDE carousel slides are fine (e.g., `whileHover` on a card), but the slide container itself must not have layout animations.
4. If the old bento grid expand behavior (click-to-expand cards) is kept alongside the carousel, separate the layout animation scope from the carousel scope entirely.

**Detection:**
- Carousel slides visually "jump" to wrong positions when navigating
- Console warnings about layout animation conflicts
- Slides appear at wrong offsets after a React re-render

**Phase to address:** The phase that replaces the bento grid with Gallery6 carousel.

---

### Pitfall 7: Scroll-Triggered SVG Timeline Animations Cause Jank When Using Non-Compositor Properties

**What goes wrong:**
The new vertical timeline with glowing nodes and scroll-triggered SVG connection lines animates SVG `pathLength`, `stroke-dashoffset`, `fill`, or `stroke` properties. These are NOT compositor-friendly properties -- they trigger repaint on every scroll frame. With 8-12 timeline nodes visible, each with its own SVG path animation driven by `useScroll`, the main thread saturates and scrolling becomes janky.

**Why it happens:**
SVG attribute animations (stroke, fill, pathLength) require the browser to repaint the SVG on every frame. Unlike `transform` and `opacity`, SVG paint properties cannot be offloaded to the GPU compositor. The current timeline already uses `useScroll` with `useMotionValueEvent` to sync scroll progress to React state (`setIsActive`), which triggers re-renders. Adding SVG path animations on top of this compounds the cost: each scroll frame triggers N state updates (one per node) plus N SVG repaints.

**Prevention:**
1. Use Motion's native `motion.path` with `pathLength` animated via `useTransform` mapped from `scrollYProgress`. When Motion directly animates `pathLength` via its `style` prop (not React state), it bypasses React re-renders and uses requestAnimationFrame directly.
2. Minimize React state updates from scroll. The current pattern (`useMotionValueEvent` -> `setIsActive`) forces a re-render per node per scroll event. Instead, use Motion's `useTransform` to derive `opacity` and `scale` values directly from the scroll progress MotionValue, keeping everything in the animation thread.
3. For the "glowing nodes" effect, use CSS `box-shadow` with `transition` triggered by a class change, not a continuously animated glow driven by scroll progress. The glow should be a discrete state (inactive -> active), not a continuous animation.
4. Use `motion.svg` and `motion.path` so Motion can use native ScrollTimeline (hardware-accelerated) when the browser supports it.
5. Profile with Chrome DevTools > Performance. Look for green "Paint" bars during scroll -- there should be minimal paint activity.

**Detection:**
- Scrolling through the timeline section feels sluggish or drops below 60fps
- Chrome DevTools Performance tab shows "Long Frame" warnings during timeline scroll
- Multiple "setState" calls appear in the React Profiler during a single scroll gesture

**Phase to address:** The phase that implements the new animated timeline.

---

### Pitfall 8: Theme Provider Breaks Admin Panel Tree-Shaking

**What goes wrong:**
The theme provider (Context + `useTheme` hook) is added at the App root level, wrapping both the portfolio and the admin panel. The theme provider imports become part of the critical path. If the theme provider is co-located with admin-aware code, or if admin components import from the theme provider module, the tree-shaking boundary for admin code is weakened.

**Why it happens:**
The current architecture uses `import.meta.env.DEV` ternary to conditionally assign `AdminShell`. The `AdminShell` sits OUTSIDE the `<SmoothScroll>` wrapper. If a `<ThemeProvider>` is added above `<SmoothScroll>` (to theme both portfolio and admin), the admin panel now depends on a production module. This is fine -- the provider is small. But if someone later adds theme-aware utilities to the admin panel that import from shared modules, those shared modules get pulled into the admin chunk, potentially pulling admin code back into production via shared chunk deduplication.

**Prevention:**
1. The ThemeProvider should be a separate, tiny module (`components/theme-provider.tsx`) with zero admin imports.
2. Place `<ThemeProvider>` in App.tsx ABOVE both the admin conditional and the `<SmoothScroll>`. This is correct because both admin and portfolio need theming.
3. Admin components can import the `useTheme` hook from the theme provider. This is safe because the theme provider itself is a production module (it should be). The dangerous direction is the reverse: theme provider importing from admin/.
4. Verify tree-shaking after adding the theme provider: `vite build && ls dist/assets/` -- confirm no admin chunks appear.

**Detection:**
- `dist/assets/` contains admin-related chunks after adding the theme provider
- Bundle size increases beyond the expected theme provider addition (~1-2KB)

**Phase to address:** The phase that implements dark/light theming. Verify tree-shaking before and after.

---

### Pitfall 9: Dark Mode Breaks Existing Visual Effects (Noise Texture, Glassmorphism, Card Spotlight)

**What goes wrong:**
The existing portfolio has multiple visual effects calibrated for the light cleanroom aesthetic: SVG `feTurbulence` noise textures, glassmorphic navigation with `backdrop-blur`, card spotlight hover effects, and the `AnimatedGridPattern` on the timeline section. Switching to dark mode causes: noise texture becomes invisible (light noise on dark background), glassmorphic blur looks muddy (wrong alpha values), card borders disappear (border colors too similar to dark background), and the animated grid pattern vanishes (uw-purple/15 on dark background is invisible).

**Why it happens:**
All existing visual effects were designed for a light background (`oklch(0.985 0.002 90)`). They use carefully tuned opacity values (e.g., `fill-uw-purple/15`, `stroke-uw-purple/15`) that work against a near-white background but become invisible against a dark background. The noise texture SVG uses a light-colored base that blends with the cleanroom background but clashes with dark surfaces.

**Prevention:**
1. Audit EVERY visual effect component for hardcoded light-mode assumptions. Create a checklist: noise texture, AnimatedGridPattern, card spotlight, glassmorphic nav, border colors, shadow colors.
2. For each effect, define dark-mode variants with adjusted opacity/color values. Example: `fill-uw-purple/15` in light mode might need to be `fill-uw-purple-light/20` in dark mode.
3. Use Tailwind's `dark:` variant for effect adjustments: `className="fill-uw-purple/15 dark:fill-uw-purple-light/25"`.
4. The SVG noise texture may need a completely different approach in dark mode (e.g., a lighter noise pattern, or inverted noise).
5. Test EVERY section in dark mode, not just the ones being changed in v1.2.

**Detection:**
- Visual effects disappear or look wrong in dark mode
- The page looks "flat" in dark mode (missing noise, shadows, borders)
- Glassmorphic elements show a muddy or too-dark blur

**Phase to address:** Must be addressed in the same phase as dark/light theming, not deferred. Every existing effect needs a dark mode audit.

---

### Pitfall 10: Embla Carousel Does Not Respect prefers-reduced-motion

**What goes wrong:**
The carousel uses CSS scroll-snap or JavaScript-driven transitions that continue to animate even when the user has enabled `prefers-reduced-motion: reduce`. The existing app wraps everything in `<MotionConfig reducedMotion="user">`, but Embla carousel is not a Motion component -- it has its own animation engine that ignores Motion's config.

**Why it happens:**
Embla carousel manages its own scroll animations independently of Motion/framer-motion. The `<MotionConfig reducedMotion="user">` only affects `motion.*` components, not third-party libraries. Embla's `speed` option controls animation duration but does not automatically disable on `prefers-reduced-motion`.

**Prevention:**
1. Pass `duration: 0` to Embla's options when `prefers-reduced-motion: reduce` is active. Use `window.matchMedia("(prefers-reduced-motion: reduce)")` to detect.
2. Or use Embla's `speed` option set to a very high value (effectively instant transitions) when reduced motion is preferred.
3. Wrap this in a custom hook: `useReducedMotionEmblaOptions()` that returns `{ duration: 0 }` when reduced motion is active.
4. Also ensure any CSS transitions on carousel navigation buttons respect `@media (prefers-reduced-motion: reduce)`.

**Detection:**
- Enable "Reduce motion" in OS accessibility settings
- Carousel still animates between slides
- Accessibility audit flags non-essential animation

**Phase to address:** The phase that implements the carousel. Must be part of the carousel integration, not an afterthought.

---

## Minor Pitfalls

### Pitfall 11: AnimatedTabs Content Height Transition Causes Layout Shift

**What goes wrong:**
When switching between tabs (e.g., from "Analog" to "Digital" in the merged Skills & Tooling section), the content area height changes abruptly because different domains have different numbers of skills. This causes the entire page below the tabs to jump, disrupting the user's scroll position and feeling jarring.

**Prevention:**
1. Set a fixed `min-height` on the tab content container based on the tallest tab's content.
2. Or animate the height change using Motion's `layout` prop with `AnimatePresence` for smooth content transitions.
3. Avoid using `overflow: hidden` on the tab content during transition -- it clips content and looks broken.

**Phase to address:** The phase that implements AnimatedTabs.

---

### Pitfall 12: Dark Mode CSS Variables Not Applied to body Before First Paint

**What goes wrong:**
The existing `body { @apply bg-cleanroom text-ink; }` uses static color references. If dark mode changes `--color-cleanroom` and `--color-ink` via CSS variables on `:root.dark`, but the `@apply` directive was resolved at build time to a static oklch value, the dark mode override has no effect on the body.

**Prevention:**
1. Change body styles from `@apply bg-cleanroom text-ink` to use the theme token CSS variables: `@apply bg-background text-foreground`. These are already defined as CSS variables that can be overridden per-theme.
2. Verify that Tailwind v4's `@apply` resolves to `var(--color-background)` rather than the static oklch value. With Tailwind v4's `@theme inline`, this should work correctly.
3. Test by inspecting the computed body background in both light and dark mode.

**Phase to address:** The phase that implements dark/light theming.

---

### Pitfall 13: New Components Not Data-Driven, Breaking Admin Panel Contract

**What goes wrong:**
New UI components (AnimatedTabs for skills, Gallery6 carousel for projects, timeline with glowing nodes) hardcode content, category names, or display logic instead of reading from the existing typed data files in `src/data/`. The admin panel's editors can no longer update content that the new components display, breaking the v1.0/v1.1 contract that "all content is editable via admin."

**Prevention:**
1. Before building any new component, verify it reads from the same data sources the admin panel writes to (`src/data/skills.ts`, `src/data/projects.ts`, `src/data/timeline.ts`, etc.).
2. Tab categories for AnimatedTabs should be derived from the data (e.g., group skills by their `category` field), not hardcoded as `["Analog", "Digital", "RF"]`.
3. The carousel slide order should be driven by the `projects` array order (with the featured project logic), not hardcoded indices.
4. New timeline node properties (glow color, connection line style) should be optional extensions to the existing `TimelineMilestone` type, not separate hardcoded arrays.

**Phase to address:** Every phase that builds a new component. Validate against admin panel data flow before marking complete.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Animated gradient hero | GPU repaint from animating gradient properties directly (Pitfall 2) | Use opacity-swap or background-position technique; pause when off-screen |
| Dark/light theme system | oklch/hex color space mismatch (Pitfall 3), FOUT flash (Pitfall 5), breaking existing effects (Pitfall 9) | Keep oklch throughout; blocking script in index.html; audit every visual effect |
| Gallery6 horizontal carousel | Lenis scroll hijacking (Pitfall 1), Motion LayoutGroup conflict (Pitfall 6), reduced motion (Pitfall 10) | data-lenis-prevent on viewport; remove LayoutGroup from carousel; embla duration:0 for reduced motion |
| AnimatedTabs for Skills/Tooling | Content height layout shift (Pitfall 11), data-driven content (Pitfall 13) | Fixed min-height or animated height; derive tabs from data |
| Animated timeline with SVG paths | SVG paint property jank (Pitfall 7), scroll-triggered re-renders | Use Motion's native pathLength with useTransform; minimize setState from scroll |
| Contact/footer refresh | Minimal risk -- primarily layout and content changes | Ensure data-driven, verify dark mode colors |
| Next.js component adaptation | "use client", next/image, next-themes breakage (Pitfall 4) | Adaptation checklist for every 21st.dev reference component |
| Admin panel integration | Theme provider breaks tree-shaking (Pitfall 8), components not data-driven (Pitfall 13) | Keep ThemeProvider separate; verify dist/ after build |

## Integration Gotchas

Specific to adding these features to the EXISTING codebase.

| Integration Point | Common Mistake | Correct Approach |
|-------------------|----------------|------------------|
| ThemeProvider + SmoothScroll + MotionConfig nesting | Placing ThemeProvider inside SmoothScroll, causing theme context to be unavailable to the nav bar or elements outside the scroll container | ThemeProvider wraps everything at the outermost level in App.tsx: `<ThemeProvider><MotionConfig><AdminShell?/><SmoothScroll>...</SmoothScroll></MotionConfig></ThemeProvider>` |
| Embla carousel inside Lenis scroll container | Not preventing Lenis from intercepting carousel scroll events | Add `data-lenis-prevent` to the Embla viewport div; add `overscroll-behavior: contain` CSS |
| Motion whileInView + Lenis virtual scroll | Motion's `whileInView` uses IntersectionObserver which works with native scroll position, but Lenis transforms the scroll. However, Lenis 1.x uses native scroll (not translate transforms), so IntersectionObserver works correctly. | No special handling needed for Lenis 1.x. Verify by checking that `whileInView` triggers at the correct scroll position. |
| Existing `@custom-variant dark (&:is(.dark *))` | The existing declaration uses `&:is(.dark *)` which only matches CHILDREN of `.dark`, not the `.dark` element itself. Styles on the `<html>` element with `.dark` class will not trigger the dark variant. | Change to `@custom-variant dark (&:is(.dark, .dark *))` to match both the root element and its children. Or use the shadcn v4 recommended pattern: `@custom-variant dark (&:where(.dark, .dark *))` |
| `body { opacity: 0 }` hydration gate + dark theme | Theme applied after hydrated class, causing a brief flash of light theme | Apply `.dark` class via blocking `<script>` in `<head>` BEFORE React loads. The opacity gate then fades in the correctly-themed page. |
| `next-themes` in package.json | Developers see it in package.json and try to use it, not realizing it was never imported and does not work in Vite | Remove `next-themes` from package.json. Replace with the custom ThemeProvider. |

## Performance Traps

| Trap | Symptoms | Prevention | Acceptable Threshold |
|------|----------|------------|---------------------|
| Animated gradient running off-screen | CPU usage stays high even when hero is scrolled out of view | Use IntersectionObserver to pause animation when hero exits viewport | <1% CPU when hero is off-screen |
| Multiple useScroll hooks on the same page | Each useScroll creates its own scroll event listener and requestAnimationFrame loop; with hero parallax, timeline scroll progress, and carousel position tracking, the scroll handler cost compounds | Share a single scroll listener where possible; use Motion's native ScrollTimeline which is hardware-accelerated | Max 3 independent useScroll hooks per page |
| SVG timeline nodes causing re-renders per scroll frame | 8-12 setState calls per scroll frame from useMotionValueEvent in TimelineNode | Replace setState pattern with useTransform for derived values; only use state for discrete active/inactive transitions | Zero React re-renders during smooth scroll; state changes only at threshold crossings |
| Dark mode transition triggering full-page repaint | Switching theme toggles CSS variables on :root, causing every element to recalculate styles | Use `color-scheme: dark light` on html element; let browser handle scrollbar/form theming natively; theme CSS variables cascade efficiently without explicit recalc | Theme switch completes in <100ms with no visible flicker |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Dark mode theme:** All shadcn tokens defined for dark mode, but existing custom colors (cleanroom, silicon-*, ink, accent, uw-purple-*) have no dark overrides. Half the page uses theme tokens and themes correctly; the other half uses custom colors and stays light-mode colored.
- [ ] **Carousel works with mouse:** Carousel navigates with click/arrow buttons, but trackpad horizontal swipe is broken due to Lenis conflict. Only discoverable by testing with a trackpad.
- [ ] **Animated gradient looks great on desktop:** The breathing effect is smooth on a MacBook Pro, but causes 15fps jank on a 3-year-old Android phone. Only discoverable by testing on a real mobile device or throttled CPU.
- [ ] **Timeline glow nodes render:** The SVG glow effect renders correctly, but scrolling through the section drops to 30fps because each node triggers a repaint per scroll frame. Only discoverable with Chrome DevTools Performance profiling.
- [ ] **AnimatedTabs switch content:** Tabs switch and show correct content, but the page layout jumps by 200px when switching between tabs with different content heights. Only discoverable by watching the scroll position.
- [ ] **prefers-reduced-motion handled for Motion components:** MotionConfig reducedMotion="user" is set, but Embla carousel, CSS gradient animation, and SVG glow effects are not covered by this and still animate.
- [ ] **Dark mode does not flash:** Theme works correctly, but hard-refreshing on a slow connection shows 300ms of white flash before dark theme applies. Only discoverable by throttling network + CPU in DevTools.
- [ ] **Admin panel still works after theme changes:** Theme provider wraps the app correctly, but admin editors now inherit dark mode styles making the admin panel hard to read (dark form on dark background). Admin panel may need its own theme override.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Lenis + Embla scroll conflict | LOW | Add `data-lenis-prevent` to carousel viewport; test with trackpad; 5-minute fix |
| Gradient causing GPU repaints | MEDIUM | Requires rewriting the gradient animation technique (opacity-swap or background-position instead of gradient property animation) |
| oklch/hex color space mismatch | HIGH | Must convert all theme variables to consistent format; if hex was introduced, convert all back to oklch; affects every component that uses theme colors |
| FOUT dark mode flash | LOW | Add blocking script to index.html; 15-minute fix |
| Motion + Embla layout conflict | LOW | Remove LayoutGroup from carousel; use plain divs for Embla structure |
| SVG timeline jank | MEDIUM | Refactor from useState + useMotionValueEvent to useTransform derived values; requires restructuring the TimelineNode component |
| Admin panel broken by theme changes | LOW | Wrap admin panel in `<div className="light">` to force light mode in admin regardless of system theme |
| Existing effects invisible in dark mode | MEDIUM | Audit and adjust opacity/color values for every visual effect; 1-2 hours per effect |

## Sources

- [Lenis GitHub - data-lenis-prevent for nested scrolling](https://github.com/darkroomengineering/lenis)
- [Lenis horizontal scroll trackpad conflict (Issue #446)](https://github.com/darkroomengineering/lenis/issues/446)
- [Embla + Framer Motion conflict (Issue #317)](https://github.com/davidjerleke/embla-carousel/issues/317)
- [Embla Carousel required setup - overflow hidden](https://www.embla-carousel.com/docs/guides/required-setup)
- [Embla watchDrag option (Issue #416)](https://github.com/davidjerleke/embla-carousel/issues/416)
- [CSS Gradient Performance Best Practices](https://upliftorch.com/tools/css-gradient/en/blog/gradient-performance.html)
- [CSS @property for gradient animations](https://digitalthriveai.com/en-us/resources/web-development/the-state-of-changing-gradients-with-css-transitions-and-animations/)
- [CSS GPU Animation: Doing It Right (Smashing Magazine)](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
- [Tailwind CSS v4 dark mode](https://tailwindcss.com/docs/dark-mode)
- [Tailwind v4 @theme directive](https://tailwindcss.com/docs/theme)
- [Tailwind v4 dark mode CSS variables discussion (#15083)](https://github.com/tailwindlabs/tailwindcss/discussions/15083)
- [shadcn/ui Vite dark mode setup](https://ui.shadcn.com/docs/dark-mode/vite)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [next-themes GitHub - Next.js specific](https://github.com/pacocoursey/next-themes)
- [Fixing dark mode flickering (FOUC) in React](https://notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Motion scroll animations - hardware accelerated ScrollTimeline](https://motion.dev/docs/react-scroll-animations)
- [Motion SVG animation - pathLength](https://motion.dev/docs/react-svg-animation)
- [Motion animation performance guide](https://motion.dev/docs/performance)
- [Motion LayoutGroup documentation](https://motion.dev/docs/react-layout-group)
- [Web Animation Performance Tier List (Motion Magazine)](https://motion.dev/magazine/web-animation-performance-tier-list)
- [OKLCH in CSS (Evil Martians)](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [OKLCH 2026 Guide (HexPickr)](https://hexpickr.com/learn/oklch-css-guide)
- [Vite Env Variables and tree-shaking](https://vite.dev/guide/env-and-mode)

---
*Pitfalls research for: v1.2 UI Polish & Interactivity milestone*
*Researched: 2026-03-26*
