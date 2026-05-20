import { Video, Camera, BookImage, Clock, Eye, Heart, ChevronRight } from 'lucide-react';
import { contentPipeline } from '../data';

const PLATFORM_ICONS = {
  tiktok: <Video size={12} />,
  instagram: <Camera size={12} />,
  pinterest: <BookImage size={12} />,
};

const PLATFORM_COLORS = {
  tiktok: { color: '#ff4d4d', bg: 'rgba(255,77,77,0.1)' },
  instagram: { color: '#c13584', bg: 'rgba(193,53,132,0.1)' },
  pinterest: { color: '#e60023', bg: 'rgba(230,0,35,0.1)' },
};

const STATUS_MAP = {
  posted: { label: 'Posted', cls: 'badge-green' },
  queued: { label: 'Queued', cls: 'badge-blue' },
  draft: { label: 'Draft', cls: 'badge-muted' },
};

const counts = (data) => ({
  posted: data.filter(x => x.status === 'posted').length,
  queued: data.filter(x => x.status === 'queued').length,
  draft: data.filter(x => x.status === 'draft').length,
});

export default function ContentPipeline() {
  const c = counts(contentPipeline);

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Video size={12} style={{ color: 'var(--blue)' }} />
          Content Pipeline
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="badge badge-green">{c.posted} Posted</span>
          <span className="badge badge-blue">{c.queued} Queued</span>
          <span className="badge badge-muted">{c.draft} Draft</span>
        </div>
      </div>

      {/* Progress bar overview */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' }}>
        {['tiktok', 'instagram', 'pinterest'].map(p => {
          const platformPosts = contentPipeline.filter(x => x.platform === p);
          const pc = PLATFORM_COLORS[p];
          const posted = platformPosts.filter(x => x.status === 'posted').length;
          return (
            <div key={p} style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: pc.color, display: 'flex', alignItems: 'center', gap: 4, textTransform: 'capitalize', fontWeight: 700 }}>
                  {PLATFORM_ICONS[p]} {p}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{posted}/{platformPosts.length}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(posted / platformPosts.length) * 100}%`, background: pc.color, opacity: 0.8 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="table-header" style={{ gridTemplateColumns: '100px 1fr 90px 80px 70px' }}>
        <span>Platform</span>
        <span>Post Title</span>
        <span>Scheduled</span>
        <span>Views</span>
        <span>Status</span>
      </div>

      {contentPipeline.map(post => {
        const pc = PLATFORM_COLORS[post.platform];
        const sm = STATUS_MAP[post.status];
        return (
          <div
            key={post.id}
            className="table-row"
            style={{ gridTemplateColumns: '100px 1fr 90px 80px 70px' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              color: pc.color, fontWeight: 700, fontSize: 11,
              textTransform: 'capitalize'
            }}>
              {PLATFORM_ICONS[post.platform]}
              {post.platform}
            </span>

            <div>
              <div style={{ color: 'var(--text-primary)', fontSize: 12, marginBottom: 2 }}>{post.title}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {post.tags.map(t => (
                  <span key={t} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>
              {post.scheduled ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={9} />
                  {post.scheduled.split(' ')[0]}
                </span>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>—</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {post.views ? (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--text-secondary)', fontSize: 11 }}>
                    <Eye size={9} />{post.views}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--green)', fontSize: 10 }}>
                    <Heart size={9} />{post.engagement}
                  </span>
                </>
              ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
            </div>

            <span className={`badge ${sm.cls}`}>{sm.label}</span>
          </div>
        );
      })}
    </div>
  );
}
