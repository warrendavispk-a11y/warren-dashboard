import { useEffect, useRef, useState } from 'react';
import { Share2, RefreshCw, ExternalLink } from 'lucide-react';

export default function NotionGraph() {
  const svgRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const animRef = useRef(null);

  async function fetchPages() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/notion/search');
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPages(data.results || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPages();
    // Auto-refresh every 60 seconds so new Notion pages appear without manual refresh
    const interval = setInterval(fetchPages, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || !svgRef.current || pages.length === 0) return;

    const svg = svgRef.current;
    const W = svg.clientWidth || 700;
    const H = svg.clientHeight || 500;
    const cx = W / 2;
    const cy = H / 2;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Build node data — center "sun" + page planets
    const nodes = [
      { id: 'center', label: 'Notion Brain', r: 22, color: '#39d353', x: cx, y: cy, fixed: true },
      ...pages.slice(0, 18).map((p, i) => {
        const title = p.properties?.Name?.title?.[0]?.plain_text
          || p.properties?.title?.title?.[0]?.plain_text
          || (Array.isArray(p.title) ? p.title.map(t => t.plain_text).join('') : null)
          || 'Untitled';
        const angle = (i / Math.min(pages.length, 18)) * Math.PI * 2;
        const orbit = 120 + (i % 3) * 70;
        return {
          id: p.id,
          label: title,
          r: 7 + Math.random() * 4,
          color: ['#388bfd', '#8957e5', '#d29922', '#f85149', '#db6d28'][i % 5],
          x: cx + Math.cos(angle) * orbit,
          y: cy + Math.sin(angle) * orbit,
          angle,
          orbit,
          url: p.url,
          data: p,
        };
      }),
    ];

    // Draw orbit rings
    const orbits = [...new Set(nodes.slice(1).map(n => n.orbit))];
    orbits.forEach(r => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', cx);
      circle.setAttribute('cy', cy);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#21262d');
      circle.setAttribute('stroke-width', '1');
      circle.setAttribute('stroke-dasharray', '4 4');
      svg.appendChild(circle);
    });

    // Draw edges (center to each planet)
    nodes.slice(1).forEach(n => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx); line.setAttribute('y1', cy);
      line.setAttribute('x2', n.x); line.setAttribute('y2', n.y);
      line.setAttribute('stroke', '#21262d');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
    });

    // Draw nodes
    const nodeGroups = nodes.map(n => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${n.x},${n.y})`);
      g.style.cursor = n.id !== 'center' ? 'pointer' : 'default';

      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('r', n.r + 6);
      glow.setAttribute('fill', n.color);
      glow.setAttribute('opacity', '0.08');
      g.appendChild(glow);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', n.r);
      circle.setAttribute('fill', n.id === 'center' ? '#1a7f37' : '#161b22');
      circle.setAttribute('stroke', n.color);
      circle.setAttribute('stroke-width', n.id === 'center' ? '2.5' : '1.5');
      g.appendChild(circle);

      if (n.id === 'center') {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '8');
        text.setAttribute('font-weight', '700');
        text.setAttribute('fill', '#39d353');
        text.textContent = 'N';
        g.appendChild(text);
      }

      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', 0);
      label.setAttribute('y', n.r + 12);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '9');
      label.setAttribute('fill', '#8b949e');
      label.textContent = n.label?.length > 16 ? n.label.slice(0, 16) + '…' : n.label;
      g.appendChild(label);

      if (n.id !== 'center') {
        g.addEventListener('mouseenter', () => {
          circle.setAttribute('stroke-width', '2.5');
          label.setAttribute('fill', '#e6edf3');
        });
        g.addEventListener('mouseleave', () => {
          circle.setAttribute('stroke-width', '1.5');
          label.setAttribute('fill', '#8b949e');
        });
        g.addEventListener('click', () => setSelected(n.data));
      }

      svg.appendChild(g);
      return { el: g, node: n };
    });

    // Animate orbital rotation
    let tick = 0;
    function animate() {
      tick += 0.003;
      nodeGroups.slice(1).forEach(({ el, node }) => {
        const a = node.angle + tick * (1 / (node.orbit / 60));
        const x = cx + Math.cos(a) * node.orbit;
        const y = cy + Math.sin(a) * node.orbit;
        el.setAttribute('transform', `translate(${x},${y})`);
      });
      animRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [pages, loading]);

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div className="panel-header">
        <span className="panel-title"><Share2 size={12} /> NOTION BRAIN — SOLAR SYSTEM</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {pages.length > 0 && (
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{pages.length} pages</span>
          )}
          <button
            onClick={fetchPages}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none',
              color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, padding: '2px 6px',
              borderRadius: 4, fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={11} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 12, marginBottom: 8 }}>Loading Notion pages…</div>
              <div className="dot dot-green pulse" style={{ margin: '0 auto' }} />
            </div>
          </div>
        )}

        {error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--red)', fontSize: 12 }}>
              <div>Failed to load Notion data</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{error}</div>
              <button
                onClick={fetchPages}
                style={{ marginTop: 12, padding: '6px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 11 }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !error && pages.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            No pages found in database
          </div>
        )}

        <svg ref={svgRef} width="100%" height="100%" style={{ display: loading || error ? 'none' : 'block' }} />
      </div>

      {/* Selected page detail */}
      {selected && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 16px',
          background: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
              {selected.properties?.Name?.title?.[0]?.plain_text
                || selected.properties?.title?.title?.[0]?.plain_text
                || (Array.isArray(selected.title) ? selected.title.map(t => t.plain_text).join('') : null)
                || 'Untitled'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
              Last edited: {selected.last_edited_time ? new Date(selected.last_edited_time).toLocaleDateString() : '—'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={selected.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--blue)', fontSize: 11, textDecoration: 'none' }}
            >
              <ExternalLink size={10} /> Open in Notion
            </a>
            <button
              onClick={() => setSelected(null)}
              style={{ padding: '5px 10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
