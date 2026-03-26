import { type MutableRefObject } from 'react';
import { z } from 'zod';
import type { NavItem } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { navItemSchema } from '../schemas';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './shared/SectionHeader';
import { FormField } from './shared/FormField';
import { Plus, X } from 'lucide-react';

interface NavigationEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

const navigationSchema = z.array(navItemSchema);

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

  return (
    <div className="space-y-4">
      <SectionHeader>Navigation Items</SectionHeader>

      {data.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border border-border bg-muted/50 p-3 space-y-3"
        >
          {/* Nav item header with remove button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Item {i + 1}
            </span>
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

          {/* Children */}
          {item.children && item.children.length > 0 && (
            <div className="ml-4 space-y-2 border-l-2 border-border pl-3">
              <span className="text-xs font-medium text-muted-foreground">
                Children
              </span>
              {item.children.map((child, ci) => (
                <div key={ci} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <FormField
                        label="Label"
                        value={child.label}
                        onChange={(v) => updateChild(i, ci, 'label', v)}
                        error={fieldErrors[`${i}.children.${ci}.label`]}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        label="Href"
                        value={child.href}
                        onChange={(v) => updateChild(i, ci, 'href', v)}
                        error={fieldErrors[`${i}.children.${ci}.href`]}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeChild(i, ci)}
                      className="mt-6 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
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
      ))}

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
