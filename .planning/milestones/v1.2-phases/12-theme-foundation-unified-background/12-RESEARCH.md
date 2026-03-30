# Phase 12: Theme Foundation & Unified Background - Research

**Researched:** 2026-03-26
**Domain:** CSS theming (oklch dark/light mode), Tailwind v4 custom variants, FOUT prevention, unified backgrounds
**Confidence:** HIGH

## Summary

Phase 12 implements system-preference dark/light mode with a blue-primary oklch color system, smooth 300ms transitions between modes, FOUT prevention via a blocking script, a unified page-spanning background gradient, and correctly themed PDF viewer and admin panel. The existing codebase uses Tailwind v4 with oklch colors at hue 250, shadcn/ui semantic tokens via `@theme inline`, and a `.hydrated` body fade-in pattern -- all of which provide a strong foundation.

The core technical work involves: (1) bumping chroma on the existing silicon scale to create visible blue-gray tints, (2) defining `.dark` class CSS variable overrides for all shadcn tokens and custom palette colors, (3) fixing the existing `@custom-variant dark` selector bug, (4) injecting a blocking script in `index.html` to apply `.dark` before first paint, (5) removing per-section background effects (NoisyBackground, AnimatedGridPattern, Contact gradient) so all sections become transparent over a unified body gradient, (6) adding `transition` properties to CSS for smooth theme switching, and (7) updating ~68 hardcoded `bg-white`/`bg-gray-*`/`text-gray-*` references in admin components plus ~4 in site components to use semantic tokens.

**Primary recommendation:** Build the color system and dark mode tokens first (CSS-only), then fix the `@custom-variant` bug, then add the blocking script, then remove per-section backgrounds and apply the unified gradient, then theme the admin panel and PDF viewer -- in that dependency order.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Blue-tinted neutrals: bump chroma on existing silicon scale (hue 250) to give all grays a visible blue undertone
- Uniform tint curve: same relative chroma increase across the full scale (50-800), blue visible at every step
- Keep existing token names (cleanroom, silicon-*, ink) -- update values only, zero rename churn
- UW purple accent stays unchanged in light mode -- branded, distinctive against blue-gray surfaces
- Full-page subtle gradient: lighter at top, slightly deeper toward bottom -- continuous across all sections
- Remove NoisyBackground wrapper from Skills, Tooling, WhoAmI sections (keep component files for Phase 15 deletion)
- Remove AnimatedGridPattern from Timeline section
- Remove Contact section's own gradient overlay (from-cleanroom via-uw-purple-faint/30 to-cleanroom)
- All sections become transparent, page gradient shows through
- Section separation via whitespace/padding only (py-24) -- no divider lines or borders
- Blue-tinted dark: dark backgrounds carry the same blue DNA as light mode (hue 250, visible chroma)
- Dark cleanroom ~oklch(0.16 0.025 250), dark ink ~oklch(0.95 0.020 250)
- Cards/elevated surfaces use subtle lightness elevation (+0.04L for cards, +0.06L for popovers) -- not border-defined
- UW purple accent slightly brighter in dark mode (shift toward uw-purple-soft values) to maintain contrast
- Images displayed as-is in both modes -- no brightness filter
- Admin panel inherits the site's dark/light theme (follows system preference)
- Admin components themed in Phase 12 scope (~15 className updates: AdminShell sidebar/header, editor panels bg-white to bg-card, resizable handles)
- shadcn components (Button, Input, Dialog) auto-themed via CSS variable changes
- Live preview pane matches system preference (WYSIWYG -- no separate toggle)

