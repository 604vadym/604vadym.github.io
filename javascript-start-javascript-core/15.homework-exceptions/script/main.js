"use strict";

console.log(
    "JavaScript Core #15. Домашнє завдання. Основи JavaScript: Обробка помилок у JavaScript",
);

/**
 * Завдання
 * Додати try/catch блок до калькулятора
 * Якщо один з аргументів не є числом - кинути помилку (throw)
 * Якщо операція (string) не корректна  - кинути помилку (throw)
 * Додати блок finally який виводить у консоль повідомлення що калькулятор завершив свою роботу.
 */

function calc(operand1, operand2, operation) {
    if (!Number.isFinite(operand1)) {
        throw new Error(`Invalid operand1: ${operand1}`);
    }
    if (!Number.isFinite(operand2)) {
        throw new Error(`Invalid operand2: ${operand2}`);
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
                throw new Error("Error: division by zero");
            }
            result = operand1 / operand2;
            break;
        default:
            throw new Error(`Invalid operation: ${operation}`);
    }

    console.log(`${operand1} ${operation} ${operand2} = ${result}`);
}

try {
    try {
        calc("hello", 4, "+");
        throw new Error("some exception from try");
    } catch (error) {
        console.error(error.message);
        throw new Error("some exception from catch");
    } finally {
        console.log("function calc() has completed");
        console.log("This will be logged even with exception inside try/catch");
    }
} catch (error) {
    console.log(error.message);
}

try {
    calc(100, "hi", "*");
} catch (error) {
    console.error(error.message);
} finally {
    console.log("function calc() has completed");
}

const foo = (() => {
    try {
        calc(100, 4, "plus");
        return;
    } catch (error) {
        console.error(error.message);
        return;
    } finally {
        console.log("function calc() has completed");
        console.log("This will be logged even with return inside try/catch");
    }

    console.log("This will not be logged");
})();
