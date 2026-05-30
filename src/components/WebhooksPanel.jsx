import { useState, useEffect } from 'react';
import { Zap, RefreshCw, Copy, CheckCircle } from 'lucide-react';

const SOURCE_COLORS = { shopify: 'var(--green)', gumroad: '#ff90e8' };

export default function WebhooksPanel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/webhooks');
      const d = await r.json();
      setEvents(d.events || []);
    } finally {
      setLoading(false);
      setLastFetch(new Date());
    }
  };

  useEffect(() => { load(); }, []);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const syncLabel = lastFetch
    ? `Synced ${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  const shopifyUrl = `${window.location.origin}/api/webhooks/shopify`;
  const gumroadUrl = `${window.location.origin}/api/webhooks/gumroad`;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Zap size={12} style={{ color: 'var(--yellow)' }} />
          Webhook Queue
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{syncLabel}</span>
          <button onClick={load} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4 }}>
            <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
          </button>
        </div>
      </div>

      {/* Endpoint URLs */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Webhook Endpoints</div>
        {[
          { label: 'Shopify', url: shopifyUrl, color: 'var(--green)' },
          { label: 'Gumroad', url: gumroadUrl, color: '#ff90e8' },
        ].map(({ label, url, color }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color, fontWeight: 700, width: 55, flexShrink: 0 }}>{label}</span>
            <code style={{ fontSize: 10, color: 'var(--text-secondary)', background: 'var(--bg-base)', padding: '2px 6px', borderRadius: 3, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</code>
            <button onClick={() => copy(url, label)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === label ? 'var(--green)' : 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4, flexShrink: 0 }}>
              {copied === label ? <CheckCircle size={11} /> : <Copy size={11} />}
            </button>
          </div>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 20 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Total: <strong style={{ color: 'var(--text-primary)' }}>{events.length}</strong>
        </span>
        {['shopify', 'gumroad'].map(src => (
          <span key={src} style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            <span style={{ color: SOURCE_COLORS[src], fontWeight: 700, textTransform: 'capitalize' }}>{src}</span>:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{events.filter(e => e.source === src).length}</strong>
          </span>
        ))}
      </div>

      {/* Events table */}
      <div className="table-header" style={{ gridTemplateColumns: '90px 80px 1fr 130px' }}>
        <span>Source</span>
        <span>Topic</span>
        <span>ID</span>
        <span>Received</span>
      </div>

      {loading && [1,2,3].map(i => (
        <div key={i} className="table-row" style={{ gridTemplateColumns: '90px 80px 1fr 130px' }}>
          {[60,70,50,80].map((w,j) => (
            <div key={j} style={{ height: 11, width: `${w}%`, background: 'var(--bg-hover)', borderRadius: 3 }} />
          ))}
        </div>
      ))}

      {!loading && events.length === 0 && (
        <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          No webhooks received yet. Add the endpoints above to Shopify and Gumroad.
        </div>
      )}

      {!loading && events.map(e => (
        <div key={e.id}>
          <div
            className="table-row"
            style={{ gridTemplateColumns: '90px 80px 1fr 130px', cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === e.id ? null : e.id)}
          >
            <span style={{ color: SOURCE_COLORS[e.source] || 'var(--text-secondary)', fontWeight: 700, fontSize: 11, textTransform: 'capitalize' }}>{e.source}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{e.topic}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)' }}>{e.id?.slice(0, 8)}…</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(e.received).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {expanded === e.id && (
            <div style={{ padding: '8px 14px', background: 'var(--bg-base)', borderBottom: '1px solid var(--border)' }}>
              <pre style={{ fontSize: 10, color: 'var(--text-secondary)', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {(() => { try { return JSON.stringify(JSON.parse(e.payload), null, 2); } catch { return e.payload; } })()}
              </pre>
            </div>
          )}
        </div>
      ))}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
