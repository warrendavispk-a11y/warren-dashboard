import { Server, Cpu, MemoryStick, HardDrive, Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { systemStatus } from '../data';

function UsageBar({ value, label, icon }) {
  if (value == null) return <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>N/A</span>;
  const fillClass = value > 80 ? 'progress-fill-red' : value > 60 ? 'progress-fill-yellow' : 'progress-fill';
  const color = value > 80 ? 'var(--red)' : value > 60 ? 'var(--yellow)' : 'var(--green)';
  return (
    <div style={{ minWidth: 70 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon} {label}
        </span>
        <span style={{ fontSize: 10, color, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <div className={fillClass} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  online: { dot: 'dot-green', badge: 'badge-green', label: 'Online', icon: <Wifi size={10} /> },
  degraded: { dot: 'dot-yellow', badge: 'badge-yellow', label: 'Degraded', icon: <AlertTriangle size={10} /> },
  offline: { dot: 'dot-red', badge: 'badge-red', label: 'Offline', icon: <WifiOff size={10} /> },
};

export default function SystemStatus() {
  const online = systemStatus.filter(s => s.status === 'online').length;
  const degraded = systemStatus.filter(s => s.status === 'degraded').length;
  const offline = systemStatus.filter(s => s.status === 'offline').length;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Server size={12} style={{ color: 'var(--orange)' }} />
          System Status
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="badge badge-green">{online} Online</span>
          {degraded > 0 && <span className="badge badge-yellow">{degraded} Degraded</span>}
          {offline > 0 && <span className="badge badge-red">{offline} Down</span>}
          <span style={{ color: 'var(--text-muted)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 3 }}>
            <RefreshCw size={9} /> Live
          </span>
        </div>
      </div>

      <div className="table-header" style={{ gridTemplateColumns: '1.2fr 1fr 90px 70px 220px 70px' }}>
        <span>Service</span>
        <span>Host</span>
        <span>Location</span>
        <span>Uptime</span>
        <span>Resources</span>
        <span>Last Check</span>
      </div>

      {systemStatus.map(svc => {
        const sc = STATUS_CONFIG[svc.status];
        return (
          <div
            key={svc.id}
            className="table-row"
            style={{ gridTemplateColumns: '1.2fr 1fr 90px 70px 220px 70px' }}
          >
            {/* Service name + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`dot ${sc.dot} ${svc.status === 'online' ? 'pulse' : ''}`} />
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 12 }}>{svc.name}</div>
                <span className={`badge ${sc.badge}`} style={{ marginTop: 2 }}>{sc.label}</span>
              </div>
            </div>

            {/* Host */}
            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {svc.host}
            </span>

            {/* Location */}
            <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{svc.location}</span>

            {/* Uptime */}
            <span style={{ color: svc.uptime === '100%' ? 'var(--green)' : svc.uptime > '99%' ? 'var(--text-secondary)' : 'var(--yellow)', fontWeight: 600 }}>
              {svc.uptime}
            </span>

            {/* Resources */}
            <div style={{ display: 'flex', gap: 10 }}>
              <UsageBar value={svc.cpu} label="CPU" icon={<Cpu size={8} />} />
              <UsageBar value={svc.ram} label="RAM" icon={<MemoryStick size={8} />} />
              <UsageBar value={svc.disk} label="Disk" icon={<HardDrive size={8} />} />
            </div>

            {/* Last check */}
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{svc.lastCheck}</span>
          </div>
        );
      })}
    </div>
  );
}
