// LANsnix Settings Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { Settings as SettingsIcon, Network, Clock, Shield } from 'lucide-react'

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure LANsnix behavior and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Network Settings */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Network Settings</h2>
          </div>
          <div className="space-y-4">
            <SettingItem
              label="Scan Interval"
              description="How often to scan the network"
              value="60 seconds"
            />
            <SettingItem
              label="Subnet"
              description="Network subnet to scan"
              value="Auto-detect"
            />
            <SettingItem
              label="Port Scanning"
              description="Enable port scanning for devices"
              value="Enabled"
            />
          </div>
        </div>

        {/* Performance Settings */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Performance</h2>
          </div>
          <div className="space-y-4">
            <SettingItem
              label="Scan Timeout"
              description="Maximum time for each scan"
              value="5 seconds"
            />
            <SettingItem
              label="Max Concurrent Scans"
              description="Number of simultaneous scans"
              value="100"
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <SettingItem
              label="Rate Limiting"
              description="Protect API from abuse"
              value="Enabled"
            />
            <SettingItem
              label="WebSocket Authentication"
              description="Require auth for realtime updates"
              value="Disabled"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-lg p-6 border border-blue-500/30">
        <p className="text-sm text-muted-foreground">
          💡 Settings are configured via environment variables or config file. 
          Restart the service after making changes.
        </p>
      </div>
    </div>
  )
}

function SettingItem({ label, description, value }: { label: string; description: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-sm font-mono px-3 py-1 bg-white/5 rounded">{value}</span>
    </div>
  )
}
