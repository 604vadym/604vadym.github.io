import * as main from '../main-jest.js'

describe('Module: main', () => {
  describe('Function: ageClassification()', () => {
    describe('with valid boundaries (1-122)', () => {
      test("return 'Дитинство' for the minimum valid age", () => {
        expect(main.ageClassification(1)).toBe('Дитинство')
      })

      test("return 'Дитинство' for the maximum childhood age boundary", () => {
        expect(main.ageClassification(24)).toBe('Дитинство')
      })

      test("return 'Молодість' for just above the childhood boundary", () => {
        expect(main.ageClassification(24.01)).toBe('Молодість')
      })

      test("return 'Молодість' for the maximum youth age boundary", () => {
        expect(main.ageClassification(44)).toBe('Молодість')
      })

      test("return 'Зрілість' for just above the youth boundary", () => {
        expect(main.ageClassification(44.01)).toBe('Зрілість')
      })

      test("return 'Зрілість' for the maximum maturity age boundary", () => {
        expect(main.ageClassification(65)).toBe('Зрілість')
      })

      test("return 'Старість' for just above the maturity boundary", () => {
        expect(main.ageClassification(65.1)).toBe('Старість')
      })

      test("return 'Старість' for the maximum old age boundary", () => {
        expect(main.ageClassification(75)).toBe('Старість')
      })

      test("return 'Довголіття' for just above the old age boundary", () => {
        expect(main.ageClassification(75.01)).toBe('Довголіття')
      })

      test("return 'Довголіття' for the maximum longevity boundary", () => {
        expect(main.ageClassification(90)).toBe('Довголіття')
      })

      test("return 'Рекорд' for just above the longevity boundary", () => {
        expect(main.ageClassification(90.01)).toBe('Рекорд')
      })

      test("return 'Рекорд' for the maximum possible human age boundary", () => {
        expect(main.ageClassification(122)).toBe('Рекорд')
      })
    })

    describe('with invalid/out of range inputs', () => {
      test('return null for negative age', () => {
        expect(main.ageClassification(-1)).toBeNull()
      })

      test('return null for zero age', () => {
        expect(main.ageClassification(0)).toBeNull()
      })

      test('return null for just above the maximum human age boundary', () => {
        expect(main.ageClassification(122.01)).toBeNull()
      })

      test('return null for extreme age values', () => {
        expect(main.ageClassification(150)).toBeNull()
      })
    })
  })

  describe('Function: weekFn()', () => {
    describe('with valid day numbers (1-7)', () => {
      test("return 'Понеділок' for day 1", () => {
        expect(main.weekFn(1)).toBe('Понеділок')
      })

      test("return 'Вівторок' for day 2", () => {
        expect(main.weekFn(2)).toBe('Вівторок')
      })

      test("return 'Середа' for day 3", () => {
        expect(main.weekFn(3)).toBe('Середа')
      })

      test("return 'Четвер' for day 4", () => {
        expect(main.weekFn(4)).toBe('Четвер')
      })

      test("return 'П'ятниця' for day 5", () => {
        expect(main.weekFn(5)).toBe("П'ятниця")
      })

      test("return 'Субота' for day 6", () => {
        expect(main.weekFn(6)).toBe('Субота')
      })

      test("return 'Неділя' for day 7", () => {
        expect(main.weekFn(7)).toBe('Неділя')
      })
    })

    describe('with invalid inputs', () => {
      test('return null for out-of-range integer', () => {
        expect(main.weekFn(9)).toBeNull()
      })

      test('return null for floating-point number', () => {
        expect(main.weekFn(1.5)).toBeNull()
      })

      test('return null for string input due to strict comparison', () => {
        expect(main.weekFn('2')).toBeNull()
      })
    })
  })

  describe('Function: generateArray()', () => {
    describe('with valid keys', () => {
      test("return [1, 2, 3] when key is '123'", () => {
        expect(main.generateArray('123')).toEqual([1, 2, 3])
      })

      test("return [8, 8, 8] when key is '888'", () => {
        expect(main.generateArray('888')).toEqual([8, 8, 8])
      })
    })

    describe('with invalid keys', () => {
      test('return an empty array for an unmapped string key', () => {
        expect(main.generateArray('unknown')).toEqual([])
      })

      test('return an empty array when key has a trailing space', () => {
        expect(main.generateArray('888 ')).toEqual([])
      })
    })
  })

  describe('Function generateObject()', () => {
    describe('with valid keys', () => {
      test("return a specific object when key is '123'", () => {
        expect(main.generateObject('123')).toEqual({
          a: 1,
          b: 2,
          c: 3
        })
      })

      test("return a specific object when key is '888'", () => {
        expect(main.generateObject('888')).toEqual({
          a: 8,
          b: 8,
          c: 8
        })
      })
    })

    describe('with invalid keys', () => {
      test('return an empty object for an unmapped string key', () => {
        expect(main.generateObject('unknown')).toEqual({})
      })

      test('return an empty object when key has a trailing space', () => {
        expect(main.generateObject('888 ')).toEqual({})
      })
    })

    describe('with missing inputs', () => {
      test('return null when the argument is completely omitted', () => {
        expect(main.generateObject()).toBeNull()
      })
    })
  })

  describe('Function addToArr()', () => {
    describe('when the string is not present in the array', () => {
      test('add the string without removing existing elements', () => {
        const expectedString = 'hello'
        const initialArray = ['hi', 'hallo', 'bonjour']

        const result = main.addToArr(expectedString, initialArray)
        expect(result).toContain(expectedString)
        expect(result).toEqual(expect.arrayContaining(initialArray))
        expect(result).toHaveLength(initialArray.length + 1)
      })
    })

    describe('when the string already exists in the array', () => {
      test('return the original array without adding duplicates', () => {
        const expectedString = 'hi'
        const initialArray = [expectedString, 'hallo', 'bonjour']

        expect(main.addToArr(expectedString, initialArray)).toEqual(initialArray)
      })
    })
  })

  describe('Object: shoppingCart', () => {
    beforeEach(() => {
      main.shoppingCart.clear()
    })

    describe('clear()', () => {
      test('remove all items and reset the cart to an empty state', () => {
        main.shoppingCart.addItem({ name: 'Laptop', price: 1000 })
        expect(main.shoppingCart.items).not.toHaveLength(0)
        main.shoppingCart.clear()
        expect(main.shoppingCart.items).toEqual([])
      })
    })

    describe('addItem()', () => {
      test('append a valid item to the cart and return true', () => {
        const product = { name: 'Laptop', price: 1000 }
        const result = main.shoppingCart.addItem(product)

        expect(result).toBe(true)
        expect(main.shoppingCart.items).toEqual([product])
      })

      test('return false and not modify items when item structure is invalid', () => {
        const product = { name: 'Laptop' }
        const result = main.shoppingCart.addItem(product)

        expect(result).toBe(false)
        expect(main.shoppingCart.items).toHaveLength(0)
      })
    })

    describe('getTotalPrice()', () => {
      test('calculate total sum correctly for multiple items', () => {
        main.shoppingCart.addItem({ name: 'Laptop', price: 1000 })
        main.shoppingCart.addItem({
          name: 'Headphones',
          price: 2500
        })

        expect(main.shoppingCart.getTotalPrice()).toBe(3500)
      })

      test('return 0 when the cart is completely empty', () => {
        expect(main.shoppingCart.getTotalPrice()).toBe(0)
      })
    })
  })
})
