# Phase 12: Theme Foundation & Unified Background - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Blue-primary oklch color system with system-preference dark/light mode (prefers-color-scheme), smooth 300ms CSS transitions, FOUT-preventing blocking script, unified page-spanning background with no per-section breaks, and correctly themed PDF viewer in both modes. Admin panel inherits site theme and is themed within this phase.

</domain>

<decisions>
## Implementation Decisions

### Color palette direction
- Blue-tinted neutrals: bump chroma on existing silicon scale (hue 250) to give all grays a visible blue undertone
- Uniform tint curve: same relative chroma increase across the full scale (50–800), blue visible at every step
- Keep existing token names (cleanroom, silicon-*, ink) — update values only, zero rename churn
- UW purple accent stays unchanged in light mode — branded, distinctive against blue-gray surfaces

### Unified background style
- Full-page subtle gradient: lighter at top, slightly deeper toward bottom — continuous across all sections
- Remove NoisyBackground wrapper from Skills, Tooling, WhoAmI sections (keep component files for Phase 15 deletion)
- Remove AnimatedGridPattern from Timeline section
- Remove Contact section's own gradient overlay (from-cleanroom via-uw-purple-faint/30 to-cleanroom)
- All sections become transparent, page gradient shows through
- Section separation via whitespace/padding only (py-24) — no divider lines or borders

### Dark mode palette feel
- Blue-tinted dark: dark backgrounds carry the same blue DNA as light mode (hue 250, visible chroma)
- Dark cleanroom ~oklch(0.16 0.025 250), dark ink ~oklch(0.95 0.020 250)
- Cards/elevated surfaces use subtle lightness elevation (+0.04L for cards, +0.06L for popovers) — not border-defined
- UW purple accent slightly brighter in dark mode (shift toward uw-purple-soft values) to maintain contrast
- Images displayed as-is in both modes — no brightness filter

### Admin panel behavior
- Admin panel inherits the site's dark/light theme (follows system preference)
- Admin components themed in Phase 12 scope (~15 className updates: AdminShell sidebar/header, editor panels bg-white→bg-card, resizable handles)
- shadcn components (Button, Input, Dialog) auto-themed via CSS variable changes
- Live preview pane matches system preference (WYSIWYG — no separate toggle)

### Claude's Discretion
- Exact oklch chroma values for each silicon step (within the "uniform blue tint" direction)
- Dark mode gradient stop values (within the "lighter top, deeper bottom" pattern)
- Blocking script implementation details for FOUT prevention
- CSS transition property targeting for the 300ms theme switch
- shadcn dark mode token mapping (--background, --foreground, etc.)

</decisions>

<specifics>
## Specific Ideas

- Both modes should share the "blue DNA" — dark mode should feel intentional and cohesive, not just an inverted version
- Elevation in dark mode = lighter shade (standard pattern like GitHub/Linear), not border-defined
- Silicon naming still makes sense — silicon IS blue-gray in real life
- Full-page gradient creates depth without seams; no section should break the continuity

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app.css` already uses oklch color space with hue 250 — values just need chroma bumps and dark definitions
- shadcn theme token layer (`@theme inline`) maps semantic tokens (--background, --foreground, etc.) — adding `.dark` definitions propagates automatically
- `@custom-variant dark (&:is(.dark *))` exists but has known bug — needs fix to `(&:is(.dark, .dark *))`
- Body fade-in transition (opacity 0 → 1 on `.hydrated`) already exists — blocking script pattern can build on this

### Established Patterns
- oklch color definitions in `:root` block of `app.css`
- Tailwind v4 `@theme` blocks for custom tokens
- `MotionConfig reducedMotion="user"` in App.tsx for accessibility
- DEV-gated lazy imports for admin panel (`import.meta.env.DEV` ternary)

### Integration Points
- `NoisyBackground` used in: Skills.tsx, Tooling.tsx, WhoAmI.tsx — remove wrapper, keep section content
- `AnimatedGridPattern` used in: Timeline.tsx — remove from section
- Contact.tsx gradient overlay div — remove the absolute-positioned gradient div
- `body` class in `app.css` `@layer base` — where unified gradient gets applied
- PdfViewer.tsx uses shadcn Dialog/Drawer — themed via CSS variables
- AdminShell.tsx and editor components — ~15 hardcoded bg-white/bg-gray references to update
- `index.html` `<head>` — where blocking theme script gets injected

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-theme-foundation-unified-background*
*Context gathered: 2026-03-26*
