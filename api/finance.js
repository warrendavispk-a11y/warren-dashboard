const SHOPIFY_SHOP = 'my-store-300000000000000009141.myshopify.com';
const SHOPIFY_VERSION = '2026-04';

function getPeriodDates(period) {
  const now = new Date();
  const until = now.toISOString().split('T')[0];
  let since;
  if (period === 'today') {
    since = until;
  } else if (period === '7d') {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    since = d.toISOString().split('T')[0];
  } else if (period === 'mtd') {
    since = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  } else {
    // default 30d
    const d = new Date(now); d.setDate(d.getDate() - 30);
    since = d.toISOString().split('T')[0];
  }
  return { since, until };
}

async function safeRun(fn) {
  try { return { data: await fn(), error: null }; }
  catch (e) { return { data: null, error: e.message }; }
}

// ── Revenue sources ────────────────────────────────────────────────────────

async function fetchShopifyRevenue(since, until) {
  const token = process.env.SHOPIFY_CLIENT_SECRET;
  if (!token) throw new Error('Missing SHOPIFY_CLIENT_SECRET');
  const base = `https://${SHOPIFY_SHOP}/admin/api/${SHOPIFY_VERSION}`;
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  let total = 0, orders = 0;
  let url = `${base}/orders.json?status=any&financial_status=paid&created_at_min=${since}T00:00:00Z&created_at_max=${until}T23:59:59Z&limit=250&fields=id,total_price`;
  while (url) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Shopify ${res.status}`);
    const data = await res.json();
    for (const o of data.orders ?? []) { total += parseFloat(o.total_price) || 0; orders++; }
    const link = res.headers.get('Link') ?? '';
    url = link.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  }
  return { amount: parseFloat(total.toFixed(2)), orders };
}

async function fetchGumroadRevenue(since, until) {
  const token = process.env.GUMROAD_ACCESS_TOKEN;
  if (!token) throw new Error('Missing GUMROAD_ACCESS_TOKEN');

  let total = 0, sales = 0, page = 1;
  while (true) {
    const url = `https://api.gumroad.com/v2/sales?access_token=${token}&after=${since}&before=${until}&page=${page}&page_key=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Gumroad ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Gumroad API error');
    for (const s of data.sales ?? []) {
      total += (parseFloat(s.price) || 0) / 100;
      sales++;
    }
    if (!data.next_page_url) break;
    page++;
  }
  return { amount: parseFloat(total.toFixed(2)), orders: sales };
}

async function fetchEtsyRevenue(since, until) {
  const apiKey = process.env.ETSY_API_KEY;
  const shopId = process.env.ETSY_SHOP_ID;
  if (!apiKey || !shopId) throw new Error('Missing ETSY_API_KEY or ETSY_SHOP_ID');

  const sinceTs = Math.floor(new Date(since + 'T00:00:00Z').getTime() / 1000);
  const untilTs = Math.floor(new Date(until + 'T23:59:59Z').getTime() / 1000);

  let total = 0, orders = 0, offset = 0;
  const limit = 100;
  while (true) {
    const url = `https://openapi.etsy.com/v3/application/shops/${shopId}/receipts?was_paid=true&min_created=${sinceTs}&max_created=${untilTs}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: { 'x-api-key': apiKey } });
    if (!res.ok) throw new Error(`Etsy ${res.status}`);
    const data = await res.json();
    for (const r of data.results ?? []) {
      total += (parseFloat(r.grandtotal?.amount) || 0) / (r.grandtotal?.divisor || 100);
      orders++;
    }
    if ((data.results ?? []).length < limit) break;
    offset += limit;
  }
  return { amount: parseFloat(total.toFixed(2)), orders };
}

// ── API spend ──────────────────────────────────────────────────────────────

async function fetchAnthropicSpend(since, until) {
  const key = process.env.ANTHROPIC_ADMIN_KEY;
  if (!key) throw new Error('Missing ANTHROPIC_ADMIN_KEY');

  // Anthropic usage API — returns daily usage buckets
  const url = `https://api.anthropic.com/v1/usage/daily?start_date=${since}&end_date=${until}`;
  const res = await fetch(url, {
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
  });
  if (res.status === 404) throw new Error('Usage API not available for this key tier');
  if (!res.ok) throw new Error(`Anthropic ${res.status}`);
  const data = await res.json();

  let cost = 0, inputTokens = 0, outputTokens = 0;
  for (const day of data.data ?? []) {
    cost += parseFloat(day.cost_usd) || 0;
    inputTokens += day.input_tokens ?? 0;
    outputTokens += day.output_tokens ?? 0;
  }
  return { amount: parseFloat(cost.toFixed(4)), inputTokens, outputTokens };
}

async function fetchOpenAISpend(since, until) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('Missing OPENAI_API_KEY');

  const startTs = Math.floor(new Date(since + 'T00:00:00Z').getTime() / 1000);
  const endTs   = Math.floor(new Date(until + 'T23:59:59Z').getTime() / 1000);

  const url = `https://api.openai.com/v1/organization/costs?start_time=${startTs}&end_time=${endTs}&bucket_width=1d`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();

  let cost = 0;
  for (const bucket of data.data ?? []) {
    for (const line of bucket.results ?? []) { cost += parseFloat(line.amount?.value) || 0; }
  }
  return { amount: parseFloat(cost.toFixed(4)) };
}

