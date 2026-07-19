"use strict";

console.log(
    "JavaScript Core #8. Домашнє завдання. Основи JavaScript: Структура даних Set",
);

/**
 * Завдання
 * Створити set чисел, в якому 10 унікальних елементів.
 * Елементи мають бути згенеровані рандомом.
 * Вивести set в консоль.
 * Приклад:
 *
 * { 5, 7, 1, 10, 6, 3, 8, 4, 9, 2}
 */

const numbers = new Set();

while (numbers.size < 10) {
    numbers.add(Math.floor(Math.random() * 11));
}

console.log(numbers);
