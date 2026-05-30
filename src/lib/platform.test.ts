import { describe, expect, it } from 'vitest'
import { detectPlatformFromValue, getPlatformFlags } from './platform'
import { getCertificateTrustSteps, getServiceManagementDescription } from './platform-copy'

describe('detectPlatformFromValue', () => {
  it('detects windows values', () => {
    expect(detectPlatformFromValue('Win32')).toBe('windows')
    expect(detectPlatformFromValue('Windows NT 10.0')).toBe('windows')
  })

  it('detects macos values', () => {
    expect(detectPlatformFromValue('MacIntel')).toBe('macos')
    expect(detectPlatformFromValue('Mac OS X')).toBe('macos')
  })

  it('detects linux values', () => {
    expect(detectPlatformFromValue('Linux x86_64')).toBe('linux')
    expect(detectPlatformFromValue('X11; Linux x86_64')).toBe('linux')
  })

  it('falls back to unknown when it cannot infer the platform', () => {
    expect(detectPlatformFromValue('SomethingElse')).toBe('unknown')
    expect(detectPlatformFromValue(undefined)).toBe('unknown')
  })
})

describe('getPlatformFlags', () => {
  it('derives flags from the platform value', () => {
    expect(getPlatformFlags('windows')).toEqual({
      isWindows: true,
      isMacOS: false,
      isLinux: false,
    })
  })
})

describe('cross-platform copy helpers', () => {
  it('describes service installation per platform', () => {
    expect(getServiceManagementDescription('windows')).toContain('Windows service')
    expect(getServiceManagementDescription('macos')).toContain('macOS')
    expect(getServiceManagementDescription('linux')).toContain('Linux')
    expect(getServiceManagementDescription('unknown')).toContain('your system')
  })

  it('returns certificate trust steps per platform', () => {
    expect(getCertificateTrustSteps('windows')[0]).toContain('Windows certificate store')
    expect(getCertificateTrustSteps('macos')[0]).toContain('Keychain Access')
    expect(getCertificateTrustSteps('linux')[0]).toContain('system trust store')
    expect(getCertificateTrustSteps('unknown')[0]).toContain('system trust store')
  })
})