import { describe, expect, it } from 'vitest'
import { addCertificate, getInitialCaCertificateState, removeCertificate, type Certificate } from './certificates'

describe('addCertificate', () => {
  it('appends a valid certificate with an expiration date', () => {
    const result = addCertificate([], 'example.local')

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      domain: 'example.local',
      isValid: true,
    })
    expect(result[0].expiresAt).toBeInstanceOf(Date)
  })
})

describe('removeCertificate', () => {
  it('removes only the matching certificate', () => {
    const certificates: Certificate[] = [
      { domain: 'one.local', isValid: true },
      { domain: 'two.local', isValid: false },
    ]

    expect(removeCertificate(certificates, 'one.local')).toEqual([{ domain: 'two.local', isValid: false }])
  })
})

describe('getInitialCaCertificateState', () => {
  it('defaults the CA certificate to missing', () => {
    expect(getInitialCaCertificateState()).toBe('Missing')
  })
})