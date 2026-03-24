# Phase 8: Admin Infrastructure - Research

**Researched:** 2026-03-24
**Domain:** Custom Vite plugin API layer, TypeScript code generation, atomic file writes, HMR loop prevention, dev/production code boundary
**Confidence:** HIGH

## Summary

Phase 8 builds the foundational backend for the admin panel: a custom Vite plugin that exposes REST endpoints for reading and writing content data files, a TypeScript code generator that produces valid `.ts` output matching the existing hand-written format, atomic file writes that prevent corruption, and the dev/production boundary ensuring zero admin code ships to production. This phase is pure infrastructure -- no UI is built here except a minimal dev-mode entry gate in App.tsx to verify the code boundary works.

The technical domain is well-understood. Vite's `configureServer` plugin hook is the documented mechanism for adding middleware to the dev server. The `apply: 'serve'` option ensures the plugin is completely inert during `vite build`. TypeScript 5.9.3 (already installed) provides `ts.createSourceFile()` for syntax validation of generated output. The main risk areas are (1) generating TypeScript that matches the existing file format (single quotes, trailing commas, `import type` syntax), (2) preventing HMR loops when the admin API writes data files that Vite watches, and (3) atomic writes on Windows NTFS where antivirus file locking can cause `EPERM` errors during rename.

**Primary recommendation:** Build the Vite plugin first with GET/POST endpoints, then layer TypeScript code generation with Prettier formatting and `ts.createSourceFile()` validation on top, using write-to-temp-then-rename for atomic writes and a write-lock flag with `handleHotUpdate` filtering for HMR loop prevention.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Admin activation UX: Two entry methods: `?admin` query parameter (bookmarkable) AND `Ctrl+Shift+A` keyboard toggle (quick switching)
- Admin panel is a slide-over panel from the left side, not a full-page replacement
- Panel is resizable via drag handle on the right edge (react-resizable-panels); default ~450px (28%), min 320px, max 60% viewport
- The live portfolio is the preview -- no iframe needed. Portfolio visible to right of admin panel, updates via HMR
- Smooth slide-in/out animation (~200ms ease-out) when opening/closing
- Exiting admin returns to portfolio view at top of page, `?admin` removed from URL
- Generated `.ts` files must match existing hand-written style (single quotes, trailing commas, consistent structure)
- No marker comments -- generated files are indistinguishable from hand-written
- Clean generation is fine -- no need to preserve original hand-written formatting quirks
- First admin save may reformat slightly; all subsequent saves are consistent
- Validate generated TypeScript with `ts.createSourceFile()` before writing to disk
- Git diffs should be clean -- formatting approach must prioritize diff readability
- Toast notifications (Sonner via shadcn/ui) for save success and failure
- Manual save only -- Save button click or Ctrl+S, no auto-save
- Debounce rapid saves -- last-write-wins with ~300ms debounce window
- Save button disabled with "Saving..." while write in progress
- Dirty state indicator -- save button shows dot for unsaved edits
- Exit confirmation -- prompt when closing admin with dirty state
- Terminal message: one-line hint in Vite native style (`Admin:   http://localhost:5173/?admin`)
- Errors only logged to terminal -- normal saves produce no terminal output
- No browser console message about admin availability

