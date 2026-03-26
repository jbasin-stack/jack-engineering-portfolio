---
status: resolved
trigger: "Inconsistent validation error highlighting across editors -- some show highlighted fields, others don't"
created: 2026-03-26T20:00:00Z
updated: 2026-03-26T20:00:00Z
---

## ROOT CAUSE FOUND

### Primary Root Cause: `z.flattenError()` produces different key structures for object vs array schemas

The `useContentEditor` hook (line 60-61) uses `z.flattenError(result.error)` to extract field errors. This works correctly for **object schemas** (Hero, Contact) where flattened keys are direct field names like `"name"`, `"subtitle"`, `"email"`.

However, for **array schemas** (Skills, Tooling, Timeline, Coursework, Papers, Projects, Navigation), `z.flattenError()` on a `z.array(itemSchema)` does NOT produce keys like `"0.title"` or `"1.description"`. Instead, it produces **numeric index keys** at the top level (e.g., `fieldErrors["0"]`) containing nested error info, or it flattens into the `formErrors` array rather than `fieldErrors`.

The list-type editors attempt to look up errors via `fieldErrors[\`${activeIndex}.field\`]` (e.g., `fieldErrors["0.title"]`), but `z.flattenError()` never produces dotted keys like `"0.title"` -- it produces keys like `"0"` with the error messages for the entire array element, or it uses Zod's nested error format. This means **field-level errors in all 7 list-type editors silently fail to display**.

### Secondary Root Cause: No required field indicators (red stars) exist anywhere

No editor renders a visual indicator for required fields. The `FormField` component has no `required` prop. Labels are rendered plain via `<Label>`. Users cannot distinguish which fields are required until they attempt to save.

### Tertiary Root Cause: NavigationEditor uses raw Input/Label with no error wiring

The NavigationEditor bypasses the `FormField` shared component entirely, using raw `Input` and `Label` from the UI library. It has no `aria-invalid` attributes, no inline error messages next to individual fields. Instead, it dumps all errors in a generic block at the bottom of the form (lines 212-220), making it impossible to identify which specific field failed.

---

## Detailed Findings

### Architecture Overview

**Shared validation infrastructure:**
- `useContentEditor<T>` hook -- fetches data, validates via Zod schema on save, stores `fieldErrors`
- `FormField` component -- accepts `error?: string[]`, shows inline red text and sets `aria-invalid`
- `TagInput` component -- accepts `error?: string[]`, shows inline red text and sets `aria-invalid`
- `StructuredArrayField` component -- accepts `error?: string[]`, shows inline red text
- `Input` / `Textarea` UI primitives -- both have `aria-invalid:border-destructive` CSS built in

**Toast message:** `"Validation failed -- check highlighted fields"` (useContentEditor.ts:62)

### Editor-by-Editor Audit

#### WORKING (Singleton Editors -- Object Schemas)

| Editor | Schema Type | Error Key Format | Field Highlighting | Inline Errors |
|--------|------------|------------------|-------------------|---------------|
| **HeroEditor** | `z.object({...})` | `fieldErrors.name` | YES (via FormField aria-invalid) | YES |
| **ContactEditor** | `z.object({...})` | `fieldErrors.tagline` | YES (via FormField aria-invalid) | YES |

These work because `z.flattenError()` on a `z.object()` produces `{ fieldErrors: { name: [...], subtitle: [...] } }` -- direct field name keys matching exactly what the editors look up.

#### BROKEN (List Editors -- Array Schemas)

| Editor | Schema Type | Error Key Attempted | Actually Produced | Field Highlighting | Inline Errors |
|--------|------------|--------------------|--------------------|-------------------|---------------|
| **SkillsEditor** | `z.array(skillGroupSchema)` | `fieldErrors["0.domain"]` | `fieldErrors["0"]` (array-level) | NO | NO |
| **ToolingEditor** | `z.array(toolingGroupSchema)` | `fieldErrors["0.category"]` | `fieldErrors["0"]` (array-level) | NO | NO |
| **TimelineEditor** | `z.array(timelineMilestoneSchema)` | `fieldErrors["0.title"]` | `fieldErrors["0"]` (array-level) | NO | NO |
| **CourseworkEditor** | `z.array(courseSchema)` | `fieldErrors["0.code"]` | `fieldErrors["0"]` (array-level) | NO | NO |
| **PapersEditor** | `z.array(paperSchema)` | `fieldErrors["0.title"]` | `fieldErrors["0"]` (array-level) | NO | NO |
| **ProjectsEditor** | `z.array(projectSchema)` | `fieldErrors["0.title"]` | `fieldErrors["0"]` (array-level) | NO | NO |

#### BROKEN (Different Reason -- Custom Layout)

| Editor | Issue |
|--------|-------|
| **NavigationEditor** | Bypasses `FormField` entirely. Uses raw `Input`/`Label`. No `aria-invalid`. No inline errors next to fields. Dumps all errors in generic block at bottom. Even if error keys matched, individual fields would not highlight. |

### Missing Features (Across ALL Editors)

1. **No required field indicators (red stars)** -- `FormField` has no `required` prop. No `<span className="text-red-500">*</span>` exists anywhere. Users cannot tell which fields are required before saving.

