"use strict";

console.log("JavaScript Core #17. Домашнє завдання. Робота з датами");

/**
 * Завдання
 * Порахувати свій вік ввівши дату народження: const dateOfBirth = new Date("1912-04-15");
 * Вивести отримане число на екран: 113 років
 * Важливо: в цьому завданні допускається розбіг з реальним значенням в +/- 1 рік, через округлення, у даному випадку з 113.5 до 114.
 */

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

const dateOfBirth = new Date("1991-02-23");
const ageMs = Date.now() - dateOfBirth.getTime();
const age = Math.floor(ageMs / 1000 / 60 / 60 / 24 / 365.2425);

console.log(age + " years");

/**
 * Дано додатне число, повернути суму його цифр.
 *
 * Приклади:
 *
 * 1234 → 10
 * 100 → 1
 * 777 → 21
 */

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

function sumOfDigits(number) {
    let sum = 0;
    while (number) {
        sum += number % 10;
        number = Math.floor(number / 10);
    }
    return sum;
}

console.log(sumOfDigits(1234)); // → 10
console.log(sumOfDigits(100)); // → 1
console.log(sumOfDigits(777)); // → 21

/**
 * Дано два додатних числа. Порахувати суму всіх чисел між ними, включно з самими числами. Гарантовано, що перше число завжди менше другого.
 *
 * Приклад:
 *
 * Вхідні дані: 3, 7
 * Очікуваний результат: 25
 * Пояснення: 3 + 4 + 5 + 6 + 7 = 25
 */

console.log(
    "******************************\n" +
        "Task 3\n" +
        "******************************",
);

function sumOfRange(start, end) {
    let sum = 0;
    do {
        sum += start++;
    } while (start <= end);
    return sum;
}

console.log(sumOfRange(3, 7)); // 25
