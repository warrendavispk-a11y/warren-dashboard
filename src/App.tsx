import { Header } from './components/Header'
import { MetricsBar } from './components/MetricsBar'
import { SprintPipeline } from './components/SprintPipeline'
import { SkillGrid } from './components/SkillGrid'
import { ActivityFeed } from './components/ActivityFeed'
import { QuickActions } from './components/QuickActions'

export default function App() {
  return (
    <div className="min-h-screen bg-surface-0">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Hero */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gradient mb-1">
            AI-Powered Software Factory
          </h1>
          <p className="text-sm text-white/40">
            gstack · 32 skills · Think → Plan → Build → Review → Test → Ship → Reflect
          </p>
        </div>

        {/* Metrics */}
        <MetricsBar />

        {/* Sprint + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SprintPipeline />
          </div>
          <div className="flex flex-col gap-4">
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Skill Grid */}
        <SkillGrid />
      </main>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-white/20">
        warren-dashboard · powered by{' '}
        <span className="text-gradient font-medium">gstack</span> · MIT License
      </footer>
    </div>
  )
}
