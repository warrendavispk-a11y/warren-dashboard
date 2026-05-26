import { PlayCircle, GitMerge, ShieldAlert, FlaskConical } from 'lucide-react'

const actions = [
  {
    label: 'Run Autoplan',
    description: 'Full review pipeline',
    icon: PlayCircle,
    color: 'bg-accent-blue/10 hover:bg-accent-blue/20 border-accent-blue/20 text-accent-blue',
  },
  {
    label: 'Ship & Deploy',
    description: 'Sync → test → PR → merge',
    icon: GitMerge,
    color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-purple-400',
  },
  {
    label: 'Security Audit',
    description: 'OWASP + STRIDE scan',
    icon: ShieldAlert,
    color: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 text-green-400',
  },
  {
    label: 'Run QA Suite',
    description: 'Browser regression tests',
    icon: FlaskConical,
    color: 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 text-teal-400',
  },
]

export function QuickActions() {
  return (
    <div className="bg-surface-1 border border-white/5 rounded-xl p-5 card-glow">
      <h2 className="text-sm font-semibold text-white/90 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => {
          const Icon = a.icon
          return (
            <button
              key={a.label}
              className={[
                'flex items-center gap-2.5 p-3 rounded-lg border transition-all duration-150 text-left',
                a.color,
              ].join(' ')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div>
                <div className="text-xs font-medium">{a.label}</div>
                <div className="text-xs opacity-60 mt-0.5">{a.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
