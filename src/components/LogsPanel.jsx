import { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, AlertCircle } from 'lucide-react';

const GROUP_LABELS = { hermes: 'Hermes', system: 'System', cron: 'Cron Jobs' };

export default function LogsPanel() {
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState('errors');
  const [lines, setLines] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch('/api/logs/sources').then(r => r.json()).then(d => setSources(d.sources || []));
  }, []);

  const load = async (src = activeSource) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/logs?source=${src}&lines=150`);
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setLines(d.lines || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLastFetch(new Date());
    }
  };

  useEffect(() => { load(activeSource); }, [activeSource]);

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => load(activeSource), 10000);
    }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, activeSource]);

  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, loading]);

  const groups = {};
  sources.forEach(s => { (groups[s.group] = groups[s.group] || []).push(s); });

  const syncLabel = lastFetch
    ? `${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    : '—';

  function lineColor(line) {
    if (/ERROR|CRITICAL|error/i.test(line)) return 'var(--red)';
    if (/WARNING|WARN/i.test(line)) return 'var(--yellow)';
    if (/INFO/i.test(line)) return 'var(--text-secondary)';
    return 'var(--text-muted)';
  }

  return (
    <div className="panel" style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="panel-header" style={{ flexShrink: 0 }}>
        <div className="panel-title">
          <Terminal size={12} style={{ color: 'var(--green)' }} />
          Log Viewer
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} style={{ width: 11, height: 11 }} />
            Auto 10s
          </label>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{syncLabel}</span>
          <button onClick={() => load()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4 }}>
            <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 180, flexShrink: 0, borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '8px 0' }}>
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', padding: '6px 12px 3px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                {GROUP_LABELS[group] || group}
              </div>
              {items.map(s => (
                <button
                  key={s.id}
                  onClick={() => setActiveSource(s.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '5px 12px',
                    background: activeSource === s.id ? 'var(--bg-hover)' : 'transparent',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    color: activeSource === s.id ? 'var(--green)' : 'var(--text-secondary)',
                    fontSize: 11, fontWeight: activeSource === s.id ? 600 : 400,
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</div>
                  {s.schedule && <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.schedule}</div>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Log output */}
        <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'monospace', fontSize: 11, padding: '10px 14px', background: 'var(--bg-base)' }}>
          {error && (
            <div style={{ display: 'flex', gap: 8, color: 'var(--red)', marginBottom: 8 }}>
              <AlertCircle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}
          {loading && !error && <div style={{ color: 'var(--text-muted)' }}>Loading…</div>}
          {!loading && !error && lines.length === 0 && (
            <div style={{ color: 'var(--text-muted)' }}>No log output found for this source.</div>
          )}
          {!loading && lines.map((line, i) => (
            <div key={i} style={{ color: lineColor(line), lineHeight: 1.5, wordBreak: 'break-all' }}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
