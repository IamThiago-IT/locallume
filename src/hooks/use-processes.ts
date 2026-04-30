'use client'

import { useState, useEffect } from 'react'

interface Process {
  name: string
  framework: string
  port: number
  pid: number
  status: 'running' | 'stopped'
}

export function useProcesses() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize with empty state
    setLoading(false)
  }, [])

  const refresh = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      // TODO: Implement API call to fetch processes
      setProcesses([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch processes')
    } finally {
      setLoading(false)
    }
  }

  return {
    processes,
    loading,
    error,
    refresh,
  }
}
