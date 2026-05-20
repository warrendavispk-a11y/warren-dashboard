import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, ShoppingBag,
  Image, FileText, AlertCircle, RefreshCw,
} from 'lucide-react';

function StatCard({ label, value, delta, loading, unavailable }) {
  if (loading) {
    return (
      <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div style={{ height: 22, width: '55%', background: 'var(--bg-hover)', borderRadius: 4, margin: '4px 0' }} />
        <div style={{ height: 10, width: '75%', background: 'var(--bg-hover)', borderRadius: 3 }} />
      </div>
    );
  }

  if (unavailable || value == null) {
    return (
      <div className="stat-card">
        <div className="stat-label">{label}</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1, margin: '4px 0' }}>N/A</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>requires read_analytics</div>
      </div>
    );
  }

  const isUp = delta > 0;
  const isDown = delta < 0;
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {delta != null ? (
        <div className={`stat-delta ${isUp ? 'delta-up' : isDown ? 'delta-down' : ''}`}
          style={!isUp && !isDown ? { color: 'var(--text-muted)' } : undefined}>
          {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : null}
          {delta > 0 ? '+' : ''}{delta}% vs prev 30d
        </div>
      ) : (
        <div className="stat-delta" style={{ color: 'var(--text-muted)' }}>no prior data</div>
      )}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="table-row" style={{ gridTemplateColumns: '2fr 90px 60px 60px 70px 90px 70px' }}>
      {[80, 60, 40, 40, 55, 55, 50].map((w, i) => (
        <div key={i} style={{ height: 11, width: `${w}%`, background: 'var(--bg-hover)', borderRadius: 3 }} />
      ))}
    </div>
  );
}

const GRID = '2fr 90px 60px 60px 70px 90px 70px';

export default function ShopifyPanel() {
  const [metrics, setMetrics] = useState(null);
  const [products, setProducts] = useState(null);
  const [metricsErr, setMetricsErr] = useState(null);
  const [productsErr, setProductsErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const load = async () => {
    setLoading(true);
    setMetricsErr(null);
    setProductsErr(null);

    await Promise.all([
      fetch('/api/shopify-metrics')
        .then(r => r.json())
        .then(d => d.error ? setMetricsErr(d.error) : setMetrics(d))
        .catch(e => setMetricsErr(e.message)),

      fetch('/api/shopify-products')
        .then(r => r.json())
        .then(d => d.error ? setProductsErr(d.error) : setProducts(d.products))
        .catch(e => setProductsErr(e.message)),
    ]);

    setLoading(false);
    setLastFetch(new Date());
  };

  useEffect(() => { load(); }, []);

  const fmtRevenue = v => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtNum    = v => v.toLocaleString('en-US');
  const fmtRate   = v => `${v.toFixed(2)}%`;

  const kpis = [
    {
      label: 'Sessions (30d)',
      value: metrics?.sessions != null ? fmtNum(metrics.sessions) : null,
      delta: metrics?.sessionsDelta ?? null,
      unavailable: metrics != null && metrics.sessions == null,
    },
    {
      label: 'Revenue (30d)',
      value: metrics?.revenue != null ? fmtRevenue(metrics.revenue) : null,
      delta: metrics?.revenueDelta ?? null,
    },
    {
      label: 'Orders (30d)',
      value: metrics?.orders != null ? fmtNum(metrics.orders) : null,
      delta: metrics?.ordersDelta ?? null,
    },
    {
      label: 'Conv. Rate',
      value: metrics?.conversionRate != null ? fmtRate(metrics.conversionRate) : null,
      delta: metrics?.conversionDelta ?? null,
      unavailable: metrics != null && metrics.conversionRate == null,
    },
  ];

  const syncLabel = lastFetch
    ? `Synced ${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  return (
    <div className="panel">
      {/* Header */}
      <div className="panel-header">
        <div className="panel-title">
          <ShoppingBag size={12} style={{ color: 'var(--green)' }} />
          Shopify Store
          <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            300000000000000009141.myshopify.com
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`dot ${loading ? 'dot-yellow pulse' : metricsErr && productsErr ? 'dot-red' : 'dot-green'}`} />
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{syncLabel}</span>
          <button onClick={load} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4 }} title="Refresh">
            <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
          </button>
        </div>
      </div>

      {/* API error banner */}
      {metricsErr && (
        <div style={{ padding: '7px 14px', background: 'rgba(248,81,73,0.08)', borderBottom: '1px solid rgba(248,81,73,0.2)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <AlertCircle size={12} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--red)' }}>Metrics: </strong>{metricsErr}
          </span>
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 12 }}>
        {kpis.map(k => (
          <StatCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            loading={loading && !metricsErr}
            unavailable={k.unavailable}
          />
        ))}
      </div>

      {/* Products table */}
      <div className="table-header" style={{ gridTemplateColumns: GRID }}>
        <span>Product</span>
        <span>SKU</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Image</span>
        <span>Description</span>
        <span>Status</span>
      </div>

      {productsErr && (
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={12} style={{ color: 'var(--red)' }} />
          <span style={{ fontSize: 12, color: 'var(--red)' }}>Products: {productsErr}</span>
        </div>
      )}

      {loading && !productsErr && <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>}

      {!loading && !productsErr && products?.length === 0 && (
        <div style={{ padding: '14px', color: 'var(--text-muted)', fontSize: 12 }}>No products found.</div>
      )}

      {!loading && !productsErr && products?.map(p => (
        <div key={p.id} className="table-row" style={{ gridTemplateColumns: GRID }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span className="dot" style={{ background: p.status === 'active' ? 'var(--green)' : 'var(--text-muted)', flexShrink: 0 }} />
            <span style={{ color: 'var(--text-primary)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name}
            </span>
          </div>

          <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 11 }}>{p.sku}</span>

          <span style={{ color: 'var(--text-secondary)' }}>{p.price}</span>

          <span style={{
            color: p.stock === 0 ? 'var(--red)' : p.stock < 10 ? 'var(--yellow)' : 'var(--text-secondary)',
            fontWeight: p.stock < 10 ? 700 : 400,
          }}>
            {p.stock === 0 ? '⚠ 0' : p.stock}
          </span>

          <span>
            {p.image
              ? <span className="badge badge-green"><Image size={9} /> OK</span>
              : <span className="badge badge-red"><AlertCircle size={9} /> Missing</span>}
          </span>

          <span>
            {p.description
              ? <span className="badge badge-green"><FileText size={9} /> OK</span>
              : <span className="badge badge-red"><AlertCircle size={9} /> Missing</span>}
          </span>

          <span>
            {p.status === 'active'   && <span className="badge badge-green">Active</span>}
            {p.status === 'draft'    && <span className="badge badge-muted">Draft</span>}
            {p.status === 'archived' && <span className="badge badge-orange">Archived</span>}
          </span>
        </div>
      ))}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
