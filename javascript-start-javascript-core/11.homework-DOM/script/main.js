"use strict";

console.log(
    "JavaScriptStart #11. Домашнє завдання. DOM. Функція для зміни тексту елемента",
);

/**
 * Створіть функцію changeText, яка приймає ідентифікатор HTML-елемента та новий текст. Функція повинна знайти цей елемент на сторінці за допомогою document.getElementById() та змінити його текст на новий.
 *
 * Важливо: Ви повинні використати метод document.getElementById() для вибору елемента.
 */

function changeText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}
