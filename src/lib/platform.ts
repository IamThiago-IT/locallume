export type Platform = 'windows' | 'macos' | 'linux' | 'unknown'

export function detectPlatformFromValue(value?: string | null): Platform {
  if (!value) {
    return 'unknown'
  }

  const normalized = value.toLowerCase()

  if (normalized.includes('win')) return 'windows'
  if (normalized.includes('mac')) return 'macos'
  if (normalized.includes('linux') || normalized.includes('x11')) return 'linux'

  return 'unknown'
}

export function getPlatformFlags(platform: Platform) {
  return {
    isWindows: platform === 'windows',
    isMacOS: platform === 'macos',
    isLinux: platform === 'linux',
  }
}