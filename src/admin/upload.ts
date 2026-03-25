/** Context describing where an uploaded file belongs in the content model. */
export interface UploadContext {
  contentType: string;
  field: string;
  itemId?: string;
}

/** Result returned from the client-side uploadFile helper. */
export interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/** Allowed image extensions for upload validation. */
const ALLOWED_IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.webp']);

/** Allowed document extensions for upload validation. */
const ALLOWED_DOC_EXTS = new Set(['.pdf']);

/** Maximum upload file size in bytes (10 MB). */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Normalizes a filename to lowercase-kebab-case.
 * Splits at the last dot to preserve the extension, then replaces
 * any run of non-alphanumeric characters in the name with a single hyphen.
 */
export function toKebabCase(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  const name = lastDot > 0 ? filename.slice(0, lastDot) : filename;
  const ext = lastDot > 0 ? filename.slice(lastDot) : '';

  const normalizedName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${normalizedName}${ext.toLowerCase()}`;
}

/**
 * Validates an uploaded file by extension and size.
 * Returns null if valid, or a descriptive error string if invalid.
 */
export function validateUpload(fileName: string, fileSize: number): string | null {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

  if (!ALLOWED_IMAGE_EXTS.has(ext) && !ALLOWED_DOC_EXTS.has(ext)) {
    return `File type ${ext} is not allowed`;
  }

  if (fileSize > MAX_FILE_SIZE) {
    return 'File too large (max 10MB)';
  }

  return null;
}

/**
 * Determines the public/ path for an uploaded file based on content type and field.
 * Returns a path relative to public/ (with leading slash).
 */
export function getUploadPath(
  contentType: string,
  field: string,
  itemId: string | undefined,
  ext: string,
): string {
  // Project assets route to /projects/{id}.{ext}
  if (contentType === 'projects' && (field === 'thumbnail' || field === 'images')) {
    return `/projects/${itemId}${ext}`;
  }

  // Paper PDFs route to /papers/{id}.{ext}
  if (contentType === 'papers' && field === 'pdfPath') {
    return `/papers/${itemId}${ext}`;
  }

  // Portrait photo (hero section)
  if (contentType === 'hero' && field === 'portrait') {
    return `/portrait${ext}`;
  }

  // Resume PDF (contact section)
  if (contentType === 'contact' && field === 'resumePath') {
    return `/resume${ext}`;
  }

  // Fallback for unknown content type/field combinations
  return `/uploads/${toKebabCase(`file${ext}`)}`;
}

/**
 * Client-side upload helper. POSTs a file with context metadata
 * to the admin upload endpoint via multipart FormData.
 */
export async function uploadFile(file: File, context: UploadContext): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('context', JSON.stringify(context));

  try {
    const response = await fetch('/__admin-api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = (await response.json()) as { error?: string; path?: string };

    if (!response.ok) {
      return { success: false, error: data.error ?? 'Upload failed' };
    }

    return { success: true, path: data.path };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}
