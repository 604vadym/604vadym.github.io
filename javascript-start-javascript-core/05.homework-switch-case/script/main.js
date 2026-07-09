"use strict";

console.log(
    "JavaScript Core #4. Домашнє завдання. Основи JavaScript: Оператор switch",
);

/*
 * Завдання на використання оператора SWITCH.
 *
 * Згенерувати число від 1 до 7, і вивести в консоль відповідний день тижня
 *
 * Наприклад: якщо число 5 - вивести “П’ятниця”, якшо 2 - “Вівторок”
 */

const number = Math.floor(Math.random() * 7) + 1;
console.log("Generated number =", number);

switch (number) {
    case 1:
        console.log("Понеділок");
        break;
    case 2:
        console.log("Вівторок");
        break;
    case 3:
        console.log("Середа");
        break;
    case 4:
        console.log("Четвер");
        break;
    case 5:
        console.log("П’ятниця");
        break;
    case 6:
        console.log("Субота");
        break;
    case 7:
        console.log("Неділя");
        break;
}
