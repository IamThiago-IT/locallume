'use client'

import { useState, useEffect } from 'react'
import { addDomain as addDomainEntry, deleteDomain as deleteDomainEntry, toggleDomain as toggleDomainEntry, type Domain } from '@/lib/domains'

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [hasHostsPermissions, setHasHostsPermissions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize with empty state
    setHasHostsPermissions(false)
  }, [])

  const addDomain = async (domain: string, target: string, ssl: boolean): Promise<boolean> => {
    try {
      // TODO: Implement API call to add domain
      setDomains((currentDomains) => addDomainEntry(currentDomains, domain, target, ssl))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add domain')
      return false
    }
  }

  const toggleDomain = async (domainId: string): Promise<void> => {
    try {
      // TODO: Implement API call to toggle domain
      setDomains((currentDomains) => toggleDomainEntry(currentDomains, domainId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle domain')
    }
  }

  const deleteDomain = async (domainId: string): Promise<void> => {
    try {
      // TODO: Implement API call to delete domain
      setDomains((currentDomains) => deleteDomainEntry(currentDomains, domainId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete domain')
    }
  }

  return {
    domains,
    hasHostsPermissions,
    error,
    addDomain,
    toggleDomain,
    deleteDomain,
  }
}
