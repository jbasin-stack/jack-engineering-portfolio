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

  it('handles special characters in data values safely', () => {
    const data = { description: "Maxwell's equations are fundamental" };
    const result = generateDataFile('HeroData', 'heroData', data, false);

    // JSON.stringify escapes apostrophes safely (no unescaped single quotes in raw output)
    expect(result).toContain("Maxwell's equations");
    // The output should be valid JSON-within-TS (double-quoted strings)
    expect(result).toContain('"description"');
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

  it('produces parseable TypeScript (no syntax errors)', async () => {
    const raw = generateDataFile(
      'HeroData',
      'heroData',
      { name: 'Test', subtitle: 'Sub', narrative: 'Narr' },
      false,
    );
    const formatted = await formatAndValidate(raw);

    // Should not throw and should return a non-empty string
    expect(formatted.length).toBeGreaterThan(0);
    expect(formatted).toContain('export const heroData');
  });

  it('throws on invalid TypeScript syntax', async () => {
    const invalid = 'const x: = 5;';

    // Prettier catches the parse error before TS validation — error includes position info
    await expect(formatAndValidate(invalid)).rejects.toThrow();
  });

  it('does not throw for valid import type statement', async () => {
    const valid = "import type { HeroData } from '../types/data';";
    const formatted = await formatAndValidate(valid);

    expect(formatted).toContain('import type');
  });

  it('preserves import type syntax (not converted to plain import)', async () => {
    const raw = generateDataFile('HeroData', 'heroData', { name: 'Test' }, false);
    const formatted = await formatAndValidate(raw);

    // Must use `import type`, not bare `import`
    expect(formatted).toMatch(/import type \{/);
    // Should NOT have bare import without type keyword for this data import
    expect(formatted).not.toMatch(/^import \{ HeroData/m);
  });

  it('returns valid TypeScript for array exports', async () => {
    const raw = generateDataFile('Project', 'projects', [{ id: 'p1', title: 'Test' }], true);
    const formatted = await formatAndValidate(raw);

    expect(formatted).toContain('Project[]');
    expect(formatted).toContain("'p1'");
  });
});

describe('round-trip: generateDataFile -> formatAndValidate', () => {
  it('succeeds for object type and contains import type', async () => {
    const raw = generateDataFile('HeroData', 'heroData', { name: 'Test', subtitle: 'Sub' }, false);
    const formatted = await formatAndValidate(raw);

    expect(formatted).toContain('import type { HeroData }');
    expect(formatted).toContain('heroData: HeroData');
    expect(formatted).toContain("'Test'");
    expect(formatted).toContain("'Sub'");
  });

  it('succeeds for array type and contains array annotation', async () => {
    const raw = generateDataFile(
      'SkillGroup',
      'skillGroups',
      [{ domain: 'RF', skills: ['Matching'] }],
      true,
    );
    const formatted = await formatAndValidate(raw);

    expect(formatted).toContain('SkillGroup[]');
    expect(formatted).toContain("'RF'");
    expect(formatted).toContain("'Matching'");
  });
});
