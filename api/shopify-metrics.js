const SHOP = '30000000000000009141.myshopify.com';
const VERSION = '2025-10';
const BASE = `https://${SHOP}/admin/api/${VERSION}`;

function headers() {
  return {
    'X-Shopify-Access-Token': process.env.SHOPIFY_CLIENT_SECRET,
    'Content-Type': 'application/json',
  };
}

async function fetchAllOrders(minDate, maxDate) {
  const orders = [];
  let url =
    `${BASE}/orders.json?status=any&financial_status=paid` +
    `&created_at_min=${minDate}` +
    (maxDate ? `&created_at_max=${maxDate}` : '') +
    `&limit=250&fields=id,total_price`;

  while (url) {
    const res = await fetch(url, { headers: headers() });
    if (res.status === 401) throw new Error('Invalid access token (401) — verify SHOPIFY_CLIENT_SECRET is an Admin API access token, not the OAuth secret');
    if (res.status === 403) throw new Error('Missing read_orders scope (403) — regenerate token with orders read permission');
    if (!res.ok) throw new Error(`Shopify orders API returned ${res.status}`);
    const data = await res.json();
    orders.push(...(data.orders ?? []));
    const link = res.headers.get('Link') ?? '';
    url = link.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
  }
  return orders;
}

async function fetchSessionsFromShopifyQL(sinceClause, untilClause) {
  const query = `FROM sessions SINCE ${sinceClause} UNTIL ${untilClause} SHOW sessions`;
  const res = await fetch(`https://${SHOP}/admin/api/${VERSION}/graphql.json`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      query: `{
        shopifyqlQuery(query: ${JSON.stringify(query)}) {
          tableData { unformattedData { headers rows } }
          parseErrors { code message }
        }
      }`,
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const qd = json?.data?.shopifyqlQuery;
  if (qd?.parseErrors?.length) return null;
  const { headers: cols, rows } = qd?.tableData?.unformattedData ?? {};
  if (!cols || !rows?.length) return null;
  const si = cols.indexOf('sessions');
  if (si < 0) return null;
  return rows.reduce((sum, row) => sum + (parseFloat(row[si]) || 0), 0);
}

function pctDelta(current, prev) {
  if (!prev) return null;
  return parseFloat(((current - prev) / prev * 100).toFixed(1));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.SHOPIFY_CLIENT_SECRET;
  if (!token) return res.status(500).json({ error: 'SHOPIFY_CLIENT_SECRET is not set' });

  try {
    const now = new Date();
    const d30 = new Date(now - 30 * 86_400_000).toISOString();
    const d60 = new Date(now - 60 * 86_400_000).toISOString();

    const [curOrders, prevOrders, curSessions, prevSessions] = await Promise.all([
      fetchAllOrders(d30, null),
      fetchAllOrders(d60, d30),
      fetchSessionsFromShopifyQL('-30d', 'today').catch(() => null),
      fetchSessionsFromShopifyQL('-60d', '-30d').catch(() => null),
    ]);

    const revenue = curOrders.reduce((s, o) => s + parseFloat(o.total_price ?? 0), 0);
    const prevRevenue = prevOrders.reduce((s, o) => s + parseFloat(o.total_price ?? 0), 0);

    const convRate = curSessions > 0 ? (curOrders.length / curSessions) * 100 : null;
    const prevConvRate = prevSessions > 0 ? (prevOrders.length / prevSessions) * 100 : null;

    return res.status(200).json({
      sessions: curSessions != null ? Math.round(curSessions) : null,
      sessionsDelta: pctDelta(curSessions, prevSessions),
      revenue: parseFloat(revenue.toFixed(2)),
      revenueDelta: pctDelta(revenue, prevRevenue),
      orders: curOrders.length,
      ordersDelta: pctDelta(curOrders.length, prevOrders.length),
      conversionRate: convRate != null ? parseFloat(convRate.toFixed(2)) : null,
      conversionDelta: convRate != null ? pctDelta(convRate, prevConvRate) : null,
    });
  } catch (err) {
    console.error('[shopify-metrics]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