### Claude's Discretion
- Exact oklch chroma values for each silicon step (within the "uniform blue tint" direction)
- Dark mode gradient stop values (within the "lighter top, deeper bottom" pattern)
- Blocking script implementation details for FOUT prevention
- CSS transition property targeting for the 300ms theme switch
- shadcn dark mode token mapping (--background, --foreground, etc.)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| THEME-01 | Site automatically applies dark or light theme based on user's system preference (prefers-color-scheme) | Blocking script pattern in index.html + @custom-variant dark fix + system preference detection via matchMedia |
| THEME-02 | Blue-primary oklch color variable system with light and dark mode definitions | oklch silicon scale chroma bump + .dark CSS overrides for all tokens + shadcn semantic token mapping |
| THEME-03 | Unified continuous background across all sections with no hard color breaks | Remove NoisyBackground/AnimatedGridPattern/Contact gradient + body-level gradient + transparent sections |
| THEME-04 | Theme switch triggers smooth 300ms CSS transitions on background, text, and border colors | Global transition rule on *, with exclusions for media and SVG + color-scheme property for native UI |
| THEME-05 | Dark mode FOUT prevented via blocking script that applies theme class before React mounts | Inline script in index.html head that reads prefers-color-scheme and applies .dark class synchronously |
| THEME-06 | PDF viewer (Dialog/Drawer) styled correctly in both light and dark modes | shadcn Dialog/Drawer already uses bg-background semantic token; PDF toolbar needs dark:* color updates |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 | Utility-first CSS with dark: variant | Already installed; @custom-variant dark provides class-based dark mode |
| shadcn/ui | 4.1.0 | Component primitives with CSS variable theming | Already installed; semantic tokens (--background, --card, etc.) auto-theme when .dark is added |
| oklch | CSS-native | Perceptually uniform color space | Already in use for entire palette; ideal for generating consistent tinted gray scales |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion | 12.38.0 | Animations | Already used; NOT needed for theme transitions (CSS transitions handle it) |
| react-pdf | 10.4.1 | PDF viewer | Already used; needs dark mode toolbar styling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom blocking script | next-themes | next-themes is Next.js-specific, already flagged for removal in STATE.md. Custom ~15-line script is simpler for system-preference-only. |
| CSS transition on * | View Transitions API | View Transitions API is newer and less supported; CSS transitions are universal and sufficient for color changes |

**Installation:**
```bash
# No new packages needed. Remove unused next-themes:
npm uninstall next-themes
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  styles/
    app.css               # All color tokens, dark overrides, transitions, unified gradient
index.html                # Blocking script in <head> for FOUT prevention
src/
  App.tsx                 # No ThemeProvider needed (system-preference-only, no toggle)
  components/
    sections/*.tsx        # Remove NoisyBackground wrappers, make transparent
    effects/*.tsx         # Keep files (Phase 15 cleanup), just unused now
  admin/
    AdminShell.tsx        # Replace bg-white/bg-gray-* with semantic tokens
    editors/*.tsx         # Replace bg-gray-* skeleton loaders with semantic tokens
```

### Pattern 1: Tailwind v4 Class-Based Dark Mode
**What:** Use `@custom-variant dark` to enable the `dark:` prefix based on a `.dark` class on `<html>`, which is applied by a blocking script reading `prefers-color-scheme`.
**When to use:** When you need class-based dark mode (not media-query-based) so a blocking script can set the class before paint.
**Example:**
```css
/* Source: https://tailwindcss.com/docs/dark-mode */
/* Fix existing bug: (&:is(.dark *)) must become (&:is(.dark, .dark *))
   Tailwind official docs recommend :where for zero specificity: */
@custom-variant dark (&:where(.dark, .dark *));
```

### Pattern 2: oklch Dark Mode Token Definitions
**What:** Define `.dark` overrides for all CSS variables in app.css using oklch with hue 250 and visible chroma.
**When to use:** For the entire dark mode color system.
**Example:**
```css
/* Light mode tokens (already in :root) */
:root {
  --background: oklch(0.985 0.002 90);  /* cleanroom */
  --foreground: oklch(0.15 0.01 250);   /* ink */
  --card: oklch(1 0 0);
  /* ... */
}

/* Dark mode overrides */
.dark {
  --background: oklch(0.16 0.025 250);  /* dark cleanroom -- blue tinted */
  --foreground: oklch(0.95 0.020 250);  /* dark ink -- blue tinted */
  --card: oklch(0.20 0.025 250);        /* +0.04L elevation */
  --popover: oklch(0.22 0.025 250);     /* +0.06L elevation */
  /* ... all other tokens */
}
```