2. **No required indicators on TagInput** -- Same gap.

3. **No required indicators on StructuredArrayField** -- Same gap.

4. **NavigationEditor does not use FormField** -- Cannot benefit from any FormField improvements.

---

## Artifacts

### Files Involved

| File | Role | Issue |
|------|------|-------|
| `src/admin/useContentEditor.ts` (lines 56-63) | Validation + error extraction | `z.flattenError()` produces wrong key format for array schemas |
| `src/admin/editors/shared/FormField.tsx` | Shared form field | Missing `required` prop and red star indicator |
| `src/admin/editors/shared/TagInput.tsx` | Tag array input | Missing `required` prop and red star indicator |
| `src/admin/editors/shared/StructuredArrayField.tsx` | Structured array input | Missing `required` prop and red star indicator |
| `src/admin/editors/NavigationEditor.tsx` | Navigation editor | Bypasses FormField; no per-field error display |
| `src/admin/editors/SkillsEditor.tsx` | Skills editor | Error key mismatch (`"0.domain"` never matches) |
| `src/admin/editors/ToolingEditor.tsx` | Tooling editor | Error key mismatch (`"0.category"` never matches) |
| `src/admin/editors/TimelineEditor.tsx` | Timeline editor | Error key mismatch (`"0.title"` never matches) |
| `src/admin/editors/CourseworkEditor.tsx` | Coursework editor | Error key mismatch (`"0.code"` never matches) |
| `src/admin/editors/PapersEditor.tsx` | Papers editor | Error key mismatch (`"0.title"` never matches) |
| `src/admin/editors/ProjectsEditor.tsx` | Projects editor | Error key mismatch (`"0.title"` never matches) |
| `src/admin/schemas.ts` | Zod schemas | Schemas are correct; issue is in error flattening |
| `src/components/ui/input.tsx` | Input primitive | Has `aria-invalid` CSS -- works when attr is set |
| `src/components/ui/textarea.tsx` | Textarea primitive | Has `aria-invalid` CSS -- works when attr is set |

### Schemas (for reference)

All schemas use `z.string().min(1)` for required fields -- correct. The validation catches empty fields. The problem is purely in error display routing.

---

## Suggested Fix Direction

### Fix 1: Custom error flattening for array schemas

Replace `z.flattenError()` with a custom flattener that walks the Zod error `issues` array and produces dotted keys like `"0.title"`, `"0.description"`, etc. This is what the list editors already expect.

```typescript
// Pseudocode for useContentEditor.ts
function flattenZodErrors(error: z.ZodError): FieldErrors {
  const result: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.');
    if (!result[key]) result[key] = [];
    result[key]!.push(issue.message);
  }
  return result;
}
```

This produces `{ "0.title": ["String must contain at least 1 character(s)"] }` which matches the `fieldErrors[\`${activeIndex}.title\`]` lookup in all list editors.

### Fix 2: Add `required` prop to FormField, TagInput, StructuredArrayField

Add optional `required?: boolean` prop. When true, render a red asterisk next to the label:
```tsx
<Label htmlFor={id}>
  {label}
  {required && <span className="text-red-500 ml-0.5">*</span>}
</Label>
```

Then pass `required` from each editor for fields backed by `z.string().min(1)`.

### Fix 3: Refactor NavigationEditor to use FormField

Replace raw `Input`/`Label` pairs with `FormField` components. Thread per-field error keys through. This gives NavigationEditor the same error display and required indicators as all other editors.

### Fix 4: Improve toast message

Change `"Validation failed -- check highlighted fields"` to something more descriptive like `"Some required fields are missing -- see red indicators below"`.

---

## Evidence Summary

- **HeroEditor** (object schema): `fieldErrors.name` resolves correctly after `z.flattenError()` -- field highlights work.
- **TimelineEditor** (array schema): `fieldErrors["0.title"]` resolves to `undefined` after `z.flattenError()` -- field highlights silently fail.
- **NavigationEditor**: Uses raw `Input`/`Label`, never sets `aria-invalid`, dumps errors at bottom instead of inline.
- **Input/Textarea CSS**: Both have `aria-invalid:border-destructive` class -- the visual highlighting mechanism exists and works when `aria-invalid` is set.
- **FormField component**: Correctly sets `aria-invalid={hasError || undefined}` and shows inline error text -- it works when errors are provided.
- **No red stars**: Zero instances of required field indicators in any component.

## Eliminated

- hypothesis: "The CSS for aria-invalid styling is missing from Input/Textarea"
  evidence: Both components have `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` in their className
  timestamp: 2026-03-26T20:00:00Z

- hypothesis: "FormField does not display errors correctly"
  evidence: FormField correctly checks `hasError = error && error.length > 0`, sets aria-invalid, and renders inline error text
  timestamp: 2026-03-26T20:00:00Z

- hypothesis: "Schemas are too lenient and don't catch empty fields"
  evidence: All schemas use `z.string().min(1)` for required fields; schema tests confirm validation catches empty strings
  timestamp: 2026-03-26T20:00:00Z
