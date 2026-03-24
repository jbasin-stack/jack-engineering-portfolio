import type { Plugin, ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { writeFile, rename } from 'fs/promises';
import { resolve } from 'path';
import { generateDataFile, formatAndValidate } from './src/admin/codegen';

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

/** Per-file write queue to serialize concurrent writes (last-write-wins). */
const writeQueues = new Map<string, Promise<void>>();

/**
 * Writes content to a file atomically using temp-file-then-rename.
 * Retries rename up to 3 times on EPERM/EBUSY (Windows antivirus locking).
 */
async function atomicWrite(filePath: string, content: string): Promise<void> {
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, content, 'utf-8');
  activeWrites.add(filePath);

  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await rename(tmpPath, filePath);
      return;
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'EPERM' || code === 'EBUSY') {
        lastError = err;
        await new Promise((r) => setTimeout(r, 100));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

/**
 * Enqueues a write for a given file, serializing against any pending write
 * to the same path. Returns a promise that resolves when the write completes.
 */
function enqueueWrite(filePath: string, content: string): Promise<void> {
  const pending = writeQueues.get(filePath) ?? Promise.resolve();
  const next = pending
    .catch(() => {
      /* swallow previous errors so the queue keeps moving */
    })
    .then(async () => {
      await atomicWrite(filePath, content);
    })
    .finally(() => {
      // Clear activeWrites after chokidar picks up the change
      setTimeout(() => activeWrites.delete(filePath), 200);
    });

  writeQueues.set(filePath, next);
  return next;
}

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
              await enqueueWrite(filePath, formatted);

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
