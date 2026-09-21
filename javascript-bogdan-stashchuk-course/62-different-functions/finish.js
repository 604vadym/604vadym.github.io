/** ЗАДАЧА 62 - Разница в объявлении функций
 *
 * 1. Объясните разницу между двумя вариантами объявления функций
 *
 * 2. Покажите эту разницу, добавив дополнительный код под функциями
 *
 * 3. Также вызовите обе функции
 */
"use strict";

console.log(
    "Классическую функцию можно вызвать из любого места в коде, т.е. даже перед ее объявлением за счет такого механизма как hoisting",
);

console.log("Вызов firstFunction() перед ее объявлением:");
console.log(firstFunction(1, 2));

function firstFunction(a, b) {
    return a + b;
}

console.log(
    "Также классическую функцию можно перезаписать, поэтому они менее предпочтительны, чем анонимные функции/функиональные выражения (или стрелочные функции) с const",
);

firstFunction = null;
try {
    console.log(firstFunction(1, 2));
} catch (error) {
    console.log("Теперь в firstFunction null");
    console.log("Exception handled:", error.message);
}

console.log("******************************");

console.log(
    "Анонимную функцию объявленную с помощью функционального выражения нельзя вызвать до ее объявления (т.е. до инициализации переменной, в которой будет хранится ссылка на анонимную функцию), т.к. механизм hoisting на них не распространяется",
);

try {
    console.log(secondFunction(1, 2));
} catch (error) {
    console.log("Вызвать secondFunction до ее объявления нельзя");
    console.log("Exception handled:", error.message);
}

const secondFunction = function (a, b) {
    return a + b;
};

console.log(
    "Анонимную функцию, объявленную с const перезаписать не получится, поэтому они считаются безопасными в отличие от классических функций",
);

try {
    secondFunction = null;
} catch (error) {
    console.log("Присвоить null в secondFunction нельзя");
    console.log("Exception handled:", error.message);
}
