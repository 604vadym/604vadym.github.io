"use strict";

console.log(
  "JavaScriptStart #3. Домашнє завдання. Основи JavaScript: Керуючі конструкції",
);

/*
 * #1 Перевірка категорії віку
 *
 * Створіть змінну age, що містить вік людини, а саме 45.Використайте конструкцію if-else для перевірки:
 *
 * Якщо вік менше 13 років, виведіть "Дитина".
 * Якщо вік від 13 до 19, виведіть "Підліток".
 * Якщо вік від 20 до 59, виведіть "Дорослий".
 * Якщо вік 60 років або більше, виведіть "Пенсіонер".
 */

console.log(
  "******************************\n" +
    "Task 1\n" +
    "******************************",
);

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

/*
 * #2 Завдання на використання оператора IF
 *
 * Створити валідатор паролю, який відповідає таким критеріям:
 * Пароль має 4 цифри (наприклад: 1234, 7890, 4791)
 * Пароль генерується новий для кожного запуску програми
 * Пароль зберігається в об'єкті user:
 * {
 *
 * 	username: “admin”,
 *
 * 	password: 1234
 *
 * }
 *
 * Якщо пароль менше або більше ніж 4 цифри - вивести помилку в консоль
 *
 * Якщо пароль валідний - вивести в консоль об’єкт user
 */

console.log(
  "******************************\n" +
    "Task 2\n" +
    "******************************",
);

const user = {
  username: "admin",
  password: Math.floor(Math.random() * 100000),
};

if (user.password < 1000 || user.password > 9999) {
  console.log(
    "Error: password invalid. Password must contain exactly 4 digits. Try again...",
  );
} else {
  console.log(user);
}
