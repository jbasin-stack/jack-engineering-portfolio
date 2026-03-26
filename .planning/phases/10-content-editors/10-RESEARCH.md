# Phase 10: Content Editors - Research

**Researched:** 2026-03-26
**Domain:** React form-based content editors with Zod validation, REST API integration
**Confidence:** HIGH

## Summary

Phase 10 builds form-based editors for all 9 content types so the user never hand-edits TypeScript data files. The infrastructure is fully in place from Phases 8-9: `AdminShell.tsx` provides the shell with navigation, save bar, and toast; `vite-plugin-admin-api.ts` provides GET/POST endpoints per content type; `codegen.ts` + `atomic-write.ts` handle code generation and safe file writing. The editor area in AdminShell (lines 79-114) currently shows placeholder text and needs to be replaced with actual editor components.

The primary technical decisions are: (1) use Zod v4 (already available as v4.3.6 transitive dep) for validation schemas that mirror the TypeScript interfaces in `src/types/data.ts`, (2) use `z.flattenError()` to extract per-field error messages for inline display, (3) use shadcn/ui form primitives (`input`, `textarea`, `label`, `checkbox`) for consistent styling, and (4) build a small set of shared form components (FormField, TagInput, StructuredArrayField, SectionHeader) that all 9 editors reuse.

**Primary recommendation:** Build controlled form components with local React state, validate on save with Zod `safeParse()`, POST validated data to `/__admin-api/content/:type`, and display `z.flattenError()` results inline. No form library (React Hook Form, Formik) needed -- the forms are simple enough that `useState` + Zod covers all requirements.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Simple string arrays (techStack, skills, tooling items): inline text input + Enter key to add, rendered as tags with x button to remove
- Structured array items (links with label+url, socialLinks with platform+url+icon): mini-form row per item with fields side-by-side, x button to remove, "+ Add" button creates new empty row
- No drag-to-reorder in v1.1 -- items stay in insertion order (EDIT-P03 defers dnd-kit reorder to v2)
- Remove is immediate on x click, no per-item confirmation needed
- All editors use a single scrollable form with subtle section headers (e.g., "Details", "Media", "Tech & Links")
- Singleton editors (Hero, Contact, Navigation): form fields directly, no item picker
- List-type editors (Projects, Papers, Skills, Tooling, Timeline, Coursework): compact item list at the top of the editor, click to load item form below, "+ Add new" button at bottom of list, active item highlighted
- Complex editors (Projects) group fields with section headers but don't use tabs or accordions
- Consistent layout across all editors -- singletons are the same pattern minus the item picker
- Users can delete items from list-type content via a "Delete" button at the bottom of the item form, with a confirmation prompt before removing
- New items start blank with `id` auto-generated from the title field (kebab-case, derived as user types)
- All other fields start empty; required fields are caught by Zod validation on save
- Zod validation fires on save only (Save button or Ctrl+S) -- no mid-typing validation
- Zod schemas mirror existing TypeScript type definitions exactly -- if the type says `string`, the field is required; arrays can be empty `[]`
- No extra validation constraints beyond what the types define
- Inline errors: red text below the invalid field + red field border
- Red toast summary for save-level error notification (Sonner already installed)
- All inline errors clear on the next save attempt (clean slate re-validation)
- Wave 1: Shared form components + singleton editors (Hero, Contact, Navigation)
- Wave 2: List-type editors with simple items (Skills, Tooling, Timeline, Coursework)
- Wave 3: Complex editors with nested arrays and uploads (Papers, Projects)
- One plan per wave (3 plans total: 10-01, 10-02, 10-03)
- Shared components extracted upfront in Wave 1 and reused across all subsequent editors