### Claude's Discretion
- Prettier vs custom formatter for generated file formatting (must achieve clean diffs + single quotes)
- Exact animation easing curve for slide-in/out
- Internal debounce implementation details
- Toast positioning (bottom-right suggested but flexible)
- Exact dirty state dot styling

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Admin panel is accessible only in dev mode -- zero admin code in production build | `import.meta.env.DEV` guard with lazy import pattern; `apply: 'serve'` on Vite plugin; verified via `vite build` + grep |
| INFRA-02 | Custom Vite plugin provides REST API at `/__admin-api/*` for content read/write | `configureServer` hook with connect middleware; `ssrLoadModule` for reading data; JSON body parsing from raw request |
| INFRA-03 | TypeScript code generation produces valid `.ts` files with `import type` syntax (passes `tsc -b`) | Prettier formatting with `singleQuote: true` + `ts.createSourceFile()` validation; template-based generation matching CONTENT_REGISTRY |
| INFRA-04 | File writes are atomic (write-to-temp then rename) preventing corruption | Write to `.tmp` file then `fs.rename()`; per-file write queue to serialize concurrent requests; retry on EPERM (Windows antivirus) |
| INFRA-05 | HMR loop prevention -- admin reads data via API endpoint, not module imports | Write-lock flag in plugin; `handleHotUpdate` hook filters `src/data/*.ts` during admin writes; admin GET endpoint reads via `ssrLoadModule` (not module import from browser) |
</phase_requirements>

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vite | ^8.0.1 | Dev server with `configureServer` plugin hook | The plugin API is the documented mechanism for adding custom middleware |
| typescript | ~5.9.3 | `ts.createSourceFile()` for syntax validation of generated code | Already a devDep; provides parse-only validation without full type-checking overhead |
| react | ^19.2.4 | Lazy import with `React.lazy()` for admin code splitting | Existing dependency; lazy imports enable dead-code elimination |

### New Dependencies to Add

| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| prettier | ^3.5.x | Programmatic formatting of generated `.ts` files (single quotes, trailing commas, consistent indentation) | Produces deterministic output matching existing code style; eliminates hand-rolling a custom formatter. `await format(code, { parser: 'typescript', singleQuote: true, trailingComma: 'all' })` |
| sonner | ^2.x | Toast notifications for save feedback (success/error) | shadcn/ui's toast solution; `npx shadcn@latest add sonner` installs it |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prettier for formatting | Custom regex-based quote replacement on JSON.stringify output | Fragile: breaks on edge cases (strings containing quotes, template literals). Prettier handles all TypeScript formatting deterministically. Worth the ~5ms async overhead per save. |
| Prettier for formatting | ts-morph AST generation + printing | 10+ MB dependency for simple data files. AST manipulation is overkill when the file structure is a single `import type` + `export const`. |
| `ts.createSourceFile()` for validation | Run `tsc --noEmit` as a child process | ~2-5 seconds per invocation vs. <1ms for `createSourceFile()`. Full type-checking is unnecessary for syntax validation of generated output. |
| Manual atomic write pattern | `write-file-atomic` npm package | The STATE.md records a decision to use manual atomic write pattern over the dependency. The pattern is simple (write tmp, rename) and avoids adding a dependency. |

**Installation:**
```bash
# Prettier as dev dependency (only used in Vite plugin, server-side)
npm install -D prettier

# Sonner toast via shadcn/ui CLI
npx shadcn@latest add sonner
```

## Architecture Patterns

### Recommended Project Structure (Phase 8 scope only)

```
vite-plugin-admin-api.ts        # Custom Vite plugin (root level, alongside vite.config.ts)
src/
  App.tsx                       # MODIFIED: add import.meta.env.DEV guard (~25 lines)
  admin/                        # NEW: admin-only directory (code-split boundary)
    AdminShell.tsx              # Stub for Phase 8 (real UI in Phase 9)
  data/
    *.ts                        # UNCHANGED at build time; written to by plugin at runtime
  types/
    data.ts                     # UNCHANGED: shared type contract
```

### Pattern 1: Vite Plugin with Content Registry

**What:** A single plugin file that maps content type names to file metadata, providing GET/POST endpoints for each.

**When to use:** Always -- this is the core data layer for the entire admin panel.

