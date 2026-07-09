"use strict";

console.log("JavaScriptStart #4. Домашнє завдання. Основи JavaScript: Функції");

/*
 * Функція для обчислення факторіалу
 *
 * Створіть функцію factorial, яка приймає одне число і повертає його факторіал. Факторіал числа n обчислюється як добуток всіх цілих чисел від 1 до n.
 */

function factorial(number) {
    if (number < 0) {
        return NaN;
    }
    if (number === 0 || number === 1) {
        return 1;
    }
    return number * factorial(number - 1);
}

console.log("-5! =", factorial(-5));
console.log("0! =", factorial(0));
console.log("1! =", factorial(1));
console.log("2! =", factorial(2));
console.log("3! =", factorial(3));
console.log("4! =", factorial(4));
console.log("5! =", factorial(5));
console.log("8! =", factorial(8));
console.log("15! =", factorial(15));
