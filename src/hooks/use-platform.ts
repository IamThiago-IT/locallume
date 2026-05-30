'use client'

import { useEffect, useState } from 'react'
import { detectPlatformFromValue, getPlatformFlags, type Platform } from '@/lib/platform'

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('unknown')

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return
    }

    const browserNavigator = navigator as Navigator & {
      userAgentData?: {
        platform?: string
      }
    }

    const platformValue = browserNavigator.userAgentData?.platform ?? browserNavigator.platform ?? browserNavigator.userAgent
    setPlatform(detectPlatformFromValue(platformValue))
  }, [])

  return {
    platform,
    ...getPlatformFlags(platform),
  }
}