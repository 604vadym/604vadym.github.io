import { describe, it, expect } from 'vitest'
import { code } from './prepareTestEnvironment'
import { sumArray } from '../main'

describe('sumArray', () => {
  const functionRegex =
    /(?:function\s+sumArray\s*\([\s\S]*?\)\s*:\s*number\s*\{[\s\S]*?\}|(?:const|let|var)\s+sumArray\s*=\s*\([\s\S]*?\)\s*:\s*number\s*=>\s*\{[\s\S]*?\})/
  const match = code.match(functionRegex)
  const sumArrayCode = match ? match[0] : 'Функція не знайдена.'

  it('returns the sum of all numbers in the array', () => {
    expect(sumArray([1, 2, 3, 4])).toBe(10)
  })

  it('uses correct typing for parameters and return type', () => {
    const regex = /\(\s*numbers\s*:\s*(number\[\]|Array<number>)\s*\)\s*:\s*number/
    if (!regex.test(sumArrayCode)) {
      throw new Error("The 'sumArray' function does not use the correct typing for parameters and return type.")
    }
  })

  it('uses correct typing for return type', () => {
    const regexReturn = /:\s*number/ // Allows optional space between ':' and 'number'
    if (!regexReturn.test(sumArrayCode)) {
      throw new Error("The 'sumArray' function does not correctly specify the return type as 'number'.")
    }
  })

  if (!sumArrayCode) {
    throw new Error("The 'sumArray' function code could not be found in the provided code.")
  }
})