### Claude's Discretion
- Exact Zod schema implementation details
- Form field component internal structure and styling
- Section header visual treatment
- How the item list is styled (compact list vs cards)
- Auto-generated ID derivation logic details
- Whether to use controlled or uncontrolled form inputs
- Toast positioning and timing

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EDIT-01 | User can edit Hero section content (name, tagline, social links) via form | Singleton editor pattern; HeroData has 3 string fields + socialLinks array; Wave 1 |
| EDIT-02 | User can edit Contact section content (email, socials, resume path) via form | Singleton editor pattern; ContactData has 3 string fields + socialLinks array; Wave 1 |
| EDIT-03 | User can edit Timeline entries (add, remove, modify milestones) via form | List-type editor; TimelineMilestone has 3 string fields; Wave 2 |
| EDIT-04 | User can edit Coursework entries via form | List-type editor; Course has 3 string fields; Wave 2 |
| EDIT-05 | User can edit Skills groups and individual skills via form | List-type editor; SkillGroup has domain string + skills string[]; Wave 2 |
| EDIT-06 | User can edit Tooling categories and items via form | List-type editor; ToolingGroup has category string + items string[]; Wave 2 |
| EDIT-07 | User can edit Navigation structure via form | Singleton editor (array of NavItem with optional children); Wave 1 |
| EDIT-08 | User can edit Papers (title, summary, PDF reference) via form | List-type with file upload (pdfPath); Paper has 4 fields; Wave 3 |
| EDIT-09 | User can edit Projects (all 10 fields including nested arrays) via form | Most complex editor; Project has 10 fields incl. string[], object[], boolean, and uploads; Wave 3 |
| EDIT-10 | All editors validate input with Zod schemas before saving | Zod v4 safeParse + z.flattenError(); schemas mirror TypeScript interfaces |
| EDIT-11 | User receives toast feedback on successful save or validation error | Sonner already installed; toast.success/toast.error; integrated in save handler |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI framework | Already installed, project standard |
| Zod | 4.3.6 | Schema validation | Already available as transitive dep; must add as explicit dep |
| Sonner | 2.0.7 | Toast notifications | Already installed and integrated in AdminShell |
| Lucide React | 0.577.0 | Icons (X, Plus, Trash2, etc.) | Already installed, project standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui input | latest | Text input component | All form text fields |
| shadcn/ui textarea | latest | Multi-line text input | summary, description, narrative fields |
| shadcn/ui label | latest | Accessible form labels | All form fields |
| shadcn/ui checkbox | latest | Boolean toggle | Project `featured` field |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| useState + Zod | React Hook Form + Zod resolver | RHF adds complexity; forms are simple enough that direct state management works; fewer deps |
| Custom form components | shadcn/ui Form (RHF wrapper) | shadcn Form requires RHF; we want validate-on-save only, not field-level watchers |
| Zod v3 | Zod v4 (already installed) | v4 is already in node_modules; error API slightly different but well-documented |

**Installation:**
```bash
npm install zod
npx shadcn@latest add input textarea label checkbox
```

## Architecture Patterns

### Recommended Project Structure
```
src/admin/
  editors/
    shared/
      FormField.tsx        # Labeled input/textarea with error display
      TagInput.tsx          # String array editor (tags + text input)
      StructuredArrayField.tsx  # Array of objects editor (mini-form rows)
      SectionHeader.tsx     # Visual section divider within forms
      ItemList.tsx          # Item picker for list-type editors
    HeroEditor.tsx          # Singleton editor
    ContactEditor.tsx       # Singleton editor
    NavigationEditor.tsx    # Singleton editor (array, but singleton pattern)
    SkillsEditor.tsx        # List-type editor
    ToolingEditor.tsx       # List-type editor
    TimelineEditor.tsx      # List-type editor
    CourseworkEditor.tsx    # List-type editor
    PapersEditor.tsx        # List-type editor with upload
    ProjectsEditor.tsx      # Complex list-type editor with uploads + nested arrays
    EditorSwitch.tsx        # Routes activeContentType to the right editor component
  schemas.ts               # All 9 Zod schemas mirroring data.ts interfaces
  useContentEditor.ts      # Shared hook: fetch, edit, validate, save
```

