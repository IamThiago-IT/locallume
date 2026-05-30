export interface Certificate {
  domain: string
  isValid: boolean
  expiresAt: Date
}

export function addCertificate(certificates: Certificate[], domain: string): Certificate[] {
  return [
    ...certificates,
    {
      domain,
      isValid: true,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    },
  ]
}

export function removeCertificate(certificates: Certificate[], domain: string): Certificate[] {
  return certificates.filter((certificate) => certificate.domain !== domain)
}

export function getInitialCaCertificateState(): 'Available' | 'Missing' {
  return 'Missing'
}