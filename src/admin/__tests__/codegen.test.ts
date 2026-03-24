import { describe, it, expect } from 'vitest';
import { generateDataFile, formatAndValidate } from '../codegen';

describe('generateDataFile', () => {
  it('produces correct output for a single object content type', () => {
    const result = generateDataFile('HeroData', 'heroData', { name: 'Test' }, false);

    expect(result).toContain("import type { HeroData } from '../types/data';");
    expect(result).toContain('export const heroData: HeroData =');
    expect(result).toContain('"name"');
    expect(result).toContain('"Test"');
    // Should not have array type annotation
    expect(result).not.toContain('HeroData[]');
  });

  it('produces correct output for an array content type', () => {
    const result = generateDataFile('Project', 'projects', [{ id: 'p1' }], true);

    expect(result).toContain("import type { Project } from '../types/data';");
    expect(result).toContain('export const projects: Project[] =');
    expect(result).toContain('"id"');
    expect(result).toContain('"p1"');
  });

  it('ends with a trailing newline', () => {
    const result = generateDataFile('HeroData', 'heroData', { name: 'Test' }, false);
    expect(result.endsWith('\n')).toBe(true);
  });

  it('has an empty line between import and export', () => {
    const result = generateDataFile('HeroData', 'heroData', { name: 'Test' }, false);
    const lines = result.split('\n');
    // Line 0: import, Line 1: empty, Line 2: export
    expect(lines[0]).toMatch(/^import type/);
    expect(lines[1]).toBe('');
    expect(lines[2]).toMatch(/^export const/);
  });
});

describe('formatAndValidate', () => {
  it('returns formatted code with single quotes', async () => {
    const raw = generateDataFile('HeroData', 'heroData', { name: 'Test' }, false);
    const formatted = await formatAndValidate(raw);

    // Prettier should convert JSON double quotes to single quotes
    expect(formatted).toContain("'Test'");
    expect(formatted).toContain("'../types/data'");
  });

  it('returns formatted code with trailing commas', async () => {
    const raw = generateDataFile('HeroData', 'heroData', { name: 'Test', value: 42 }, false);
    const formatted = await formatAndValidate(raw);

    // Trailing commas after last property
    expect(formatted).toContain('42,');
  });

  it('throws on invalid TypeScript syntax', async () => {
    const invalid = 'const x: = 5;';

    await expect(formatAndValidate(invalid)).rejects.toThrow();
  });

  it('returns valid TypeScript for array exports', async () => {
    const raw = generateDataFile('Project', 'projects', [{ id: 'p1', title: 'Test' }], true);
    const formatted = await formatAndValidate(raw);

    expect(formatted).toContain('Project[]');
    expect(formatted).toContain("'p1'");
  });
});
