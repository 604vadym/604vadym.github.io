"use strict";

console.log(
    "JavaScript Core #14. Домашнє завдання. Основи JavaScript: Стрілочні функції (Arrow Functions)",
);

/**
 * Завдання
 * Дано масив об’єктів з даними користувачів
 * Відфільтрувати масив по критерію: всі користувачі 18-ти років і старші
 * Використати стрілочну функцію у для фільтрації методом filter()
 * Вхідні дані:
 *
 *            const users = [
 *                { name: 'Kateryna', age: 25 },
 *                { name: 'Mykola', age: 17 },
 *                { name: 'Roman', age: 30 },
 *                { name: 'Konstantyn', age: 15 },
 *                { name: 'Sashko', age: 4 },
 *                { name: 'Jaroslav', age: 18 }
 *            ];
 * Приклад результату роботи фільтра для даного вхідного масиву:
 *
 * [ { name: 'Kateryna', age: 25 },
 * { name: 'Roman', age: 30 },
 * { name: 'Jaroslav', age: 18 } ]
 */

const users = [
    { name: "Kateryna", age: 25 },
    { name: "Mykola", age: 17 },
    { name: "Roman", age: 30 },
    { name: "Konstantyn", age: 15 },
    { name: "Sashko", age: 4 },
    { name: "Jaroslav", age: 18 },
];

const adultUsers = users.filter((user) => user.age >= 18);
console.log(adultUsers);
