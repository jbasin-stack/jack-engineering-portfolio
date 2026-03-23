# Roadmap: Jack Basinski Engineering Portfolio

## Overview

This roadmap delivers a high-performance, minimalist single-page portfolio that lets recruiters, professors, and peers immediately understand Jack's range and depth as an electrical engineer. Phase 1 scaffolds the project with correct tooling, smooth scroll, navigation, and the hero section. Phase 2 builds all data-driven content sections (skills, tooling, coursework, timeline, contact). Phase 3 tackles the two complex interactive features: bento grid project cards with inline expansion and in-browser PDF viewing for papers and resume. Phase 4 locks down performance, responsive design, accessibility, and Vercel deployment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation, Navigation, and Hero** - Scaffold Vite 8 + React 19 project with Lenis, Motion, Tailwind v4, glassmorphic nav, and typography-first hero (completed 2026-03-22)
- [ ] **Phase 2: Content Sections** - Build all data-driven sections: Skills, Lab/Tooling, Coursework, Timeline, and Contact
- [x] **Phase 3: Interactive Features** - Bento grid project cards with inline expansion and in-browser PDF viewer for papers and resume (completed 2026-03-23)
- [ ] **Phase 4: Polish and Deployment** - Responsive QA, Lighthouse 90+, accessibility, semantic HTML, and Vercel deployment

## Phase Details

### Phase 1: Foundation, Navigation, and Hero
**Goal**: Visitor lands on a working single-page app with premium smooth scroll, glassmorphic navigation, and a typography-first hero that immediately communicates Jack's identity
**Depends on**: Nothing (first phase)
**Requirements**: FNDN-01, FNDN-02, FNDN-03, FNDN-04, FNDN-05, FNDN-06, FNDN-07, FNDN-08, NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, HERO-01, HERO-02, HERO-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees a hero section with Jack's name, ECE at UW identity, and semiconductor fabrication x system design narrative rendered in high-quality sans-serif typography with generous whitespace
  2. Visitor sees a fixed glassmorphic navigation bar with backdrop-blur that stays visible at all scroll positions, highlights the active section while scrolling, and smooth-scrolls to target sections on click
  3. Navigation collapses to a mobile-friendly hamburger menu at small breakpoints
  4. Page scrolls with a weighted, physical Lenis smooth-scroll feel, and all section entries animate with weighted Motion transitions (no bounce or spring)
  5. All content data structures (projects, papers, skills, courses, tooling, timeline, nav items) are defined as typed TypeScript data files separate from JSX
**Plans:** 3/3 plans complete

Plans:
- [x] 01-01-PLAN.md — Scaffold Vite project, design system, typed data layer, scroll infrastructure, and test suite
- [x] 01-02-PLAN.md — Typography-first hero section with staggered animation, social icons, and scroll indicator
- [x] 01-03-PLAN.md — Glassmorphic navigation with dropdown, scroll-spy, mobile hamburger overlay

### Phase 2: Content Sections
**Goal**: Visitor can browse all informational sections — skills grouped by domain, lab tooling proficiency, coursework highlights, engineering timeline, and contact links — all rendered from data files with consistent animation and semantic markup
**Depends on**: Phase 1
**Requirements**: SKIL-01, SKIL-02, SKIL-03, SKIL-04, TOOL-01, TOOL-02, TOOL-03, CRSE-01, CRSE-02, CRSE-03, TIME-01, TIME-02, TIME-03, TIME-04, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. Visitor can view technical skills as a clean typography-driven list grouped by Fabrication, RF, Analog, and Digital domains, with semantic HTML that AI scrapers can parse
  2. Visitor can view a lab and tooling section showing hands-on proficiency grouped by category (EDA tools, lab equipment, fabrication processes)
  3. Visitor can view key UW ECE courses with brief descriptors signaling domain relevance
  4. Visitor can view a vertical timeline of 6-10 engineering milestones that fills progressively as they scroll down the page
  5. Visitor can access email link, LinkedIn, GitHub profiles, and download resume as PDF from the contact section
**Plans:** 4/4 plans complete

Plans:
- [x] 02-01-PLAN.md — Typed data layer: interfaces, 5 content data files, animation variants, and data integrity tests
- [x] 02-02-PLAN.md — Skills, Tooling, and Coursework section components with column grid and vertical list layouts
- [x] 02-03-PLAN.md — Timeline with scroll-driven progressive fill and Contact CTA section
- [x] 02-04-PLAN.md — Wire all sections into App.tsx and visual verification checkpoint

### Phase 3: Interactive Features
**Goal**: Visitor can explore 3-5 projects via an interactive bento grid with inline card expansion, and view academic papers and resume in-browser via a PDF viewer — the two flagship interactive experiences of the portfolio
**Depends on**: Phase 2
**Requirements**: PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, PROJ-06, DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
**Success Criteria** (what must be TRUE):
  1. Visitor sees 3-5 projects in a bento grid layout with variable-size cards showing thumbnails, titles, and brief descriptions
  2. Visitor can click any project card to see it expand inline with full description, visuals, tech stack, and links — with smooth Motion layout animation for expand and collapse
  3. Bento grid collapses gracefully to single-column on mobile
  4. Visitor can click any paper or the resume to view the PDF in-browser (Dialog on desktop, Drawer on mobile) with a direct download fallback
  5. PDF viewer works correctly in both development and production Vite builds
**Plans:** 4/4 plans complete

Plans:
- [x] 03-01-PLAN.md — Foundation: shadcn/ui init, react-pdf setup, type interfaces, data files, useIsMobile hook, layout transition config
- [x] 03-02-PLAN.md — Bento grid Projects section with inline card expansion and project detail Dialog/Drawer
- [x] 03-03-PLAN.md — Papers section with row listing and shared PDF viewer component
- [x] 03-04-PLAN.md — Wire sections into App.tsx, connect resume to PDF viewer, production build verification

### Phase 4: Polish and Deployment
**Goal**: Site is fully responsive, scores 90+ on Lighthouse, respects accessibility preferences, and is live on Vercel with auto-deploy
**Depends on**: Phase 3
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05
**Success Criteria** (what must be TRUE):
  1. Site renders correctly and is fully usable at mobile, tablet, and desktop breakpoints
  2. Lighthouse performance score is 90+ with optimized images, lazy loading, and minimal JS bundle
  3. Semantic HTML uses proper heading hierarchy and semantic elements; OpenGraph meta tags produce polished social previews
  4. Site is live on Vercel free tier with auto-deploy on push and working HTTPS
**Plans**: TBD

Plans:
- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Navigation, and Hero | 3/3 | Complete   | 2026-03-22 |
| 2. Content Sections | 4/4 | Complete | 2026-03-23 |
| 3. Interactive Features | 4/4 | Complete   | 2026-03-23 |
| 4. Polish and Deployment | 0/1 | Not started | - |
