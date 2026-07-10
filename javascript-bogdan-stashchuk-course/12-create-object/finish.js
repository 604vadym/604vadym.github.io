/** ЗАДАЧА 12 - Создание объекта
 *
 * 1. Создайте объект с тремя свойствами:
 *  - name
 *  - surname
 *  - favoriteNumber
 *
 * 2. Выведите в консоль строку
 * "My name is <name> <surname> and my favorite number is <favoriteNumber>"
 */
"use strict";

const BoC = {
    name: "Michael",
    surname: "Sandison",
    favoriteNumber: 70,
};

console.log(
    `My name is ${BoC.name} ${BoC.surname} and my favorite number is ${BoC.favoriteNumber}`,
);
