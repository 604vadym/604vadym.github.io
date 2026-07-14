/** ЗАДАЧА 27 - Const
 *
 * Ответьте на следующие вопросы:
 *   1. Почему после 13 строки не выдается ошибка?
 *   2. Почему после строки 18 генерируется TypeError?
 *
 * Измените одну строку кода, чтобы эта ошибка исчезла.
 * Не меняйте строки 13, 18
 */

let arr = [1, 2]; // <-- Объявление переменной используя const

// No error because arr is a const variable, but it assigned to object (Array) which is reference type. arr has reference (address in memory) inside so we can change (mutate) this object (Array).
arr.push(3);

console.log(arr);
// [1, 2, 3]

// Error because we are trying to change the value of a variable arr which is const. We can change the value of an object by reference assigned to variable arr, but we can't change this reference by itself.
arr = [1, 2, 3, 4];
// ДО: Uncaught TypeError: Assignment to constant variable.
// ПОСЛЕ: Нет ошибки

console.log(arr);
// [1, 2, 3, 4]
