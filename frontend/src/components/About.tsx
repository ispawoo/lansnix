// LANsnix About Component
// Created by Yasir Ispawoo (https://github.com/ispawoo)

'use client'

import { Github, Heart, Code, Shield } from 'lucide-react'

export function About() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          LANsnix
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Realtime LAN Discovery & Monitoring Platform
        </p>
        <p className="text-lg mt-4">Your Network. Visualized.</p>
      </div>

      {/* Version Info */}
      <div className="glass rounded-lg p-6 text-center">
        <p className="text-2xl font-bold">Version 1.0.0</p>
        <p className="text-muted-foreground mt-2">Released January 2024</p>
      </div>

      {/* Features */}
      <div className="glass rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureItem icon="🔍" title="Device Discovery" description="ARP & ICMP scanning" />
          <FeatureItem icon="📊" title="Realtime Monitoring" description="Live device status updates" />
          <FeatureItem icon="🔌" title="Port Scanning" description="Detect open ports and services" />
          <FeatureItem icon="🏷️" title="Vendor Detection" description="Identify device manufacturers" />
          <FeatureItem icon="🌐" title="Network Map" description="Visual topology view" />
          <FeatureItem icon="📝" title="Activity Feed" description="Event history and logging" />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Built With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <TechItem name="Go" description="Backend" />
          <TechItem name="Next.js" description="Frontend" />
          <TechItem name="TypeScript" description="Type Safety" />
          <TechItem name="TailwindCSS" description="Styling" />
          <TechItem name="SQLite" description="Database" />
          <TechItem name="WebSocket" description="Realtime" />
          <TechItem name="Docker" description="Deployment" />
          <TechItem name="Linux" description="Platform" />
        </div>
      </div>

      {/* Author */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">Created By</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
            👨‍💻
          </div>
          <div>
            <p className="text-lg font-semibold">Yasir Ispawoo</p>
            <a
              href="https://github.com/ispawoo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:underline mt-1"
            >
              <Github className="w-4 h-4" />
              github.com/ispawoo
            </a>
          </div>
        </div>
      </div>

      {/* License */}
      <div className="glass rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold">License</h2>
        </div>
        <p className="text-muted-foreground">
          LANsnix is open-source software licensed under the MIT License.
          Free to use, modify, and distribute.
        </p>
      </div>

      {/* Links */}
      <div className="glass rounded-lg p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://github.com/ispawoo/lansnix"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
          <a
            href="https://github.com/ispawoo/lansnix/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/5 transition-colors"
          >
            Report Issue
          </a>
          <a
            href="https://github.com/ispawoo/lansnix/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white/5 transition-colors"
          >
            Contribute
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-red-500" /> for the Linux and homelab community
        </p>
      </div>
    </div>
  )
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="text-center p-3 rounded-lg hover:bg-white/5 transition-colors">
      <p className="font-semibold">{name}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
