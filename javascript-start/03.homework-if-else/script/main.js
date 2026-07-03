"use strict";

console.log(
  "JavaScriptStart #2. Домашнє завдання. Основи JavaScript: Оператори та Вирази",
);

/*
 * Перевірка категорії віку
 *
 * Створіть змінну age, що містить вік людини, а саме 45.Використайте конструкцію if-else для перевірки:
 *
 * Якщо вік менше 13 років, виведіть "Дитина".
 * Якщо вік від 13 до 19, виведіть "Підліток".
 * Якщо вік від 20 до 59, виведіть "Дорослий".
 * Якщо вік 60 років або більше, виведіть "Пенсіонер".
 */

function checkAgeCategory(age) {
  if (age < 13) {
    console.log("Дитина");
  } else if (age >= 13 && age <= 19) {
    console.log("Підліток");
  } else if (age >= 20 && age <= 59) {
    console.log("Дорослий");
  } else if (age >= 60) {
    console.log("Пенсіонер");
  }
}

checkAgeCategory(7);
checkAgeCategory(13);
checkAgeCategory(15);
checkAgeCategory(19);
checkAgeCategory(20);
checkAgeCategory(35);
checkAgeCategory(59);
checkAgeCategory(60);
checkAgeCategory(80);
