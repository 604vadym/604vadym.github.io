import { UserProfile } from '../main'
import { code } from './prepareTestEnvironment'
import { describe, test, expect } from 'vitest'

describe('UserProfile namespace', () => {
  test('createProfile creates a profile with given name and email', () => {
    const profile = UserProfile.createProfile('John Doe', 'john@example.com')

    expect(profile).toHaveProperty('id')
    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('john@example.com')
  })

  test('should define UserProfile as a namespace', () => {
    const namespaceRegex = /namespace UserProfile\s*{[\s\S]*}/
    expect(code).toMatch(namespaceRegex)
  })
})
