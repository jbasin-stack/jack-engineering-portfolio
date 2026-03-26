import { useState, type MutableRefObject } from 'react';
import type { TimelineMilestone } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { timelineMilestoneSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { z } from 'zod';

interface TimelineEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** List-type editor for TimelineMilestone[] with date, title, description */
export function TimelineEditor({
  onDirtyChange,
  saveRef,
}: TimelineEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, setData, fieldErrors, loading } = useContentEditor<
    TimelineMilestone[]
  >({
    contentType: 'timeline',
    schema: z.array(timelineMilestoneSchema),
    onDirtyChange,
    saveRef,
  });

  // Update a field on the active item
  const updateItem = <K extends keyof TimelineMilestone>(
    field: K,
    value: TimelineMilestone[K]
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
      return [...items, { date: '', title: '', description: '' }];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this milestone?')) return;
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
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-24 w-full rounded bg-gray-100" />
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
        getLabel={(item) => item.title || 'Untitled'}
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
            label="Date"
            value={activeItem.date}
            onChange={(v) => updateItem('date', v)}
            error={fieldErrors[`${activeIndex}.date`]}
            placeholder="e.g. Fall 2025"
          />
          <FormField
            label="Title"
            value={activeItem.title}
            onChange={(v) => updateItem('title', v)}
            error={fieldErrors[`${activeIndex}.title`]}
            placeholder="e.g. Started ECE Program"
          />
          <FormField
            label="Description"
            value={activeItem.description}
            onChange={(v) => updateItem('description', v)}
            error={fieldErrors[`${activeIndex}.description`]}
            multiline
            placeholder="Describe this milestone..."
          />

          <button
            type="button"
            onClick={deleteItem}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Milestone
          </button>
        </>
      )}
    </div>
  );
}
