// LANsnix API Client
// Created by Yasir Ispawoo (https://github.com/ispawoo)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export interface Device {
  id: number
  ip: string
  mac: string
  hostname: string
  vendor: string
  status: string
  latency: number
  first_seen: string
  last_seen: string
  open_ports: string
}

export interface Activity {
  id: number
  device_id: number
  type: string
  message: string
  timestamp: string
  ip: string
  hostname: string
}

export interface Port {
  id: number
  device_id: number
  port: number
  service: string
  state: string
  last_seen: string
}

export interface Stats {
  total_devices: number
  online_devices: number
  offline_devices: number
  total_activities: number
}

class APIClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async getStats(): Promise<Stats> {
    return this.fetch<Stats>('/api/stats')
  }

  async getDevices(): Promise<Device[]> {
    return this.fetch<Device[]>('/api/devices')
  }

  async getDevice(ip: string): Promise<Device> {
    return this.fetch<Device>(`/api/devices/${ip}`)
  }

  async getActivity(limit: number = 100): Promise<Activity[]> {
    return this.fetch<Activity[]>(`/api/activity?limit=${limit}`)
  }

  async getDevicePorts(deviceId: number): Promise<Port[]> {
    return this.fetch<Port[]>(`/api/ports/${deviceId}`)
  }

  async triggerScan(): Promise<{ message: string }> {
    return this.fetch('/api/scan', { method: 'POST' })
  }

  async healthCheck(): Promise<{ status: string; version: string; author: string }> {
    return this.fetch('/api/health')
  }
}

export const api = new APIClient(API_URL)
