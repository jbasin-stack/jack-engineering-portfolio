import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

interface StructuredArrayFieldProps<T extends Record<string, string>> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldDef[];
  error?: string[];
}

/** Array-of-objects editor with mini-form rows and add/remove */
export function StructuredArrayField<T extends Record<string, string>>({
  label,
  items,
  onChange,
  fields,
  error,
}: StructuredArrayFieldProps<T>) {
  const addItem = () => {
    const empty = Object.fromEntries(fields.map((f) => [f.key, ''])) as T;
    onChange([...items, empty]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: string, value: string) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    onChange(next);
  };

  const hasError = error && error.length > 0;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {fields.map((field) => (
            <Input
              key={field.key}
              value={item[field.key] ?? ''}
              onChange={(e) => updateItem(i, field.key, e.target.value)}
              placeholder={field.placeholder ?? field.label}
              className="flex-1"
            />
          ))}
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="mt-1.5 shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addItem}
        className="gap-1 text-gray-500"
      >
        <Plus className="size-3.5" />
        Add
      </Button>
      {hasError && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
  );
}