// ── Ad spend ───────────────────────────────────────────────────────────────

async function fetchMetaAdSpend(since, until) {
  const token   = process.env.META_ACCESS_TOKEN;
  const acctId  = process.env.META_AD_ACCOUNT_ID;
  if (!token || !acctId) throw new Error('Missing META_ACCESS_TOKEN or META_AD_ACCOUNT_ID');

  const url = `https://graph.facebook.com/v19.0/act_${acctId}/insights?fields=spend,impressions,clicks&time_range={"since":"${since}","until":"${until}"}&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Meta ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);

  const row = data.data?.[0] ?? {};
  return {
    amount: parseFloat(row.spend || 0),
    impressions: parseInt(row.impressions || 0, 10),
    clicks: parseInt(row.clicks || 0, 10),
  };
}

async function fetchTikTokAdSpend(since, until) {
  const token      = process.env.TIKTOK_ACCESS_TOKEN;
  const advertiserId = process.env.TIKTOK_ADVERTISER_ID;
  if (!token || !advertiserId) throw new Error('Missing TIKTOK_ACCESS_TOKEN or TIKTOK_ADVERTISER_ID');

  const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/', {
    method: 'POST',
    headers: { 'Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      advertiser_id: advertiserId,
      report_type: 'BASIC',
      dimensions: ['stat_time_day'],
      metrics: ['spend', 'impressions', 'clicks'],
      start_date: since,
      end_date: until,
      page_size: 100,
    }),
  });
  if (!res.ok) throw new Error(`TikTok ${res.status}`);
  const data = await res.json();
  if (data.code !== 0) throw new Error(data.message || 'TikTok API error');

  let spend = 0, impressions = 0, clicks = 0;
  for (const row of data.data?.list ?? []) {
    spend       += parseFloat(row.metrics?.spend       || 0);
    impressions += parseInt(row.metrics?.impressions   || 0, 10);
    clicks      += parseInt(row.metrics?.clicks        || 0, 10);
  }
  return { amount: parseFloat(spend.toFixed(2)), impressions, clicks };
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const period = req.query.period || '30d';
  const { since, until } = getPeriodDates(period);

  const [shopify, gumroad, etsy, anthropic, openai, meta, tiktok] = await Promise.all([
    safeRun(() => fetchShopifyRevenue(since, until)),
    safeRun(() => fetchGumroadRevenue(since, until)),
    safeRun(() => fetchEtsyRevenue(since, until)),
    safeRun(() => fetchAnthropicSpend(since, until)),
    safeRun(() => fetchOpenAISpend(since, until)),
    safeRun(() => fetchMetaAdSpend(since, until)),
    safeRun(() => fetchTikTokAdSpend(since, until)),
  ]);

  const rev    = (shopify.data?.amount  || 0) + (gumroad.data?.amount || 0) + (etsy.data?.amount    || 0);
  const apiSp  = (anthropic.data?.amount || 0) + (openai.data?.amount  || 0);
  const adSp   = (meta.data?.amount     || 0) + (tiktok.data?.amount   || 0);
  const spend  = apiSp + adSp;

  res.status(200).json({
    period, since, until,
    revenue: {
      shopify:  shopify.data,
      gumroad:  gumroad.data,
      etsy:     etsy.data,
      total:    parseFloat(rev.toFixed(2)),
    },
    spend: {
      api: {
        anthropic: anthropic.data,
        openai:    openai.data,
        total:     parseFloat(apiSp.toFixed(4)),
      },
      ads: {
        meta:   meta.data,
        tiktok: tiktok.data,
        total:  parseFloat(adSp.toFixed(2)),
      },
      total: parseFloat(spend.toFixed(2)),
    },
    net: parseFloat((rev - spend).toFixed(2)),
    errors: {
      shopify:   shopify.error,
      gumroad:   gumroad.error,
      etsy:      etsy.error,
      anthropic: anthropic.error,
      openai:    openai.error,
      meta:      meta.error,
      tiktok:    tiktok.error,
    },
  });
}
