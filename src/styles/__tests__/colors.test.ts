import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssContent = readFileSync(
  resolve(__dirname, '..', 'app.css'),
  'utf-8',
);

describe('UW color tokens in app.css', () => {
  const uwTokens = [
    '--color-uw-purple',
    '--color-uw-purple-soft',
    '--color-uw-purple-light',
    '--color-uw-purple-faint',
    '--color-uw-gold',
  ];

  uwTokens.forEach((token) => {
    it(`contains ${token} token`, () => {
      expect(cssContent).toContain(token);
    });
  });

  it('all UW color values use oklch color space', () => {
    // Extract lines that define UW color tokens
    const uwLines = cssContent
      .split('\n')
      .filter((line) => line.includes('--color-uw-'));

    expect(uwLines.length).toBeGreaterThanOrEqual(5);

    uwLines.forEach((line) => {
      expect(line).toMatch(/oklch\(/);
    });
  });
});

describe('dark mode token presence in app.css', () => {
  // Extract the .dark { ... } block content
  const darkBlockMatch = cssContent.match(/\.dark\s*\{([\s\S]*?)\n\}/);
  const darkBlock = darkBlockMatch ? darkBlockMatch[1] : '';

  it('has .dark block with --background token', () => {
    expect(darkBlock).toContain('--background:');
  });

  it('has .dark block with --foreground token', () => {
    expect(darkBlock).toContain('--foreground:');
  });
});

describe('silicon scale chroma values are visibly blue (>= 0.010)', () => {
  const siliconTokens = [
    '--color-silicon-50',
    '--color-silicon-100',
    '--color-silicon-200',
    '--color-silicon-400',
    '--color-silicon-600',
    '--color-silicon-800',
  ];

  // Extract chroma from the @theme block (light mode definitions)
  const themeBlock = cssContent.match(/@theme\s*\{([\s\S]*?)\n\}/);
  const themeContent = themeBlock ? themeBlock[1] : '';

  siliconTokens.forEach((token) => {
    it(`${token} has chroma >= 0.010`, () => {
      // Match the token definition and extract oklch chroma value
      const regex = new RegExp(`${token.replace(/[-]/g, '[-]')}:\\s*oklch\\([\\d.]+ ([\\d.]+) \\d+\\)`);
      const match = themeContent.match(regex);
      expect(match).not.toBeNull();
      const chroma = parseFloat(match![1]);
      expect(chroma).toBeGreaterThanOrEqual(0.010);
    });
  });
});

describe('cleanroom hue is 250 (blue DNA)', () => {
  it('cleanroom uses hue 250, not 90', () => {
    const themeBlock = cssContent.match(/@theme\s*\{([\s\S]*?)\n\}/);
    const themeContent = themeBlock ? themeBlock[1] : '';
    const match = themeContent.match(/--color-cleanroom:\s*oklch\([\d.]+ [\d.]+ (\d+)\)/);
    expect(match).not.toBeNull();
    expect(parseInt(match![1])).toBe(250);
  });
});

describe('aurora keyframe in app.css', () => {
  it('defines --animate-aurora custom property', () => {
    expect(cssContent).toContain('--animate-aurora');
  });

  it('contains @keyframes aurora definition', () => {
    expect(cssContent).toContain('@keyframes aurora');
  });

  it('aurora keyframe animates background-position', () => {
    expect(cssContent).toContain('background-position');
  });
});
