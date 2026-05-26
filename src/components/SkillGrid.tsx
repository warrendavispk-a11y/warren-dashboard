import {
  Lightbulb,
  Code2,
  ShieldCheck,
  Rocket,
  Zap,
} from 'lucide-react'
import { categories } from '../data/skills'
import { SkillCard } from './SkillCard'

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  Code2,
  ShieldCheck,
  Rocket,
  Zap,
}

const headerColor: Record<string, string> = {
  amber: 'text-amber-400',
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  teal: 'text-teal-400',
}

export function SkillGrid() {
  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon]
        const running = cat.skills.filter((s) => s.status === 'running').length
        const done = cat.skills.filter((s) => s.status === 'done').length

        return (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${headerColor[cat.color]}`} />
                <h2 className="text-sm font-semibold text-white/90">{cat.title}</h2>
                <span className="text-xs text-white/25">{cat.skills.length} skills</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/30">
                {running > 0 && (
                  <span className="text-accent-blue font-medium">{running} running</span>
                )}
                <span>{done} done</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {cat.skills.map((skill) => (
                <SkillCard key={skill.command} skill={skill} accentColor={cat.color} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
