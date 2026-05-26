import { Play, Loader2, Check, AlertCircle, Clock } from 'lucide-react'
import type { Skill } from '../data/skills'

interface SkillCardProps {
  skill: Skill
  accentColor: string
}

const statusConfig = {
  idle: { icon: null, label: 'Idle', class: 'text-white/30' },
  running: { icon: Loader2, label: 'Running', class: 'text-accent-blue animate-spin' },
  done: { icon: Check, label: 'Done', class: 'text-accent-green' },
  error: { icon: AlertCircle, label: 'Error', class: 'text-accent-red' },
}

const colorMap: Record<string, string> = {
  amber: 'from-amber-500/10 to-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
  blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
  green: 'from-green-500/10 to-green-500/5 border-green-500/20 hover:border-green-500/40',
  purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
  teal: 'from-teal-500/10 to-teal-500/5 border-teal-500/20 hover:border-teal-500/40',
}

const runBtnColor: Record<string, string> = {
  amber: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400',
  blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/10 hover:bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400',
  teal: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-400',
}

export function SkillCard({ skill, accentColor }: SkillCardProps) {
  const cfg = statusConfig[skill.status]
  const StatusIcon = cfg.icon

  return (
    <div
      className={[
        'group relative flex flex-col gap-3 p-4 rounded-xl border bg-gradient-to-br transition-all duration-200 cursor-default',
        colorMap[accentColor] ?? colorMap['blue'],
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <code className="text-xs font-mono font-medium text-white/80 bg-black/20 px-2 py-0.5 rounded-md">
          {skill.command}
        </code>
        <button
          className={[
            'shrink-0 flex items-center justify-center w-6 h-6 rounded-md transition-colors opacity-0 group-hover:opacity-100',
            runBtnColor[accentColor] ?? runBtnColor['blue'],
          ].join(' ')}
          title={`Run ${skill.command}`}
        >
          <Play className="w-3 h-3" />
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">{skill.role}</p>
        <p className="text-sm text-white/70 leading-relaxed">{skill.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          {StatusIcon && <StatusIcon className={`w-3 h-3 ${cfg.class}`} />}
          <span className={`text-xs font-medium ${cfg.class}`}>{cfg.label}</span>
        </div>
        {skill.lastRun && (
          <div className="flex items-center gap-1 text-xs text-white/25">
            <Clock className="w-3 h-3" />
            <span>{skill.lastRun}</span>
            {skill.duration && <span>· {skill.duration}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