### Pattern 3: Blocking Script for FOUT Prevention
**What:** Inline synchronous script in `<head>` that reads system preference and applies `.dark` class before any rendering.
**When to use:** In index.html, before the Vite module script.
**Example:**
```html
<!-- Source: shadcn/ui Vite dark mode docs + Tailwind CSS docs -->
<script>
  // Apply dark class synchronously before first paint
  (function() {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
    // Set color-scheme for native UI elements (scrollbars, form controls)
    document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light';
  })();
</script>
```

### Pattern 4: Smooth Theme Transition
**What:** Global CSS transition rule that applies smooth color changes when system preference toggles.
**When to use:** Applied globally so ALL elements transition together.
**Example:**
```css
/* Apply to all elements for smooth theme switch */
*,
*::before,
*::after {
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease;
}

/* Disable transitions on initial load to prevent flash */
html.no-transition *,
html.no-transition *::before,
html.no-transition *::after {
  transition: none !important;
}
```

### Pattern 5: Unified Page Gradient
**What:** Single gradient on `<body>` from lighter at top to slightly deeper at bottom; all sections become transparent.
**When to use:** Replaces all per-section backgrounds.
**Example:**
```css
body {
  background: linear-gradient(
    to bottom,
    var(--color-cleanroom),
    var(--color-silicon-50)
  );
  background-attachment: fixed; /* Gradient stays while scrolling */
}

/* Dark mode body gradient */
.dark body {
  background: linear-gradient(
    to bottom,
    var(--color-cleanroom),   /* dark cleanroom value */
    oklch(0.12 0.020 250)     /* slightly deeper */
  );
}
```

### Anti-Patterns to Avoid
- **Animating `background-image` with CSS transitions:** CSS cannot transition `background-image` (linear-gradient). If the gradient changes between modes, use a crossfade trick with `::before` pseudo-element or define the gradient using CSS variables for the stop colors that CAN transition.
- **Using media-query-based dark mode without a class:** Prevents the blocking script from working, since you cannot programmatically set `prefers-color-scheme`. The class approach is mandatory for FOUT prevention.
- **Adding `transition` to the blocking script's initial application:** Must suppress transitions on page load so the theme applies instantly. The `no-transition` class pattern prevents this.
- **Using `color-scheme: dark` without matching CSS variables:** The `color-scheme` property changes native UI (scrollbars, inputs) but does NOT change your custom-styled elements. Both are needed.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark mode color system | Custom color toggling logic | CSS variables + `.dark` class override | CSS handles it natively; zero JS runtime cost |
| Theme state management | React context ThemeProvider | Blocking script + `matchMedia` listener | System-preference-only mode needs no React state -- just CSS |
| Component dark styling | Per-component dark mode logic | shadcn semantic tokens (`bg-background`, `text-foreground`) | Tokens auto-switch when `.dark` class is present |
| Smooth transitions | JavaScript color interpolation | CSS `transition` property | GPU-accelerated, zero JS overhead |
| Native UI theming | Custom scrollbar styles | `color-scheme: dark` CSS property | Browser handles scrollbar, form control, selection colors natively |

**Key insight:** Since this project uses system-preference-only (no user toggle), the entire dark mode implementation can be done with zero runtime JavaScript beyond the blocking script and a matchMedia listener. No React state, no context, no ThemeProvider -- pure CSS.

## Common Pitfalls

### Pitfall 1: FOUT (Flash of Unstyled Theme)
**What goes wrong:** Page loads with light theme, then flashes to dark when React hydrates and applies the class.
**Why it happens:** The `.dark` class is applied too late (after first paint) because it depends on React mounting.
**How to avoid:** Inline synchronous `<script>` in `<head>` before any `<link>` or module scripts. Apply `.dark` to `document.documentElement` immediately based on `matchMedia`.
**Warning signs:** Visible white flash when loading the site on a dark-mode system.

### Pitfall 2: @custom-variant Selector Bug
**What goes wrong:** The `dark:` prefix only works on descendants of `.dark`, not on the `.dark` element itself (e.g., `<html class="dark">`).
**Why it happens:** The existing code has `(&:is(.dark *))` which only matches children, not the element with `.dark` itself.
**How to avoid:** Fix to `(&:where(.dark, .dark *))` per Tailwind v4 official docs. Use `:where` for zero specificity impact.
**Warning signs:** `dark:bg-*` classes on `<html>` or `<body>` not applying.

