/** ЗАДАЧА 34 - Массив объектов
 *
 * 1. Создайте массив с 3 объектами "cars"
 *
 * 2. Каждый объект должен иметь три свойства
 *  - carBrand (строка)
 *  - price (число)
 *  - isAvailableForSale (логическое значение)
 *
 * 3. Добавьте еще один объект в массив
 *
 * 4. Выведите результирующий массив в консоль
 */
"use strict";

const cars = [
    { carBrand: "BMW", price: 80000, isAvailableForSale: true },
    { carBrand: "Lexus", price: 70000, isAvailableForSale: true },
    { carBrand: "Volkswagen", price: 55000, isAvailableForSale: true },
];

cars.push({ carBrand: "Cadillac", price: 100000, isAvailableForSale: true });

console.log(cars);
