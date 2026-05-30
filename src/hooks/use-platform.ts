'use client'

import { useEffect, useState } from 'react'

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') {
    return 'unknown'
  }

  const platform = navigator.userAgentData?.platform ?? navigator.platform ?? navigator.userAgent
  const normalized = platform.toLowerCase()

  if (normalized.includes('win')) return 'windows'
  if (normalized.includes('mac')) return 'macos'
  if (normalized.includes('linux') || normalized.includes('x11')) return 'linux'

  return 'unknown'
}

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('unknown')

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  return {
    platform,
    isWindows: platform === 'windows',
    isMacOS: platform === 'macos',
    isLinux: platform === 'linux',
  }
}