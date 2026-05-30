import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import { readFileSync, existsSync, appendFileSync } from 'fs';
import crypto from 'crypto';

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

// --- Gumroad API proxy ---
app.get('/api/gumroad-metrics', async (req, res) => {
  const key = process.env.GUMROAD_API_KEY;
  if (!key) return res.status(500).json({ error: 'GUMROAD_API_KEY not set' });
  try {
    const [productsRes, salesRes] = await Promise.all([
      fetch('https://api.gumroad.com/v2/products', { headers: { Authorization: `Bearer ${key}` } }),
      fetch('https://api.gumroad.com/v2/sales?limit=100', { headers: { Authorization: `Bearer ${key}` } }),
    ]);
    const [productsData, salesData] = await Promise.all([productsRes.json(), salesRes.json()]);
    if (!productsData.success) throw new Error(productsData.message || 'Gumroad products error');

    const products = (productsData.products || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price / 100,
      published: p.published,
      sales_count: p.sales_count ?? 0,
      revenue: ((p.price / 100) * (p.sales_count ?? 0)),
      url: p.short_url || p.url,
    }));

    const sales = salesData.success ? (salesData.sales || []) : [];
    const totalRevenue = sales.reduce((s, sale) => s + (parseFloat(sale.price) || 0), 0) / 100;
    const ordersCount = sales.length;

    res.json({ products, totalRevenue, ordersCount, productCount: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Shopify API proxy ---
const SHOPIFY_STORE = 'my-store-300000000000000009141.myshopify.com';
const SHOPIFY_API_VERSION = '2024-01';

app.get('/api/shopify-metrics', async (req, res) => {
  const token = process.env.SHOPIFY_CLIENT_SECRET;
  if (!token) return res.status(500).json({ error: 'SHOPIFY_CLIENT_SECRET not set' });
  try {
    const now = new Date();
    const d30 = new Date(now - 30 * 86_400_000).toISOString();
    const shopifyHeaders = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };
    const res30 = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/orders.json?status=any&financial_status=paid&created_at_min=${d30}&limit=250&fields=id,total_price`,
      { headers: shopifyHeaders }
    );
    if (res30.status === 401) throw new Error('Invalid Shopify token — regenerate Admin API access token in Shopify admin');
    if (!res30.ok) throw new Error(`Shopify API returned ${res30.status}`);
    const { orders } = await res30.json();
    const revenue = orders.reduce((s, o) => s + parseFloat(o.total_price ?? 0), 0);
    res.json({ revenue: parseFloat(revenue.toFixed(2)), orders: orders.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/shopify-products', async (req, res) => {
  const token = process.env.SHOPIFY_CLIENT_SECRET;
  if (!token) return res.status(500).json({ error: 'SHOPIFY_CLIENT_SECRET not set' });
  try {
    const shopifyHeaders = { 'X-Shopify-Access-Token': token };
    const r = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=50&fields=id,title,status,variants,images,body_html`,
      { headers: shopifyHeaders }
    );
    if (r.status === 401) throw new Error('Invalid Shopify token');
    if (!r.ok) throw new Error(`Shopify API returned ${r.status}`);
    const { products } = await r.json();
    res.json({
      products: products.map(p => ({
        id: p.id,
        name: p.title,
        sku: p.variants?.[0]?.sku || '—',
        price: `$${parseFloat(p.variants?.[0]?.price || 0).toFixed(2)}`,
        stock: p.variants?.[0]?.inventory_quantity ?? '∞',
        image: p.images?.length > 0,
        description: !!p.body_html,
        status: p.status,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Centralized Log Viewer ---
const HERMES_LOGS = '/root/.hermes/logs';
const CRON_OUTPUT = '/root/.hermes/cron/output';
const CRON_JOBS_FILE = '/root/.hermes/cron/jobs.json';

function getCronJobs() {
  try {
    const data = JSON.parse(readFileSync(CRON_JOBS_FILE, 'utf8'));
    return (data.jobs || []).map(j => ({ id: j.id, name: j.name, schedule: j.schedule?.display || '' }));
  } catch { return []; }
}

function tailFile(filePath, lines = 100) {
  if (!existsSync(filePath)) return [];
  try {
    return execSync(`tail -n ${lines} "${filePath}" 2>/dev/null`).toString().split('\n').filter(Boolean);
  } catch { return []; }
}

app.get('/api/logs', (req, res) => {
  const source = req.query.source || 'errors';
  const lines = Math.min(parseInt(req.query.lines || '150'), 500);

  if (source === 'dashboard') {
    try {
      const out = execSync(`journalctl -u warren-os --no-pager -n ${lines} --output=short 2>/dev/null`).toString();
      return res.json({ lines: out.split('\n').filter(Boolean) });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  if (source === 'hermes-gateway') return res.json({ lines: tailFile(`${HERMES_LOGS}/gateway.log`, lines) });
  if (source === 'errors')         return res.json({ lines: tailFile(`${HERMES_LOGS}/errors.log`, lines) });
  if (source === 'agent')          return res.json({ lines: tailFile(`${HERMES_LOGS}/agent.log`, lines) });

  // cron job by id
  const cronPath = `${CRON_OUTPUT}/${source}`;
  if (existsSync(cronPath)) return res.json({ lines: tailFile(cronPath, lines) });

  res.status(404).json({ error: `Unknown log source: ${source}` });
});

app.get('/api/logs/sources', (req, res) => {
  const cronJobs = getCronJobs();
  res.json({
    sources: [
      { id: 'errors',          label: 'Hermes Errors',    group: 'hermes' },
      { id: 'agent',           label: 'Hermes Agent',     group: 'hermes' },
      { id: 'hermes-gateway',  label: 'Hermes Gateway',   group: 'hermes' },
      { id: 'dashboard',       label: 'WarrenOS',         group: 'system' },
      ...cronJobs.map(j => ({ id: j.id, label: j.name, schedule: j.schedule, group: 'cron' })),
    ],
  });
});

// --- Webhook Queue (Item 5) ---
const WEBHOOK_QUEUE = '/root/warren-dashboard-fresh/data/webhook-queue.jsonl';

function enqueueWebhook(event) {
  appendFileSync(WEBHOOK_QUEUE, JSON.stringify(event) + '\n');
}

function readWebhookQueue(limit = 100) {
  if (!existsSync(WEBHOOK_QUEUE)) return [];
  const lines = readFileSync(WEBHOOK_QUEUE, 'utf8').split('\n').filter(Boolean);
  return lines.slice(-limit).reverse().map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

app.post('/api/webhooks/shopify', express.raw({ type: '*/*' }), (req, res) => {
  const event = {
    id: crypto.randomUUID(),
    source: 'shopify',
    topic: req.headers['x-shopify-topic'] || 'unknown',
    received: new Date().toISOString(),
    status: 'queued',
    payload: req.body.toString('utf8').slice(0, 2000),
  };
  enqueueWebhook(event);
  res.status(200).json({ ok: true, id: event.id });
});

app.post('/api/webhooks/gumroad', express.json(), (req, res) => {
  const event = {
    id: crypto.randomUUID(),
    source: 'gumroad',
    topic: req.body?.type || 'sale',
    received: new Date().toISOString(),
    status: 'queued',
    payload: JSON.stringify(req.body || {}).slice(0, 2000),
  };
  enqueueWebhook(event);
  res.status(200).json({ ok: true, id: event.id });
});

app.get('/api/webhooks', (req, res) => {
  res.json({ events: readWebhookQueue(100) });
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
