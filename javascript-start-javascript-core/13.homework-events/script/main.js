"use strict";

console.log(
    "JavaScriptStart #13. Домашнє завдання. Events. Функція для обробки кліку по кнопці",
);

/**
 * Створіть функцію handleClick, яка викликається при натисканні на кнопку і виводить повідомлення "Кнопку натиснуто" в консоль.
 *
 * Важливо: Використовуйте метод addEventListener для додавання обробника події кліку.
 */

function handleClick() {
    console.log("Кнопку натиснуто");
}

const button = document.getElementById("myButton");
button.addEventListener("click", handleClick);
