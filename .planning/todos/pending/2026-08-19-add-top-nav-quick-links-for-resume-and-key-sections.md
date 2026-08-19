---
created: 2026-08-19T05:24:50.000Z
title: Add top-nav quick links for resume and key sections
area: ui
files:
  - src/components/layout/Navigation.tsx:16
  - src/hooks/useScrollVisibility.ts
  - src/data/navigation.ts
  - src/components/sections/Contact.tsx:15
  - src/types/data.ts:1
---

## Problem

Nothing on the site is reachable without scrolling, and the resume is the worst case.

Three compounding causes, all confirmed in code:

1. **The nav bar doesn't exist on landing.** `Navigation.tsx:16` calls
   `useScrollVisibility(400)`, so the header only mounts once the user has scrolled
   past 400px. A visitor who lands on the hero and doesn't scroll sees no navigation
   at all — no way to jump anywhere, no signal that other sections exist.

2. **The resume has no nav entry anywhere.** It is reachable from exactly one place:
   the unified links row in the Contact section (`Contact.tsx:15`), which sits at the
   very bottom of a long single-page scroll. A recruiter who wants the PDF has to
   scroll the entire site to find it.

3. **Contact isn't in the nav either.** `navigation.ts` lists only Background
   (with Expertise/Timeline children), Projects, Papers, and Vibe Coded Projects.
   `contact` *is* tracked in the scroll-spy `sectionIds` array
   (`Navigation.tsx:13`) but has no corresponding nav item — so the scroll-spy
   highlights a section the user can't click to.

For a portfolio whose primary audience is recruiters and grad-school reviewers,
the resume should be a first-class, always-visible target.

## Solution

Undecided — user raised this as an idea ("maybe some quick links in the top somewhere"),
not a spec. Options to evaluate:

1. **Always-visible header.** Drop or lower the 400px `useScrollVisibility`
   threshold so the nav is present from first paint. Simplest fix, addresses cause 1
   on its own. Risk: the hero was likely designed for a clean, chrome-free first
   impression — check that against the minimalist intent before changing it.

2. **Persistent Resume button in the nav.** A visually distinct CTA (accent fill or
   outline) pinned to the right of the nav links, separate from the section anchors,
   linking to `contactData.resumePath`. Directly fixes the headline complaint.

3. **Add Contact to `navItems`.** One-line data change that also repairs the
   scroll-spy mismatch in cause 3.

4. **Hero-level quick links.** Instead of (or alongside) nav changes, put
   Resume / Projects / Contact affordances in the hero itself, so the first screen
   offers a route somewhere. Avoids touching the scroll-reveal behavior entirely.

Note on implementation: `navItems` is admin-editable via
`src/admin/editors/NavigationEditor.tsx`, and `NavItem` (`types/data.ts:1`) is
just `{ label, href, children? }`. A resume link is a *download* to a static asset,
not a `#section` anchor, so option 2 likely needs either a new optional field on
`NavItem` (e.g. `external`/`download`) or a hardcoded button outside the
`navItems` map — worth deciding deliberately, since the admin editor and the
`navigation.test.ts` shape assertions both key off that type.

Related: pending quick task 9 also touches admin navigation editing
(`.planning/quick/9-change-the-navigation-page-of-the-admin-/`).
