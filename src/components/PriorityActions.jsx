import { useState } from 'react';
import { Zap, AlertTriangle, Info, CheckCircle2, Circle, ShoppingBag, Video, Users, Server } from 'lucide-react';
import { priorityActions } from '../data';

const URGENCY = {
  critical: { color: 'var(--red)', bg: 'rgba(248,81,73,0.08)', label: 'CRITICAL', icon: <Zap size={11} /> },
  high: { color: 'var(--orange)', bg: 'rgba(219,109,40,0.08)', label: 'HIGH', icon: <AlertTriangle size={11} /> },
  medium: { color: 'var(--yellow)', bg: 'rgba(210,153,34,0.08)', label: 'MED', icon: <Info size={11} /> },
  low: { color: 'var(--text-muted)', bg: 'transparent', label: 'LOW', icon: <Circle size={11} /> },
};

const CATEGORY = {
  system: { icon: <Server size={10} />, label: 'System', cls: 'badge-orange' },
  store: { icon: <ShoppingBag size={10} />, label: 'Store', cls: 'badge-green' },
  content: { icon: <Video size={10} />, label: 'Content', cls: 'badge-blue' },
  leads: { icon: <Users size={10} />, label: 'Leads', cls: 'badge-purple' },
};

export default function PriorityActions() {
  const [done, setDone] = useState(new Set());

  const toggleDone = (id) => {
    setDone(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const critical = priorityActions.filter(a => a.urgency === 'critical').length;
  const high = priorityActions.filter(a => a.urgency === 'high').length;
  const remaining = priorityActions.length - done.size;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Zap size={12} style={{ color: 'var(--red)' }} />
          Priority Action List
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {critical > 0 && <span className="badge badge-red"><Zap size={9} /> {critical} Critical</span>}
          {high > 0 && <span className="badge badge-orange">{high} High</span>}
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{remaining} remaining · {done.size} done</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="progress-bar" style={{ flex: 1 }}>
          <div
            className="progress-fill"
            style={{ width: `${(done.size / priorityActions.length) * 100}%` }}
          />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {done.size}/{priorityActions.length} complete
        </span>
      </div>

      {priorityActions.map((action, idx) => {
        const u = URGENCY[action.urgency];
        const cat = CATEGORY[action.category];
        const isDone = done.has(action.id);

        return (
          <div
            key={action.id}
            className="action-item"
            style={{
              background: isDone ? 'transparent' : u.bg,
              opacity: isDone ? 0.45 : 1,
              transition: 'all 0.2s',
            }}
            onClick={() => toggleDone(action.id)}
          >
            {/* Urgency bar */}
            <div style={{ width: 3, borderRadius: 2, background: u.color, flexShrink: 0, alignSelf: 'stretch', minHeight: 16, opacity: isDone ? 0.3 : 1 }} />

            {/* Checkbox */}
            <div style={{ flexShrink: 0, marginTop: 1, color: isDone ? 'var(--green)' : 'var(--text-muted)' }}>
              {isDone ? <CheckCircle2 size={14} /> : <Circle size={14} />}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: u.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  flexShrink: 0
                }}>
                  {u.icon} {u.label}
                </span>
                <span className={`badge ${cat.cls}`} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {cat.icon} {cat.label}
                </span>
                <span style={{
                  color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: 12,
                  textDecoration: isDone ? 'line-through' : 'none',
                  flex: 1,
                  minWidth: 0
                }}>
                  {action.title}
                </span>
                <span style={{
                  fontSize: 10,
                  color: action.due === 'NOW' ? 'var(--red)' : 'var(--text-muted)',
                  fontWeight: action.due === 'NOW' ? 700 : 400,
                  flexShrink: 0
                }}>
                  {action.due}
                </span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.5 }}>
                {action.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
