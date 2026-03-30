# Phase 15: Contact Footer & Cleanup - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Polish the contact section with a compact link row and hover animations, add a minimal footer with copyright and "Built with" tagline, and remove all dead code from replaced effect components. Production build must be clean.

</domain>

<decisions>
## Implementation Decisions

### Contact Section Layout
- Heading changed to "Say Hello" (friendly, minimal tone)
- Keep centered-stack layout (heading → tagline → links row)
- All 4 links (Email, GitHub, LinkedIn, Resume) in a single horizontal row
- Each link shows icon + label text (not icon-only)
- All links styled identically — resume is not a CTA, just one link among equals
- Resume link downloads directly (no in-browser PDF viewer modal)
- Remove LazyPdfViewer integration and useState from Contact.tsx

### Icon Hover Animations
- Color shift from muted gray to oklch accent blue on hover
- Hover applies to icon + label text together (whole link lights up)
- 300ms CSS transition duration
- No scale, bounce, or glow effects — color shift only

### Footer
- Copyright line: "© {dynamic year} Jack Basinski" using new Date().getFullYear()
- Second line: "Built with React & Motion" tagline
- Subtle 1px muted border-top separator between contact section and footer
- Footer centered, minimal padding

### Cleanup
- Delete all 4 unused effect components: NoisyBackground.tsx, AnimatedGridPattern.tsx, AuroraBackground.tsx, Particles.tsx
- Keep CardSpotlight.tsx (still used by ProjectCard)
- Update effects test file to only test CardSpotlight
- Remove PDF viewer import and resume modal state from Contact.tsx

### Claude's Discretion
- Footer component structure (separate component vs inline in Contact)
- Any additional obvious dead code found during implementation
- Exact spacing, font sizes, and padding values
- Whether "Built with" text links to anything or is plain text

</decisions>

<specifics>
## Specific Ideas

- All 4 contact links should feel like equals in a row — no visual hierarchy among them
- "Say Hello" heading matches the friendly-but-professional tone of the portfolio
- The footer should feel like a quiet sign-off, not a destination

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Contact.tsx`: Existing component with centered layout, Motion variants, Lucide icons — needs refactoring not rewriting
- `contactData` in `data/contact.ts`: Already has email, resumePath, socialLinks with icon names — may need email added to socialLinks or handled alongside
- `sectionVariants` / `fadeUpVariant` in `styles/motion.ts`: Standard section entry animations, already used by Contact
- Lucide icons: `Mail`, `Download`, `Github`, `Linkedin` already imported; `Download` replaced by `FileText` or similar for resume

### Established Patterns
- oklch accent color via CSS custom properties (Phase 12) — hover color should use `text-accent` class
- Motion `whileInView` with `sectionVariants` / `fadeUpVariant` for section entry (consistent across all sections)
- `transition-colors duration-300` for hover effects (used on current contact links)
- Data-driven rendering from typed TS files in `src/data/`

### Integration Points
- `App.tsx` line 77-79: Contact is inside `<footer>` element — footer strip goes below Contact within this wrapper
- `navigation.ts`: Contact nav link points to `#contact` — no changes needed
- `effects/__tests__/effects.test.ts`: Imports all 5 effects — must be updated when 4 are deleted
- Production build verification: `vite build` must succeed with no deprecated component references

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 15-contact-footer-cleanup*
*Context gathered: 2026-03-30*
