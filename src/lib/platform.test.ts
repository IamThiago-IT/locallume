import { describe, expect, it } from 'vitest'
import { detectPlatformFromValue, getPlatformFlags } from './platform'

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