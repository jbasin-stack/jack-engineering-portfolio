import { useState, useRef, type MutableRefObject } from 'react';
import type { Project } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { projectSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { TagInput } from './shared/TagInput';
import { StructuredArrayField } from './shared/StructuredArrayField';
import { SectionHeader } from './shared/SectionHeader';
import { ItemList } from './shared/ItemList';
import { UploadZone } from '../UploadZone';
import { Checkbox } from '@/components/ui/checkbox';
import { toKebabCase } from '../upload';
import { z } from 'zod';
import { X } from 'lucide-react';

interface ProjectsEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

const linkFields = [
  { key: 'label', label: 'Label', placeholder: 'e.g. GitHub' },
  { key: 'url', label: 'URL', placeholder: 'e.g. https://github.com/...' },
];

/** Complex list-type editor for Project[] with uploads, nested arrays, and boolean toggle */
export function ProjectsEditor({
  onDirtyChange,
  saveRef,
}: ProjectsEditorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Track which item IDs existed at load time (should not auto-update)
  const existingIds = useRef<Set<string>>(new Set());

  const { data, setData, fieldErrors, loading } = useContentEditor<Project[]>({
    contentType: 'projects',
    schema: z.array(projectSchema),
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
  const updateItem = <K extends keyof Project>(
    field: K,
    value: Project[K]
  ) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const item = { ...updated[activeIndex], [field]: value };

      // Auto-generate ID from title for new items only
      if (
        field === 'title' &&
        !existingIds.current.has(updated[activeIndex].id)
      ) {
        item.id = toKebabCase(value as string);
      }

      updated[activeIndex] = item;
      return updated;
    });
    onDirtyChange(true);
  };

  // Remove an image from the images array by index
  const removeImage = (imageIndex: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const item = { ...updated[activeIndex] };
      item.images = item.images.filter((_, i) => i !== imageIndex);
      updated[activeIndex] = item;
      return updated;
    });
    onDirtyChange(true);
  };

  // Append a newly uploaded image path
  const addImage = (path: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const item = { ...updated[activeIndex] };
      item.images = [...item.images, path];
      updated[activeIndex] = item;
      return updated;
    });
    onDirtyChange(true);
  };

  const addItem = () => {
    setData((prev) => {
      const items = prev ?? [];
      return [
        ...items,
        {
          id: '',
          title: '',
          brief: '',
          summary: '',
          thumbnail: '',
          images: [],
          domain: '',
          techStack: [],
          links: [],
          featured: false,
        },
      ];
    });
    setActiveIndex(data ? data.length : 0);
    onDirtyChange(true);
  };

  const deleteItem = () => {
    if (!window.confirm('Delete this project?')) return;
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
        getLabel={(item) => item.title || 'Untitled Project'}
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
          {/* ── Details ── */}
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
            placeholder="e.g. LNA Design Tool"
          />
          <FormField
            label="Brief"
            value={activeItem.brief}
            onChange={(v) => updateItem('brief', v)}
            error={fieldErrors[`${activeIndex}.brief`]}
            placeholder="One-line project summary"
          />
          <FormField
            label="Summary"
            value={activeItem.summary}
            onChange={(v) => updateItem('summary', v)}
            error={fieldErrors[`${activeIndex}.summary`]}
            multiline
            placeholder="Detailed project description"
          />
          <FormField
            label="Domain"
            value={activeItem.domain}
            onChange={(v) => updateItem('domain', v)}
            error={fieldErrors[`${activeIndex}.domain`]}
            placeholder="e.g. RF Engineering"
          />

          {/* Featured checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={activeItem.featured}
              onCheckedChange={(checked) =>
                updateItem('featured', checked as boolean)
              }
            />
            <span className="text-sm font-medium text-foreground">
              Featured project
            </span>
          </div>

          {/* ── Media ── */}
          <SectionHeader>Media</SectionHeader>

          <UploadZone
            label="Thumbnail"
            accept={['.jpg', '.jpeg', '.png', '.svg', '.webp']}
            maxSize={10 * 1024 * 1024}
            context={{
              contentType: 'projects',
              field: 'thumbnail',
              itemId: activeItem.id,
            }}
            currentFile={activeItem.thumbnail}
            onUploaded={(path) => updateItem('thumbnail', path)}
          />
          {fieldErrors[`${activeIndex}.thumbnail`] && (
            <p className="text-sm text-red-500">
              {fieldErrors[`${activeIndex}.thumbnail`]![0]}
            </p>
          )}

          {/* Images gallery with remove buttons */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Images</span>
            {activeItem.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeItem.images.map((img, i) => (
                  <div
                    key={i}
                    className="group relative rounded border border-border overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Project image ${i + 1}`}
                      className="h-20 w-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <UploadZone
              label="Add Image"
              accept={['.jpg', '.jpeg', '.png', '.svg', '.webp']}
              maxSize={10 * 1024 * 1024}
              context={{
                contentType: 'projects',
                field: 'images',
                itemId: activeItem.id,
              }}
              onUploaded={addImage}
            />
          </div>

          {/* ── Tech & Links ── */}
          <SectionHeader>Tech & Links</SectionHeader>

          <TagInput
            label="Tech Stack"
            tags={activeItem.techStack}
            onChange={(tags) => updateItem('techStack', tags)}
            error={fieldErrors[`${activeIndex}.techStack`]}
          />

          <StructuredArrayField
            label="Links"
            items={
              activeItem.links as unknown as Record<string, string>[]
            }
            onChange={(links) =>
              updateItem(
                'links',
                links as unknown as { label: string; url: string }[]
              )
            }
            fields={linkFields}
            error={fieldErrors[`${activeIndex}.links`]}
          />

          <button
            type="button"
            onClick={deleteItem}
            className="mt-4 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Project
          </button>
        </>
      )}
    </div>
  );
}
