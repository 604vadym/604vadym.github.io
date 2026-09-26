import { deleteData } from '../main'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

let originalConsoleError // Визначаємо змінну в області видимості, доступній для обох хуків
let originalConsoleLog // Визначаємо змінну в області видимості, доступній для обох хуків

// Мокуємо `fetch` глобально за допомогою vitest
beforeEach(() => {
  originalConsoleError = console.error // Зберігаємо оригінальний console.error
  originalConsoleLog = console.log // Зберігаємо оригінальний console.log
  console.error = vi.fn() // Приглушаємо console.error
  console.log = vi.fn() // Приглушаємо console.log
  global.fetch = vi.fn()
})

afterEach(() => {
  console.error = originalConsoleError // Відновлюємо console.error
  console.log = originalConsoleLog // Відновлюємо console.log
  vi.clearAllMocks()
})

describe('deleteData function error handling', () => {
  it('returns true on successful deletion', async () => {
    // Симулюємо успішну відповідь
    global.fetch.mockResolvedValue({ ok: true, status: 200 })

    const id = 1 // Використовуємо ідентифікатор для сценарію успішного видалення
    const result = await deleteData(id)
    expect(result).toBe(true) // Явно перевіряємо, що результат є true

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })

  it('returns error message when the fetch call fails', async () => {
    // Симулюємо помилку fetch запиту
    global.fetch.mockRejectedValue(new Error('Network failure'))

    const id = 3 // Використовуємо ідентифікатор, який симулює сценарій помилки
    const result = await deleteData(id)
    expect(result).toBe('Network failure') // Перевіряємо, що функція повернула повідомлення помилки

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })

  it('returns status code on non-200 response', async () => {
    // Симулюємо відповідь, що імітує неуспішне видалення
    global.fetch.mockResolvedValue({ ok: false, status: 500 })

    const id = 4 // Ідентифікатор для сценарію неуспішного видалення
    const result = await deleteData(id)
    expect(result).toBe(500) // Перевіряємо, що функція повернула статус код помилки

    // Перевіряємо, що fetch був викликаний з правильним URL і методом
    expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE'
    })
  })
})
