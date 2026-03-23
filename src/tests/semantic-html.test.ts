import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('semantic HTML structure', () => {
  it('App.tsx wraps Contact in a footer element', () => {
    const appSrc = readFileSync(resolve(__dirname, '../App.tsx'), 'utf-8');
    expect(appSrc).toMatch(/<footer[\s>]/);
    expect(appSrc).toMatch(/<\/footer>/);
    // Contact should be inside footer, not inside main
    const mainBlock = appSrc.match(/<main[\s>][\s\S]*?<\/main>/);
    expect(mainBlock).toBeTruthy();
    expect(mainBlock![0]).not.toContain('<Contact');
  });

  it('index.html has no Google Fonts external requests', () => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(html).not.toContain('fonts.gstatic.com');
  });
});
