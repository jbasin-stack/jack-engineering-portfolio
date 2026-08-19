---
phase: quick-9
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/admin/editors/NavigationEditor.tsx
  - src/admin/editors/shared/ItemList.tsx
autonomous: true
requirements: [QUICK-9]
must_haves:
  truths:
    - "Admin can drag navigation items to reorder them"
    - "Admin can drag children within a parent nav item to reorder them"
    - "Reordering nav items in admin and saving updates the website navbar link order"
    - "Adding new nav items still works correctly"
    - "Removing nav items still works correctly"
    - "The website scrolls to the correct section regardless of nav item order"
  artifacts:
    - path: "src/admin/editors/NavigationEditor.tsx"
      provides: "Drag-to-reorder navigation editor"
    - path: "src/admin/editors/shared/ItemList.tsx"
      provides: "Enhanced ItemList with optional drag-to-reorder"
  key_links:
    - from: "src/admin/editors/NavigationEditor.tsx"
      to: "src/data/navigation.ts"
      via: "useContentEditor save -> codegen pipeline"
      pattern: "useContentEditor.*navigation"
    - from: "src/data/navigation.ts"
      to: "src/components/layout/Navigation.tsx"
      via: "navItems import renders in navbar order"
      pattern: "navItems\\.map"
---

<objective>
Add drag-to-reorder functionality to the admin panel's Navigation editor so that nav items (and their children) can be reordered by dragging instead of only adding/removing.

Purpose: Allow intuitive reordering of navigation links. The order in `navigation.ts` directly controls the order links appear in the website's desktop navbar and mobile menu, so drag reorder gives the admin visual control over site navigation layout.

Output: Updated NavigationEditor with @dnd-kit drag-to-reorder for top-level items and children. The website's scroll-to-section behavior is unaffected because scroll targets are determined by `href` anchors, not array order.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/admin/editors/NavigationEditor.tsx
@src/admin/editors/shared/ItemList.tsx
@src/data/navigation.ts
@src/types/data.ts
@src/components/layout/Navigation.tsx
@src/components/layout/MobileMenu.tsx
@src/admin/useContentEditor.ts
@src/App.tsx

<interfaces>
<!-- Key types the executor needs -->

From src/types/data.ts:
```typescript
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}
```

From src/admin/useContentEditor.ts:
```typescript
export function useContentEditor<T>(options: {
  contentType: string;
  schema: z.ZodType<T>;
  onDirtyChange: (dirty: boolean) => void;
  saveRef?: MutableRefObject<(() => Promise<boolean>) | null>;
}): {
  data: T | null;
  setData: (value: T) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  fieldErrors: FieldErrors;
  save: () => Promise<boolean>;
  loading: boolean;
};
```

From src/admin/editors/shared/ItemList.tsx:
```typescript
interface ItemListProps<T> {
  items: T[];
  activeIndex: number;
  onSelect: (index: number) => void;
  getLabel: (item: T) => string;
  onAdd: () => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}
```
</interfaces>

**Important context about website flow:**
- Section rendering order is hardcoded in App.tsx (Hero -> WhoAmI -> Expertise -> Timeline -> Projects -> Papers -> Contact -> Footer)
- Navigation.tsx hardcodes `sectionIds` for scroll-spy: `['about', 'expertise', 'timeline', 'projects', 'papers', 'contact']`
- Reordering nav items only changes the ORDER of links in the navbar/mobile menu, NOT the page section order
- Each nav item's `href` (e.g., `#projects`) scrolls to the matching `id` on the page via Lenis smooth scroll
- Therefore, reordering nav items is safe and will not disrupt scrolling behavior
</context>

<tasks>

<task type="auto">
  <name>Task 1: Install @dnd-kit and add drag-to-reorder to NavigationEditor</name>
  <files>package.json, src/admin/editors/NavigationEditor.tsx</files>
  <action>
