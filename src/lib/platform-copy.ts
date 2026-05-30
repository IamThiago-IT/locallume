import type { Platform } from '@/lib/platform'

export function getServiceManagementDescription(platform: Platform): string {
  if (platform === 'windows') {
    return 'Install LocalLume as a Windows service to run automatically in the background'
  }

  if (platform === 'macos') {
    return 'Install LocalLume as a background service for macOS'
  }

  if (platform === 'linux') {
    return 'Install LocalLume as a background service for Linux'
  }

  return 'Install LocalLume as a background service for your system'
}

export function getCertificateTrustSteps(platform: Platform): string[] {
  const trustStepByPlatform = {
    windows: 'Install the CA certificate in the Windows certificate store.',
    macos: 'Import the CA certificate into Keychain Access and mark it as trusted.',
    linux: 'Add the CA certificate to your system trust store.',
    unknown: 'Add the CA certificate to your system trust store.',
  } as const

  return [trustStepByPlatform[platform], 'Restart your browser after trusting the certificate.']
}