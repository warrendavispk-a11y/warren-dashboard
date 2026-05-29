import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

const NOTION_VERSION = '2022-06-28';

app.use(cors());
app.use(express.json());

// --- Notion API proxy ---

async function notionFetch(endpoint, options = {}) {
  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API ${res.status}: ${text}`);
  }
  return res.json();
}

app.get('/api/notion/database/:id', async (req, res) => {
  try {
    const data = await notionFetch(`/databases/${req.params.id}/query`, {
      method: 'POST',
      body: JSON.stringify({ page_size: 50 }),
    });
    res.json(data);
  } catch (e) {
    // If it's a page, fetch it and its children instead
    if (e.message.includes('page, not a database')) {
      try {
        const [page, blocks] = await Promise.all([
          notionFetch(`/pages/${req.params.id}`),
          notionFetch(`/blocks/${req.params.id}/children?page_size=50`),
        ]);
        // Return in a format compatible with the database query response
        const childPages = (blocks.results || []).filter(b => b.type === 'child_page' || b.type === 'child_database');
        res.json({ results: childPages.map(b => ({
          id: b.id,
          object: b.type === 'child_database' ? 'database' : 'page',
          url: `https://notion.so/${b.id.replace(/-/g, '')}`,
          last_edited_time: b.last_edited_time,
          properties: { Name: { title: [{ plain_text: b.child_page?.title || b.child_database?.title || 'Untitled' }] } },
        })), parent_page: page });
      } catch (e2) {
        res.status(500).json({ error: e2.message });
      }
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

app.get('/api/notion/page/:id', async (req, res) => {
  try {
    const data = await notionFetch(`/pages/${req.params.id}`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/notion/search', async (req, res) => {
  try {
    // Paginate through ALL results, not just the first page
    const all = [];
    let cursor = undefined;
    do {
      const body = { query: req.query.q || '', page_size: 100 };
      if (cursor) body.start_cursor = cursor;
      const data = await notionFetch('/search', { method: 'POST', body: JSON.stringify(body) });
      all.push(...(data.results || []));
      cursor = data.has_more ? data.next_cursor : undefined;
    } while (cursor);
    res.json({ results: all, total: all.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API catch-all — return JSON 404 instead of falling through to SPA
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});

// Serve React app static files
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback — Express 5 requires named wildcard
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`WarrenOS running on http://0.0.0.0:${PORT}`);
});
const NOTION_API_KEY = process.env.NOTION_API_KEY;
