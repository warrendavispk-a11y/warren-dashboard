import { Video } from 'lucide-react';
import { contentPipeline, socialFollowers } from '../data.js';

const platformColors = { tiktok: 'var(--red)', instagram: 'var(--purple)', youtube: 'var(--red)', pinterest: 'var(--orange)', twitter: 'var(--blue)' };
const platformLabels = { tiktok: 'TikTok', instagram: 'IG', youtube: 'YT', pinterest: 'Pin', twitter: 'X' };
const statusColors = { queued: 'yellow', posted: 'green', draft: 'muted', scheduled: 'blue' };

export default function ContentPipeline({ compact }) {
  const items = compact ? contentPipeline.slice(0, 5) : contentPipeline;

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><Video size={12} /> CONTENT PIPELINE</span>
        <span className="badge badge-yellow">{contentPipeline.filter(c => c.status === 'queued').length} queued</span>
      </div>

      {/* Social follower counts */}
      {!compact && (
        <>
          <div style={{ padding: '10px 16px 6px', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Follower Goals
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 1, background: 'var(--border)', marginBottom: 1 }}>
            {socialFollowers.map(s => (
              <div key={s.platform} style={{ background: 'var(--bg-card)', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>{s.platform}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{s.followers.toLocaleString()}</div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>/ {s.goal.toLocaleString()} goal</div>
                <div style={{ marginTop: 4 }}>
                  <div className="progress-bar" style={{ height: 2 }}>
                    <div className="progress-fill" style={{ width: `${Math.min(100, (s.followers / s.goal) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="table-header" style={{ gridTemplateColumns: '50px 1fr 70px 70px' }}>
        <span>Platform</span>
        <span>Title</span>
        <span>Scheduled</span>
        <span>Status</span>
      </div>

      {items.map(item => (
        <div key={item.id} className="table-row" style={{ gridTemplateColumns: '50px 1fr 70px 70px' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: platformColors[item.platform] || 'var(--text-muted)' }}>
            {platformLabels[item.platform] || item.platform}
          </span>
          <span style={{ color: 'var(--text-primary)', fontSize: 11 }}>{item.title}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{item.scheduled || '—'}</span>
          <span className={`badge badge-${statusColors[item.status] || 'muted'}`}>{item.status}</span>
        </div>
      ))}

      {compact && contentPipeline.length > 5 && (
        <div style={{ padding: '8px 14px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{contentPipeline.length - 5} more in Content tab</span>
        </div>
      )}
    </div>
  );
}
