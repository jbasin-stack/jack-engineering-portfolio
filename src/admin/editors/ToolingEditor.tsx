import { useState, type MutableRefObject } from 'react';
import type { ToolingGroup } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { toolingGroupSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { TagInput } from './shared/TagInput';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { z } from 'zod';

interface ToolingEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** List-type editor for ToolingGroup[] with category and items TagInput */
export function ToolingEditor({ onDirtyChange, saveRef }: ToolingEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, setData, fieldErrors, loading } = useContentEditor<
    ToolingGroup[]
  >({
    contentType: 'tooling',
    schema: z.array(toolingGroupSchema),
    onDirtyChange,
    saveRef,
  });

  // Update a field on the active item
  const updateItem = <K extends keyof ToolingGroup>(
    field: K,
    value: ToolingGroup[K]
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      updated[activeIndex] = { ...updated[activeIndex], [field]: value };
      return updated;
    });
    onDirtyChange(true);
  };

  const addItem = () => {
    setData((prev) => {
      const items = prev ?? [];
      return [...items, { category: '', items: [] }];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this tooling group?')) return;
    setData((prev) => {
      if (!prev) return prev;
      const updated = prev.filter((_, i) => i !== activeIndex);
      return updated;
    });
    setActiveIndex((prev) => Math.max(0, prev - 1));
    onDirtyChange(true);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-3 w-20 rounded bg-muted" />
        <div className="h-24 w-full rounded bg-muted/50" />
      </div>
    );
  }

  const items = data ?? [];
  const activeItem = items[activeIndex];

  return (
    <div className="space-y-4">
      <ItemList
        items={items}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        getLabel={(item) => item.category || 'Untitled'}
        onAdd={addItem}
        onReorder={(from, to) => {
          setData((prev) => {
            if (!prev) return prev;
            const next = [...prev];
            [next[from], next[to]] = [next[to], next[from]];
            return next;
          });
          setActiveIndex(to);
          onDirtyChange(true);
        }}
      />

      {activeItem && (
        <>
          <SectionHeader>Details</SectionHeader>
          <FormField
            label="Category"
            value={activeItem.category}
            onChange={(v) => updateItem('category', v)}
            error={fieldErrors[`${activeIndex}.category`]}
            placeholder="e.g. IDEs & Editors"
          />

          <SectionHeader>Items</SectionHeader>
          <TagInput
            label="Items"
            tags={activeItem.items}
            onChange={(tags) => updateItem('items', tags)}
            error={fieldErrors[`${activeIndex}.items`]}
          />

          <button
            type="button"
            onClick={deleteItem}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Group
          </button>
        </>
      )}
    </div>
  );
}
