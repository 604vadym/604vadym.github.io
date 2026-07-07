/** ЗАДАЧА 4 - Объединение строк
 *
 * 1. Объявите три переменные с значениями:
 *  - ваше имя
 *  - ваша фамилия
 *  - ваша профессия
 *
 * 2. Создайте еще одну переменную. Ее значение должно быть, например
 * "Меня зовут <Имя> <Фамилия> и я <Профессия>"
 *
 * 3. Выведите значение последней переменной в консоль
 */
"use strict";

const name = "Вадим";
const surname = "Рогачко";
const profession = "программист";

const greeting = "Меня зовут " + name + " " + surname + " и я " + profession;

console.log(greeting);

const greeting2 = `Меня зовут ${name} ${surname} и я ${profession}`;

console.log(greeting2);
