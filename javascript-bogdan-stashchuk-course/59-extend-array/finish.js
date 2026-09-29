/** ЗАДАЧА 59 - Расширение массивов
 *
 * 1. Создайте новый класс "ExtendedArray", который должен расширять встроенный "Array"
 *
 * 2. Добавьте в новый класс два пользовательских метода:
 *  - "sum" - он должен возвращать сумму всех элементов массива
 *  - "onlyNumbers" - должен возвращать новый массив,
 * который будет содержать только числа из исходного массива
 *
 * 3. Создайте несколько экземпляров нового класса "ExtendedArray"
 * и протестируйте оба метода "sum" и "onlyNumbers".
 *
 * 4. Убедитесь, что остальные методы массивов такие,
 * как "forEach", "map" также доступны
 */
"use strict";

class ExtendedArray extends Array {
    sum() {
        return this.onlyNumbers().reduce((accum, value) => accum + value, 0);
    }

    onlyNumbers() {
        return this.filter((element) => typeof element === "number");
    }
}

const extendedArr1 = new ExtendedArray(1, 2, 3, 4, 5);
const extendedArr2 = new ExtendedArray(10, 15, null, 20, 25, 30);
const extendedArr3 = new ExtendedArray(25, 25, "Hello", 25, true, undefined);

console.log(extendedArr1.sum());
console.log(extendedArr2.sum());
console.log(extendedArr3.sum());

console.log(extendedArr1.onlyNumbers());
console.log(extendedArr2.onlyNumbers());
console.log(extendedArr3.onlyNumbers());

extendedArr1.forEach((element) => console.log(element));
console.log(extendedArr2.map((element) => "Element value: " + element));
console.log(extendedArr3.filter((element) => typeof element === "string"));
