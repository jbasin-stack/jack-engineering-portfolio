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
