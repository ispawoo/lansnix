// LANsnix Activity Feed Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { useEffect, useState } from 'react'
import { api, type Activity } from '@/lib/api'
import { Activity as ActivityIcon, Wifi, WifiOff, Plus, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api.getActivity(100)
        setActivities(data)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
    const interval = setInterval(fetchActivities, 5000)
    return () => clearInterval(interval)
  }, [])

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
        <h1 className="text-3xl font-bold">Activity Feed</h1>
        <p className="text-muted-foreground mt-1">
          Recent network events and changes
        </p>
      </div>

      {/* Activity Timeline */}
      <div className="glass rounded-lg p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No activity yet
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityItem({ activity, index }: { activity: Activity; index: number }) {
  const getIcon = () => {
    switch (activity.type) {
      case 'device_joined':
        return <Plus className="w-5 h-5 text-green-500" />
      case 'device_online':
        return <Wifi className="w-5 h-5 text-green-500" />
      case 'device_offline':
        return <WifiOff className="w-5 h-5 text-red-500" />
      case 'port_change':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <ActivityIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getColor = () => {
    switch (activity.type) {
      case 'device_joined':
      case 'device_online':
        return 'border-green-500/30'
      case 'device_offline':
        return 'border-red-500/30'
      case 'port_change':
        return 'border-yellow-500/30'
      default:
        return 'border-blue-500/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-4 p-4 rounded-lg border ${getColor()} hover:bg-white/5 transition-colors`}
    >
      <div className="mt-1">{getIcon()}</div>
      <div className="flex-1">
        <p className="font-medium">{activity.message}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          {activity.ip && <span className="font-mono">{activity.ip}</span>}
          {activity.hostname && <span>{activity.hostname}</span>}
          <span>{new Date(activity.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  )
}
