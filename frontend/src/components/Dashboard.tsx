// LANsnix Dashboard Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { useEffect, useState } from 'react'
import { api, type Stats, type Device } from '@/lib/api'
import { Monitor, Activity, Wifi, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  const fetchData = async () => {
    try {
      const [statsData, devicesData] = await Promise.all([
        api.getStats(),
        api.getDevices(),
      ])
      setStats(statsData)
      setDevices(devicesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleScan = async () => {
    setScanning(true)
    try {
      await api.triggerScan()
      toast.success('Network scan started')
      setTimeout(fetchData, 2000)
    } catch (error) {
      toast.error('Failed to start scan')
    } finally {
      setScanning(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
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
  const avgLatency = onlineDevices.length > 0
    ? onlineDevices.reduce((sum, d) => sum + d.latency, 0) / onlineDevices.length
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Network overview and statistics</p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan Network'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Devices"
          value={stats?.total_devices || 0}
          icon={Monitor}
          color="blue"
        />
        <StatCard
          title="Online"
          value={stats?.online_devices || 0}
          icon={Wifi}
          color="green"
        />
        <StatCard
          title="Offline"
          value={stats?.offline_devices || 0}
          icon={Activity}
          color="red"
        />
        <StatCard
          title="Avg Latency"
          value={`${avgLatency.toFixed(1)}ms`}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Recent Devices */}
      <div className="glass rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Devices</h2>
        <div className="space-y-3">
          {devices.slice(0, 10).map((device) => (
            <DeviceRow key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: any
  color: 'blue' | 'green' | 'red' | 'purple'
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-lg p-6 border bg-gradient-to-br ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon className="w-10 h-10 opacity-50" />
      </div>
    </motion.div>
  )
}

function DeviceRow({ device }: { device: Device }) {
  const statusColor = device.status === 'online' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusColor}`} />
        <div>
          <p className="font-medium">{device.hostname || device.ip}</p>
          <p className="text-sm text-muted-foreground">{device.ip} • {device.vendor}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-muted-foreground">{device.latency.toFixed(1)}ms</p>
      </div>
    </div>
  )
}
