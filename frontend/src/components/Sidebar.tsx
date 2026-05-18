// LANsnix Sidebar Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { 
  LayoutDashboard, 
  Monitor, 
  Activity, 
  Network, 
  Settings as SettingsIcon,
  Info 
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'devices', label: 'Devices', icon: Monitor },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'network', label: 'Network Map', icon: Network },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'about', label: 'About', icon: Info },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-64 glass border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          LANsnix
        </h1>
        <p className="text-xs text-muted-foreground mt-1">Your Network. Visualized.</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground glow'
                  : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground text-center">
          Created by{' '}
          <a
            href="https://github.com/ispawoo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Yasir Ispawoo
          </a>
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">v1.0.0</p>
      </div>
    </aside>
  )
}
