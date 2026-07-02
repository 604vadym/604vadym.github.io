"use strict";

console.log(
  "JavaScriptStart #1. Домашнє завдання. Основи JavaScript: Змінні та Типи Даних",
);

/*
 * #1 Робота з числами та округлення
 * Створіть змінну number, яка містить дробове число 7.6.
 *
 * Використовуйте метод  для округлення числа до найближчого цілого та виведіть результат в консоль.
 */

console.log(
  "******************************\n" +
    "Task 1\n" +
    "******************************",
);
const number = 7.6;
const roundedNumber = Math.round(number);
console.log("number =", number);
console.log("roundedNumber =", roundedNumber);

/*
 * #2 Обчислення кількості символів у рядку
 * Створіть змінну text, яка містить  рядок “Hello, world!” .
 *
 * Обчисліть кількість символів у цьому рядку (включаючи пробіли) та виведіть це значення в консоль.
 */

console.log(
  "******************************\n" +
    "Task 2\n" +
    "******************************",
);

const text = "Hello, world!";
const characterCount = text.length;
console.log("characterCount =", characterCount);
