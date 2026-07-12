/** ЗАДАЧА 21 - Сравнение переменных
 *
 * 1. Сравните 2 переменные "myVariable1" и "myVariable2".
 * Выведите в консоль "true", если значение "myVariable1" меньше или равно "myVariable2".
 *
 * 2. Преобразуйте обе переменные в числа перед сравнением.
 */
"use strict";

let myVariable1 = 10;
let myVariable2 = "5";

if (+myVariable1 <= +myVariable2) {
    console.log(true);
    console.log("log msg: if №1");
}

if (Number(myVariable1) <= Number(myVariable2)) {
    console.log(true);
    console.log("log msg: if №2");
}

myVariable1 = "20";
myVariable2 = 100;

if (+myVariable1 <= +myVariable2) {
    console.log(true);
    console.log("log msg: if №3");
}

if (Number(myVariable1) <= Number(myVariable2)) {
    console.log(true);
    console.log("log msg: if №4");
}