### Pattern 1: Content Editor Hook (`useContentEditor`)
**What:** A shared custom hook that encapsulates the fetch-edit-validate-save cycle for any content type.
**When to use:** Every editor uses this hook.
**Example:**
```typescript
// src/admin/useContentEditor.ts
import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

interface UseContentEditorOptions<T> {
  contentType: string;
  schema: z.ZodType<T>;
  onDirtyChange: (dirty: boolean) => void;
}

interface FieldErrors {
  [key: string]: string[];
}

export function useContentEditor<T>({
  contentType,
  schema,
  onDirtyChange,
}: UseContentEditorOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);

  // Fetch current data from API
  useEffect(() => {
    fetch(`/__admin-api/content/${contentType}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json as T);
        setLoading(false);
      });
  }, [contentType]);

  // Update a single field
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => (prev ? { ...prev, [field]: value } : prev));
      onDirtyChange(true);
    },
    [onDirtyChange]
  );

  // Validate and save
  const save = useCallback(async (): Promise<boolean> => {
    setFieldErrors({}); // Clear previous errors (clean slate)
    const result = schema.safeParse(data);

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      setFieldErrors(flattened.fieldErrors);
      toast.error('Validation failed -- check highlighted fields');
      return false;
    }

    const res = await fetch(`/__admin-api/content/${contentType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data),
    });

    if (res.ok) {
      toast.success('Saved');
      onDirtyChange(false);
      return true;
    } else {
      const err = await res.json();
      toast.error(err.error ?? 'Save failed');
      return false;
    }
  }, [data, schema, contentType, onDirtyChange]);

  return { data, setData, updateField, fieldErrors, save, loading };
}
```

### Pattern 2: Singleton Editor
**What:** A form that edits a single object (HeroData, ContactData). No item picker.
**When to use:** Hero, Contact content types.
**Example:**
```typescript
// Simplified HeroEditor structure
export function HeroEditor({ onDirtyChange }: EditorProps) {
  const { data, updateField, fieldErrors, save, loading } =
    useContentEditor<HeroData>({
      contentType: 'hero',
      schema: heroSchema,
      onDirtyChange,
    });

  if (loading || !data) return <LoadingSkeleton />;

  return (
    <div className="space-y-4">
      <SectionHeader>Details</SectionHeader>
      <FormField
        label="Name"
        value={data.name}
        onChange={(v) => updateField('name', v)}
        error={fieldErrors.name}
      />
      <FormField
        label="Subtitle"
        value={data.subtitle}
        onChange={(v) => updateField('subtitle', v)}
        error={fieldErrors.subtitle}
      />
      {/* ... more fields ... */}
    </div>
  );
}
```

### Pattern 3: List-Type Editor
**What:** An item picker list at top + form for the selected item below. Supports add/delete.
**When to use:** Skills, Tooling, Timeline, Coursework, Papers, Projects.
**Example:**
```typescript
// Simplified list editor structure
export function TimelineEditor({ onDirtyChange }: EditorProps) {
  const { data, setData, fieldErrors, save, loading } =
    useContentEditor<TimelineMilestone[]>({
      contentType: 'timeline',
      schema: z.array(timelineMilestoneSchema),
      onDirtyChange,
    });
  const [activeIndex, setActiveIndex] = useState(0);

  // Active item is data[activeIndex]
  const activeItem = data?.[activeIndex];

  // Update a field on the active item
  const updateItemField = (field: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[activeIndex] = { ...next[activeIndex], [field]: value };
      return next;
    });
    onDirtyChange(true);
  };

  return (
    <div className="space-y-4">
      <ItemList
        items={data ?? []}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        getLabel={(item) => item.title || 'Untitled'}
        onAdd={() => { /* append blank item */ }}
      />
      {activeItem && (
        <>
          <SectionHeader>Details</SectionHeader>
          <FormField label="Date" value={activeItem.date} onChange={...} />
          <FormField label="Title" value={activeItem.title} onChange={...} />
          {/* ... */}
        </>
      )}
    </div>
  );
}
```

### Pattern 4: Wiring Editors into AdminShell
**What:** An `EditorSwitch` component that maps `activeContentType` to the right editor, and wiring save/dirty state.
**When to use:** Single integration point in AdminShell.
**Example:**
```typescript
// EditorSwitch maps content type key to editor component
function EditorSwitch({
  contentType,
  onDirtyChange,
  saveRef,
}: {
  contentType: ContentTypeKey;
  onDirtyChange: (dirty: boolean) => void;
  saveRef: React.MutableRefObject<(() => Promise<boolean>) | null>;
}) {
  switch (contentType) {
    case 'hero': return <HeroEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />;
    case 'contact': return <ContactEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />;
    // ... all 9 types
  }
}
```

### Anti-Patterns to Avoid
- **Importing data modules in admin components:** Never `import { heroData } from '@/data/hero'` -- always fetch via `/__admin-api/content/hero`. Importing data files creates HMR loops since the admin writes to those files.
- **Per-field validation / onChange validation:** The decision is validate-on-save only. Adding blur/change validation violates the user decision and adds complexity.
- **Separate save handler per editor:** The `useContentEditor` hook centralizes the fetch-validate-save cycle. Don't duplicate this logic in each editor.
- **Using React Hook Form:** The forms are simple controlled inputs with Zod validate-on-save. RHF adds a layer of abstraction that doesn't pay for itself here.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text input styling | Custom `<input>` with Tailwind | shadcn/ui `Input` component | Consistent with existing button/sonner components; handles focus, disabled, aria states |
| Multi-line text | Custom `<textarea>` | shadcn/ui `Textarea` component | Consistent styling, auto-resize potential |
| Toast notifications | Custom notification system | Sonner (already installed) | Already wired into AdminShell with `<Toaster />` |
| Form labels | Custom label elements | shadcn/ui `Label` component | Handles `htmlFor` association, consistent typography |
| Boolean toggle | Custom checkbox | shadcn/ui `Checkbox` component | Accessible, consistent with design system |
| ID generation (kebab-case) | Custom regex | Reuse `toKebabCase()` from `src/admin/upload.ts` | Already tested, handles edge cases |
| File uploads in editors | Custom upload UI | Existing `UploadZone` component | Already built in Phase 9 with drag-drop, validation, progress states |

**Key insight:** The project already has shadcn/ui configured (base-nova style), Sonner for toasts, and UploadZone for file uploads. Every visual primitive needed for forms is either already installed or one `npx shadcn add` away.

## Common Pitfalls

### Pitfall 1: HMR Loop from Data Imports
**What goes wrong:** Editor component imports `src/data/hero.ts` directly. When admin saves, codegen writes to that file, HMR triggers, editor re-renders, potentially re-fetching or losing state.
**Why it happens:** Natural instinct is to import data files for initial values.
**How to avoid:** All data reads go through `GET /__admin-api/content/:type` (which uses `server.ssrLoadModule` on the server side). Never import data files in admin code.
**Warning signs:** Page refreshes or editor state resets after every save.

### Pitfall 2: Stale Closure in Save Handler
**What goes wrong:** Save handler captures an outdated `data` reference and saves stale content.
**Why it happens:** The save function is defined in a `useCallback` that doesn't update when `data` changes, or is passed via ref without re-binding.
**How to avoid:** Include `data` in the dependency array of the save `useCallback`, or use a ref to hold the latest data.
**Warning signs:** Saved file doesn't match what's visible in the form.

### Pitfall 3: Zod v4 Error API Mismatch
**What goes wrong:** Code uses `result.error.flatten()` (v3 method syntax) instead of `z.flattenError(result.error)` (v4 standalone function).
**Why it happens:** Many tutorials and examples still show Zod v3 API.
**How to avoid:** Use `z.flattenError(result.error)` (standalone function, not method). The `.flatten()` method is deprecated in v4.
**Warning signs:** TypeScript error or runtime "not a function" error on `.flatten()`.

### Pitfall 4: Navigation Content Type is Array but Singleton-Like
**What goes wrong:** Navigation is typed as `NavItem[]` (array) but the CONTEXT.md says it should use the singleton editor pattern (no item picker).
**Why it happens:** It's the only content type that is an array at the top level but edited as a single document.
**How to avoid:** Treat navigation editor as a special case: fetch the full array, edit the whole structure in one form (with structured array field for items + nested children), save the full array back.
**Warning signs:** Trying to fit it into the list-type editor pattern with item selection, which doesn't match the user's mental model.

### Pitfall 5: Lost Form State on Content Type Switch
**What goes wrong:** User edits hero fields, switches to projects, switches back -- hero edits are gone.
**Why it happens:** Editor components unmount and remount when `activeContentType` changes, losing local state.
**How to avoid:** The existing dirty check in `useAdminPanel.handleSetActiveContentType` already resets dirty state on switch. The editors should re-fetch on mount. If unsaved changes exist, the save bar is visible -- user should save first. No need to persist draft state across type switches.
**Warning signs:** User confusion about lost edits when switching types.

### Pitfall 6: Array Field Errors in Flat Schema
**What goes wrong:** Zod errors for array items (e.g., `socialLinks[0].url`) don't appear in `z.flattenError()` fieldErrors because they're nested.
**Why it happens:** `z.flattenError()` only handles one level deep.
**How to avoid:** For array fields in singleton schemas (Hero's socialLinks, Contact's socialLinks), use `z.treeifyError()` to get nested errors, or validate inner items separately. Alternatively, validate the outer schema and display top-level array errors alongside the array section.
**Warning signs:** Invalid nested items save without errors shown.

## Code Examples

### Zod Schema Definitions (mirroring src/types/data.ts)
```typescript
// src/admin/schemas.ts
import { z } from 'zod';

// Shared sub-schemas
const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().min(1),
});

const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

// Singleton schemas
export const heroSchema = z.object({
  name: z.string().min(1),
  subtitle: z.string().min(1),
  narrative: z.string().min(1),
  socialLinks: z.array(socialLinkSchema),
});

export const contactSchema = z.object({
  tagline: z.string().min(1),
  email: z.string().min(1),
  resumePath: z.string().min(1),
  socialLinks: z.array(socialLinkSchema),
});

// Array item schemas
export const navItemSchema: z.ZodType<{
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}> = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  children: z.array(z.object({
    label: z.string().min(1),
    href: z.string().min(1),
  })).optional(),
});

export const skillGroupSchema = z.object({
  domain: z.string().min(1),
  skills: z.array(z.string()),
});

export const toolingGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string()),
});

export const timelineMilestoneSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const courseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  descriptor: z.string().min(1),
});

export const paperSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  descriptor: z.string().min(1),
  pdfPath: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  brief: z.string().min(1),
  summary: z.string().min(1),
  thumbnail: z.string().min(1),
  images: z.array(z.string()),
  domain: z.string().min(1),
  techStack: z.array(z.string()),
  links: z.array(projectLinkSchema),
  featured: z.boolean(),
});
```

### FormField Component
```typescript
// src/admin/editors/shared/FormField.tsx
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string[];
  multiline?: boolean;
  placeholder?: string;
}

export function FormField({
  label,
  value,
  onChange,
  error,
  multiline,
  placeholder,
}: FormFieldProps) {
  const hasError = error && error.length > 0;
  const id = label.toLowerCase().replace(/\s+/g, '-');
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <InputComponent
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(hasError && 'border-red-500 focus-visible:ring-red-500')}
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-red-500">{error[0]}</p>
      )}
    </div>
  );
}
```

### TagInput Component
```typescript
// src/admin/editors/shared/TagInput.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string[];
}

export function TagInput({ label, tags, onChange, error }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onChange([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-sm text-gray-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter"
      />
      {error && error.length > 0 && (
        <p className="text-sm text-red-500">{error[0]}</p>
      )}
    </div>
  );
}
```

### Save Wiring in AdminShell
```typescript
// Key integration: AdminShell handleSave calls the active editor's save function
// via a ref that each editor sets on mount

const saveRef = useRef<(() => Promise<boolean>) | null>(null);

const handleSave = async () => {
  if (saveRef.current) {
    await saveRef.current();
  }
};

// In editor area:
<EditorSwitch
  contentType={activeContentType}
  onDirtyChange={setDirty}
  saveRef={saveRef}
/>
```

## Content Type Analysis

### Singleton Types (Wave 1)
| Type | Interface | Fields | Special |
|------|-----------|--------|---------|
| Hero | HeroData | name, subtitle, narrative, socialLinks[] | socialLinks is StructuredArrayField |
| Contact | ContactData | tagline, email, resumePath, socialLinks[] | socialLinks shared with Hero; resumePath uses UploadZone |
| Navigation | NavItem[] | label, href, children?[] | Array at top level but edited as one document; children is nested array |

### List Types - Simple (Wave 2)
| Type | Interface | Fields | Special |
|------|-----------|--------|---------|
| Skills | SkillGroup | domain, skills[] | skills is TagInput |
| Tooling | ToolingGroup | category, items[] | items is TagInput |
| Timeline | TimelineMilestone | date, title, description | All simple strings; no arrays |
| Coursework | Course | code, name, descriptor | All simple strings; no arrays |

### List Types - Complex (Wave 3)
| Type | Interface | Fields | Special |
|------|-----------|--------|---------|
| Papers | Paper | id, title, descriptor, pdfPath | pdfPath uses UploadZone; id auto-generated |
| Projects | Project | id, title, brief, summary, thumbnail, images[], domain, techStack[], links[], featured | Most complex; thumbnail/images use UploadZone; techStack is TagInput; links is StructuredArrayField; featured is Checkbox |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zod v3 `.flatten()` method | Zod v4 `z.flattenError()` standalone | Zod 4.0 (2025) | Error handling uses standalone functions, not methods |
| Zod v3 `result.error.errors` | Zod v4 `result.error.issues` | Zod 4.0 (2025) | `.errors` removed; use `.issues` |
| Zod v3 `.format()` method | Zod v4 `z.treeifyError()` standalone | Zod 4.0 (2025) | For nested error display |
| shadcn/ui Form (RHF wrapper) | Direct shadcn/ui primitives + Zod | Current | No need for RHF when validation is save-only |

**Deprecated/outdated:**
- `z.string().email()` is deprecated in Zod v4 -- use `z.email()` instead (not relevant for this phase since we only need `z.string().min(1)`)
- `result.error.flatten()` method deprecated -- use `z.flattenError(result.error)` standalone function

## Open Questions

1. **Navigation editor nested children**
   - What we know: NavItem has optional `children: NavItem[]`. The data shows one level of nesting (Background > Skills, Lab & Tooling, Timeline).
   - What's unclear: Should the editor support arbitrary depth or just one level of children?
   - Recommendation: Support exactly one level of children (matching current data). Use a StructuredArrayField for children within each nav item. The recursive NavItem type suggests arbitrary depth, but the actual data and UI only use one level.

2. **Zod as explicit dependency**
   - What we know: Zod 4.3.6 is available as a transitive dep (via shadcn). Not listed in package.json.
   - What's unclear: Whether importing from transitive dep is reliable across installs.
   - Recommendation: Add `zod` as an explicit dependency in package.json before Phase 10 implementation. This is a one-line `npm install zod` command.

3. **Save ref vs callback pattern for editor-to-shell communication**
   - What we know: AdminShell needs to trigger save on the active editor when user clicks Save or Ctrl+S.
   - What's unclear: Whether to use a ref pattern (editor sets `saveRef.current = save`) or lift save state up.
   - Recommendation: Use the ref pattern. Each editor's `useContentEditor` hook returns a `save` function; the editor assigns it to the ref on mount. This avoids prop-drilling all validation/data state up to AdminShell.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EDIT-10 | Zod schemas validate correctly for all 9 types | unit | `npx vitest run src/admin/schemas.test.ts -x` | No -- Wave 0 |
| EDIT-01 | Hero editor renders fields and captures input | unit | `npx vitest run src/admin/editors/HeroEditor.test.tsx -x` | No -- Wave 0 |
| EDIT-11 | Save shows toast on success/error | unit | `npx vitest run src/admin/useContentEditor.test.ts -x` | No -- Wave 0 |
| EDIT-01..09 | Each editor saves valid data to API | integration | Manual E2E: open admin, edit, save, verify file | No automated E2E |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/admin/schemas.test.ts` -- covers EDIT-10 (Zod schema validation for all 9 types)
- [ ] `src/admin/useContentEditor.test.ts` -- covers EDIT-11 (save flow with toast feedback)
- [ ] Vitest + jsdom already configured -- no framework install needed

## Sources

### Primary (HIGH confidence)
- Project source code: `src/types/data.ts`, `src/admin/AdminShell.tsx`, `vite-plugin-admin-api.ts`, all 9 `src/data/*.ts` files -- direct reading
- [Zod v4 error formatting docs](https://zod.dev/error-formatting) -- `z.flattenError()` and `z.treeifyError()` API
- [Zod v4 basic usage](https://zod.dev/basics) -- `safeParse()`, `z.object()`, `z.array()`, `z.string()` API
- [Zod v4 migration guide](https://zod.dev/v4/changelog) -- breaking changes from v3

### Secondary (MEDIUM confidence)
- [shadcn/ui Input component](https://ui.shadcn.com/docs/components/radix/input) -- installation and usage
- [shadcn/ui Label component](https://ui.shadcn.com/docs/components/radix/label) -- installation and usage
- [shadcn/ui components index](https://ui.shadcn.com/docs/components) -- available components

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed or one command away; versions verified from package.json and node_modules
- Architecture: HIGH -- patterns derived directly from existing codebase patterns (AdminShell, useAdminPanel, codegen pipeline)
- Pitfalls: HIGH -- derived from analysis of the actual codebase integration points (HMR suppression, API patterns, Zod v4 API)
- Zod v4 API: HIGH -- verified against official docs (zod.dev)

**Research date:** 2026-03-26
**Valid until:** 2026-04-26 (stable stack, no fast-moving dependencies)
