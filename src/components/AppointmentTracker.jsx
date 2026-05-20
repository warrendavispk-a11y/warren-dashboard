import { Link2, Phone, Calendar, MessageSquare, User, ChevronRight } from 'lucide-react';
import { appointments } from '../data';

const STATUS_MAP = {
  confirmed: { label: 'Confirmed', cls: 'badge-green' },
  responded: { label: 'Responded', cls: 'badge-blue' },
  pending: { label: 'Pending', cls: 'badge-yellow' },
};

const TYPE_MAP = {
  linkedin_lead: { label: 'LinkedIn', icon: <Linkedin size={11} />, color: 'var(--blue)' },
  scheduled_call: { label: 'Call', icon: <Phone size={11} />, color: 'var(--green)' },
};

export default function AppointmentTracker() {
  const leads = appointments.filter(a => a.type === 'linkedin_lead');
  const calls = appointments.filter(a => a.type === 'scheduled_call');
  const pending = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Calendar size={12} style={{ color: 'var(--purple)' }} />
          Appointments & Leads
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-blue">{leads.length} LinkedIn</span>
          <span className="badge badge-green">{calls.length} Calls</span>
          {pending > 0 && <span className="badge badge-yellow">{pending} Pending</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        {/* LinkedIn Leads */}
        <div style={{ borderRight: '1px solid var(--border)' }}>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Link2 size={10} /> LinkedIn Leads
            </span>
          </div>
          {leads.map(lead => {
            const sm = STATUS_MAP[lead.status];
            return (
              <div key={lead.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', transition: 'background 0.1s', cursor: 'pointer' }} className="action-item"
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 12 }}>{lead.name}</span>
                    </div>
                    <span className={`badge ${sm.cls}`}>{sm.label}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>
                    {lead.role} @ {lead.company}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                    <MessageSquare size={10} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.4 }}>{lead.notes}</span>
                  </div>
                  <div style={{ marginTop: 5, color: 'var(--text-muted)', fontSize: 10 }}>
                    {lead.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scheduled Calls */}
        <div>
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Phone size={10} /> Scheduled Calls
            </span>
          </div>
          {calls.map(call => {
            const sm = STATUS_MAP[call.status];
            return (
              <div key={call.id} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', transition: 'background 0.1s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={11} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 12 }}>{call.name}</span>
                  </div>
                  <span className={`badge ${sm.cls}`}>{sm.label}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 4 }}>
                  {call.role} @ {call.company}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, padding: '4px 8px', background: 'var(--bg-card)', borderRadius: 4, border: '1px solid var(--border)' }}>
                  <Calendar size={10} style={{ color: 'var(--green)' }} />
                  <span style={{ color: 'var(--green)', fontSize: 11, fontWeight: 600 }}>{call.callTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <MessageSquare size={10} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.4 }}>{call.notes}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
