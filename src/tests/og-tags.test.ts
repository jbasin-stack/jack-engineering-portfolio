import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('OpenGraph and Twitter Card meta tags', () => {
  const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');

  it('has og:title meta tag with correct value', () => {
    expect(html).toContain('og:title');
    expect(html).toContain('Jack Basinski | ECE at UW');
  });

  it('has og:description meta tag', () => {
    expect(html).toContain('og:description');
  });

  it('has og:image pointing to a .png file', () => {
    expect(html).toMatch(/og:image.*\.png/);
  });

  it('has og:type set to website', () => {
    expect(html).toContain('og:type');
    expect(html).toContain('"website"');
  });

  it('has twitter:card set to summary_large_image', () => {
    expect(html).toContain('twitter:card');
    expect(html).toContain('summary_large_image');
  });

  it('has twitter:image pointing to a .png file', () => {
    expect(html).toMatch(/twitter:image[\s\S]*?\.png/);
  });
});
