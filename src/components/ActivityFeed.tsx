import { CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react'
import { recentActivity } from '../data/skills'

const statusIcons = {
  done: { Icon: CheckCircle2, class: 'text-accent-green' },
  running: { Icon: Loader2, class: 'text-accent-blue animate-spin' },
  error: { Icon: AlertCircle, class: 'text-accent-red' },
}

const dotColor: Record<string, string> = {
  green: 'bg-accent-green',
  blue: 'bg-accent-blue',
  red: 'bg-accent-red',
  amber: 'bg-accent-amber',
}

export function ActivityFeed() {
  return (
    <div className="bg-surface-1 border border-white/5 rounded-xl p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white/90">Recent Activity</h2>
        <button className="text-xs text-white/30 hover:text-white/60 transition-colors">View all</button>
      </div>

      <div className="space-y-1">
        {recentActivity.map((item, i) => {
          const cfg = statusIcons[item.status as keyof typeof statusIcons]

          return (
            <div
              key={i}
              className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-white/3 transition-colors group"
            >
              <div className="mt-0.5 shrink-0">
                <cfg.Icon className={`w-3.5 h-3.5 ${cfg.class}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <code className="text-xs font-mono text-white/60">{item.skill}</code>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[item.color] ?? 'bg-white/20'}`} />
                </div>
                <p className="text-xs text-white/50 truncate">{item.message}</p>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs text-white/25">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
