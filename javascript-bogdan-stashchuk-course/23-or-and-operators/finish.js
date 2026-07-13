/** ЗАДАЧА 23 - ИЛИ и И операторы
 *
 * Что будет выведено в консоль?
 */
"use strict";

console.log(
    "(true && null) ---> null, 3 || null ---> 3 => 3 will be in console",
);
console.log(3 || (true && null) || false);
