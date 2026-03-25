import { describe, it, expect } from 'vitest';
import { normalizePath } from 'vite';

describe('HMR suppression path normalization', () => {
  it('matches forward-slash path against backslash-stored path when both are normalized', () => {
    const backslashPath = 'C:\\Users\\Jack\\src\\data\\hero.ts';
    const forwardSlashPath = 'C:/Users/Jack/src/data/hero.ts';

    expect(normalizePath(backslashPath)).toBe(normalizePath(forwardSlashPath));
  });

  it('matches identical forward-slash paths', () => {
    const path = 'C:/Users/Jack/src/data/hero.ts';

    expect(normalizePath(path)).toBe(path);
  });

  it('does not match unrelated paths', () => {
    const pathA = 'C:/Users/Jack/src/data/hero.ts';
    const pathB = 'C:/Users/Jack/src/data/projects.ts';

    expect(normalizePath(pathA)).not.toBe(normalizePath(pathB));
  });

  it('Set.has() matches when both stored and queried paths are normalized', () => {
    const activeWrites = new Set<string>();

    // Simulate Windows path.resolve() output (backslashes)
    const storedPath = 'C:\\Users\\Jack\\project\\src\\data\\hero.ts';
    // Simulate Vite handleHotUpdate file argument (forward slashes)
    const queriedPath = 'C:/Users/Jack/project/src/data/hero.ts';

    // Store normalized path (what the fix does)
    activeWrites.add(normalizePath(storedPath));

    // Vite already normalizes the handleHotUpdate file argument
    expect(activeWrites.has(queriedPath)).toBe(true);
  });

  it('Set.has() fails without normalization on mismatched separators', () => {
    const activeWrites = new Set<string>();

    // Store raw backslash path (the bug)
    const storedPath = 'C:\\Users\\Jack\\project\\src\\data\\hero.ts';
    const queriedPath = 'C:/Users/Jack/project/src/data/hero.ts';

    activeWrites.add(storedPath);

    // Without normalization, this FAILS — demonstrating the bug
    expect(activeWrites.has(queriedPath)).toBe(false);
  });
});
