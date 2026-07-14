"use strict";

console.log(
    "JavaScriptStart & JavaScript Core #7. Домашнє завдання. Основи JavaScript: Масиви (Arrays)",
);

/**
 * #1 Завдання.
 * Створити масив чисел розміром 10 елементів.
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
 * #2 Задача.
 * Функція для пошуку мінімального значення в масиві
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

/**
 * #3 Завдання.
 * Сума елементів масиву:
 *
 * Згенерувати число в діапазоні від 10 до 20 і записати в змінну ‘size’
 * Створити масив розміру ‘size’
 * Заповнити його випадковими(random) числами, незалежно від розміру
 * Порахувати суму всіх чисел у масиві і вивести її у консоль
 * Приклад:
 *
 * масив [4, 0, 7, 2, 6, 11, 78, 2, -4, 19]
 *
 * сума:  133
 */

console.log(
    "******************************\n" +
        "Task 3\n" +
        "******************************",
);

const size = Math.floor(Math.random() * 11) + 10;

const numbersRand = new Array(size);

for (let i = 0; i < numbersRand.length; i++) {
    numbersRand[i] = Math.floor(Math.random() * 100);
}

const sum = numbersRand.reduce((accum, value) => accum + value);

console.log("array:", numbersRand);
console.log("sum:", sum);

/**
 * #4 Завдання.
 * Список покупок:
 *
 * створити масив строк зі списком покупок і вивести на екран
 *
 * Приклад: [‘juice’, ‘milk’, ‘potato’, ‘palyanytsia’, ‘banana’]
 *
 * Відсортувати масив і вивести на екран знову
 */

console.log(
    "******************************\n" +
        "Task 4\n" +
        "******************************",
);

const strings = ["juice", "milk", "potato", "palyanytsia", "banana"];

console.log(strings);

strings.sort();

console.log(strings);
