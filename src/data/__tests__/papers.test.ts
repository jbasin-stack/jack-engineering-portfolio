import { describe, it, expect } from 'vitest';
import { papers } from '../papers';

describe('papers data', () => {
  it('is an array of 2+ entries', () => {
    expect(papers.length).toBeGreaterThanOrEqual(2);
  });

  it('each paper has all required fields', () => {
    for (const paper of papers) {
      expect(paper).toHaveProperty('id');
      expect(paper).toHaveProperty('title');
      expect(paper).toHaveProperty('descriptor');
      expect(paper).toHaveProperty('pdfPath');
    }
  });

  it('all string fields are non-empty', () => {
    for (const paper of papers) {
      expect(paper.id.length).toBeGreaterThan(0);
      expect(paper.title.length).toBeGreaterThan(0);
      expect(paper.descriptor.length).toBeGreaterThan(0);
      expect(paper.pdfPath.length).toBeGreaterThan(0);
    }
  });

  it('pdfPath starts with /', () => {
    for (const paper of papers) {
      expect(paper.pdfPath.startsWith('/')).toBe(true);
    }
  });
});
