import { describe, it, expect } from 'vitest'
import { getOrderStatus, OrderStatus } from '../main'
import { code } from './prepareTestEnvironment'

describe('getOrderStatus function', () => {
  it('correctly returns status messages', () => {
    expect(getOrderStatus(OrderStatus.Pending)).toEqual('Замовлення очікує на обробку')
    expect(getOrderStatus(OrderStatus.Shipped)).toEqual('Замовлення було відправлено')
    expect(getOrderStatus(OrderStatus.Delivered)).toEqual('Замовлення доставлено')
    expect(getOrderStatus(OrderStatus.Cancelled)).toEqual('Замовлення скасовано')
  })

  // Тест на перевірку присутності enum OrderStatus та коректної типізації функції
  it('Checks for the presence of OrderStatus enum and correct typing in function parameters', () => {
    const enumRegex = /enum\s+OrderStatus\s*{[\s\S]*?}/
    const functionParamRegex = /(?:function\s+getOrderStatus\(\s*status\s*:\s*OrderStatus\s*\)\s*:\s*string|(?:const|let|var)\s+getOrderStatus\s*=\s*\(\s*status\s*:\s*OrderStatus\s*\)\s*:\s*string\s*=>)/

    const isEnumPresent = enumRegex.test(code)
    const isFunctionTypedCorrectly = functionParamRegex.test(code)

    if (!isEnumPresent) {
      throw new Error('OrderStatus enum is missing or incorrectly defined.')
    }

    if (!isFunctionTypedCorrectly) {
      throw new Error('Function getOrderStatus does not have correct parameter typing or return type.')
    }
  })

  // Тест для перевірки викидання помилки
  it('throws an error for unknown order status', () => {
    expect(() => getOrderStatus('Unknown' as any)).toThrow('Невідомий статус замовлення')
  })
})
