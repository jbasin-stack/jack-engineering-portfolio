import { describe, it, expect } from 'vitest';
import { contactData } from '../contact';

describe('contact data', () => {
  it('exports contactData with non-empty tagline', () => {
    expect(typeof contactData.tagline).toBe('string');
    expect(contactData.tagline.length).toBeGreaterThan(0);
  });

  it('email contains @', () => {
    expect(contactData.email).toContain('@');
  });

  it('resumePath is /resume.pdf', () => {
    expect(contactData.resumePath).toBe('/resume.pdf');
  });

  it('socialLinks has at least 2 entries with GitHub and LinkedIn', () => {
    expect(contactData.socialLinks.length).toBeGreaterThanOrEqual(2);
    const platforms = contactData.socialLinks.map((l) => l.platform);
    expect(platforms).toContain('GitHub');
    expect(platforms).toContain('LinkedIn');
  });

  it('each social link has platform, url, and icon fields', () => {
    contactData.socialLinks.forEach((link) => {
      expect(link.platform).toBeTruthy();
      expect(link.url).toBeTruthy();
      expect(link.icon).toBeTruthy();
    });
  });
});
