import { useState } from 'react';
import { Lock } from 'lucide-react';

const PASSWORD_HASH = 'warren2026';

export default function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === PASSWORD_HASH) {
      localStorage.setItem('warren_auth', '1');
      onAuth();
    } else {
      setErr(true);
      setPw('');
      setTimeout(() => setErr(false), 2000);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--bg-panel)',
        border: `1px solid ${err ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 12,
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        width: 360,
        transition: 'border-color 0.2s',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--green-muted), var(--green))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={22} color="#000" strokeWidth={2.5} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            WarrenOS
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Private dashboard · Enter password to continue
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--bg-card)',
              border: `1px solid ${err ? 'var(--red)' : 'var(--border-accent)'}`,
              borderRadius: 6,
              color: 'var(--text-primary)',
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <button type="submit" style={{
            padding: '10px',
            background: 'var(--green-muted)',
            color: 'var(--green)',
            border: '1px solid var(--green-dim)',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.04em',
          }}>
            UNLOCK
          </button>
          {err && (
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--red)' }}>
              Incorrect password
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
