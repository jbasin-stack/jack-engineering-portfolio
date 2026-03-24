import { writeFile, rename } from 'fs/promises';

/**
 * Writes content to a file atomically using temp-file-then-rename.
 * Retries rename up to 3 times on EPERM/EBUSY (Windows antivirus locking).
 */
export async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, content, 'utf-8');

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await rename(tmpPath, filePath);
      return;
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EBUSY') {
        lastError = err;
        await new Promise((r) => setTimeout(r, 100));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

/** Per-file write queue to serialize concurrent writes (last-write-wins). */
const writeQueues = new Map<string, Promise<void>>();

/**
 * Enqueues a write for a given file, serializing against any pending write
 * to the same path. Returns a promise that resolves when the write completes.
 *
 * @param onWriteStart - Optional callback invoked just before atomicWrite (e.g. to track active writes)
 * @param onWriteEnd - Optional callback invoked after write completes (e.g. delayed cleanup)
 */
export function enqueueWrite(
  filePath: string,
  content: string,
  onWriteStart?: (path: string) => void,
  onWriteEnd?: (path: string) => void,
): Promise<void> {
  const pending = writeQueues.get(filePath) ?? Promise.resolve();
  const next = pending
    .catch(() => {
      /* swallow previous errors so the queue keeps moving */
    })
    .then(async () => {
      onWriteStart?.(filePath);
      await atomicWrite(filePath, content);
    })
    .finally(() => {
      onWriteEnd?.(filePath);
    });

  writeQueues.set(filePath, next);
  return next;
}
