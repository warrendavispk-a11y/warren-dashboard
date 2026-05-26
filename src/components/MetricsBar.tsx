import { metrics } from '../data/skills'

export function MetricsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-surface-1 border border-white/5 rounded-xl p-4 card-glow transition-all duration-200"
        >
          <div className={`text-2xl font-bold tracking-tight ${m.color}`}>{m.value}</div>
          <div className="text-sm font-medium text-white/80 mt-0.5">{m.label}</div>
          <div className="text-xs text-white/30 mt-0.5">{m.sub}</div>
        </div>
      ))}
    </div>
  )
}