### Pitfall 3: Transition Flash on Initial Load
**What goes wrong:** The 300ms transition rule causes a visible color sweep from default to dark on first load.
**Why it happens:** Transitions apply even when the blocking script adds `.dark` if the CSS transition rule is already active.
**How to avoid:** Add `no-transition` class to `<html>` in the blocking script, remove it after a single requestAnimationFrame. Or: add transitions via a class that is only applied after hydration.
**Warning signs:** Slow color fade-in on page load instead of instant dark theme.

### Pitfall 4: background-image Cannot Be Transitioned
**What goes wrong:** The unified gradient (a `background-image: linear-gradient(...)`) cannot smoothly transition between light and dark mode variants.
**Why it happens:** CSS transitions do not interpolate `background-image` values.
**How to avoid:** Define the gradient using CSS custom property color stops (e.g., `linear-gradient(to bottom, var(--gradient-top), var(--gradient-bottom))`). Transition the custom properties themselves, or transition `background-color` on body and use a `::before` pseudo-element with opacity for the gradient overlay.
**Warning signs:** Abrupt gradient jump when system preference changes.

### Pitfall 5: Hardcoded Colors in Admin Components
**What goes wrong:** Admin panel looks broken in dark mode because it uses hardcoded `bg-white`, `bg-gray-50`, `text-gray-900`, etc.
**Why it happens:** Admin was built for light-mode-only dev tool use; 68 occurrences of hardcoded gray values across 17 admin files.
**How to avoid:** Replace with Tailwind semantic classes: `bg-white` -> `bg-background`, `bg-gray-50` -> `bg-muted`, `text-gray-900` -> `text-foreground`, `text-gray-400` -> `text-muted-foreground`, `border-gray-200` -> `border-border`, etc.
**Warning signs:** White panels on dark background, unreadable text.

### Pitfall 6: Navigation and Mobile Menu Hardcoded Backgrounds
**What goes wrong:** Navigation bar shows `bg-white/80` and mobile menu shows `bg-white/95`, which remain white in dark mode.
**Why it happens:** These were hardcoded before dark mode was planned.
**How to avoid:** Replace with `bg-background/80` and `bg-background/95` respectively.
**Warning signs:** White navigation bar floating over dark page.

### Pitfall 7: ProjectCard Hardcoded White Background
**What goes wrong:** Project cards show as white rectangles on dark background.
**Why it happens:** `bg-white` is hardcoded in ProjectCard.tsx.
**How to avoid:** Replace `bg-white` with `bg-card` (which uses the shadcn --card token, auto-themed).
**Warning signs:** Bright white cards that look out of place.

### Pitfall 8: Missing color-scheme Property
**What goes wrong:** Scrollbars, checkboxes, and browser-provided UI remain light-themed in dark mode.
**Why it happens:** Without `color-scheme: dark`, the browser renders all native UI in light mode.
**How to avoid:** Set `color-scheme` on `:root` dynamically in the blocking script, and in CSS: `:root { color-scheme: light; } .dark { color-scheme: dark; }`.
**Warning signs:** Light scrollbar on dark background, light form inputs in admin panel.

## Code Examples

Verified patterns from official sources:

