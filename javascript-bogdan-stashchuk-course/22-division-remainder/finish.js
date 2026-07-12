/** ЗАДАЧА 22 - Остаток от деления
 *
 * 1. Выведите в консоль остаток от деления "myNumber1" на "myNumber2".
 *
 * 2. Какой приоритет и ассоциативность
 * имеет оператор остаток от деления?
 *
 * 3. Проверьте ассоциативность самостоятельно
 */
"use strict";

const myNumber1 = 10; // 10 = 3 + 3 + 3 + 1
const myNumber2 = 3;

console.log(myNumber1 % myNumber2);

//prettier-ignore
if (28 % 10 % 3 === ((28 % 10) % 3)) {
    console.log("Opearator % associativity is left-to-right");
}
else {
    console.log("Opearator % associativity is right-to-left");
}
