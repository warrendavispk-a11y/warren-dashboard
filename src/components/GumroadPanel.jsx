import { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

export default function GumroadPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/gumroad-metrics');
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLastFetch(new Date());
    }
  };

  useEffect(() => { load(); }, []);

  const syncLabel = lastFetch
    ? `Synced ${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  const kpis = data ? [
    { label: 'Products Live', value: data.products.filter(p => p.published).length + ' / ' + data.productCount },
    { label: 'Total Sales', value: data.ordersCount },
    { label: 'Total Revenue', value: `$${data.totalRevenue.toFixed(2)}` },
  ] : [];

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <ShoppingBag size={12} style={{ color: '#ff90e8' }} />
          Gumroad Store
          <span style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            thedigitalblueprint1.gumroad.com
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`dot ${loading ? 'dot-yellow pulse' : error ? 'dot-red' : 'dot-green'}`} />
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{syncLabel}</span>
          <button onClick={load} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4 }}>
            <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '7px 14px', background: 'rgba(248,81,73,0.08)', borderBottom: '1px solid rgba(248,81,73,0.2)', display: 'flex', gap: 8 }}>
          <AlertCircle size={12} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{error}</span>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 12 }}>
        {loading ? [1,2,3].map(i => (
          <div key={i} className="stat-card">
            <div style={{ height: 10, width: '60%', background: 'var(--bg-hover)', borderRadius: 3, marginBottom: 6 }} />
            <div style={{ height: 20, width: '45%', background: 'var(--bg-hover)', borderRadius: 4 }} />
          </div>
        )) : kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div className="stat-label">{k.label}</div>
            <div className="stat-value" style={{ fontSize: 18 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className="table-header" style={{ gridTemplateColumns: '2fr 70px 60px 80px' }}>
        <span>Product</span>
        <span>Price</span>
        <span>Sales</span>
        <span>Status</span>
      </div>

      {loading && [1,2,3].map(i => (
        <div key={i} className="table-row" style={{ gridTemplateColumns: '2fr 70px 60px 80px' }}>
          {[70,40,30,50].map((w,j) => (
            <div key={j} style={{ height: 11, width: `${w}%`, background: 'var(--bg-hover)', borderRadius: 3 }} />
          ))}
        </div>
      ))}

      {!loading && !error && data?.products.map(p => (
        <div key={p.id} className="table-row" style={{ gridTemplateColumns: '2fr 70px 60px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span className="dot" style={{ background: p.published ? 'var(--green)' : 'var(--text-muted)', flexShrink: 0 }} />
            <a href={p.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-primary)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              {p.name}
              <ExternalLink size={9} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </a>
          </div>
          <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 12 }}>${p.price.toFixed(2)}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.sales_count}</span>
          <span>
            {p.published
              ? <span className="badge badge-green">Published</span>
              : <span className="badge badge-muted">Draft</span>}
          </span>
        </div>
      ))}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
