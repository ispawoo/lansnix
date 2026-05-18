// LANsnix Network Map Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { useEffect, useState } from 'react'
import { api, type Device } from '@/lib/api'

export function NetworkMap() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await api.getDevices()
        setDevices(data)
      } catch (error) {
        console.error('Failed to fetch devices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const onlineDevices = devices.filter(d => d.status === 'online')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Network Map</h1>
        <p className="text-muted-foreground mt-1">
          Visual representation of your network topology
        </p>
      </div>

      {/* Network Visualization */}
      <div className="glass rounded-lg p-8 min-h-[600px]">
        <div className="flex flex-col items-center justify-center h-full">
          {/* Router/Gateway */}
          <div className="mb-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center glow">
              <span className="text-2xl">🌐</span>
            </div>
            <p className="text-center mt-2 font-semibold">Gateway</p>
          </div>

          {/* Connected Devices */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {onlineDevices.map((device) => (
              <div key={device.id} className="flex flex-col items-center">
                <div className="relative">
                  {/* Connection Line */}
                  <div className="absolute bottom-full left-1/2 w-0.5 h-12 bg-gradient-to-t from-primary to-transparent -translate-x-1/2" />
                  
                  {/* Device Node */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 border-2 border-green-500 flex items-center justify-center glow-green">
                    <span className="text-xl">💻</span>
                  </div>
                </div>
                <p className="text-xs text-center mt-2 max-w-[80px] truncate">
                  {device.hostname || device.ip}
                </p>
                <p className="text-xs text-muted-foreground">{device.latency.toFixed(0)}ms</p>
              </div>
            ))}
          </div>

          {onlineDevices.length === 0 && (
            <p className="text-muted-foreground">No online devices found</p>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="glass rounded-lg p-4">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500" />
            <span className="text-sm">Gateway/Router</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm">Online Device</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm">Offline Device</span>
          </div>
        </div>
      </div>
    </div>
  )
}
