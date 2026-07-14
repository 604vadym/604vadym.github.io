"use strict";

console.log(
    "JavaScriptStart & JavaScript Core #7. Домашнє завдання. Основи JavaScript: Масиви (Arrays)",
);

/**
 * #1 Створити масив чисел розміром 10 елементів.
 * Записати випадкове(random) число в кожну ячейку масиву
 * Вивести масив на екран
 * складне:
 *
 * пройти по масиву і перемножити кожне 2-ге число на 2
 * Приклад:
 *
 * до:        [3,  7,  8, 3, 4,  6, 0, 2, 12,  4]
 *
 * після:    [3, 14, 8, 6, 4, 12 ,0, 4, 12, 8]
 *
 * Важливо: алгоритм має працювати для масиву любого розміру
 */

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

const numbers = new Array(10);

for (let i = 0; i < numbers.length; i++) {
    numbers[i] = Math.floor(Math.random() * 21);
}

console.log(numbers);

for (let i = 1; i < numbers.length; i += 2) {
    numbers[i] *= 2;
}

console.log(numbers);

/**
 * #2 Задача. Функція для пошуку мінімального значення в масиві
 * Створіть функцію findMin, яка приймає масив чисел і повертає мінімальне значення з цього масиву.
 */

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

const numbersArr = [17, 88, 3, 15, 11, 33];

console.log(numbersArr);

function findMin(numbers) {
    return Math.min.apply(null, numbers);
}

console.log("min number:", findMin(numbersArr));

function findMin2(numbers) {
    return Math.min(...numbers);
}

console.log("min number:", findMin2(numbersArr));

function findMin3(numbers) {
    let minNumber = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < minNumber) {
            minNumber = numbers[i];
        }
    }
    return minNumber;
}

console.log("min number:", findMin3(numbersArr));

function findMin4(numbers) {
    let minNumber = numbers[0];
    for (let number of numbers) {
        if (number < minNumber) {
            minNumber = number;
        }
    }
    return minNumber;
}

console.log("min number:", findMin4(numbersArr));

function findMin5(numbers) {
    let minNumber = numbers[0];
    numbers.forEach((number) => {
        if (number < minNumber) {
            minNumber = number;
        }
    });
    return minNumber;
}

console.log("min number:", findMin5(numbersArr));
