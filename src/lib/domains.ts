export interface Domain {
  id: string
  domain: string
  target: string
  ssl: boolean
  enabled: boolean
}

export function createDomainId(domain: string): string {
  return domain.toLowerCase().replace(/\./g, '-')
}

export function addDomain(domains: Domain[], domain: string, target: string, ssl: boolean): Domain[] {
  return [
    ...domains,
    {
      id: createDomainId(domain),
      domain,
      target,
      ssl,
      enabled: true,
    },
  ]
}

export function toggleDomain(domains: Domain[], domainId: string): Domain[] {
  return domains.map((domain) => (domain.id === domainId ? { ...domain, enabled: !domain.enabled } : domain))
}

export function deleteDomain(domains: Domain[], domainId: string): Domain[] {
  return domains.filter((domain) => domain.id !== domainId)
}