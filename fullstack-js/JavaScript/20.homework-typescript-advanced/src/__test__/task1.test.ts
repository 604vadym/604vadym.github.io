import { code } from './prepareTestEnvironment'
import { createPerson } from '../main'
import { describe, test, expect } from 'vitest'

describe('createPerson function', () => {
  test('should return a Person object with correct properties', () => {
    const name = 'Анна'
    const age = 25
    const isActive = true

    const result = createPerson(name, age, isActive)

    // Перевіряємо, що результат є об'єктом з правильними властивостями
    expect(result).toEqual({ name, age, isActive })
  })

  test('should return a Person object with isActive set to false', () => {
    const name = 'Олег'
    const age = 30
    const isActive = false // Передаємо false для isActive

    const result = createPerson(name, age, isActive)

    // Перевіряємо, що результат містить isActive: false
    expect(result.isActive).toBe(false)
  })

  // Тест на перевірку типів властивостей об'єкта Person
  test('should have properties of correct types', () => {
    const name = 'Іван'
    const age = 40
    const isActive = true

    const person = createPerson(name, age, isActive)

    expect(typeof person.name).toBe('string')
    expect(typeof person.age).toBe('number')
    expect(typeof person.isActive).toBe('boolean')
  })

  test('Checks for the presence of PersonInterface and its properties', () => {
    // Перевіряємо наявність декларації інтерфейсу
    const interfaceDeclarationMatch = /interface\s+PersonInterface\s*\{/.test(code)
    expect(interfaceDeclarationMatch).toBe(true)

    // Перевіряємо наявність необхідних властивостей всередині інтерфейсу
    const interfaceBodyMatch = code.match(/interface\s+PersonInterface\s*\{([^}]+)\}/)
    expect(interfaceBodyMatch).not.toBeNull()

    if (interfaceBodyMatch) {
      const body = interfaceBodyMatch[1]
      expect(/name\s*:\s*string/.test(body)).toBe(true)
      expect(/age\s*:\s*number/.test(body)).toBe(true)
      expect(/isActive\s*:\s*boolean/.test(body)).toBe(true)
    }
  })

  test('Checks for the correct typing in function parameters', () => {
    // Перевіряємо наявність правильної сигнатури функції
    expect(/function\s+createPerson\s*\(/.test(code)).toBe(true)
    
    // Перевіряємо наявність правильних параметрів
    const functionSignatureMatch = code.match(/function\s+createPerson\s*\(([^)]+)\)\s*:\s*PersonInterface/)
    expect(functionSignatureMatch).not.toBeNull()

    if (functionSignatureMatch) {
      const params = functionSignatureMatch[1]
      expect(/name\s*:\s*string/.test(params)).toBe(true)
      expect(/age\s*:\s*number/.test(params)).toBe(true)
      expect(/isActive\s*:\s*boolean/.test(params)).toBe(true)
    }
  })
})
