import { describe, expect, it } from 'vitest'
import { addDomain, createDomainId, deleteDomain, toggleDomain, type Domain } from './domains'

describe('createDomainId', () => {
  it('normalizes dots to hyphens', () => {
    expect(createDomainId('My.App.Local')).toBe('my-app-local')
  })
})

describe('addDomain', () => {
  it('appends a new enabled domain', () => {
    const result = addDomain([], 'example.local', 'http://localhost:3000', true)

    expect(result).toEqual([
      {
        id: 'example-local',
        domain: 'example.local',
        target: 'http://localhost:3000',
        ssl: true,
        enabled: true,
      },
    ])
  })
})

describe('toggleDomain', () => {
  it('flips only the matching domain', () => {
    const domains: Domain[] = [
      { id: 'one', domain: 'one.local', target: 'http://localhost:3001', ssl: false, enabled: true },
      { id: 'two', domain: 'two.local', target: 'http://localhost:3002', ssl: true, enabled: false },
    ]

    expect(toggleDomain(domains, 'two')).toEqual([
      { id: 'one', domain: 'one.local', target: 'http://localhost:3001', ssl: false, enabled: true },
      { id: 'two', domain: 'two.local', target: 'http://localhost:3002', ssl: true, enabled: true },
    ])
  })
})

describe('deleteDomain', () => {
  it('removes the matching domain', () => {
    const domains: Domain[] = [
      { id: 'one', domain: 'one.local', target: 'http://localhost:3001', ssl: false, enabled: true },
      { id: 'two', domain: 'two.local', target: 'http://localhost:3002', ssl: true, enabled: false },
    ]

    expect(deleteDomain(domains, 'one')).toEqual([
      { id: 'two', domain: 'two.local', target: 'http://localhost:3002', ssl: true, enabled: false },
    ])
  })
})