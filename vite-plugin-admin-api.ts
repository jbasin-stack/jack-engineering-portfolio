import { normalizePath } from 'vite';
import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { resolve, extname, dirname } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import Busboy from 'busboy';
import { generateDataFile, formatAndValidate } from './src/admin/codegen';
import { enqueueWrite } from './src/admin/atomic-write';
import { toKebabCase, validateUpload, getUploadPath } from './src/admin/upload';

/** Registry mapping content type keys to their data file metadata. */
const CONTENT_REGISTRY: Record<
  string,
  { file: string; type: string; export: string; isArray: boolean }
> = {
  hero: { file: 'hero.ts', type: 'HeroData', export: 'heroData', isArray: false },
  projects: { file: 'projects.ts', type: 'Project', export: 'projects', isArray: true },
  papers: { file: 'papers.ts', type: 'Paper', export: 'papers', isArray: true },
  skills: { file: 'skills.ts', type: 'SkillGroup', export: 'skillGroups', isArray: true },
  tooling: { file: 'tooling.ts', type: 'ToolingGroup', export: 'toolingGroups', isArray: true },
  timeline: {
    file: 'timeline.ts',
    type: 'TimelineMilestone',
    export: 'milestones',
    isArray: true,
  },
  contact: { file: 'contact.ts', type: 'ContactData', export: 'contactData', isArray: false },
  navigation: { file: 'navigation.ts', type: 'NavItem', export: 'navItems', isArray: true },
  coursework: { file: 'coursework.ts', type: 'Course', export: 'courses', isArray: true },
};

/** Files currently being written — used to suppress HMR during admin writes. */
const activeWrites = new Set<string>();

/** Collect the full request body as a string. */
function collectBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

