import { TrendingUp, TrendingDown, ShoppingBag, Image, FileText, AlertCircle } from 'lucide-react';
import { shopifyMetrics, products } from '../data';

function StatCard({ metric }) {
  const isUp = metric.delta > 0;
  return (
    <div className="stat-card">
      <div className="stat-label">{metric.label}</div>
      <div className="stat-value">{metric.value}</div>
      <div className={`stat-delta ${isUp ? 'delta-up' : 'delta-down'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {isUp ? '+' : ''}{metric.delta}% vs last 7d
      </div>
    </div>
  );
}

function StatusPill({ ok, label }) {
  if (ok) {
    return <span className="badge badge-green">{label} ✓</span>;
  }
  return <span className="badge badge-red">{label} ✗</span>;
}

export default function ShopifyPanel() {
  const metrics = Object.values(shopifyMetrics);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShoppingBag size={12} style={{ color: 'var(--green)' }} />
          Shopify Store
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="dot dot-green pulse" />
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Live · Last sync 2m ago</span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 12 }}>
        {metrics.map(m => <StatCard key={m.label} metric={m} />)}
      </div>

      {/* Product table */}
      <div className="table-header" style={{ gridTemplateColumns: '2fr 80px 60px 60px 70px 80px 80px' }}>
        <span>Product</span>
        <span>SKU</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Image</span>
        <span>Desc</span>
        <span>Revenue</span>
      </div>

      {products.map(p => (
        <div
          key={p.id}
          className="table-row"
          style={{ gridTemplateColumns: '2fr 80px 60px 60px 70px 80px 80px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="dot"
              style={{
                background: p.status === 'active' ? 'var(--green)' : 'var(--text-muted)',
                flexShrink: 0
              }}
            />
            <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{p.name}</span>
          </div>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.sku}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{p.price}</span>
          <span style={{
            color: p.stock === 0 ? 'var(--red)' : p.stock < 15 ? 'var(--yellow)' : 'var(--text-secondary)',
            fontWeight: p.stock < 15 ? 700 : 400
          }}>
            {p.stock === 0 ? '⚠ 0' : p.stock}
          </span>
          <span>
            {p.image
              ? <span className="badge badge-green"><Image size={9} /> OK</span>
              : <span className="badge badge-red"><AlertCircle size={9} /> Missing</span>
            }
          </span>
          <span>
            {p.description
              ? <span className="badge badge-green"><FileText size={9} /> OK</span>
              : <span className="badge badge-red"><AlertCircle size={9} /> Missing</span>
            }
          </span>
          <span style={{ color: 'var(--green)', fontWeight: 600 }}>{p.revenue}</span>
        </div>
      ))}
    </div>
  );
}
