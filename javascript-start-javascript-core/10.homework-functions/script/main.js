"use strict";

console.log(
    "JavaScript Core #10. Домашнє завдання. Основи JavaScript: Функції",
);

/**
 * Завдання
 * 1. Створити калькулятор у вигляді функції calc яка приймає три параметри:
 *
 * операнд 1
 * операнд 2
 * математичну операцію у вигляді символа
 * 2. Операції які мають підтримуватися:
 *
 * додавання
 * віднімання
 * множення
 * ділення
 * 3. Викликати функцію з різними параметрами і вивести всі результати на екран
 *
 * 4. Функція має перевіряти що операнд_1 і операнд_2 є числами
 *
 * 5. Якщо любий з операндів не є числом - виводити помилку у консоль
 *
 * Приклад використання калькулятора:
 *
 *       calc(2, 12, "*");		 // результат: 24
 *       calc(6, -2, "+"); 		// результат: 4
 *       calc(5, 17, "-"); 		// результат: -12
 *       calc(100, 4, "/"); 		// результат: 25
 */

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

function calc(operand1, operand2, operation) {
    if (!Number.isFinite(operand1)) {
        console.log(`Error: invalid operand1: ${operand1}`);
        return;
    }
    if (!Number.isFinite(operand2)) {
        console.log(`Error: invalid operand2: ${operand2}`);
        return;
    }

    let result;
    switch (operation) {
        case "+":
            result = operand1 + operand2;
            break;
        case "-":
            result = operand1 - operand2;
            break;
        case "*":
            result = operand1 * operand2;
            break;
        case "/":
            if (operand2 === 0) {
                console.log("Error: division by zero");
                return;
            }
            result = operand1 / operand2;
            break;
        default:
            console.log(`Error: invalid operation: ${operation}`);
            return;
    }

    console.log(`${operand1} ${operation} ${operand2} = ${result}`);
}

calc(2, 12, "*"); // результат: 24
calc(6, -2, "+"); // результат: 4
calc(5, 17, "-"); // результат: -12
calc(100, 4, "/"); // результат: 25

console.log("******************************");

calc("hello", 4, "+"); // Error: invalid operand
calc(100, "hi", "*"); // Error: invalid operand
calc(100, 4, "plus"); // Error: invalid operation
calc(100, 4, 5); // Error: invalid operation
calc(100, 0, "/"); // Error: division by zero

/**
 * Дано масив чисел array. Порахувати скільки від'ємних чисел у масиві.
 *
 * Приклад вхідного масиву:
 *
 * [9, -2, 0, 100, -35, 6, 23, 8, 1, -1, 0, 12]
 * Очікуємий результат: 3
 */

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

{
    function findNegativeNumbers(array) {
        let counter = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] < 0) {
                counter++;
            }
        }
        return counter;
    }

    const numbers = [9, -2, 0, 100, -35, 6, 23, 8, 1, -1, 0, 12];

    const result = findNegativeNumbers(numbers);

    console.log(numbers);
    console.log("Count of negative numbers in array:", result); // Очікуємий результат: 3
}

console.log("******************************");

{
    function findNegativeNumbers(array) {
        return array.reduce(
            (counter, value) => (value < 0 ? counter + 1 : counter),
            0,
        );
    }

    const numbers = [9, -2, 0, 100, -35, 6, 23, 8, 1, -1, 0, 12];

    const result = findNegativeNumbers(numbers);

    console.log(numbers);
    console.log("Count of negative numbers in array:", result); // Очікуємий результат: 3
}

console.log("******************************");

{
    function findNegativeNumbers(array) {
        let counter = 0;
        array.forEach((value) => {
            if (value < 0) ++counter;
        });
        return counter;
    }

    const numbers = [9, -2, 0, 100, -35, 6, 23, 8, 1, -1, 0, 12];

    const result = findNegativeNumbers(numbers);

    console.log(numbers);
    console.log("Count of negative numbers in array:", result); // Очікуємий результат: 3
}

console.log("******************************");

{
    function findNegativeNumbers(array) {
        let counter = 0;
        for (const value of array) {
            if (value < 0) ++counter;
        }
        return counter;
    }

    const numbers = [9, -2, 0, 100, -35, 6, 23, 8, 1, -1, 0, 12];

    const result = findNegativeNumbers(numbers);

    console.log(numbers);
    console.log("Count of negative numbers in array:", result); // Очікуємий результат: 3
}

/**
 * Завдання
 * Створити функцію even() яка приймає “…args” на вхід
 * Функція має визначати чи є параметр числом
 * Якщо параметр є позитивним парним числом - він має додаватися в масив result
 * Функція має повертати масив заповнений тільки парними числами (2,4,6,8,10, …)
 * Отриманий масив вивести на екран
 * Приклад 1:
 *
 * Вхідні параметри:
 *
 * let array = even(4, 9, 16, 25, 29, 180, 66, 77, “hello”, true, 0, 128, 11);
 * Результат:
 * { 4, 16, 180, 66, 128 }
 * Приклад 2:
 *
 * Вхідні параметри:
 *
 * let array = even(-5, 7, undefined, null, 1024, “$”, “(”, “)”, 0, 64, {age: 12});
 * Результат:
 * { 1024, 64 }
 */

console.log(
    "******************************\n" +
        "Task 3\n" +
        "******************************",
);

function even(...args) {
    return args.filter(
        (arg) => typeof arg == "number" && arg > 0 && arg % 2 === 0,
    );
}

let array = even(4, 9, 16, 25, 29, 180, 66, 77, "hello", true, 0, 128, 11);
console.log(array); // Результат: [ 4, 16, 180, 66, 128 ]

array = even(-5, 7, undefined, null, 1024, "$", "(", ")", 0, 64, { age: 12 });
console.log(array); // Результат: [ 1024, 64 ]

/**
 * Дано масив чисел array, порахувати середнє арифметичне всіх чисел у ньому. Функція має повертати число якщо масив не пустий, і нуль у випадку якщо масив пустий.
 *
 * Приклади:
 *
 * [10, 20, 30] → 20
 * [100, 300, 500, 700] → 400
 */

console.log(
    "******************************\n" +
        "Task 4\n" +
        "******************************",
);

function calculateAverage(arr) {
    return arr.length === 0
        ? 0
        : arr.reduce((acc, val) => acc + val, 0) / arr.length;
}

console.log(calculateAverage([10, 20, 30])); // → 20
console.log(calculateAverage([100, 300, 500, 700])); // → 400
console.log(calculateAverage([])); // → 0
