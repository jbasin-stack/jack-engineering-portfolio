import { useState, useEffect, useCallback, type MutableRefObject } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

interface UseContentEditorOptions<T> {
  contentType: string;
  schema: z.ZodType<T>;
  onDirtyChange: (dirty: boolean) => void;
  saveRef?: MutableRefObject<(() => Promise<boolean>) | null>;
}

export interface FieldErrors {
  [key: string]: string[] | undefined;
}

export function useContentEditor<T>({
  contentType,
  schema,
  onDirtyChange,
  saveRef,
}: UseContentEditorOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);

  // Fetch current data from API
  useEffect(() => {
    setLoading(true);
    fetch(`/__admin-api/content/${contentType}`)
      .then((res) => {
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json as T);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`[admin] Failed to load ${contentType}:`, err);
        toast.error(`Failed to load ${contentType} data`);
        setLoading(false);
      });
  }, [contentType]);

  // Update a single field (works for object data)
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setData((prev) => (prev ? { ...prev, [field]: value } : prev));
      onDirtyChange(true);
    },
    [onDirtyChange]
  );

  // Validate and save
  const save = useCallback(async (): Promise<boolean> => {
    setFieldErrors({}); // Clear previous errors (clean slate)
    const result = schema.safeParse(data);

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      setFieldErrors(flattened.fieldErrors as FieldErrors);
      toast.error('Validation failed -- check highlighted fields');
      return false;
    }

    try {
      const res = await fetch(`/__admin-api/content/${contentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (res.ok) {
        toast.success('Saved');
        onDirtyChange(false);
        return true;
      } else {
        const err = await res.json();
        toast.error(err.error ?? 'Save failed');
        return false;
      }
    } catch {
      toast.error('Save failed');
      return false;
    }
  }, [data, schema, contentType, onDirtyChange]);

  // Expose save function via ref for AdminShell integration
  useEffect(() => {
    if (saveRef) {
      saveRef.current = save;
    }
  }, [save, saveRef]);

  return { data, setData, updateField, fieldErrors, save, loading };
}
