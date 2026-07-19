/** ЗАДАЧА 33 - Добавление элемента по определенному индексу
 *
 * 1. Добавить элемент "abc" с индексом 10.
 *
 * 2. Выведите результирующий массив в консоль. Объясните результаты.
 *
 * 3. Какова длина конечного массива?
 */
"use strict";

const myArray = [1, 2];

myArray[10] = "abc";

console.log(myArray);
console.log(
    "Element added at index 10 and 8 items of array are empty because we didn't assign any value to them so the are undefined - empty. We should not add elements to array this way, we should use method 'push()' instead to add new element to array.",
);
console.log("Length of array is 11");
console.log(myArray.length);
