/** ЗАДАЧА 30 - Колбэк функция
 *
 * 1. Что будет выведено в консоль?
 * Постарайтесь ответить без запуска кода.
 *
 * 2. Нужно ли как-то исправить этот код?
 */
"use sctrict";

// There will be error in console without changes in code because this is function declaration in setTimeout() but should be functional expression. And we can't use function later in the code that was declared incorrect (as a function argument).
setTimeout(function () {
    console.log("Привет из функции myFn");
}, 2000);