**Example:**
```typescript
// Source: Vite Plugin API docs (https://vite.dev/guide/api-plugin)
import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs/promises';
import path from 'path';

const CONTENT_REGISTRY = {
  hero:       { file: 'hero.ts',       type: 'HeroData',          export: 'heroData',      isArray: false },
  projects:   { file: 'projects.ts',   type: 'Project',           export: 'projects',      isArray: true },
  papers:     { file: 'papers.ts',     type: 'Paper',             export: 'papers',        isArray: true },
  skills:     { file: 'skills.ts',     type: 'SkillGroup',        export: 'skillGroups',   isArray: true },
  tooling:    { file: 'tooling.ts',    type: 'ToolingGroup',      export: 'toolingGroups', isArray: true },
  timeline:   { file: 'timeline.ts',   type: 'TimelineMilestone', export: 'milestones',    isArray: true },
  contact:    { file: 'contact.ts',    type: 'ContactData',       export: 'contactData',   isArray: false },
  navigation: { file: 'navigation.ts', type: 'NavItem',           export: 'navItems',      isArray: true },
  coursework: { file: 'coursework.ts', type: 'Course',            export: 'courses',       isArray: true },
} as const;

type ContentType = keyof typeof CONTENT_REGISTRY;
```

### Pattern 2: Atomic Write with Write-Lock for HMR

**What:** Write to a temp file, rename atomically, suppress HMR during the rename window.

**When to use:** Every file write from the admin API.

**Example:**
```typescript
// Write-lock flag prevents HMR loop
let activeWrites = new Set<string>();

async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tmpPath = filePath + '.tmp';
  activeWrites.add(filePath);
  try {
    await fs.writeFile(tmpPath, content, 'utf-8');
    // Retry rename on Windows EPERM (antivirus file lock)
    let retries = 3;
    while (retries > 0) {
      try {
        await fs.rename(tmpPath, filePath);
        break;
      } catch (err: any) {
        if (err.code === 'EPERM' && retries > 1) {
          retries--;
          await new Promise(r => setTimeout(r, 100));
        } else {
          throw err;
        }
      }
    }
  } finally {
    // Small delay to let chokidar pick up the rename before clearing lock
    setTimeout(() => activeWrites.delete(filePath), 200);
  }
}
```

### Pattern 3: TypeScript Code Generation with Prettier + Validation

**What:** Generate a TypeScript source string from JSON data, format with Prettier, validate with `ts.createSourceFile()`, then write.

**When to use:** Every POST to `/__admin-api/content/:type`.