### Complete app.css Dark Mode Token Block
```css
/* Source: shadcn/ui theming docs + project CONTEXT.md decisions */

/* Fix the @custom-variant selector bug */
@custom-variant dark (&:where(.dark, .dark *));

/* Light mode :root already exists -- just need .dark overrides */
.dark {
  color-scheme: dark;

  /* Core semantic tokens */
  --background: oklch(0.16 0.025 250);
  --foreground: oklch(0.95 0.020 250);
  --card: oklch(0.20 0.025 250);         /* +0.04L from background */
  --card-foreground: oklch(0.95 0.020 250);
  --popover: oklch(0.22 0.025 250);      /* +0.06L from background */
  --popover-foreground: oklch(0.95 0.020 250);
  --primary: oklch(0.95 0.020 250);
  --primary-foreground: oklch(0.16 0.025 250);
  --secondary: oklch(0.22 0.020 250);
  --secondary-foreground: oklch(0.90 0.020 250);
  --muted: oklch(0.22 0.020 250);
  --muted-foreground: oklch(0.60 0.020 250);
  --accent: oklch(0.22 0.020 250);
  --accent-foreground: oklch(0.95 0.020 250);
  --destructive: oklch(0.60 0.245 27.325);
  --border: oklch(0.25 0.020 250);
  --input: oklch(0.25 0.020 250);
  --ring: oklch(0.45 0.020 250);

  /* Sidebar (admin) */
  --sidebar: oklch(0.18 0.025 250);
  --sidebar-foreground: oklch(0.95 0.020 250);
  --sidebar-primary: oklch(0.95 0.020 250);
  --sidebar-primary-foreground: oklch(0.16 0.025 250);
  --sidebar-accent: oklch(0.22 0.020 250);
  --sidebar-accent-foreground: oklch(0.95 0.020 250);
  --sidebar-border: oklch(0.25 0.020 250);
  --sidebar-ring: oklch(0.45 0.020 250);
}
```

### Complete Blocking Script for index.html
```html
<!-- Place in <head> BEFORE any <link> or <script type="module"> -->
<script>
  // Synchronous dark mode detection -- prevents FOUT
  (function() {
    var d = document.documentElement;
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) d.classList.add('dark');
    d.style.colorScheme = prefersDark ? 'dark' : 'light';
    // Suppress transitions on initial load
    d.classList.add('no-transition');
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        d.classList.remove('no-transition');
      });
    });
  })();
</script>
```

### System Preference Change Listener (main.tsx)
```typescript
// Listen for system preference changes and update .dark class
const mql = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(e: MediaQueryListEvent | MediaQueryList) {
  const root = document.documentElement;
  root.classList.toggle('dark', e.matches);
  root.style.colorScheme = e.matches ? 'dark' : 'light';
}
mql.addEventListener('change', applyTheme);
```

### Unified Body Gradient with Transitionable Stops
```css
/* Custom properties for gradient stops -- these CAN be transitioned */
:root {
  --gradient-top: oklch(0.985 0.008 250);     /* light cleanroom with blue tint */
  --gradient-bottom: oklch(0.96 0.012 250);   /* slightly deeper */
}

.dark {
  --gradient-top: oklch(0.16 0.025 250);
  --gradient-bottom: oklch(0.12 0.020 250);
}

body {
  background: var(--gradient-top);  /* Fallback solid */
  /* Fixed gradient that spans entire viewport */
  background-image: linear-gradient(
    to bottom,
    var(--gradient-top),
    var(--gradient-bottom)
  );
  min-height: 100vh;
}
```

### Admin Component Token Mapping Reference
```
bg-white       -> bg-background   (or bg-card for elevated panels)
bg-gray-50     -> bg-muted
bg-gray-100    -> bg-muted
bg-gray-200    -> bg-muted (or border-border for skeleton loaders)
text-gray-900  -> text-foreground
text-gray-700  -> text-foreground
text-gray-600  -> text-muted-foreground
text-gray-500  -> text-muted-foreground
text-gray-400  -> text-muted-foreground
border-gray-200 -> border-border
border-gray-100 -> border-border
hover:bg-gray-100 -> hover:bg-muted
hover:text-gray-600 -> hover:text-foreground
hover:text-gray-900 -> hover:text-foreground
bg-white/70    -> bg-background/70
bg-white/80    -> bg-background/80
bg-white/95    -> bg-background/95
bg-white/90    -> bg-background/90
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@custom-variant dark (&:is(.dark *))` | `@custom-variant dark (&:where(.dark, .dark *))` | Tailwind v4.0 docs clarification | Fixes dark variant on root element + zero specificity |
| HSL color variables | oklch color variables | shadcn/ui March 2025 update | More perceptually uniform; already in use in this project |
| next-themes for dark mode | Custom blocking script | Project decision (STATE.md) | Removes unused Next.js dependency; system-preference-only needs no React state |
| Per-section gradient backgrounds | Single body-level gradient | Phase 12 design decision | Eliminates visual seams between sections |

