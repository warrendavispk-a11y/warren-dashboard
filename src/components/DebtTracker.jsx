import { TrendingDown, Target, Calendar, DollarSign } from 'lucide-react';
import { debtMission, incomeStreams, monthlyUpdates } from '../data.js';

const pct = (n, d) => d === 0 ? 0 : Math.min(100, (n / d) * 100);

export default function DebtTracker({ compact }) {
  const { totalDebt, currentBalance, paidToDate, monthlyTarget, currentMonth, targetDate } = debtMission;
  const paidPct = pct(paidToDate, totalDebt);
  const monthPct = pct(currentMonth, 12);

  const stats = [
    { label: 'Total Debt', value: `$${totalDebt.toLocaleString()}`, color: 'var(--red)', icon: TrendingDown },
    { label: 'Paid Off', value: `$${paidToDate.toLocaleString()}`, color: 'var(--green)', icon: DollarSign },
    { label: 'Remaining', value: `$${currentBalance.toLocaleString()}`, color: 'var(--yellow)', icon: Target },
    { label: 'Monthly Target', value: `$${monthlyTarget.toLocaleString()}`, color: 'var(--blue)', icon: Calendar },
  ];

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-title"><TrendingDown size={12} /> DEBT ELIMINATION MISSION</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Target: {targetDate} · Month {currentMonth}/12</span>
      </div>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)' }}>
        {stats.map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ background: 'var(--bg-card)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Icon size={11} style={{ color }} />
              <span className="stat-label">{label}</span>
            </div>
            <div className="stat-value" style={{ color, fontSize: compact ? 18 : 24 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Debt Eliminated</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700 }}>{paidPct.toFixed(1)}%</span>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill" style={{ width: `${paidPct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 10, color: 'var(--green)' }}>${paidToDate.toLocaleString()} paid</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>${currentBalance.toLocaleString()} left</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>12-Month Timeline</span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700 }}>Month {currentMonth} of 12</span>
          </div>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-fill progress-fill-yellow" style={{ width: `${monthPct}%` }} />
          </div>
        </div>
      </div>

      {/* Income streams */}
      {!compact && (
        <>
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Income Streams
          </div>
          {incomeStreams.map(s => (
            <div key={s.id} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}>
              <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{s.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.type}</span>
              <span style={{ color: 'var(--green)', fontSize: 11 }}>${s.ytd.toLocaleString()} YTD</span>
              <span className={`badge badge-${s.status === 'active' || s.status === 'live' ? 'green' : 'yellow'}`}>{s.status}</span>
            </div>
          ))}
        </>
      )}

      {/* Monthly log */}
      {!compact && monthlyUpdates.length === 0 && (
        <div style={{ padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, borderTop: '1px solid var(--border)' }}>
          Monthly updates will appear here — first update due end of Month 1.
        </div>
      )}
    </div>
  );
}