**Example:**
```typescript
import * as prettier from 'prettier';
import ts from 'typescript';

function generateDataFile(
  typeName: string,
  exportName: string,
  data: unknown,
  isArray: boolean,
): string {
  const typeAnnotation = isArray ? `${typeName}[]` : typeName;
  const serialized = JSON.stringify(data, null, 2);
  return [
    `import type { ${typeName} } from '../types/data';`,
    '',
    `export const ${exportName}: ${typeAnnotation} = ${serialized};`,
    '',
  ].join('\n');
}

async function formatAndValidate(rawSource: string): Promise<string> {
  // Format with Prettier (single quotes, trailing commas)
  const formatted = await prettier.format(rawSource, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 100,
  });

  // Validate syntax with TypeScript parser
  const sourceFile = ts.createSourceFile(
    'generated.ts',
    formatted,
    ts.ScriptTarget.Latest,
    true,
  );
  const errors = sourceFile.parseDiagnostics;
  if (errors && errors.length > 0) {
    const messages = errors.map(d =>
      `Line ${ts.getLineAndCharacterOfPosition(sourceFile, d.start!).line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`
    );
    throw new Error(`Generated TypeScript has syntax errors:\n${messages.join('\n')}`);
  }

  return formatted;
}
```

### Pattern 4: JSON Body Parsing for Connect Middleware

**What:** Parse JSON request bodies from raw Node.js `IncomingMessage` (no Express needed).

**When to use:** POST endpoints in the admin API plugin.

**Example:**
```typescript
function parseJsonBody(req: import('http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf-8');
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}
```

### Pattern 5: Dev-Mode Entry Gate with `import.meta.env.DEV`

**What:** Conditional lazy import that is statically eliminated in production builds.

**When to use:** The single entry point in App.tsx that gates all admin code.

**Example:**
```typescript
// Source: Vite Env and Mode docs (https://vite.dev/guide/env-and-mode)
// import.meta.env.DEV is replaced with `false` at build time.
// The ternary resolves to null, and lazy() is dead code.
const AdminShell = import.meta.env.DEV
  ? lazy(() => import('./admin/AdminShell'))
  : null;
```

### Anti-Patterns to Avoid

- **Importing admin modules statically:** A top-level `import AdminShell from './admin/AdminShell'` will be bundled even inside an `if (DEV)` block. Must use dynamic `import()` inside the DEV ternary.
- **Reading data via module imports in admin:** The admin panel must NOT `import { heroData } from '../data/hero'` because this creates HMR dependencies that cause loops. Read via the GET API endpoint instead.
- **Using `server.ssrLoadModule()` without understanding deprecation path:** `ssrLoadModule` still works in Vite 8 but is deprecated in favor of `moduleRunner.import()`. For Phase 8, `ssrLoadModule` is acceptable since it still works and the ModuleRunner API is more complex. Flag for migration in future.
- **Synchronous Prettier calls:** Prettier's `format()` is async. Do not use `formatSync()` or any workaround -- async is fine in the middleware handler.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| TypeScript formatting (single quotes, trailing commas, indentation) | Regex-based string replacement on JSON.stringify output | Prettier `format()` with `{ parser: 'typescript', singleQuote: true, trailingComma: 'all' }` | Edge cases: strings containing quotes, template literals, multiline strings, unicode escapes. Prettier handles all of these deterministically. |
| Syntax validation of generated TypeScript | Custom regex parser or no validation | `ts.createSourceFile()` with `parseDiagnostics` check | TypeScript's own parser catches all syntax errors. `createSourceFile` is synchronous and takes <1ms. |
| Atomic file writes | Simple `fs.writeFile()` | Write-to-temp + `fs.rename()` with EPERM retry | `fs.writeFile` is not atomic. On Windows, antivirus scanners can lock the temp file causing EPERM on rename -- need retry logic. |
| JSON body parsing in connect middleware | Installing Express just for `req.body` | Manual buffer collection from `req.on('data')` + `JSON.parse()` | Express adds ~600KB to node_modules for one feature. The manual pattern is 10 lines and well-understood. |
| Toast notifications | Custom notification system | Sonner via `npx shadcn@latest add sonner` | Battle-tested, accessible, matches shadcn/ui design system. |

**Key insight:** The complexity in this phase is not in any single component but in the interplay between file writes, HMR, and TypeScript validity. Each individual piece (write a file, format code, validate syntax) is straightforward -- the challenge is orchestrating them correctly so rapid saves don't corrupt files or trigger infinite loops.

## Common Pitfalls

### Pitfall 1: Infinite HMR Loop
**What goes wrong:** Admin writes `src/data/hero.ts`, Vite detects the change, HMR fires, if the admin component re-imports the data module, it may trigger a re-render that writes again.
**Why it happens:** Vite watches everything under `src/` by default. Writing to `src/data/*.ts` triggers HMR like any other source edit.
**How to avoid:** (1) Admin reads data via `GET /__admin-api/content/:type` (API endpoint), never via module import. (2) Plugin uses `handleHotUpdate` hook to check `activeWrites` set -- if the changed file is in the set, return empty array `[]` to suppress HMR propagation. (3) After the write lock clears (~200ms), subsequent external edits (e.g., user edits in VS Code) trigger HMR normally.
**Warning signs:** Terminal shows rapid repeated `[vite] hmr update /src/data/hero.ts` messages; browser page flickers.

### Pitfall 2: Generated TypeScript Fails `tsc -b`
**What goes wrong:** The generated file uses `import { HeroData }` instead of `import type { HeroData }`, or has a syntax error from improperly escaped user content.
**Why it happens:** The project uses `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true` in tsconfig -- these reject non-`type` imports for type-only usage. Content with apostrophes (e.g., "Maxwell's equations") breaks naive string generation.
**How to avoid:** (1) Always use `import type { ... }` in the template. (2) Use `JSON.stringify()` for the data value (handles string escaping). (3) Run Prettier (normalizes formatting). (4) Validate with `ts.createSourceFile()` before writing -- reject and return error if validation fails, never write invalid files.
**Warning signs:** `npm run build` (which runs `tsc -b && vite build`) fails after admin edits.

### Pitfall 3: File Corruption from Rapid Saves
**What goes wrong:** User clicks Save 5 times in 2 seconds. Two concurrent `fs.writeFile` calls to the same file interleave, producing truncated output.
**Why it happens:** `fs.writeFile` is not atomic. Two overlapping writes to the same path produce undefined results.
**How to avoid:** (1) Client-side debounce (~300ms, last-write-wins) so 5 clicks = 1 write. (2) Server-side per-file write queue -- if a write to `hero.ts` is in progress, queue the next and execute after the first completes. (3) Atomic write-to-temp-then-rename as a safety net.
**Warning signs:** Data file contains truncated content or a mix of old/new data; Vite error overlay shows parse failures.

### Pitfall 4: Admin Code Leaks to Production
**What goes wrong:** After `vite build`, the `dist/` folder contains admin-related JavaScript chunks or references.
**Why it happens:** Static `import` at top of file is always bundled regardless of runtime conditions. If `src/admin/` is imported statically in App.tsx, Vite cannot tree-shake it.
**How to avoid:** (1) The ONLY reference to `src/admin/` is via `lazy(() => import('./admin/AdminShell'))` inside an `import.meta.env.DEV` ternary. (2) The plugin uses `apply: 'serve'` so it doesn't exist during build. (3) Verify with `vite build && grep -r "admin" dist/` -- should return zero matches. (4) Verify with `grep -r "AdminShell" dist/` -- should return zero matches.
**Warning signs:** `dist/assets/` contains chunks with "admin" in the filename.

### Pitfall 5: Windows EPERM on File Rename
**What goes wrong:** `fs.rename()` throws `EPERM` or `EBUSY` intermittently on Windows.
**Why it happens:** Windows Defender (or other antivirus) opens newly-written files for scanning. The file is briefly locked when `rename()` fires immediately after `writeFile()`.
**How to avoid:** Retry `fs.rename()` up to 3 times with 100ms delay between attempts. Only on Windows and only for `EPERM`/`EBUSY` error codes.
**Warning signs:** Sporadic write failures in the terminal with `EPERM` errors, usually resolving on retry.

## Code Examples

### Complete Vite Plugin Structure

```typescript
// vite-plugin-admin-api.ts
// Source: Vite Plugin API (https://vite.dev/guide/api-plugin)
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs/promises';
import path from 'path';
import ts from 'typescript';

const CONTENT_REGISTRY = {
  hero:       { file: 'hero.ts',       type: 'HeroData',          export: 'heroData',      isArray: false },
  projects:   { file: 'projects.ts',   type: 'Project',           export: 'projects',      isArray: true },
  papers:     { file: 'papers.ts',     type: 'Paper',             export: 'papers',        isArray: true },
  skills:     { file: 'skills.ts',     type: 'SkillGroup',        export: 'skillGroups',   isArray: true },
  tooling:    { file: 'tooling.ts',    type: 'ToolingGroup',      export: 'toolingGroups', isArray: true },
  timeline:   { file: 'timeline.ts',   type: 'TimelineMilestone', export: 'milestones',    isArray: true },
  contact:    { file: 'contact.ts',    type: 'ContactData',       export: 'contactData',   isArray: false },
  navigation: { file: 'navigation.ts', type: 'NavItem',           export: 'navItems',      isArray: true },
  coursework: { file: 'coursework.ts', type: 'Course',            export: 'courses',       isArray: true },
} as const;

type ContentType = keyof typeof CONTENT_REGISTRY;

export function adminApiPlugin(): Plugin {
  const activeWrites = new Set<string>();
  let dataDir: string;

  return {
    name: 'admin-api',
    apply: 'serve',

    configureServer(server: ViteDevServer) {
      dataDir = path.resolve(server.config.root, 'src/data');

      // Print admin URL alongside Vite's own output
      const originalPrint = server.printUrls;
      server.printUrls = () => {
        originalPrint();
        const address = server.resolvedUrls?.local[0];
        if (address) {
          server.config.logger.info(
            `  ${'\x1b[36m'}Admin:${'\x1b[0m'}   ${address}?admin`
          );
        }
      };

      // Return function to mount after Vite's internal middleware
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/__admin-api/')) return next();
          // ... route handling
        });
      };
    },

    handleHotUpdate({ file, modules }) {
      // Suppress HMR for files currently being written by admin API
      const normalized = path.resolve(file);
      if (activeWrites.has(normalized)) {
        return []; // Empty array = no HMR update
      }
    },
  };
}
```

### Reading Data via ssrLoadModule

```typescript
// Inside the GET handler
// Source: Vite SSR docs (https://vite.dev/guide/ssr)
// Note: ssrLoadModule still works in Vite 8 but is deprecated.
// Use it for now; migrate to moduleRunner.import() when ssrLoadModule is removed.
async function handleGet(
  server: ViteDevServer,
  contentType: ContentType,
  res: ServerResponse,
) {
  const entry = CONTENT_REGISTRY[contentType];
  const mod = await server.ssrLoadModule(`/src/data/${entry.file}`);
  const data = mod[entry.export];
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}
```

### Terminal Message in Vite Style

```typescript
// The configureServer hook overrides printUrls to add admin line
// Output appears as:
//   VITE v8.0.1  ready in 200 ms
//
//   ➜  Local:   http://localhost:5173/
//   ➜  Admin:   http://localhost:5173/?admin
```

### Production Exclusion Verification

```bash
# After vite build, run these checks (should all return empty):
grep -r "admin" dist/
grep -r "AdminShell" dist/
grep -r "__admin-api" dist/
# Bundle size should match v1.0 (no admin code overhead)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `server.ssrLoadModule()` | `moduleRunner.import()` | Vite 6.0 (deprecated, not removed) | ssrLoadModule still works in Vite 8. Use it now, plan migration when removed in future major. |
| `handleHotUpdate` hook | `hotUpdate` hook | Vite 6.0 (deprecated, not removed) | handleHotUpdate still works. The new hotUpdate adds `type` field (create/update/delete). Use handleHotUpdate for now. |
| `write-file-atomic` package | Manual temp+rename pattern | Project decision (STATE.md) | User chose to avoid the dependency. Manual pattern with EPERM retry is sufficient for this use case. |

**Deprecated/outdated:**
- `server.ssrLoadModule()`: Deprecated since Vite 6.0 but still functional in Vite 8.0.1. Replacement is `moduleRunner.import()`. The old API is simpler and fine for this use case.
- `handleHotUpdate`: Deprecated since Vite 6.0 but still functional. Replacement `hotUpdate` adds `type` field. The old API covers our needs.

## Open Questions

1. **Prettier installation as devDependency**
   - What we know: Prettier is not currently installed. STATE.md flags "Verify Prettier is installed as devDep before Phase 8 code generation work."
   - What's unclear: Nothing -- it just needs to be installed.
   - Recommendation: Install `prettier` as a devDependency in Wave 0 of implementation. It is only used server-side in the Vite plugin.

2. **ssrLoadModule future removal timeline**
   - What we know: Deprecated in Vite 6.0, still works in Vite 8.0.1, removal planned for "a future major."
   - What's unclear: Which major version will remove it.
   - Recommendation: Use ssrLoadModule now. Add a `// TODO: migrate to moduleRunner.import() when ssrLoadModule is removed` comment. The migration is straightforward when needed.

3. **Sonner vs shadcn/ui Toast**
   - What we know: CONTEXT.md specifies "Sonner via shadcn/ui" for toast notifications. shadcn/ui v4 provides `npx shadcn@latest add sonner` which installs the sonner package and a Toaster component.
   - What's unclear: Whether sonner is needed in Phase 8 (infrastructure) or Phase 9/10 (UI).
   - Recommendation: Install sonner in Phase 8 so the toast infrastructure is available when the admin shell is built. The Toaster provider goes in App.tsx alongside the admin entry gate.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` (exists, jsdom environment, globals enabled) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | Zero admin code in production build | integration (build + grep) | `npx vite build && ! grep -r "admin" dist/` | No -- Wave 0 |
| INFRA-02 | GET/POST endpoints return correct data | unit (plugin handler) | `npx vitest run src/admin/__tests__/admin-api.test.ts -x` | No -- Wave 0 |
| INFRA-03 | Generated TS passes `ts.createSourceFile()` and `tsc -b` | unit (code generator) | `npx vitest run src/admin/__tests__/codegen.test.ts -x` | No -- Wave 0 |
| INFRA-04 | Atomic writes survive concurrent access | unit (atomic write fn) | `npx vitest run src/admin/__tests__/atomic-write.test.ts -x` | No -- Wave 0 |
| INFRA-05 | HMR not triggered during admin writes | integration (write + HMR check) | Manual verification: write file, observe no HMR flood in terminal | No -- manual |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npx tsc -b`
- **Phase gate:** Full suite green + `vite build` + grep verification before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/admin/__tests__/codegen.test.ts` -- covers INFRA-03 (TypeScript generation + formatting + validation)
- [ ] `src/admin/__tests__/atomic-write.test.ts` -- covers INFRA-04 (temp file + rename + concurrent writes)
- [ ] `src/admin/__tests__/admin-api.test.ts` -- covers INFRA-02 (GET/POST endpoint handlers, unit tested with mock server)
- [ ] Build verification script for INFRA-01 (can be a vitest test or shell script)

*(Existing data tests in `src/data/__tests__/*.test.ts` validate that data files maintain their structure after admin writes -- these serve as regression tests.)*

## Sources

### Primary (HIGH confidence)
- [Vite Plugin API - configureServer, handleHotUpdate, apply](https://vite.dev/guide/api-plugin) -- Official Vite docs on plugin hooks
- [Vite Env and Mode - import.meta.env.DEV](https://vite.dev/guide/env-and-mode) -- Static replacement and tree-shaking behavior
- [TypeScript Compiler API - createSourceFile](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) -- Syntax-only parsing without type checking
- [Prettier API - format()](https://prettier.io/docs/api) -- Programmatic formatting with options
- [Prettier Options - singleQuote, trailingComma](https://prettier.io/docs/options) -- Configuration for TypeScript formatting
- [Node.js fs API](https://nodejs.org/api/fs.html) -- writeFile, rename for atomic writes
- [Vite SSR - ssrLoadModule deprecation](https://vite.dev/changes/ssr-using-modulerunner) -- ModuleRunner replacement, still works in Vite 8
- [Vite HMR - hotUpdate hook](https://vite.dev/changes/hotupdate-hook) -- handleHotUpdate deprecation timeline

### Secondary (MEDIUM confidence)
- [write-file-atomic](https://github.com/npm/write-file-atomic) -- Reference for atomic write patterns (not using the package, using the pattern)
- [EPERM on Windows rename](https://github.com/nodejs/node/issues/29481) -- Windows antivirus file locking during rename
- [Vite HMR discussion](https://github.com/vitejs/vite/discussions/13943) -- Suppressing HMR for specific files

### Tertiary (LOW confidence)
- None -- all findings verified against official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Vite plugin API, TypeScript compiler API, and Prettier are all well-documented and verified
- Architecture: HIGH -- the configureServer + handleHotUpdate + atomic write pattern is established; project research (ARCHITECTURE.md, PITFALLS.md) already validated the approach
- Pitfalls: HIGH -- all 5 pitfalls identified from project research and verified against Vite docs and Windows-specific Node.js issues
- Code generation: HIGH -- `ts.createSourceFile()` syntax validation tested locally (works with TypeScript 5.9.3); Prettier formatting tested against official docs

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (30 days -- all dependencies are stable releases)
