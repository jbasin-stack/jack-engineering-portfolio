import { useState, type MutableRefObject } from 'react';
import type { Course } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { courseSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { z } from 'zod';

interface CourseworkEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** List-type editor for Course[] with code, name, descriptor */
export function CourseworkEditor({
  onDirtyChange,
  saveRef,
}: CourseworkEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, setData, fieldErrors, loading } = useContentEditor<Course[]>({
    contentType: 'coursework',
    schema: z.array(courseSchema),
    onDirtyChange,
    saveRef,
  });

  // Update a field on the active item
  const updateItem = <K extends keyof Course>(
    field: K,
    value: Course[K]
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
      return [...items, { code: '', name: '', descriptor: '' }];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this course?')) return;
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
        getLabel={(item) =>
          item.code ? `${item.code} — ${item.name}` : item.name || 'Untitled'
        }
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
            label="Code"
            value={activeItem.code}
            onChange={(v) => updateItem('code', v)}
            error={fieldErrors[`${activeIndex}.code`]}
            placeholder="e.g. ECE 271"
          />
          <FormField
            label="Name"
            value={activeItem.name}
            onChange={(v) => updateItem('name', v)}
            error={fieldErrors[`${activeIndex}.name`]}
            placeholder="e.g. Digital Logic Design"
          />
          <FormField
            label="Descriptor"
            value={activeItem.descriptor}
            onChange={(v) => updateItem('descriptor', v)}
            error={fieldErrors[`${activeIndex}.descriptor`]}
            placeholder="e.g. Combinational and sequential circuit design"
          />

          <button
            type="button"
            onClick={deleteItem}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Course
          </button>
        </>
      )}
    </div>
  );
}
