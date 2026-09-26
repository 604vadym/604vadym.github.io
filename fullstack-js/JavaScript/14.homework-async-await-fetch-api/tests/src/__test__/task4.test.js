import { patchData } from '../main'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

let originalConsoleError
let originalConsoleLog

// Мокуємо `fetch` глобально за допомогою vitest
beforeEach(() => {
  originalConsoleError = console.error
  originalConsoleLog = console.log
  console.error = vi.fn()
  console.log = vi.fn()
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ message: 'Success' })
    })
  )
})

afterEach(() => {
  console.error = originalConsoleError
  console.log = originalConsoleLog
  vi.clearAllMocks()
})

describe('patchData function', () => {
  it('successfully updates data and returns the result', async () => {
    const id = 1
    const newData = { title: 'Updated Title' }

    const result = await patchData(id, newData)
    expect(result).toEqual({ message: 'Success' })
    expect(fetch).toHaveBeenCalledWith(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(newData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })

  it('returns an error message on fetch failure', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')))

    const result = await patchData(1, {})
    expect(result).toContain('Network error')
  })
})
