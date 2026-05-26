import { Terminal, GitBranch, Bell, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-0/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-white tracking-tight">Warren Dashboard</span>
            <span className="ml-2 text-xs text-white/30 font-mono">AI Software Factory</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 border border-white/5 text-xs text-white/50">
            <GitBranch className="w-3 h-3" />
            <span className="font-mono">main</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <button className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-surface-2 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue" />
            </button>
            <button className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-surface-2 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
