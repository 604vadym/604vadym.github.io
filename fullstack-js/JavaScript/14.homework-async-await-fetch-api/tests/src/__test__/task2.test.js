import { postData } from '../main'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

let originalConsoleError
let originalConsoleLog

// Мокуємо `fetch` глобально за допомогою vitest
beforeEach(() => {
  originalConsoleError = console.error
  originalConsoleLog = console.log
  console.error = vi.fn()
  console.log = vi.fn()
  global.fetch = vi.fn()
})

afterEach(() => {
  console.error = originalConsoleError
  console.log = originalConsoleLog
  vi.clearAllMocks()
})

describe('postData function', () => {
  it('uses POST method to send data', async () => {
    const mockData = { title: 'Test', body: 'This is a test', userId: 1 }
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData)
    }))

    await postData('/posts', mockData)

    // Перевіряємо, що fetch викликається із правильним методом, URL, заголовками та тілом
    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        body: JSON.stringify(mockData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  })

  it('successfully posts data to an API', async () => {
    const mockData = { title: 'Test', body: 'This is a test', userId: 1 }
    global.fetch.mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData)
    }))

    const result = await postData('/posts', mockData)
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts', expect.anything())
  })

  it('returns an error message on a failed request', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 404 }))

    const result = await postData('/posts', {})
    expect(result).toContain('HTTP error! status: 404')
  })
})
