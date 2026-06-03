import { useState } from 'react';
import { Activity, MessageSquare, TrendingDown, ShoppingBag, Video, Cpu, CheckSquare, DollarSign, Store, Terminal, Zap, Layers, TrendingUp } from 'lucide-react';
import DebtTracker from './components/DebtTracker';
import ProductsPanel from './components/ProductsPanel';
import ContentPipeline from './components/ContentPipeline';
import SystemStatus from './components/SystemStatus';
import PriorityActions from './components/PriorityActions';
import ChatPanel from './components/ChatPanel';
import FinancePanel from './components/FinancePanel';
import GumroadPanel from './components/GumroadPanel';
import ShopifyPanel from './components/ShopifyPanel';
import LogsPanel from './components/LogsPanel';
import WebhooksPanel from './components/WebhooksPanel';
import AssetGallery from './components/AssetGallery';
import RevenueOS from './components/RevenueOS';

const now = new Date().toLocaleString('en-US', {
  weekday: 'short', month: 'short', day: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: true,
});

const TABS = [
  { key: 'overview', label: 'Overview', icon: Activity },
  { key: 'finance', label: 'Finance', icon: DollarSign },
  { key: 'debt', label: 'Debt Tracker', icon: TrendingDown },
  { key: 'store', label: 'Store Revenue', icon: Store },
  { key: 'products', label: 'Products', icon: ShoppingBag },
  { key: 'content', label: 'Content', icon: Video },
  { key: 'studio', label: 'Studio', icon: Layers },
  { key: 'logs', label: 'Logs', icon: Terminal },
  { key: 'webhooks', label: 'Webhooks', icon: Zap },
  { key: 'system', label: 'System', icon: Cpu },
  { key: 'actions', label: 'Actions', icon: CheckSquare },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'revenue', label: 'Revenue OS', icon: TrendingUp },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
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
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>WarrenOS</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 1 }}>v1.0</span>
        </div>

        <nav style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                padding: '4px 12px', borderRadius: 5, border: 'none',
                background: activeTab === key ? 'var(--bg-hover)' : 'transparent',
                color: activeTab === key ? 'var(--green)' : 'var(--text-muted)',
                fontSize: 12, fontWeight: activeTab === key ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              }}
            >
              <Icon size={11} />{label}
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{now}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20 }}>
            <span className="dot dot-green pulse" />
            <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>Live</span>
          </div>
          <a
            href="http://142.93.118.208:9119"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              background: 'rgba(57,211,83,0.1)', border: '1px solid rgba(57,211,83,0.3)',
              color: 'var(--green)', fontSize: 10, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <MessageSquare size={10} /> Hermes Chat ↗
          </a>
        </div>
      </header>

      <main style={{ padding: '16px 20px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activeTab === 'overview' && (
          <>
            <DebtTracker compact />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <ProductsPanel compact />
              <ContentPipeline compact />
            </div>
            <PriorityActions />
            <SystemStatus />
          </>
        )}
        {activeTab === 'finance' && <FinancePanel />}
        {activeTab === 'debt' && <DebtTracker />}
        {activeTab === 'store' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <GumroadPanel />
            <ShopifyPanel />
          </div>
        )}
        {activeTab === 'products' && <ProductsPanel />}
        {activeTab === 'content' && <ContentPipeline />}
        {activeTab === 'studio' && <AssetGallery />}
        {activeTab === 'logs' && <LogsPanel />}
        {activeTab === 'webhooks' && <WebhooksPanel />}
        {activeTab === 'system' && <SystemStatus />}
        {activeTab === 'actions' && <PriorityActions />}
        {activeTab === 'chat' && <ChatPanel />}
        {activeTab === 'revenue' && <RevenueOS />}
      </main>
    </div>
  );
}
