import { describe, it, expect } from 'vitest';
import { toKebabCase, validateUpload, getUploadPath } from '../upload';

describe('toKebabCase', () => {
  it('converts mixed-case filename with spaces to lowercase kebab', () => {
    expect(toKebabCase('My Cool Project.PNG')).toBe('my-cool-project.png');
  });

  it('converts underscores and mixed case to kebab', () => {
    expect(toKebabCase('FPGA_FFT Paper.pdf')).toBe('fpga-fft-paper.pdf');
  });

  it('collapses multiple spaces into a single hyphen', () => {
    expect(toKebabCase('  Spaced  Out  Name.jpg')).toBe('spaced-out-name.jpg');
  });

  it('returns already-kebab filenames unchanged', () => {
    expect(toKebabCase('already-kebab.svg')).toBe('already-kebab.svg');
  });

  it('collapses consecutive dots in the name to a single hyphen', () => {
    expect(toKebabCase('file...with...dots.webp')).toBe('file-with-dots.webp');
  });
});

describe('validateUpload', () => {
  it('returns null for a valid .jpg under 10MB', () => {
    expect(validateUpload('photo.jpg', 5 * 1024 * 1024)).toBeNull();
  });

  it('returns null for a valid .pdf under 10MB', () => {
    expect(validateUpload('paper.pdf', 2 * 1024 * 1024)).toBeNull();
  });

  it('rejects .exe files with descriptive error', () => {
    expect(validateUpload('malware.exe', 1024)).toBe('File type .exe is not allowed');
  });

  it('rejects files over 10MB', () => {
    expect(validateUpload('huge.jpg', 15 * 1024 * 1024)).toContain('too large');
  });

  it('rejects .txt files with descriptive error', () => {
    expect(validateUpload('notes.txt', 1024)).toBe('File type .txt is not allowed');
  });

  it('returns null for valid .png, .svg, .webp, .jpeg', () => {
    expect(validateUpload('icon.png', 1024)).toBeNull();
    expect(validateUpload('logo.svg', 1024)).toBeNull();
    expect(validateUpload('photo.webp', 1024)).toBeNull();
    expect(validateUpload('shot.jpeg', 1024)).toBeNull();
  });
});

describe('getUploadPath', () => {
  it('routes project thumbnails to /projects/{id}.{ext}', () => {
    expect(getUploadPath('projects', 'thumbnail', 'lna-design', '.png')).toBe(
      '/projects/lna-design.png',
    );
  });

  it('routes paper PDFs to /papers/{id}.{ext}', () => {
    expect(getUploadPath('papers', 'pdfPath', 'mems-report', '.pdf')).toBe(
      '/papers/mems-report.pdf',
    );
  });

  it('routes hero portrait to /portrait.{ext}', () => {
    expect(getUploadPath('hero', 'portrait', undefined, '.jpg')).toBe('/portrait.jpg');
  });

  it('routes contact resume to /resume.{ext}', () => {
    expect(getUploadPath('contact', 'resumePath', undefined, '.pdf')).toBe('/resume.pdf');
  });
});
