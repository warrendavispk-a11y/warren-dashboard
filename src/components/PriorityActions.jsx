import { CheckSquare, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { priorityActions } from '../data.js';

const urgencyConfig = {
  critical: { icon: AlertCircle, color: 'var(--red)', badge: 'badge-red', label: 'CRITICAL' },
  high: { icon: AlertTriangle, color: 'var(--yellow)', badge: 'badge-yellow', label: 'HIGH' },
  medium: { icon: Info, color: 'var(--blue)', badge: 'badge-blue', label: 'MEDIUM' },
  low: { icon: CheckSquare, color: 'var(--text-muted)', badge: 'badge-muted', label: 'LOW' },
};

export default function PriorityActions() {
  const grouped = ['critical', 'high', 'medium', 'low'].map(u => ({
    urgency: u,
    items: priorityActions.filter(a => a.urgency === u),
  })).filter(g => g.items.length > 0);

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><CheckSquare size={12} /> PRIORITY ACTIONS</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge badge-red">{priorityActions.filter(a => a.urgency === 'critical').length} critical</span>
          <span className="badge badge-yellow">{priorityActions.filter(a => a.urgency === 'high').length} high</span>
        </div>
      </div>

      {grouped.map(({ urgency, items }) => {
        const { icon: Icon, color, badge, label } = urgencyConfig[urgency];
        return (
          <div key={urgency}>
            <div style={{ padding: '6px 14px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon size={10} style={{ color }} />
              <span style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: '0.08em' }}>{label}</span>
            </div>
            {items.map(action => (
              <div key={action.id} className="action-item">
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', marginTop: 3, flexShrink: 0,
                  background: color, boxShadow: `0 0 4px ${color}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{action.title}</span>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{action.due}</span>
                      <span className={`badge ${badge}`}>{action.category}</span>
                    </div>
                  </div>
                  <p style={{ margin: '3px 0 0', color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.5 }}>{action.detail}</p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
