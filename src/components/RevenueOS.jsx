import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Trophy, Package, RefreshCw, AlertCircle } from 'lucide-react';

const API = '';

function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(API + url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [url]);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: color || 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
      {sub && <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
      <AlertCircle size={20} style={{ marginBottom: 8, opacity: 0.4 }} />
      <div>{message}</div>
    </div>
  );
}

export default function RevenueOS() {
  const summary  = useFetch('/api/revenue/summary');
  const products = useFetch('/api/revenue/products');
  const winners  = useFetch('/api/revenue/winners');

  const [syncing,    setSyncing]    = useState(false);
  const [syncOutput, setSyncOutput] = useState(null);
  const [syncError,  setSyncError]  = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncOutput(null);
    setSyncError(null);
    try {
      const r = await fetch('/api/revenue/sync', { method: 'POST' });
      const d = await r.json();
      if (d.ok) {
        setSyncOutput(d.output);
        // Reload all panels
        summary.reload();
        products.reload();
        winners.reload();
      } else {
        setSyncError(d.error || 'Sync failed');
        setSyncOutput(d.output || '');
      }
    } catch (e) {
      setSyncError(e.message);
    } finally {
      setSyncing(false);
    }
  };

  const s = summary.data;
  const pList = products.data?.products || [];
  const wList = winners.data?.winners || [];

  const fmtRevenue = (n) => {
    if (n == null) return '—';
    return '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Header */}
      <div className="panel" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={16} color="var(--green)" />
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Revenue OS</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Intelligence Layer — Content → Sales</span>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6,
              background: syncing ? 'var(--bg-hover)' : 'rgba(57,211,83,0.12)',
              border: '1px solid rgba(57,211,83,0.3)',
              color: 'var(--green)', fontSize: 12, fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: syncing ? 0.7 : 1,
            }}
          >
            <RefreshCw size={12} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync Revenue'}
          </button>
        </div>

        {/* Sync output / error */}
        {(syncOutput || syncError) && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: syncError ? 'rgba(255,80,80,0.08)' : 'rgba(57,211,83,0.06)',
            border: `1px solid ${syncError ? 'rgba(255,80,80,0.3)' : 'rgba(57,211,83,0.2)'}`,
            borderRadius: 6, fontSize: 10, color: syncError ? '#ff5050' : 'var(--text-muted)',
            fontFamily: 'monospace', whiteSpace: 'pre-wrap', maxHeight: 160, overflowY: 'auto',
          }}>
            {syncError ? `Error: ${syncError}\n` : ''}{syncOutput}
          </div>
        )}
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {summary.loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '16px 20px', height: 80, opacity: 0.5 }} />
          ))
        ) : summary.error ? (
          <div style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: 12, padding: 8 }}>Failed to load summary: {summary.error}</div>
        ) : (
          <>
            <StatCard
              label="Total Revenue Tracked"
              value={fmtRevenue(s?.total_revenue)}
              sub={`${s?.campaign_count ?? 0} campaigns`}
              color="var(--green)"
            />
            <StatCard
              label="Winners Detected"
              value={s?.winner_count ?? 0}
              sub={`${s?.win_rate_pct ?? 0}% win rate`}
              color="var(--yellow)"
            />
            <StatCard
              label="Top Product"
              value={s?.top_product ? s.top_product.replace(/-/g, ' ') : '—'}
              sub="by attributed revenue"
            />
            <StatCard
              label="Active Campaigns"
              value={s?.campaign_count ?? 0}
              sub={`${s?.product_count ?? 0} products`}
            />
          </>
        )}
      </div>

      {/* Products table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title"><Package size={12} /> PRODUCTS</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{pList.length} tracked</span>
        </div>

        <div className="table-header" style={{ gridTemplateColumns: '1fr 80px 70px 60px 70px 60px' }}>
          <span>Product</span>
          <span>Store</span>
          <span>Price</span>
          <span>Runs</span>
          <span>Winners</span>
          <span>Status</span>
        </div>

        {products.loading && <EmptyState message="Loading products..." />}
        {!products.loading && pList.length === 0 && <EmptyState message="No products found in products.jsonl" />}
        {pList.map(p => (
          <div key={p.id} className="table-row" style={{ gridTemplateColumns: '1fr 80px 70px 60px 70px 60px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }}>{p.name}</span>
            <span style={{ fontSize: 10, color: 'var(--blue)', textTransform: 'uppercase', fontWeight: 700 }}>{p.store}</span>
            <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>${p.price}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.run_count ?? 0}</span>
            <span style={{ fontSize: 11, color: p.winner_count > 0 ? 'var(--yellow)' : 'var(--text-muted)' }}>
              {p.winner_count ?? 0} {p.winner_count > 0 ? '🏆' : ''}
            </span>
            <span className={`badge badge-${p.status === 'active' ? 'green' : 'muted'}`}>{p.status}</span>
          </div>
        ))}
      </div>

      {/* Winners list */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title"><Trophy size={12} /> WINNER CREATIVES</span>
          <span className={`badge badge-${wList.length > 0 ? 'yellow' : 'muted'}`}>{wList.length} detected</span>
        </div>

        {winners.loading && <EmptyState message="Loading winners..." />}
        {!winners.loading && wList.length === 0 && (
          <EmptyState message="No winners yet — run Sync Revenue once performance data arrives from Shopify/Gumroad." />
        )}

        {wList.length > 0 && (
          <>
            <div className="table-header" style={{ gridTemplateColumns: '1fr 120px 140px 100px 70px 100px' }}>
              <span>Run ID</span>
              <span>Product</span>
              <span>Trigger</span>
              <span>Revenue</span>
              <span>CTR</span>
              <span>Detected</span>
            </div>
            {wList.map((w, i) => (
              <div key={w.run_id || i} className="table-row" style={{ gridTemplateColumns: '1fr 120px 140px 100px 70px 100px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}>{w.run_id}</span>
                <span style={{ fontSize: 11, color: 'var(--text-primary)' }}>{w.product}</span>
                <span style={{ fontSize: 10, color: 'var(--yellow)', fontWeight: 600 }}>{w.trigger}</span>
                <span style={{ fontSize: 11, color: 'var(--green)' }}>{fmtRevenue(w.revenue)}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{w.ctr != null ? `${w.ctr}%` : '—'}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{w.detected_at ? w.detected_at.slice(0, 10) : '—'}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
