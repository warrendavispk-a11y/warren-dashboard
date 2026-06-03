import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Image, ChevronDown, ChevronUp } from 'lucide-react';

const RATIO_ORDER = ['1:1', '4:5', '9:16', '2:3', '3:4', '16:9'];
const PLATFORM_COLORS = {
  tiktok: 'var(--red)', instagram: 'var(--purple)', pinterest: 'var(--orange)',
  twitter: 'var(--blue)', x: 'var(--blue)', youtube: 'var(--red)',
};

function RunCard({ run, onApprove }) {
  const [expanded, setExpanded] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(run.approved);
  const [activeImage, setActiveImage] = useState(null);

  const ratios = RATIO_ORDER.filter(r => run.images[r]);
  useEffect(() => { if (ratios.length) setActiveImage(ratios[0]); }, [run.run_id]);

  async function handleApprove() {
    setApproving(true);
    try {
      const res = await fetch(`/api/assets/${run.run_id}/approve`, { method: 'POST' });
      if (res.ok) { setApproved(true); onApprove(run.run_id); }
    } finally {
      setApproving(false);
    }
  }

  const platformColor = PLATFORM_COLORS[run.platform?.toLowerCase()] || 'var(--text-muted)';
  const hooks = Array.isArray(run.hooks) ? run.hooks.slice(0, 3) : [];
  const captions = Array.isArray(run.captions) ? run.captions.slice(0, 2) : [];

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div className="panel-header" style={{ flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span className="panel-title" style={{ textTransform: 'none', fontSize: 11 }}>
            {run.product}
          </span>
          {run.platform && (
            <span style={{ fontSize: 9, fontWeight: 700, color: platformColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {run.platform}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{run.date}</span>
          {approved ? (
            <span className="badge badge-green" style={{ fontSize: 9 }}>
              <CheckCircle size={9} style={{ marginRight: 3 }} />APPROVED
            </span>
          ) : (
            <span className="badge badge-yellow" style={{ fontSize: 9 }}>
              <Clock size={9} style={{ marginRight: 3 }} />PENDING
            </span>
          )}
        </div>
      </div>

      {/* Image viewer */}
      <div style={{ background: 'var(--bg-base)', position: 'relative' }}>
        {activeImage && run.images[activeImage] ? (
          <img
            src={run.images[activeImage]}
            alt={`${run.product} ${activeImage}`}
            style={{ width: '100%', display: 'block', maxHeight: 280, objectFit: 'contain', background: '#111' }}
          />
        ) : (
          <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <Image size={32} />
          </div>
        )}
        {/* Ratio selector */}
        {ratios.length > 1 && (
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
            {ratios.map(r => (
              <button
                key={r}
                onClick={() => setActiveImage(r)}
                style={{
                  padding: '2px 7px', fontSize: 9, fontWeight: 700, borderRadius: 4, cursor: 'pointer', border: 'none',
                  background: activeImage === r ? 'var(--green)' : 'rgba(0,0,0,0.6)',
                  color: activeImage === r ? '#000' : 'var(--text-muted)',
                }}
              >{r}</button>
            ))}
          </div>
        )}
      </div>

      {/* Hooks preview */}
      {hooks.length > 0 && (
        <div style={{ padding: '10px 16px 4px' }}>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Hooks
          </div>
          {hooks.map((h, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.4, paddingLeft: 8, borderLeft: '2px solid var(--border)' }}>
              {typeof h === 'object' ? h.hook || h.text || JSON.stringify(h) : h}
            </div>
          ))}
        </div>
      )}

      {/* Expand / collapse */}
      {(captions.length > 0 || run.ad_copy) && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 10 }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Less' : 'Captions & copy'}
          </button>
          {expanded && (
            <div style={{ padding: '0 16px 10px' }}>
              {captions.map((c, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5, padding: '8px 10px', background: 'var(--bg-base)', borderRadius: 4 }}>
                  {typeof c === 'object' ? c.caption || c.text || JSON.stringify(c) : c}
                </div>
              ))}
              {run.ad_copy && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, padding: '8px 10px', background: 'var(--bg-base)', borderRadius: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Ad: </span>
                  {typeof run.ad_copy === 'object' ? JSON.stringify(run.ad_copy) : run.ad_copy}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Approve button */}
      <div style={{ padding: '10px 16px 14px', marginTop: 'auto' }}>
        <button
          onClick={handleApprove}
          disabled={approved || approving}
          style={{
            width: '100%', padding: '8px 0', fontSize: 11, fontWeight: 700, borderRadius: 6,
            border: 'none', cursor: approved ? 'default' : 'pointer',
            background: approved ? 'var(--bg-card)' : 'var(--green)',
            color: approved ? 'var(--text-muted)' : '#000',
            letterSpacing: '0.04em',
          }}
        >
          {approving ? 'Approving…' : approved ? '✓ Approved' : 'Approve'}
        </button>
      </div>
    </div>
  );
}

export default function AssetGallery() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/assets')
      .then(r => r.json())
      .then(d => { setRuns(d.runs || []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  function handleApprove(runId) {
    setRuns(prev => prev.map(r => r.run_id === runId ? { ...r, approved: true } : r));
  }

  const filtered = filter === 'approved'
    ? runs.filter(r => r.approved)
    : filter === 'pending'
    ? runs.filter(r => !r.approved)
    : runs;

  const approvedCount = runs.filter(r => r.approved).length;

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 1, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
          {['all', 'pending', 'approved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 12px', fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer',
                background: filter === f ? 'var(--green)' : 'var(--bg-card)',
                color: filter === f ? '#000' : 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}
            >{f}</button>
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {runs.length} runs · {approvedCount} approved
        </span>
      </div>

      {/* Grid */}
      {loading && (
        <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 24 }}>Loading assets…</div>
      )}
      {error && (
        <div style={{ color: 'var(--red)', fontSize: 12, padding: 24 }}>Error: {error}</div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: 12, padding: 24 }}>
          {runs.length === 0
            ? 'No runs yet. Run the pipeline to generate your first batch.'
            : `No ${filter} runs.`}
        </div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
      }}>
        {filtered.map(run => (
          <RunCard key={run.run_id} run={run} onApprove={handleApprove} />
        ))}
      </div>
    </div>
  );
}
