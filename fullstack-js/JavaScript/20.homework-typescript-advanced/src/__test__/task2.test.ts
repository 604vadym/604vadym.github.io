import { Calculator } from '../main'
import { code } from './prepareTestEnvironment'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Calculator with LogMethodCalls decorator', () => {
  let calculator: Calculator
  let logSpy: any

  beforeEach(() => {
    calculator = new Calculator()
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test('add correctly adds two numbers', () => {
    expect(calculator.add(2, 3)).toBe(5)
  })

  test('multiply correctly multiplies two numbers', () => {
    expect(calculator.multiply(2, 4)).toBe(8)
  })

  test('add logs method call', () => {
    calculator.add(5, 3)
    expect(logSpy).toHaveBeenCalledWith('Calling "add" with arguments: 5, 3')
  })

  test('multiply logs method call', () => {
    calculator.multiply(4, 2)
    expect(logSpy).toHaveBeenCalledWith('Calling "multiply" with arguments: 4, 2')
  })

  test('contains LogMethodCalls decorator on methods', () => {
    const addDecoratorRegex = /@LogMethodCalls[\s\S]*?add\s*\(/
    const multiplyDecoratorRegex = /@LogMethodCalls[\s\S]*?multiply\s*\(/
    
    expect(code).toMatch(addDecoratorRegex)
    expect(code).toMatch(multiplyDecoratorRegex)
  })
})
