import { Cpu, ExternalLink } from 'lucide-react';
import { systemStatus } from '../data.js';

const statusDot = { online: 'dot-green', live: 'dot-green', degraded: 'dot-yellow', offline: 'dot-red' };
const statusBadge = { online: 'badge-green', live: 'badge-green', degraded: 'badge-yellow', offline: 'badge-red' };

export default function SystemStatus() {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><Cpu size={12} /> SYSTEM STATUS</span>
        <span className="badge badge-green">{systemStatus.filter(s => s.status === 'online' || s.status === 'live').length}/{systemStatus.length} Online</span>
      </div>

      <div className="table-header" style={{ gridTemplateColumns: '2fr 2fr 1fr 80px 80px' }}>
        <span>Service</span>
        <span>Host</span>
        <span>Detail</span>
        <span>Last Check</span>
        <span>Status</span>
      </div>

      {systemStatus.map(s => (
        <div key={s.id} className="table-row" style={{ gridTemplateColumns: '2fr 2fr 1fr 80px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`dot ${statusDot[s.status] || 'dot-muted'} ${s.status === 'online' || s.status === 'live' ? 'pulse' : ''}`} />
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
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{s.lastCheck}</span>
          <span className={`badge ${statusBadge[s.status] || 'badge-muted'}`}>{s.status}</span>
        </div>
      ))}
    </div>
  );
}
