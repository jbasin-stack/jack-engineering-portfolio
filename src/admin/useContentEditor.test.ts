import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useContentEditor } from './useContentEditor';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Import mocked toast for assertions
import { toast } from 'sonner';

const testSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1),
});

type TestData = z.infer<typeof testSchema>;

const validData: TestData = { name: 'Jack', email: 'jack@example.com' };

describe('useContentEditor', () => {
  let onDirtyChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onDirtyChange = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('save() with valid data', () => {
    it('returns true, clears dirty state, and shows success toast', async () => {
      // Mock fetch: first call returns data (initial load), second call is the POST save
      vi.stubGlobal(
        'fetch',
        vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(validData),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true }),
          })
      );

      const { result } = renderHook(() =>
        useContentEditor<TestData>({
          contentType: 'test',
          schema: testSchema,
          onDirtyChange,
        })
      );

      // Wait for initial data fetch
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      expect(result.current.data).toEqual(validData);
      expect(result.current.loading).toBe(false);

      // Call save
      let saveResult: boolean;
      await act(async () => {
        saveResult = await result.current.save();
      });

      expect(saveResult!).toBe(true);
      expect(onDirtyChange).toHaveBeenCalledWith(false);
      expect(toast.success).toHaveBeenCalledWith('Saved');
    });
  });

  describe('save() with invalid data', () => {
    it('returns false, sets field errors, and shows error toast', async () => {
      const invalidData = { name: '', email: 'jack@example.com' };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(invalidData),
        })
      );

      const { result } = renderHook(() =>
        useContentEditor<TestData>({
          contentType: 'test',
          schema: testSchema,
          onDirtyChange,
        })
      );

      // Wait for initial data fetch
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      // Call save with invalid data
      let saveResult: boolean;
      await act(async () => {
        saveResult = await result.current.save();
      });

      expect(saveResult!).toBe(false);
      expect(result.current.fieldErrors).toHaveProperty('name');
      expect(toast.error).toHaveBeenCalledWith(
        'Validation failed -- check highlighted fields'
      );
    });
  });

  describe('save() with server error', () => {
    it('returns false and shows error toast with server message', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn()
          .mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(validData),
          })
          .mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ error: 'Internal error' }),
          })
      );

      const { result } = renderHook(() =>
        useContentEditor<TestData>({
          contentType: 'test',
          schema: testSchema,
          onDirtyChange,
        })
      );

      // Wait for initial data fetch
      await act(async () => {
        await new Promise((r) => setTimeout(r, 10));
      });

      // Call save
      let saveResult: boolean;
      await act(async () => {
        saveResult = await result.current.save();
      });

      expect(saveResult!).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Internal error');
    });
  });
});
