import { safeDecodeFromBase64, safeDecodeFromHex } from '../main.js'
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'

let originalConsoleError // Визначаємо змінну в області видимості, доступній для обох хуків
let originalConsoleLog // Визначаємо змінну в області видимості, доступній для обох хуків

// Мокуємо `fetch` глобально за допомогою vitest
beforeEach(() => {
  vi.resetAllMocks()
  originalConsoleError = console.error // Зберігаємо оригінальний console.error
  originalConsoleLog = console.log // Зберігаємо оригінальний console.log
  console.error = vi.fn() // Приглушаємо console.error
  console.log = vi.fn() // Приглушаємо console.log
})

afterEach(() => {
  console.error = originalConsoleError // Відновлюємо console.error
  console.log = originalConsoleLog // Відновлюємо console.log
})

describe('Safe Decoder Functions', () => {
  test('safeDecodeFromBase64 correctly decodes a valid base64 string', () => {
    const validBase64 = Buffer.from('hello:world').toString('base64')
    expect(safeDecodeFromBase64(validBase64)).toBe('hello:world')
    expect(console.log).toHaveBeenCalledWith('hello:world')
  })

  test('safeDecodeFromBase64 throws error on invalid base64 input', () => {
    const invalidBase64 = 'not*valid*base64'
    expect(() => safeDecodeFromBase64(invalidBase64)).toThrow('Invalid base64 string')
    expect(console.error).toHaveBeenCalledWith('Invalid base64 string')
  })

  test('safeDecodeFromHex correctly decodes a valid hex string', () => {
    const validHex = Buffer.from('hello:world').toString('hex')
    expect(safeDecodeFromHex(validHex)).toBe('hello:world')
    expect(console.log).toHaveBeenCalledWith('hello:world')
  })

  test('safeDecodeFromHex throws error on invalid hex input', () => {
    const invalidHex = 'notHex'
    expect(() => safeDecodeFromHex(invalidHex)).toThrow('Invalid hex string')
    expect(console.error).toHaveBeenCalledWith('Invalid hex string')
  })
})
