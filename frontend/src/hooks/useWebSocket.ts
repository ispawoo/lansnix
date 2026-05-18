// LANsnix WebSocket Hook
// Created by Yasir Ispawoo (https://github.com/ispawoo)

import { useEffect, useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'

interface WebSocketMessage {
  type: string
  data: any
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(`${WS_URL}/api/ws`)

      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        toast.success('Connected to LANsnix')
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          setLastMessage(message)

          // Handle different message types
          switch (message.type) {
            case 'device_online':
              toast.success(`Device online: ${message.data.hostname || message.data.ip}`)
              break
            case 'device_offline':
              toast.error(`Device offline: ${message.data.hostname || message.data.ip}`)
              break
            case 'device_joined':
              toast.info(`New device: ${message.data.hostname || message.data.ip}`)
              break
            case 'scan_complete':
              toast.success(`Scan complete: ${message.data.count} devices found`)
              break
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        
        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...')
          connect()
        }, 5000)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [connect])

  return { isConnected, lastMessage }
}
