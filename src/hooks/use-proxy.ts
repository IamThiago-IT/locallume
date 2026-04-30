'use client'

import { useState } from 'react'

interface ProxyStatus {
  isRunning: boolean
  httpPort: number | null
  httpsPort: number | null
}

export function useProxy() {
  const [status, setStatus] = useState<ProxyStatus>({
    isRunning: false,
    httpPort: null,
    httpsPort: null,
  })

  const startProxy = async (port: number): Promise<void> => {
    try {
      // TODO: Implement API call to start proxy
      setStatus({
        isRunning: true,
        httpPort: port,
        httpsPort: port + 1,
      })
    } catch (error) {
      console.error('Failed to start proxy:', error)
    }
  }

  const stopProxy = async (): Promise<void> => {
    try {
      // TODO: Implement API call to stop proxy
      setStatus({
        isRunning: false,
        httpPort: null,
        httpsPort: null,
      })
    } catch (error) {
      console.error('Failed to stop proxy:', error)
    }
  }

  return {
    status,
    startProxy,
    stopProxy,
  }
}
