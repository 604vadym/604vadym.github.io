import { isValidUrl } from '../main'

describe('URL Validation Tests', () => {
  test('Validates a correct URL', () => {
    expect(isValidUrl('https://www.example.com')).toBe(true)
  })

  test('Validates a URL without WWW', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
  })

  test('Rejects a URL without HTTP or HTTPS', () => {
    expect(isValidUrl('www.example.com')).toBe(false)
  })

  test('Rejects a malformed URL', () => {
    expect(isValidUrl('example.')).toBe(false)
  })

  test('Handles empty string', () => {
    expect(isValidUrl('')).toBe(false)
  })

  test('Handles undefined', () => {
    expect(isValidUrl(undefined)).toBe(false)
  })
})
