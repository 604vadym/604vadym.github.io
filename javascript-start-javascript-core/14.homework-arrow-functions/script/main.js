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

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

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

/**
 * Дано рядок який має відкриваючі і закриваючі дужки. Порахувати кількість обох типів дужок,
 * якщо кількість дужок однакова - функція має повертати true, якщо різна - false.
 * Строка яка не має дужок має повертати false.
 *
 * Приклади:
 *
 * "(( ))" → true (2 відкриваючі, 2 закриваючі)
 * "(( )" → false (2 відкриваючі, 1 закриваюча)
 * "abc ) def ( 123 @#$ ()" → true (інші символи ігноруються)
 **/

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

const countBrackets = (data) => {
    if (typeof data !== "string") return false;
    if (data.legth === 0) return false;

    let openBracket = 0;
    let closeBracket = 0;
    for (let i = 0; i < data.length; i++) {
        if (data.charAt(i) === "(") openBracket++;
        if (data.charAt(i) === ")") closeBracket++;
    }

    if (!openBracket && !closeBracket) return false;

    return openBracket === closeBracket;
};

console.log(countBrackets("(( ))"));
console.log(countBrackets("(( )"));
console.log(countBrackets("abc ) def ( 123 @#$ ()"));