**Deprecated/outdated:**
- `next-themes` package: Listed in package.json but unused (Next.js-specific). Must be removed.
- `(&:is(.dark *))` selector: Bug in current codebase; must be fixed to include `.dark` itself.

## Open Questions

1. **Gradient transition between modes**
   - What we know: CSS cannot transition `background-image` (linear-gradient). The gradient stop colors are defined as custom properties.
   - What's unclear: Whether transitioning `--gradient-top` and `--gradient-bottom` custom properties works natively in all browsers, or if a pseudo-element overlay approach is needed.
   - Recommendation: Use `@property` registered custom properties with `oklch` syntax for animatable custom properties. Fallback: use solid `background-color` transition with the gradient as a `::before` overlay.

2. **Exact chroma values for blue-tinted silicon scale**
   - What we know: Current scale has low chroma (0.002-0.02). Decision says "uniform tint curve" with "blue visible at every step."
   - What's unclear: Exact chroma bump amount that reads as "visibly blue" without being "too colorful."
   - Recommendation: Increase chroma by roughly 2-3x across the scale (e.g., 0.005->0.012, 0.008->0.018, 0.01->0.022). Visual QA needed.

3. **Admin editor skeleton loaders in dark mode**
   - What we know: 8 editor files use `bg-gray-100`/`bg-gray-200` for loading skeleton placeholders.
   - What's unclear: Whether `bg-muted` provides enough visual distinction from `bg-background` in dark mode for skeletons.
   - Recommendation: Map skeleton `bg-gray-200` -> `bg-muted`, skeleton `bg-gray-100` -> `bg-muted/50`. Verify visually.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| THEME-01 | System preference detection applies .dark class | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "system preference" -x` | Wave 0 |
| THEME-02 | oklch color tokens defined for light and dark modes | unit | `npx vitest run src/styles/__tests__/colors.test.ts -x` | Exists (needs expansion) |
| THEME-03 | No NoisyBackground/AnimatedGridPattern in section renders; body has gradient | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "unified background" -x` | Wave 0 |
| THEME-04 | CSS contains transition rules for theme switching | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "transition" -x` | Wave 0 |
| THEME-05 | index.html contains blocking script with prefers-color-scheme | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "blocking script" -x` | Wave 0 |
| THEME-06 | PDF viewer uses semantic tokens (bg-background, not hardcoded) | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "pdf viewer" -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/styles/__tests__/theme.test.ts` -- covers THEME-01, THEME-03, THEME-04, THEME-05, THEME-06
- [ ] Expand `src/styles/__tests__/colors.test.ts` -- add dark mode token assertions for THEME-02
- [ ] Test that `index.html` contains the blocking script (string assertion on file content)
- [ ] Test that `app.css` contains `.dark` block with required tokens
- [ ] Test that section components no longer import/render NoisyBackground or AnimatedGridPattern

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode) - @custom-variant syntax, :where() selector, class-based dark mode
- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming) - CSS variable list, oklch values, .dark overrides
- [shadcn/ui Vite Dark Mode docs](https://ui.shadcn.com/docs/dark-mode/vite) - ThemeProvider pattern, blocking script approach
- [MDN color-scheme property](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) - Native UI theming for scrollbars, form controls

### Secondary (MEDIUM confidence)
- [Evil Martians oklch guide](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) - oklch color space best practices, chroma perception
- [shadcn/ui Tailwind v4 migration](https://ui.shadcn.com/docs/tailwind-v4) - @theme inline directive, CSS variable mapping

### Tertiary (LOW confidence)
- Exact chroma values for "visibly blue" tint -- needs visual QA, no authoritative source for this aesthetic judgment
- `@property` support for animating CSS custom properties -- browser support is broad but not verified for oklch interpolation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and in use; only CSS changes needed
- Architecture: HIGH - Patterns verified against Tailwind v4 and shadcn/ui official docs
- Pitfalls: HIGH - @custom-variant bug confirmed in codebase; FOUT pattern well-documented; hardcoded colors counted precisely (68 admin, 4 site)
- Color values: MEDIUM - User-specified direction is clear, but exact chroma values need visual QA

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable domain -- CSS/Tailwind v4 unlikely to change)
