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
    console.log("Count of negative numbers in array:", result);
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
    console.log("Count of negative numbers in array:", result);
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
    console.log("Count of negative numbers in array:", result);
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
    console.log("Count of negative numbers in array:", result);
}
