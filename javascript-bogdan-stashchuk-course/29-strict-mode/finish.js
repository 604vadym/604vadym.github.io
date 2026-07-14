/** ЗАДАЧА 29 - Строгий режим
 *
 * 1. Исправьте ошибку, которая возникает при включенном строгом режиме
 *
 * 2. Что будет, если отключить строгий режим?
 */

"use strict";

// there will be no error without "use strict" because of hoisting
function myFunction() {
    const a = 2;
    return a;
}

myFunction();
