// LANsnix Device List Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { useEffect, useState } from 'react'
import { api, type Device } from '@/lib/api'
import { Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await api.getDevices()
        setDevices(data)
        setFilteredDevices(data)
      } catch (error) {
        console.error('Failed to fetch devices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDevices()
    const interval = setInterval(fetchDevices, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = devices

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(d =>
        d.ip.toLowerCase().includes(term) ||
        d.hostname.toLowerCase().includes(term) ||
        d.mac.toLowerCase().includes(term) ||
        d.vendor.toLowerCase().includes(term)
      )
    }

    setFilteredDevices(filtered)
  }, [devices, searchTerm, statusFilter])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Devices</h1>
        <p className="text-muted-foreground mt-1">
          {filteredDevices.length} of {devices.length} devices
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by IP, hostname, MAC, or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass rounded-lg border border-white/10 focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'online', 'offline'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg transition-all ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground'
                  : 'glass hover:bg-white/5'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device, index) => (
          <DeviceCard key={device.id} device={device} index={index} />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No devices found
        </div>
      )}
    </div>
  )
}

function DeviceCard({ device, index }: { device: Device; index: number }) {
  const statusColor = device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
  const statusGlow = device.status === 'online' ? 'glow-green' : 'glow-red'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-lg p-6 border border-white/10 hover:border-primary/50 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColor} ${statusGlow}`} />
        <span className="text-xs text-muted-foreground">
          {device.status.toUpperCase()}
        </span>
      </div>

      <h3 className="text-lg font-semibold mb-2">{device.hostname || 'Unknown'}</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">IP:</span>
          <span className="font-mono">{device.ip}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">MAC:</span>
          <span className="font-mono text-xs">{device.mac}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Vendor:</span>
          <span>{device.vendor}</span>
        </div>
        {device.status === 'online' && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latency:</span>
            <span>{device.latency.toFixed(1)}ms</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-muted-foreground">
          Last seen: {new Date(device.last_seen).toLocaleString()}
        </p>
      </div>
    </motion.div>
  )
}
