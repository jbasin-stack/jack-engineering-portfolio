import { useState, type MutableRefObject } from 'react';
import type { SkillGroup } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { skillGroupSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { TagInput } from './shared/TagInput';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { z } from 'zod';

interface SkillsEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** List-type editor for SkillGroup[] with domain and skills TagInput */
export function SkillsEditor({ onDirtyChange, saveRef }: SkillsEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, setData, fieldErrors, loading } = useContentEditor<
    SkillGroup[]
  >({
    contentType: 'skills',
    schema: z.array(skillGroupSchema),
    onDirtyChange,
    saveRef,
  });

  // Update a field on the active item
  const updateItem = <K extends keyof SkillGroup>(
    field: K,
    value: SkillGroup[K]
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
      return [...items, { domain: '', skills: [] }];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this skill group?')) return;
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
        getLabel={(item) => item.domain || 'Untitled'}
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
            label="Domain"
            value={activeItem.domain}
            onChange={(v) => updateItem('domain', v)}
            error={fieldErrors[`${activeIndex}.domain`]}
            placeholder="e.g. Embedded Systems"
          />

          <SectionHeader>Skills</SectionHeader>
          <TagInput
            label="Skills"
            tags={activeItem.skills}
            onChange={(tags) => updateItem('skills', tags)}
            error={fieldErrors[`${activeIndex}.skills`]}
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
