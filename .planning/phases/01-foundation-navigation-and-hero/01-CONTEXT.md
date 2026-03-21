# Phase 1: Foundation, Navigation, and Hero - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold Vite 8 + React 19 project with Lenis, Motion, Tailwind v4, glassmorphic nav, and typography-first hero. Visitor lands on a working single-page app with premium smooth scroll, navigation, and a hero that immediately communicates Jack's identity. Content sections, interactive features, and deployment are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Hero layout
- Height: 70-80vh — tall but next section peeks above the fold
- Alignment: centered horizontally, vertically centered within the hero area
- Text hierarchy: three tiers — large name, medium subtitle, short narrative line
- Entrance animation: staggered fade-up (name → subtitle → narrative, ~200ms delay between each, weighted easing, no bounce)
- Background: subtle gradient from white to barely-there warm grey (not pure flat white)
- Scroll indicator: subtle animated chevron at bottom that gently pulses, disappears on scroll
- Social icons: small GitHub + LinkedIn outline icons below the narrative text, minimal stroke style, hover darkens

### Hero content
- Name displayed as uppercase via CSS text-transform ("JACK BASINSKI")
- Subtitle: "Electrical & Computer Engineering · UW" (medium size)
- Narrative line: general direction is "semiconductor manufacturing and design" — user will finalize exact copy later. Use placeholder text that can be swapped via data file
- Three-tier structure: name (large bold) → subtitle (medium) → narrative (smaller, lighter weight)

### Typography system
- Font family: geometric & precise sans-serif — Claude selects the best fit from the geometric family (Inter, Satoshi, General Sans, or similar)
- Single font family throughout — differentiate with weight and size, no font pairing
- Hero name size: clamp range ~3-5rem, fluid between mobile and desktop
- Letter spacing: wide tracking (~0.05-0.1em) on uppercase text (hero name); default tracking on body text
- Section headings: natural case, bold weight (not uppercase) — contrasts with the uppercase hero
- Body text weight: regular (400)

### Color palette
- Background ("Cleanroom White"): Claude selects shade (cool off-white, warm off-white, or pure white)
- Grey tone ("Silicon Grey"): Claude selects (neutral, cool/blue, or warm grey)
- Accent color: single subtle accent for links, active nav states, hover effects — Claude selects the hue that complements the palette
- Primary text color: Claude selects (near-black preferred over pure black for readability)
- 0.5px border system with 1px fallback for non-Retina — Claude decides placement (nav, sections, cards) based on visual clarity

### Glassmorphism
- Nav style: light frost — backdrop-blur(12px) with ~80% white opacity
- Subtle, lets content blur through gently

### Navigation structure
- Four grouped nav items: Background (dropdown: Skills, Coursework, Lab/Tooling), Projects, Papers, Contact
- "Background" has a hover dropdown revealing sub-sections (Skills, Coursework, Lab/Tooling)
- Left side: "JB" initials as compact text mark — clicking scrolls to top
- Nav visibility: hidden on initial load, appears with fade-in after user scrolls past the hero section
- Active section highlighted via Intersection Observer scroll-spy
- Nav links smooth-scroll to targets via Lenis

### Mobile navigation
- Hamburger icon triggers full-screen overlay menu
- All nav items listed vertically, grouped sub-items shown indented
- Hamburger menu only appears at mobile breakpoints (desktop shows full nav bar)

### Claude's Discretion
- Exact font family selection (geometric sans-serif)
- Exact color values for cleanroom white, silicon grey, accent, and text colors
- 0.5px border placement strategy
- Loading skeleton and error state handling
- Scroll chevron animation timing and style
- Glassmorphic nav appearance animation (fade, slide, etc.)
- Mobile overlay animation (slide direction, timing)

</decisions>

<specifics>
## Specific Ideas

- Aesthetic reference: Dieter Rams / Jony Ive — industrial minimalism
- Hero name in uppercase conveys architectural, design-forward confidence
- Section headings in natural case (bold) create hierarchy contrast with the uppercase hero
- Wide letter-spacing on uppercase text gives a refined, architectural feel
- The gradient background should be barely perceptible — depth without competing with text
- Social icons should blend with the typography, not draw attention
- Narrative copy placeholder: "semiconductor manufacturing and design" direction — user will finalize exact wording later

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project. All components built from scratch.

### Established Patterns
- No existing patterns. Phase 1 establishes the foundational patterns for all subsequent phases.
- Stack defined in requirements: Vite 8, React 19, TypeScript, Tailwind v4, Motion, Lenis
- 21st.dev MCP server as primary component source

### Integration Points
- Data files: all content (nav items, hero text, social links) must be TypeScript data files per FNDN-02
- Lenis + Motion frame sync required per FNDN-04 (autoRaf disabled, driven by Motion frame.update)
- prefers-reduced-motion support per FNDN-07

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-navigation-and-hero*
*Context gathered: 2026-03-20*
