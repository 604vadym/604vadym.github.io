/** ЗАДАЧА 79 - Перебор свойств объекта
 *
 * 1. Создайте функцию "sumObjectValues", которая будет суммировть
 * все значения свойств, которые являются числами.
 *
 * 2. Сумму чисел необходимо вернуть из функции
 *
 * 3. Убедитесь, что итерация выполняется только
 * по собственным свойствам объекта
 */
"use strict";

const objectWithNumbers = {
    a: 10,
    b: 20,
    c: "string",
    d: 12,
};

function sumObjectValues(obj) {
    return Object.values(obj).reduce(
        (accum, value) => (typeof value === "number" ? accum + value : accum),
        0,
    );
}

function sumObjectValuesWithDestruct(obj) {
    let sum = 0;
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "number") sum += value;
    }
    return sum;
}

const result = sumObjectValues(objectWithNumbers);
console.log(result);
//42

const result2 = sumObjectValuesWithDestruct(objectWithNumbers);
console.log(result2);
//42
