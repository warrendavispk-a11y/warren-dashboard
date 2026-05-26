import {
  Brain,
  ClipboardList,
  Code2,
  Eye,
  FlaskConical,
  Rocket,
  RotateCcw,
  Check,
} from 'lucide-react'
import { sprintStages } from '../data/skills'

const iconMap: Record<string, React.ElementType> = {
  Brain,
  ClipboardList,
  Code2,
  Eye,
  FlaskConical,
  Rocket,
  RotateCcw,
}

export function SprintPipeline() {
  const currentIdx = sprintStages.findIndex((s) => s.active && !s.done)

  return (
    <div className="bg-surface-1 border border-white/5 rounded-xl p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white/90">Current Sprint</h2>
          <p className="text-xs text-white/30 mt-0.5">warren-dashboard · Sprint 12</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 font-medium">
          In Progress
        </span>
      </div>

      <div className="flex items-center gap-0 overflow-x-auto pb-1">
        {sprintStages.map((stage, i) => {
          const Icon = iconMap[stage.icon]
          const isCurrent = i === currentIdx
          const isPast = stage.done

          return (
            <div key={stage.label} className="flex items-center shrink-0">
              <div className="flex flex-col items-center gap-1.5 px-3">
                <div
                  className={[
                    'flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all',
                    isPast
                      ? 'bg-accent-green/10 border-accent-green/50 text-accent-green'
                      : isCurrent
                      ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-[0_0_12px_rgba(79,142,247,0.25)]'
                      : 'bg-surface-3 border-white/10 text-white/20',
                  ].join(' ')}
                >
                  {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={[
                    'text-xs font-medium',
                    isPast
                      ? 'text-accent-green/80'
                      : isCurrent
                      ? 'text-accent-blue'
                      : 'text-white/25',
                  ].join(' ')}
                >
                  {stage.label}
                </span>
              </div>

              {i < sprintStages.length - 1 && (
                <div
                  className={[
                    'h-px w-6 shrink-0 -mt-5',
                    isPast ? 'bg-accent-green/40' : 'bg-white/8',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 h-1 bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all duration-700"
          style={{ width: `${(sprintStages.filter((s) => s.done).length / sprintStages.length) * 100}%` }}
        />
      </div>
      <p className="text-xs text-white/30 mt-1.5">
        {sprintStages.filter((s) => s.done).length} of {sprintStages.length} stages complete
      </p>
    </div>
  )
}
