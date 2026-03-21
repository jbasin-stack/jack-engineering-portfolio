# Jack Basinski — Engineering Portfolio

## What This Is

A high-performance, minimalist personal portfolio for Jack Basinski, an Electrical & Computer Engineering student at the University of Washington. The site showcases the intersection of semiconductor fabrication and system design across analog, RF, and digital domains. Built with a "less, but better" philosophy — precision typography, generous whitespace, and physical-feeling transitions that evoke the quality of the work itself.

## Core Value

Every visitor — recruiter, professor, or peer — immediately understands Jack's range and depth as an electrical engineer, and can access the evidence (projects, papers, resume) without friction.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Typography-first hero section with narrative on semiconductor fabrication × system design
- [ ] Single-page smooth scroll with Lenis for weighted, premium scroll feel
- [ ] Fixed minimalist glassmorphic navigation (Skills, Projects, Papers, Contact/Resume)
- [ ] Skills section as a clean typography-driven list, grouped by domain (Fab, RF, Analog, Digital)
- [ ] Project shells (3–5) as interactive bento/grid cards with inline expansion for detail view
- [ ] Papers section with in-browser PDF viewer (Shadcn Dialog or drawer) for technical documents and resume
- [ ] Lab & Tooling section showcasing hands-on proficiency (Cadence, KLayout, oscilloscopes, cleanroom equipment)
- [ ] Coursework section highlighting key UW ECE courses that signal depth
- [ ] Timeline section visualizing engineering journey and progression
- [ ] Contact section with email, LinkedIn, GitHub, and downloadable resume PDF
- [ ] Framer Motion animations for all entry and hover states — weighted, no bounce
- [ ] "Cleanroom White" and "Silicon Grey" palette with 0.5px borders throughout
- [ ] Semantic HTML and clean metadata for AI scraper and recruiter readability
- [ ] Vercel deployment

### Out of Scope

- Testimonials/quotes section — deferred to v2 (needs content collection)
- Certifications section — deferred to v2 (low priority for v1 launch)
- Open source contributions section — deferred to v2
- Blog/technical notes — deferred to v2 (content creation overhead)
- CMS or admin panel — static content is sufficient for v1
- Dark mode toggle — single cohesive theme for v1
- Contact form backend — direct email link is sufficient

## Context

- **Audience:** Equal weight between recruiters (internship/full-time in semiconductor/hardware) and professors (grad school admissions). Both need to see technical depth and breadth quickly.
- **Content readiness:** 3–5 projects with descriptions, images, and papers ready. Mix of academic papers and technical reports (PDFs).
- **Technical stack direction:** React, Framer Motion, Lenis smooth scroll, 21st.dev MCP for sourcing premium components, Shadcn UI primitives.
- **Aesthetic reference:** Dieter Rams / Jony Ive — industrial minimalism. Glassmorphism for nav/overlays. No bouncy animations. Physical, weighted motion. 0.5px borders as a signature detail.
- **Deployment:** Vercel free tier.

## Constraints

- **Tech stack**: React + Vite (or Next.js) with Framer Motion, Lenis, Shadcn/21st.dev components — chosen for performance and premium component ecosystem
- **Content**: All project content must be swappable/updatable without code changes — clean data-driven structure
- **Performance**: Must score 90+ on Lighthouse — portfolio sites that load slowly undermine credibility
- **Accessibility**: Semantic HTML is non-negotiable for both scraper readability and accessibility compliance
- **Budget**: Zero cost — Vercel free tier, no paid services

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single-page scroll over multi-page routing | Minimalist philosophy; seamless flow matches "less, but better" | — Pending |
| Inline card expansion over modal/full-page detail | Keeps user in context; feels more physical and connected | — Pending |
| Typography-driven skills list over chips/cards | Cleaner, more editorial feel; aligns with minimalist aesthetic | — Pending |
| In-browser PDF viewer over external links | Keeps visitors on-site; reduces friction for paper/resume review | — Pending |
| Lenis smooth scroll | Premium weighted scroll feel that sets the tone immediately | — Pending |

---
*Last updated: 2026-03-20 after initialization*
