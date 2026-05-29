import { MessageSquare, ExternalLink } from 'lucide-react';

const HERMES_URL = 'http://142.93.118.208:9119';

export default function ChatPanel() {
  return (
    <div className="panel" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="panel-title"><MessageSquare size={12} /> HERMES CHAT — CLAUDE CODE AGENT</span>
        <a
          href={HERMES_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--green)', fontSize: 11, textDecoration: 'none' }}
        >
          <ExternalLink size={11} /> Open in new tab
        </a>
      </div>

      {/* Embedded Hermes dashboard */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src={HERMES_URL}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'var(--bg-base)',
          }}
          title="Hermes Chat"
          allow="clipboard-read; clipboard-write"
        />
      </div>

      {/* Fallback notice */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          Connected to Hermes Agent on VPS · Telegram gateway active · Claude Code linked
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="dot dot-green pulse" />
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>Online</span>
        </div>
      </div>
    </div>
  );
}
