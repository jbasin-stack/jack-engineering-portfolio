import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { resolve, extname } from 'path';

/** Recursively collect all .ts and .tsx files under a directory */
function collectFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and dist
      if (entry === 'node_modules' || entry === 'dist') continue;
      collectFiles(fullPath, files);
    } else {
      const ext = extname(entry);
      if (ext === '.ts' || ext === '.tsx') {
        files.push(fullPath);
      }
    }
  }
  return files;
}

describe('no framer-motion imports in codebase', () => {
  const srcDir = resolve(__dirname, '..');
  const allFiles = collectFiles(srcDir);

  it('found source files to scan', () => {
    expect(allFiles.length).toBeGreaterThan(0);
  });

  it('no file imports from framer-motion', () => {
    // Use regex to detect import statements without string literals that match themselves
    const framerImportPattern = /from\s+["']framer-motion["']/;
    const violations: string[] = [];

    for (const filePath of allFiles) {
      // Skip this test file itself
      if (filePath.includes('imports.test.ts')) continue;

      const content = readFileSync(filePath, 'utf-8');
      if (framerImportPattern.test(content)) {
        violations.push(filePath);
      }
    }

    expect(violations).toEqual([]);
  });
});
