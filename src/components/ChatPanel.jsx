import { useState } from 'react';
import { MessageSquare, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import { useServiceHealth } from '../hooks/useServiceHealth';

const HERMES_URL = 'http://142.93.118.208:9119';

export default function ChatPanel() {
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeStatus, setIframeStatus] = useState('loading');
  const { status: vpsStatus, lastChecked, error } = useServiceHealth(HERMES_URL);

  const retry = () => {
    setIframeStatus('loading');
    setIframeKey(k => k + 1);
  };

  const dotClass =
    iframeStatus === 'loaded' ? 'dot-green pulse'
    : iframeStatus === 'error' ? 'dot-red'
    : 'dot-yellow pulse';

  const dotLabel =
    iframeStatus === 'loaded' ? 'Online'
    : iframeStatus === 'error' ? 'Unreachable'
    : 'Connecting…';

  const dotColor =
    iframeStatus === 'loaded' ? 'var(--green)'
    : iframeStatus === 'error' ? '#f85149'
    : '#d29922';

  return (
    <div className="panel" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <span className="panel-title"><MessageSquare size={12} /> HERMES CHAT — CLAUDE CODE AGENT</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {vpsStatus === 'offline' && (
            <span style={{ fontSize: 10, color: '#f85149', fontWeight: 600 }}>
              ⚠ VPS unreachable
            </span>
          )}
          <a
            href={HERMES_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--green)', fontSize: 11, textDecoration: 'none' }}
          >
            <ExternalLink size={11} /> Open in new tab
          </a>
        </div>
      </div>

      {/* Embedded Hermes dashboard */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <iframe
          key={iframeKey}
          src={HERMES_URL}
          onLoad={() => setIframeStatus('loaded')}
          onError={() => setIframeStatus('error')}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            background: 'var(--bg-base)',
            display: iframeStatus === 'error' ? 'none' : 'block',
          }}
          title="Hermes Chat"
          allow="clipboard-read; clipboard-write"
        />

        {/* Error overlay */}
        {iframeStatus === 'error' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 12, background: 'var(--bg-base)',
          }}>
            <AlertTriangle size={28} color="#f85149" />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f85149', marginBottom: 4 }}>
                Hermes Agent Unreachable
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 280 }}>
                Cannot connect to <span style={{ fontFamily: 'monospace' }}>{HERMES_URL}</span>.
                The VPS may be down or the Hermes service has stopped.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={retry}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 6,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: 11, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <RefreshCw size={11} /> Retry
              </button>
              <a
                href={HERMES_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 6,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--green)', fontSize: 11, textDecoration: 'none',
                }}
              >
                <ExternalLink size={11} /> Test direct link
              </a>
            </div>
            {error && (
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace', maxWidth: 320, textAlign: 'center' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Loading overlay */}
        {iframeStatus === 'loading' && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-base)',
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Connecting to Hermes…</span>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          {iframeStatus === 'error'
            ? `VPS at ${HERMES_URL} is not responding · Check that the Hermes service is running`
            : 'Connected to Hermes Agent on VPS · Telegram gateway active · Claude Code linked'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {lastChecked && (
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              checked {lastChecked.toLocaleTimeString()}
            </span>
          )}
          <span className={`dot ${dotClass}`} />
          <span style={{ fontSize: 10, color: dotColor, fontWeight: 600 }}>{dotLabel}</span>
        </div>
      </div>
    </div>
  );
}
