import { useState } from 'react';
import { Activity, Bell, Settings } from 'lucide-react';
import ShopifyPanel from './components/ShopifyPanel';
import ContentPipeline from './components/ContentPipeline';
import AppointmentTracker from './components/AppointmentTracker';
import SystemStatus from './components/SystemStatus';
import PriorityActions from './components/PriorityActions';

const now = new Date().toLocaleString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: true
});

export default function App() {
  const [activeSection, setActiveSection] = useState('all');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Top navbar */}
      <header style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        height: 48,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--green-muted), var(--green))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={14} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            WarrenOS
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 1 }}>DASHBOARD</span>
        </div>

        <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
          {[
            { key: 'all', label: 'Overview' },
            { key: 'shopify', label: 'Shopify' },
            { key: 'content', label: 'Content' },
            { key: 'leads', label: 'Leads' },
            { key: 'system', label: 'System' },
            { key: 'actions', label: 'Actions' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              style={{
                padding: '4px 12px',
                borderRadius: 5,
                border: 'none',
                background: activeSection === key ? 'var(--bg-hover)' : 'transparent',
                color: activeSection === key ? 'var(--green)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: activeSection === key ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{now}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <span className="dot dot-green pulse" />
            <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>5/6 Systems Online</span>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
            <Bell size={15} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex' }}>
            <Settings size={15} />
          </button>
        </div>
      </header>

      {/* Critical alert banner */}
      <div style={{
        background: 'rgba(248,81,73,0.08)',
        borderBottom: '1px solid rgba(248,81,73,0.2)',
        padding: '7px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ color: 'var(--red)', fontSize: 11, fontWeight: 700 }}>⚡ CRITICAL</span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
          n8n order sync pipeline is broken — last success 18h ago. ~14 orders may be unprocessed.
        </span>
        <span
          style={{ color: 'var(--red)', fontSize: 11, marginLeft: 'auto', cursor: 'pointer' }}
          onClick={() => setActiveSection('actions')}
        >
          View action →
        </span>
      </div>

      {/* Main content */}
      <main style={{ padding: '16px 20px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(activeSection === 'all' || activeSection === 'actions') && <PriorityActions />}
        {(activeSection === 'all' || activeSection === 'shopify') && <ShopifyPanel />}

        {activeSection === 'all' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ContentPipeline />
            <AppointmentTracker />
          </div>
        )}

        {activeSection === 'content' && <ContentPipeline />}
        {activeSection === 'leads' && <AppointmentTracker />}
        {(activeSection === 'all' || activeSection === 'system') && <SystemStatus />}
      </main>
    </div>
  );
}