/** Send a JSON response with the given status code. */
function jsonResponse(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Updates the data file reference after a file upload.
 * Returns true if a data update was performed, false if skipped
 * (e.g., portrait/hero where path is hardcoded in the component).
 */
async function updateDataReference(
  server: ViteDevServer,
  entry: { file: string; type: string; export: string; isArray: boolean },
  context: { contentType: string; field: string; itemId?: string },
  targetPath: string,
): Promise<boolean> {
  // Hero portrait: path is hardcoded in the component, no data update needed
  if (context.contentType === 'hero' && context.field === 'portrait') {
    return false;
  }

  const mod = await server.ssrLoadModule(`/src/data/${entry.file}`);
  let data = structuredClone(mod[entry.export]);

  if (entry.isArray && Array.isArray(data) && context.itemId) {
    // Find the item by id and update the relevant field
    const item = data.find((i: Record<string, unknown>) => i.id === context.itemId);
    if (item) {
      item[context.field] = targetPath;
    } else {
      return false;
    }
  } else if (!entry.isArray && typeof data === 'object' && data !== null) {
    // Singleton object: update the field directly
    (data as Record<string, unknown>)[context.field] = targetPath;
  } else {
    return false;
  }

  const rawSource = generateDataFile(entry.type, entry.export, data, entry.isArray);
  const formatted = await formatAndValidate(rawSource);
  const filePath = resolve(server.config.root, 'src', 'data', entry.file);

  await enqueueWrite(
    filePath,
    formatted,
    (p) => activeWrites.add(normalizePath(p)),
    (p) => setTimeout(() => activeWrites.delete(normalizePath(p)), 200),
  );

  return true;
}

/**
 * Vite plugin providing the admin API backend.
 * Active only during `vite dev` (apply: 'serve').
 */
export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api',
    apply: 'serve',

    configureServer(server: ViteDevServer) {
      // Print Admin URL alongside Vite's native output
      const originalPrintUrls = server.printUrls;
      server.printUrls = () => {
        originalPrintUrls();
        const address = server.resolvedUrls?.local[0] ?? 'http://localhost:5173/';
        const adminUrl = address.replace(/\/$/, '') + '/?admin';
        // Match Vite's native styling: bold cyan label, dim arrow
        server.config.logger.info(
          `  \x1b[36m\x1b[1mAdmin:\x1b[22m\x1b[39m   ${adminUrl}`,
        );
      };

      // Return middleware factory — mounts AFTER Vite internals
      return () => {
        server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const url = req.url ?? '';

          // --- Upload endpoint: multipart file upload with busboy ---
          if (url === '/__admin-api/upload' && req.method === 'POST') {
            try {
              const bb = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });

              let fileBuffer: Buffer | null = null;
              let fileName = '';
              let fileTruncated = false;
              let context: { contentType: string; field: string; itemId?: string } | null = null;

              bb.on('file', (_fieldname, stream, info) => {
                const chunks: Buffer[] = [];
                fileName = info.filename;

                stream.on('data', (chunk: Buffer) => chunks.push(chunk));
                stream.on('limit', () => { fileTruncated = true; });
                stream.on('end', () => { fileBuffer = Buffer.concat(chunks); });
              });

              bb.on('field', (fieldname, value) => {
                if (fieldname === 'context') {
                  try { context = JSON.parse(value); } catch { /* ignore parse errors */ }
                }
              });

              bb.on('finish', async () => {
                try {
                  // Validate: size limit hit by busboy
                  if (fileTruncated) {
                    jsonResponse(res, 413, { error: 'File too large (max 10MB)' });
                    return;
                  }

                  // Validate: required fields present
                  if (!fileBuffer || !context) {
                    jsonResponse(res, 400, { error: 'Missing file or context' });
                    return;
                  }

                  // Validate: file type and size
                  const validationError = validateUpload(fileName, fileBuffer.length);
                  if (validationError) {
                    jsonResponse(res, 400, { error: validationError });
                    return;
                  }

                  // Normalize filename and determine target path
                  const normalizedName = toKebabCase(fileName);
                  const ext = extname(normalizedName);
                  const targetPath = getUploadPath(context.contentType, context.field, context.itemId, ext);

                  // Write file to public/ FIRST (before data update to prevent race condition)
                  const fullPath = resolve(server.config.root, 'public', targetPath.replace(/^\//, ''));
                  await mkdir(dirname(fullPath), { recursive: true });
                  await writeFile(fullPath, fileBuffer);

                  // Update data file reference if applicable
                  const entry = CONTENT_REGISTRY[context.contentType];
                  if (entry) {
                    const shouldUpdateData = await updateDataReference(
                      server, entry, context, targetPath,
                    );
                    if (!shouldUpdateData) {
                      server.config.logger.info(`[admin-api] Uploaded ${targetPath} (no data update needed)`);
                    }
                  }

                  jsonResponse(res, 200, { success: true, path: targetPath });
                } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : String(err);
                  server.config.logger.error(`[admin-api] Upload error: ${message}`);
                  jsonResponse(res, 500, { error: message });
                }
              });

              req.pipe(bb);
            } catch (err: unknown) {
              const message = err instanceof Error ? err.message : String(err);
              server.config.logger.error(`[admin-api] Upload error: ${message}`);
              jsonResponse(res, 500, { error: message });
            }
            return;
          }

          // Handle content type listing
          if (url === '/__admin-api/content' || url === '/__admin-api/content/') {
            jsonResponse(res, 200, { types: Object.keys(CONTENT_REGISTRY) });
            return;
          }

          // Match /__admin-api/content/:type
          const match = url.match(/^\/__admin-api\/content\/([a-z]+)$/);
          if (!match) {
            next();
            return;
          }

          const contentType = match[1];
          const entry = CONTENT_REGISTRY[contentType];

          if (!entry) {
            jsonResponse(res, 404, { error: 'Unknown content type' });
            return;
          }

          try {
            if (req.method === 'GET') {
              // TODO: migrate to moduleRunner.import() when ssrLoadModule is removed
              const mod = await server.ssrLoadModule(`/src/data/${entry.file}`);
              jsonResponse(res, 200, mod[entry.export]);
              return;
            }

            if (req.method === 'POST') {
              const body = await collectBody(req);
              const data = JSON.parse(body);

              const rawSource = generateDataFile(entry.type, entry.export, data, entry.isArray);
              const formatted = await formatAndValidate(rawSource);

              const filePath = resolve(server.config.root, 'src', 'data', entry.file);
              await enqueueWrite(
                filePath,
                formatted,
                (p) => activeWrites.add(normalizePath(p)),
                (p) => setTimeout(() => activeWrites.delete(normalizePath(p)), 200),
              );

              jsonResponse(res, 200, { success: true });
              return;
            }

            jsonResponse(res, 405, { error: 'Method not allowed' });
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            server.config.logger.error(`[admin-api] ERROR: ${message}`);
            jsonResponse(res, 400, { error: message });
          }
        });
      };
    },

    handleHotUpdate({ file }) {
      // Suppress HMR for files being written by admin API
      if (activeWrites.has(file)) {
        return [];
      }
      return undefined;
    },
  };
}