1. Install `@dnd-kit/core` and `@dnd-kit/sortable` and `@dnd-kit/utilities`:
   ```
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. Refactor NavigationEditor.tsx to support drag-to-reorder for top-level nav items AND children within each parent:

   **Top-level drag reorder:**
   - Wrap the nav items list in `<DndContext>` with `<SortableContext>` using `verticalListSortingStrategy`
   - Each nav item card becomes a `<SortableNavItem>` component that uses `useSortable` hook
   - Add a drag handle (GripVertical icon from lucide-react) to each nav item card header, positioned before the "Item N" label
   - On `onDragEnd`, compute the reordered array using `arrayMove` from `@dnd-kit/sortable` and call `setData(reordered)` + `onDirtyChange(true)`
   - Use `closestCenter` collision detection
   - Add `restrictToVerticalAxis` and `restrictToParentElement` modifiers from `@dnd-kit/modifiers` for constrained dragging (install `@dnd-kit/modifiers` too)
   - Each sortable item needs a stable `id` -- use the index as string (items don't have unique IDs, but since we're reordering an array in local state this is acceptable; use `useMemo` to generate stable ids like `"nav-0"`, `"nav-1"`, etc., regenerated when data.length changes)

   **Children drag reorder (within each parent):**
   - Within each nav item's children section, wrap children in a nested `<DndContext>` + `<SortableContext>`
   - Each child gets its own `<SortableChildItem>` with a smaller drag handle
   - On child `onDragEnd`, reorder only that parent's `children` array using `arrayMove`, then call `setData` with the updated parent

   **Styling for drag state:**
   - The actively dragged item should have `opacity-50` and a subtle `ring-2 ring-accent/30` visual
   - Use `CSS.Transform.toString(transform)` from `@dnd-kit/utilities` for smooth transform
   - The drag handle cursor should be `cursor-grab` (and `cursor-grabbing` when active)
   - Keep all existing functionality: add/remove nav items, add/remove children, edit label/href fields, validation errors

   **Important:** Do NOT change App.tsx section order or Navigation.tsx sectionIds. Only the admin editor is modified.
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && npx tsc --noEmit 2>&1 | head -30</automated>
  </verify>
  <done>NavigationEditor renders drag handles on each nav item and child, items can be dragged to reorder, all existing add/remove/edit functionality preserved, TypeScript compiles without errors</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Drag-to-reorder navigation items in the admin panel's Navigation editor. Both top-level nav items and children within parent items can be reordered by dragging.</what-built>
  <how-to-verify>
    1. Run `npm run dev` and open the app with `?admin` query param (or press Ctrl+Shift+A)
    2. Click "Navigation" in the admin sidebar
    3. Verify each nav item card has a drag handle (grip icon) on the left
    4. Drag a top-level nav item (e.g., "Projects") to a different position -- it should smoothly reorder
    5. Open a parent item with children (e.g., "Background" which has "Expertise" and "Timeline" children) -- verify children also have drag handles and can be reordered within the parent
    6. After reordering, click Save
    7. Check the website navbar -- link order should match the new order you set
    8. Verify scrolling still works: click any nav link and confirm it scrolls to the correct section
    9. Test adding a new nav item and removing one -- both should still work
    10. Test on mobile view: open hamburger menu and verify the new order is reflected there too
  </how-to-verify>
  <resume-signal>Type "approved" or describe any issues with drag behavior, ordering, or scroll navigation</resume-signal>
</task>

</tasks>

<verification>
- TypeScript compiles: `npx tsc --noEmit`
- Dev server runs without errors: `npm run dev`
- Navigation editor loads in admin panel and shows drag handles
- Reordering saves correctly and updates the website's navbar order
- Website smooth scroll to sections is unaffected by nav item reorder
</verification>

<success_criteria>
- Navigation items in admin panel can be reordered by dragging (both top-level and children)
- Saving reordered navigation updates the website navbar link order
- All existing NavigationEditor functionality (add, remove, edit label/href, children management) still works
- Website scroll-to-section behavior is completely unaffected
- No TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/quick/9-change-the-navigation-page-of-the-admin-/9-SUMMARY.md`
</output>
