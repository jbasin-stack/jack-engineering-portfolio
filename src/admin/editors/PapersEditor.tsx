import { useState, useRef, type MutableRefObject } from 'react';
import type { Paper } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { paperSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { UploadZone } from '../UploadZone';
import { toKebabCase } from '../upload';
import { z } from 'zod';

interface PapersEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** List-type editor for Paper[] with PDF upload via UploadZone */
export function PapersEditor({ onDirtyChange, saveRef }: PapersEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Track which item IDs were present at load time (should not auto-update)
  const existingIds = useRef<Set<string>>(new Set());

  const { data, setData, fieldErrors, loading } = useContentEditor<Paper[]>({
    contentType: 'papers',
    schema: z.array(paperSchema),
    onDirtyChange,
    saveRef,
  });

  // Capture existing IDs once data loads
  if (data && existingIds.current.size === 0) {
    data.forEach((p) => {
      if (p.id) existingIds.current.add(p.id);
    });
  }

  // Update a field on the active item
  const updateItem = <K extends keyof Paper>(field: K, value: Paper[K]) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const item = { ...updated[activeIndex], [field]: value };

      // Auto-generate ID from title for new items only
      if (field === 'title' && !existingIds.current.has(updated[activeIndex].id)) {
        item.id = toKebabCase(value as string);
      }

      updated[activeIndex] = item;
      return updated;
    });
    onDirtyChange(true);
  };

  const addItem = () => {
    setData((prev) => {
      const items = prev ?? [];
      return [...items, { id: '', title: '', descriptor: '', pdfPath: '' }];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this paper?')) return;
    setData((prev) => {
      if (!prev) return prev;
      return prev.filter((_, i) => i !== activeIndex);
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
        getLabel={(item) => item.title || 'Untitled Paper'}
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

          {/* Read-only auto-generated ID */}
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-muted-foreground">ID</span>
            <p className="rounded bg-muted px-3 py-2 text-sm text-muted-foreground">
              {activeItem.id || '(auto-generated from title)'}
            </p>
          </div>

          <FormField
            label="Title"
            value={activeItem.title}
            onChange={(v) => updateItem('title', v)}
            error={fieldErrors[`${activeIndex}.title`]}
            placeholder="e.g. RF Filter Design Report"
          />

          <FormField
            label="Descriptor"
            value={activeItem.descriptor}
            onChange={(v) => updateItem('descriptor', v)}
            error={fieldErrors[`${activeIndex}.descriptor`]}
            multiline
            placeholder="Brief description of the paper"
          />

          <SectionHeader>PDF</SectionHeader>
          <UploadZone
            label="Paper PDF"
            accept={['.pdf']}
            maxSize={10 * 1024 * 1024}
            context={{
              contentType: 'papers',
              field: 'pdfPath',
              itemId: activeItem.id,
            }}
            currentFile={activeItem.pdfPath}
            onUploaded={(path) => updateItem('pdfPath', path)}
          />
          {fieldErrors[`${activeIndex}.pdfPath`] && (
            <p className="text-sm text-red-500">
              {fieldErrors[`${activeIndex}.pdfPath`]![0]}
            </p>
          )}

          <button
            type="button"
            onClick={deleteItem}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Paper
          </button>
        </>
      )}
    </div>
  );
}
