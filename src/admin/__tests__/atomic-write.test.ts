import { describe, it, expect, afterEach } from 'vitest';
import { readFile, unlink, access } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { atomicWrite, enqueueWrite } from '../atomic-write';

/** Generate a unique temp file path for test isolation. */
function tempPath(suffix = '.ts'): string {
  return join(tmpdir(), `admin-test-${randomUUID()}${suffix}`);
}

/** Tracked temp files for cleanup. */
const tempFiles: string[] = [];

afterEach(async () => {
  // Clean up all temp files created during the test
  for (const file of tempFiles) {
    try {
      await unlink(file);
    } catch {
      /* file may not exist — ignore */
    }
    try {
      await unlink(file + '.tmp');
    } catch {
      /* tmp file may not exist — ignore */
    }
  }
  tempFiles.length = 0;
});

describe('atomicWrite', () => {
  it('writes content to the target file', async () => {
    const filePath = tempPath();
    tempFiles.push(filePath);

    await atomicWrite(filePath, 'hello world');
    const content = await readFile(filePath, 'utf-8');

    expect(content).toBe('hello world');
  });

  it('does not leave a .tmp file after completion', async () => {
    const filePath = tempPath();
    tempFiles.push(filePath);

    await atomicWrite(filePath, 'test content');

    // The .tmp file should have been renamed away
    await expect(access(filePath + '.tmp')).rejects.toThrow();
  });

  it('preserves exact content integrity on read-back', async () => {
    const filePath = tempPath();
    tempFiles.push(filePath);

    const content = `import type { HeroData } from '../types/data';\n\nexport const heroData: HeroData = {\n  name: 'Jack',\n  subtitle: 'Engineer',\n};\n`;
    await atomicWrite(filePath, content);
    const readBack = await readFile(filePath, 'utf-8');

    expect(readBack).toBe(content);
  });

  it('handles concurrent writes without corruption (last-write-wins via enqueueWrite)', async () => {
    const filePath = tempPath();
    tempFiles.push(filePath);

    // Fire 5 enqueued writes concurrently with different content
    const writes = Array.from({ length: 5 }, (_, i) =>
      enqueueWrite(filePath, `version ${i + 1}`),
    );
    await Promise.all(writes);

    const content = await readFile(filePath, 'utf-8');

    // Content should be one of the valid versions (not corrupted)
    const validVersions = ['version 1', 'version 2', 'version 3', 'version 4', 'version 5'];
    expect(validVersions).toContain(content);

    // Since writes are serialized, the last enqueued should win
    expect(content).toBe('version 5');
  });
});
