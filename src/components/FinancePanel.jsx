import { useState, useEffect, useCallback } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Zap, Megaphone, RefreshCw, AlertCircle, Link } from 'lucide-react';

const PERIODS = [
  { key: 'today', label: 'Today' },
  { key: '7d',   label: '7 Days' },
  { key: '30d',  label: '30 Days' },
  { key: 'mtd',  label: 'MTD' },
];

const fmt = v => `$${(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtK = v => {
  if (!v) return '—';
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K`;
  return v.toLocaleString();
};

function SkeletonBar({ w = '60%' }) {
  return <div style={{ height: 10, width: w, background: 'var(--bg-hover)', borderRadius: 3, marginTop: 4 }} />;
}

function NetBadge({ net, loading }) {
  if (loading) return <SkeletonBar w="80px" />;
  const color = net >= 0 ? 'var(--green)' : 'var(--red)';
  const Icon  = net >= 0 ? TrendingUp : TrendingDown;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color }}>
      <Icon size={14} />
      <span style={{ fontSize: 20, fontWeight: 700 }}>{fmt(net)}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>net</span>
    </div>
  );
}

function SummaryCard({ label, value, sub, loading, color = 'var(--text-primary)', icon: Icon }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 7, padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11, marginBottom: 6 }}>
        {Icon && <Icon size={11} />}{label}
      </div>
      {loading
        ? <><SkeletonBar w="55%" /><SkeletonBar w="35%" /></>
        : <>
          <div style={{ fontSize: 18, fontWeight: 700, color, lineHeight: 1.2 }}>{fmt(value)}</div>
          {sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
        </>}
    </div>
  );
}

function SourceRow({ name, logo, data, error, loading, isSpend = false }) {
  const missing = !loading && !data && !error;
  const needsKey = error?.includes('Missing');

  let statusEl;
  if (loading) {
    statusEl = <SkeletonBar w="70px" />;
  } else if (needsKey) {
    statusEl = (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--yellow)' }}>
        <Link size={9} /> Connect
      </span>
    );
  } else if (error) {
    statusEl = (
      <span title={error} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--red)' }}>
        <AlertCircle size={9} /> Error
      </span>
    );
  } else {
    statusEl = (
      <span style={{ fontSize: 13, fontWeight: 600, color: isSpend ? 'var(--red)' : 'var(--green)' }}>
        {isSpend ? '-' : '+'}{fmt(data?.amount)}
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 14px', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16 }}>{logo}</span>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{name}</div>
          {!loading && data?.orders != null && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{data.orders} orders</div>
          )}
          {!loading && data?.impressions != null && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {fmtK(data.impressions)} impr · {fmtK(data.clicks)} clicks
            </div>
          )}
          {!loading && data?.inputTokens != null && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {fmtK(data.inputTokens)} in · {fmtK(data.outputTokens)} out tokens
            </div>
          )}
          {needsKey && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{error.replace('Missing ', '').replace(' or ', ' · ')}</div>
          )}
        </div>
      </div>
      {statusEl}
    </div>
  );
}

function Section({ title, icon: Icon, iconColor, children }) {
  return (
    <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 14px', borderBottom: '1px solid var(--border)',
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
        color: 'var(--text-secondary)',
      }}>
        <Icon size={11} style={{ color: iconColor }} />{title}
      </div>
      {children}
    </div>
  );
}

export default function FinancePanel() {
  const [period, setPeriod] = useState('30d');
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/finance?period=${period}`);
      const json = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch {
      // keep stale data on network error
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const e = data?.errors ?? {};
  const rev   = data?.revenue;
  const spend = data?.spend;
  const net   = data?.net ?? 0;

  const syncLabel = lastFetch
    ? `Synced ${lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DollarSign size={14} style={{ color: 'var(--green)' }} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Finance Overview</span>
          <div style={{ display: 'flex', gap: 2 }}>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  padding: '3px 10px', borderRadius: 5, border: 'none', cursor: 'pointer',
                  background: period === p.key ? 'var(--bg-hover)' : 'transparent',
                  color: period === p.key ? 'var(--green)' : 'var(--text-muted)',
                  fontSize: 11, fontWeight: period === p.key ? 700 : 400, fontFamily: 'inherit',
                }}
              >{p.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{syncLabel}</span>
          <button onClick={load} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 3, display: 'flex', borderRadius: 4 }}>
            <RefreshCw size={11} style={loading ? { animation: 'spin 1s linear infinite' } : undefined} />
          </button>
        </div>
      </div>

      {/* Net P&L + summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
        <div style={{
          background: 'var(--bg-card)', border: `1px solid ${net >= 0 ? 'rgba(57,211,83,0.25)' : 'rgba(248,81,73,0.25)'}`,
          borderRadius: 7, padding: '12px 14px', gridColumn: 'span 1',
        }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Net Profit / Loss</div>
          <NetBadge net={net} loading={loading} />
          {!loading && data && (
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
              {data.since} → {data.until}
            </div>
          )}
        </div>
        <SummaryCard label="Total Revenue" value={rev?.total} loading={loading} color="var(--green)" icon={TrendingUp} />
        <SummaryCard label="API Spend"     value={spend?.api?.total} loading={loading} color="var(--red)" icon={Zap}
          sub={spend?.api?.total != null ? `Anthropic + OpenAI` : undefined} />
        <SummaryCard label="Ad Spend"      value={spend?.ads?.total} loading={loading} color="var(--red)" icon={Megaphone}
          sub={spend?.ads?.total != null ? `Meta + TikTok` : undefined} />
      </div>

      {/* Detail rows */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Revenue */}
        <Section title="Revenue" icon={TrendingUp} iconColor="var(--green)">
          <SourceRow name="Shopify"  logo="🛍️" data={rev?.shopify}  error={e.shopify}  loading={loading} />
          <SourceRow name="Gumroad"  logo="🟠" data={rev?.gumroad}  error={e.gumroad}  loading={loading} />
          <SourceRow name="Etsy"     logo="🏺" data={rev?.etsy}     error={e.etsy}     loading={loading} />
          <div style={{ padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
            {loading
              ? <SkeletonBar w="60px" />
              : <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{fmt(rev?.total)}</span>}
          </div>
        </Section>

        {/* Spend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Section title="API Spend" icon={Zap} iconColor="var(--purple)">
            <SourceRow name="Anthropic" logo="🤖" data={spend?.api?.anthropic} error={e.anthropic} loading={loading} isSpend />
            <SourceRow name="OpenAI"    logo="⚡" data={spend?.api?.openai}    error={e.openai}    loading={loading} isSpend />
            <div style={{ padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
              {loading
                ? <SkeletonBar w="60px" />
                : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>-{fmt(spend?.api?.total)}</span>}
            </div>
          </Section>

          <Section title="Ad Spend" icon={Megaphone} iconColor="var(--blue)">
            <SourceRow name="Meta Ads" logo="🎯" data={spend?.ads?.meta}   error={e.meta}   loading={loading} isSpend />
            <SourceRow name="TikTok"   logo="🎵" data={spend?.ads?.tiktok} error={e.tiktok} loading={loading} isSpend />
            <div style={{ padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
              {loading
                ? <SkeletonBar w="60px" />
                : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)' }}>-{fmt(spend?.ads?.total)}</span>}
            </div>
          </Section>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
