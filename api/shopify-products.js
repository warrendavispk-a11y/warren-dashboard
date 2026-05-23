const SHOP = 'my-store-300000000000000009141.myshopify.com';
const VERSION = '2026-04';
const BASE = `https://${SHOP}/admin/api/${VERSION}`;

function headers() {
  return {
    'X-Shopify-Access-Token': process.env.SHOPIFY_CLIENT_SECRET,
    'Content-Type': 'application/json',
  };
}

function hasDescription(html) {
  if (!html) return false;
  return html.replace(/<[^>]*>/g, '').trim().length > 10;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.SHOPIFY_CLIENT_SECRET;
  if (!token) return res.status(500).json({ error: 'SHOPIFY_CLIENT_SECRET is not set' });

  try {
    const products = [];
    let url = `${BASE}/products.json?limit=250&fields=id,title,variants,images,body_html,status`;

    while (url) {
      const resp = await fetch(url, { headers: headers() });
      if (resp.status === 401) throw new Error('Invalid access token (401) — verify SHOPIFY_CLIENT_SECRET');
      if (resp.status === 403) throw new Error('Missing read_products scope (403)');
      if (!resp.ok) throw new Error(`Shopify products API returned ${resp.status}`);
      const data = await resp.json();
      products.push(...(data.products ?? []));
      const link = resp.headers.get('Link') ?? '';
      url = link.match(/<([^>]+)>;\s*rel="next"/)?.[1] ?? null;
    }

    const mapped = products.map(p => {
      const firstVariant = p.variants?.[0] ?? {};
      const stock = (p.variants ?? []).reduce(
        (s, v) => s + (v.inventory_quantity ?? 0),
        0,
      );
      return {
        id: p.id,
        name: p.title,
        sku: firstVariant.sku || '—',
        price: `$${parseFloat(firstVariant.price ?? 0).toFixed(2)}`,
        stock,
        image: (p.images?.length ?? 0) > 0,
        description: hasDescription(p.body_html),
        status: p.status, // 'active' | 'draft' | 'archived'
      };
    });

    return res.status(200).json({ products: mapped });
  } catch (err) {
    console.error('[shopify-products]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
