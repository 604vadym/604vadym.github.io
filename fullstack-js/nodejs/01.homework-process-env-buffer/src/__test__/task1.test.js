import { isDebugMode } from '../main.js'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

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

describe('isDebugMode', () => {
  it('should return true if NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    expect(isDebugMode()).toBe(true)
    expect(console.log).toHaveBeenCalledWith('development')
    expect(console.log).toHaveBeenCalledWith(true)
  })

  it('should return false if NODE_ENV is not development', () => {
    process.env.NODE_ENV = 'production'
    expect(isDebugMode()).toBe(false)
    expect(console.log).toHaveBeenCalledWith('production')
    expect(console.log).toHaveBeenCalledWith(false)
  })
})
