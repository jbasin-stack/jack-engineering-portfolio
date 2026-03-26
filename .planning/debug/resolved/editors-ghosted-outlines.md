---
status: resolved
trigger: "Editors render as ghosted outlines instead of fully rendered forms"
created: 2026-03-26T00:00:00Z
updated: 2026-03-26T18:00:00Z
---

## Current Focus

hypothesis: CONFIRMED - Admin API middleware mounts AFTER Vite SPA fallback, so API requests get HTML instead of JSON
test: curl the API endpoint directly
expecting: JSON data from data files
next_action: return diagnosis

## Symptoms

expected: Clicking content types in admin sidebar renders fully populated editor forms
actual: Editors show pulsing gray rectangles ("ghosted outlines") and never transition to the real form
errors: Silent -- SyntaxError in JSON parse is swallowed by missing .catch() on fetch promise chain
reproduction: Open admin panel (?admin), click any content type in sidebar
started: Since Phase 10 editors were built

## Eliminated

(none -- root cause found on first hypothesis path)

## Evidence

- timestamp: 2026-03-26T00:01:00Z
  checked: useContentEditor.ts fetch chain (lines 27-34)
  found: No .catch() handler on the fetch promise chain. If res.json() throws, setLoading(false) never runs.
  implication: Any non-JSON response causes permanent loading state

- timestamp: 2026-03-26T00:02:00Z
  checked: curl http://localhost:5199/__admin-api/content/hero
  found: Returns full HTML page (index.html SPA fallback), NOT JSON data
  implication: Vite's SPA fallback is intercepting the request before the admin API middleware

- timestamp: 2026-03-26T00:03:00Z
  checked: vite-plugin-admin-api.ts configureServer (line 121-123)
  found: Plugin returns a function from configureServer() which mounts middleware AFTER Vite internals
  implication: This is the "post" middleware pattern -- Vite's SPA fallback (history-api-fallback) runs first, matches the /__admin-api/* route as a client route, and serves index.html

- timestamp: 2026-03-26T00:04:00Z
  checked: Vite configureServer docs
  found: Direct server.middlewares.use() calls = pre-middleware (before Vite). Returning a function = post-middleware (after Vite). API routes MUST use pre-middleware to avoid SPA fallback.
  implication: The fix is to NOT return a function, and instead call server.middlewares.use() directly in configureServer()

## Resolution

root_cause: |
  The admin API Vite plugin registers its middleware as "post" middleware
  (by returning a function from configureServer) instead of "pre" middleware
  (by calling server.middlewares.use() directly). This causes Vite's built-in
  SPA fallback (connect-history-api-fallback) to intercept /__admin-api/*
  requests first and serve index.html instead of passing them to the API handler.

  The fetch chain in useContentEditor has no .catch(), so when res.json() fails
  to parse HTML as JSON (SyntaxError: Unexpected token '<'), the error is
  silently swallowed and setLoading(false) is never called. The editors remain
  stuck in their animate-pulse skeleton state forever -- the "ghosted outlines."

fix: (not applied -- diagnosis only)
verification: (not applied -- diagnosis only)
files_changed: []
