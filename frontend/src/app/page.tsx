// LANsnix Dashboard Page
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { DeviceList } from '@/components/DeviceList'
import { ActivityFeed } from '@/components/ActivityFeed'
import { NetworkMap } from '@/components/NetworkMap'
import { Settings } from '@/components/Settings'
import { About } from '@/components/About'
import { useWebSocket } from '@/hooks/useWebSocket'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { isConnected } = useWebSocket()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {/* Connection Status */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 glow-green' : 'bg-red-500 glow-red'} animate-pulse`} />
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Page Content */}
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'devices' && <DeviceList />}
          {currentPage === 'activity' && <ActivityFeed />}
          {currentPage === 'network' && <NetworkMap />}
          {currentPage === 'settings' && <Settings />}
          {currentPage === 'about' && <About />}
        </div>
      </main>
    </div>
  )
}
