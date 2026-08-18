import { type MutableRefObject, useMemo } from 'react';
import { z } from 'zod';
import type { NavItem } from '@/types/data';
import { useContentEditor, type FieldErrors } from '../useContentEditor';
import { navItemSchema } from '../schemas';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './shared/SectionHeader';
import { FormField } from './shared/FormField';
import { Plus, X, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

interface NavigationEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

const navigationSchema = z.array(navItemSchema);

/* ------------------------------------------------------------------ */
/*  Sortable wrapper for a single child item                          */
/* ------------------------------------------------------------------ */

interface SortableChildProps {
  id: string;
  child: NavItem;
  navIndex: number;
  childIndex: number;
  fieldErrors: FieldErrors;
  updateChild: (
    navIndex: number,
    childIndex: number,
    field: 'label' | 'href',
    value: string
  ) => void;
  removeChild: (navIndex: number, childIndex: number) => void;
}

function SortableChildItem({
  id,
  child,
  navIndex,
  childIndex,
  fieldErrors,
  updateChild,
  removeChild,
}: SortableChildProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-2 ${isDragging ? 'opacity-50 ring-2 ring-accent/30 rounded-md' : ''}`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle for child */}
        <button
          type="button"
          className="mt-6 shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
        <div className="flex-1">
          <FormField
            label="Label"
            value={child.label}
            onChange={(v) => updateChild(navIndex, childIndex, 'label', v)}
            error={fieldErrors[`${navIndex}.children.${childIndex}.label`]}
            required
          />
        </div>
        <div className="flex-1">
          <FormField
            label="Href"
            value={child.href}
            onChange={(v) => updateChild(navIndex, childIndex, 'href', v)}
            error={fieldErrors[`${navIndex}.children.${childIndex}.href`]}
            required
          />
        </div>
        <button
          type="button"
          onClick={() => removeChild(navIndex, childIndex)}
          className="mt-6 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable wrapper for a top-level nav item                         */
/* ------------------------------------------------------------------ */

interface SortableNavItemProps {
  id: string;
  item: NavItem;
  index: number;
  fieldErrors: FieldErrors;
  updateNavItem: (index: number, field: keyof NavItem, value: string) => void;
  removeNavItem: (index: number) => void;
  updateChild: (
    navIndex: number,
    childIndex: number,
    field: 'label' | 'href',
    value: string
  ) => void;
  addChild: (navIndex: number) => void;
  removeChild: (navIndex: number, childIndex: number) => void;
  onChildReorder: (navIndex: number, fromIndex: number, toIndex: number) => void;
}

function SortableNavItem({
  id,
  item,
  index: i,
  fieldErrors,
  updateNavItem,
  removeNavItem,
  updateChild,
  addChild,
  removeChild,
  onChildReorder,
}: SortableNavItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Stable IDs for children sortable context
  const childIds = useMemo(
    () => (item.children ?? []).map((_, ci) => `child-${i}-${ci}`),
    [item.children, i]
  );

  // Sensors for child drag context (separate from parent)
  const childSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = childIds.indexOf(active.id as string);
    const newIndex = childIds.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onChildReorder(i, oldIndex, newIndex);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border border-border bg-muted/50 p-3 space-y-3 ${
        isDragging ? 'opacity-50 ring-2 ring-accent/30' : ''
      }`}
    >
      {/* Nav item header with drag handle and remove button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
          <span className="text-xs font-medium text-muted-foreground">
            Item {i + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={() => removeNavItem(i)}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>

      {/* Nav item fields */}
      <div className="grid grid-cols-2 gap-2">
        <FormField
          label="Label"
          value={item.label}
          onChange={(v) => updateNavItem(i, 'label', v)}
          error={fieldErrors[`${i}.label`]}
          required
        />
        <FormField
          label="Href"
          value={item.href}
          onChange={(v) => updateNavItem(i, 'href', v)}
          error={fieldErrors[`${i}.href`]}
          required
        />
      </div>

      {/* Children with nested drag-to-reorder */}
      {item.children && item.children.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-border pl-3">
          <span className="text-xs font-medium text-muted-foreground">
            Children
          </span>
          <DndContext
            sensors={childSensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleChildDragEnd}
          >
            <SortableContext
              items={childIds}
              strategy={verticalListSortingStrategy}
            >
              {item.children.map((child, ci) => (
                <SortableChildItem
                  key={childIds[ci]}
                  id={childIds[ci]}
                  child={child}
                  navIndex={i}
                  childIndex={ci}
                  fieldErrors={fieldErrors}
                  updateChild={updateChild}
                  removeChild={removeChild}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {/* Add child button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => addChild(i)}
        className="gap-1 text-xs text-muted-foreground"
      >
        <Plus className="size-3" />
        Add child
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main NavigationEditor                                             */
/* ------------------------------------------------------------------ */

/** Singleton editor for the full navigation structure (NavItem[]) */
export function NavigationEditor({
  onDirtyChange,
  saveRef,
}: NavigationEditorProps) {
  const { data, setData, fieldErrors, loading } =
    useContentEditor<NavItem[]>({
      contentType: 'navigation',
      schema: navigationSchema,
      onDirtyChange,
      saveRef,
    });

  // Stable IDs for top-level sortable context
  const navIds = useMemo(
    () => (data ?? []).map((_, i) => `nav-${i}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data?.length]
  );

  // Pointer sensor with small distance threshold to avoid conflict with clicks
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted/50" />
        <div className="h-24 w-full rounded bg-muted/50" />
      </div>
    );
  }

  // Update a field on a specific nav item
  const updateNavItem = (index: number, field: keyof NavItem, value: string) => {
    const next = data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setData(next);
    onDirtyChange(true);
  };

  // Add a new nav item
  const addNavItem = () => {
    setData([...data, { label: '', href: '' }]);
    onDirtyChange(true);
  };

  // Remove a nav item
  const removeNavItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    onDirtyChange(true);
  };

  // Update a child's field
  const updateChild = (
    navIndex: number,
    childIndex: number,
    field: 'label' | 'href',
    value: string
  ) => {
    const next = data.map((item, i) => {
      if (i !== navIndex) return item;
      const children = [...(item.children ?? [])];
      children[childIndex] = { ...children[childIndex], [field]: value };
      return { ...item, children };
    });
    setData(next);
    onDirtyChange(true);
  };

  // Add a child to a nav item
  const addChild = (navIndex: number) => {
    const next = data.map((item, i) => {
      if (i !== navIndex) return item;
      return {
        ...item,
        children: [...(item.children ?? []), { label: '', href: '' }],
      };
    });
    setData(next);
    onDirtyChange(true);
  };

  // Remove a child from a nav item
  const removeChild = (navIndex: number, childIndex: number) => {
    const next = data.map((item, i) => {
      if (i !== navIndex) return item;
      const children = (item.children ?? []).filter(
        (_, ci) => ci !== childIndex
      );
      return { ...item, children: children.length > 0 ? children : undefined };
    });
    setData(next);
    onDirtyChange(true);
  };

  // Reorder children within a parent nav item
  const handleChildReorder = (
    navIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    const next = data.map((item, i) => {
      if (i !== navIndex) return item;
      const children = arrayMove(item.children ?? [], fromIndex, toIndex);
      return { ...item, children };
    });
    setData(next);
    onDirtyChange(true);
  };

  // Handle top-level drag end -- reorder nav items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = navIds.indexOf(active.id as string);
    const newIndex = navIds.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      setData(arrayMove(data, oldIndex, newIndex));
      onDirtyChange(true);
    }
  };

  return (
    <div className="space-y-4">
      <SectionHeader>Navigation Items</SectionHeader>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={navIds}
          strategy={verticalListSortingStrategy}
        >
          {data.map((item, i) => (
            <SortableNavItem
              key={navIds[i]}
              id={navIds[i]}
              item={item}
              index={i}
              fieldErrors={fieldErrors}
              updateNavItem={updateNavItem}
              removeNavItem={removeNavItem}
              updateChild={updateChild}
              addChild={addChild}
              removeChild={removeChild}
              onChildReorder={handleChildReorder}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add nav item button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addNavItem}
        className="gap-1 text-muted-foreground"
      >
        <Plus className="size-3.5" />
        Add nav item
      </Button>
    </div>
  );
}
