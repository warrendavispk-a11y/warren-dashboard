import { Cpu, ExternalLink } from 'lucide-react';
import { systemStatus } from '../data.js';
import { useServiceHealth } from '../hooks/useServiceHealth';

const statusDot = { online: 'dot-green', live: 'dot-green', checking: 'dot-yellow', offline: 'dot-red', degraded: 'dot-yellow' };
const statusBadge = { online: 'badge-green', live: 'badge-green', checking: 'badge-yellow', offline: 'badge-red', degraded: 'badge-yellow' };

function fmtTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Separate component so each hook call is at the top level
function ServiceRow({ s, liveStatus, liveChecked }) {
  const resolved = liveStatus || s.status;
  const lastCheck = liveChecked ? fmtTime(liveChecked) : s.lastCheck;
  const isActive = resolved === 'online' || resolved === 'live';
  const dotCls = statusDot[resolved] || 'dot-muted';

  return (
    <div key={s.id} className="table-row" style={{ gridTemplateColumns: '2fr 2fr 1fr 90px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={`dot ${dotCls} ${isActive ? 'pulse' : ''}`} />
        <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600 }}>{s.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace' }}>{s.host}</span>
        {s.url && (
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', display: 'flex' }}>
            <ExternalLink size={10} />
          </a>
        )}
      </div>
      <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{s.detail}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{lastCheck}</span>
      <span className={`badge ${statusBadge[resolved] || 'badge-muted'}`}>{resolved}</span>
    </div>
  );
}

function LiveServiceRow({ s }) {
  const { status, lastChecked } = useServiceHealth(s.url, 30000);
  return <ServiceRow s={s} liveStatus={status} liveChecked={lastChecked} />;
}

function StaticServiceRow({ s }) {
  return <ServiceRow s={s} liveStatus={null} liveChecked={null} />;
}

export default function SystemStatus() {
  const onlineCount = systemStatus.filter(s => s.status === 'online' || s.status === 'live').length;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><Cpu size={12} /> SYSTEM STATUS</span>
        <span className="badge badge-green">{onlineCount}/{systemStatus.length} Online</span>
      </div>

      <div className="table-header" style={{ gridTemplateColumns: '2fr 2fr 1fr 90px 80px' }}>
        <span>Service</span>
        <span>Host</span>
        <span>Detail</span>
        <span>Last Check</span>
        <span>Status</span>
      </div>

      {systemStatus.map(s =>
        s.url
          ? <LiveServiceRow key={s.id} s={s} />
          : <StaticServiceRow key={s.id} s={s} />
      )}
    </div>
  );
}
