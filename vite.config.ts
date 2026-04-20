import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

const LOCAL_DATA_DIR = path.resolve(__dirname, 'local-data');
const LOCAL_STATE_FILE = path.resolve(LOCAL_DATA_DIR, 'agent-state.json');
const LOCAL_STATE_PATH = 'local-data/agent-state.json';

const defaultPersistedState = {
  version: 1,
  messages: [],
  sessionState: {
    activeWorkflow: null,
    savedRecords: [],
  },
  updatedAt: new Date(0).toISOString(),
};

async function readLocalAgentState() {
  try {
    const fileContent = await fs.readFile(LOCAL_STATE_FILE, 'utf8');
    return JSON.parse(fileContent);
  } catch {
    return defaultPersistedState;
  }
}

async function writeLocalAgentState(state: unknown) {
  await fs.mkdir(LOCAL_DATA_DIR, {recursive: true});
  await fs.writeFile(LOCAL_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function jsonResponse(
  res: {
    statusCode: number;
    setHeader: (key: string, value: string) => void;
    end: (body: string) => void;
  },
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function localAgentStatePlugin() {
  const handler = async (
    req: {
      method?: string;
      url?: string;
      on: (event: string, callback: (chunk?: Buffer) => void) => void;
    },
    res: {
      statusCode: number;
      setHeader: (key: string, value: string) => void;
      end: (body: string) => void;
    },
    next: () => void,
  ) => {
    if (!req.url || !req.url.startsWith('/api/local-agent-state')) {
      next();
      return;
    }

    if (req.method === 'GET') {
      const state = await readLocalAgentState();
      jsonResponse(res, 200, {
        state,
        storage: {
          kind: 'local-file',
          label: '目前工作區檔案',
          path: LOCAL_STATE_PATH,
        },
      });
      return;
    }

    if (req.method === 'POST') {
      const chunks: Buffer[] = [];

      req.on('data', (chunk) => {
        if (chunk) {
          chunks.push(chunk);
        }
      });

      req.on('end', async () => {
        try {
          const rawBody = Buffer.concat(chunks).toString('utf8');
          const parsedBody = rawBody ? JSON.parse(rawBody) : {};
          await writeLocalAgentState(parsedBody.state ?? defaultPersistedState);
          jsonResponse(res, 200, {
            ok: true,
            storage: {
              kind: 'local-file',
              label: '目前工作區檔案',
              path: LOCAL_STATE_PATH,
            },
          });
        } catch (error) {
          jsonResponse(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      });

      return;
    }

    jsonResponse(res, 405, {
      ok: false,
      error: 'Method not allowed',
    });
  };

  return {
    name: 'local-agent-state',
    configureServer(server: {middlewares: {use: (middleware: typeof handler) => void}}) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: {middlewares: {use: (middleware: typeof handler) => void}}) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), localAgentStatePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
