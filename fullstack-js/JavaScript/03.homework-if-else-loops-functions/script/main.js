"use strict";

console.log(
  "JS #3. Домашнє завдання. Основи JavaScript: Функції, умовні оператори, цикли та callback-и",
);

/*
 * #1
 *
 * Створіть об'єкт userObj, що описує людину.
 *
 * Наступні поля обов'язкові:
 * firstName - будь-яке ім'я, рядок
 * lastName - будь-яке прізвище, рядок
 * age - будь-який вік, число
 */

console.log(
  "******************************\n" +
    "Task 1\n" +
    "******************************",
);

const userObj = {
  firstName: "Bjarne",
  lastName: "Stroustrup",
  age: 75,
};

console.log(userObj);

/*
 * #2
 *
 * Для об'єкта з п.1 створіть метод fullName(), що повертає коректне повне ім'я, яке є конкатенацією firstName та lastName через пробіл.

 * Наприклад:
 * userObj.firstName ← 'John'
 * userObj.lastName  ← 'Smith'
 * userObj.fullName() → 'John Smith'.
 */

console.log(
  "******************************\n" +
    "Task 2\n" +
    "******************************",
);

userObj.fullName = function () {
  return this.firstName + " " + this.lastName;
};

console.log(userObj.fullName());

userObj.firstName = "John";
userObj.lastName = "Smith";
userObj.age = 18;

console.log(userObj.fullName()); // John Smith

/*
 * #3
 *
 * Функція defUpperStr('My text') повертає текст, перетворений у верхній регістр, тобто: defUpperStr('My text') → 'MY TEXT'.
 *
 * Якщо функція викликається без параметра defUpperStr(), вона не повинна повертати undefined, у цьому випадку потрібно повернути рядок тексту за замовчуванням у верхньому регістрі, тобто defUpperStr() → 'DEFAULT TEXT'.
 *
 * При виконанні завдання не використовуйте оператор if, потрібен розв'язок із логічним оператором ||.
 */

console.log(
  "******************************\n" +
    "Task 3\n" +
    "******************************",
);

{
  console.log(
    "Variant 1 - solution strictly according to the task requirements (by arguments length, issue with explicit undefined argument)",
  );

  function defUpperStr(text) {
    arguments.length !== 0 || (text = "default text");
    return String(text).toUpperCase();
  }

  console.log(defUpperStr("My text")); // MY TEXT
  console.log(defUpperStr()); // DEFAULT TEXT
  console.log("Issue: undefined =>", defUpperStr(undefined));
  console.log("No issue: empty string =>", defUpperStr(""));
  console.log("No issue: 0 =>", defUpperStr(0));
}

console.log("******************************");

{
  console.log(
    "Variant 1 version 2 - solution strictly according to the task requirements (with empty string or number 0 issues)",
  );

  function defUpperStr(text) {
    text || (text = "default text");
    return String(text).toUpperCase();
  }

  console.log(defUpperStr("My text")); // MY TEXT
  console.log(defUpperStr()); // DEFAULT TEXT
  console.log("No issue: undefined =>", defUpperStr(undefined));
  console.log("Issue: empty string =>", defUpperStr(""));
  console.log("Issue: 0 =>", defUpperStr(0));
}

console.log("******************************");

{
  console.log(
    "Variant 1 version 3 - solution strictly according to the task requirements (the best one, the most reliable, handles explicit undefined, empty string and number 0, no issues at all)",
  );

  function defUpperStr(text) {
    typeof text !== "undefined" || (text = "default text");
    return String(text).toUpperCase();
  }

  console.log(defUpperStr("My text")); // MY TEXT
  console.log(defUpperStr()); // DEFAULT TEXT
  console.log("No issue: undefined =>", defUpperStr(undefined));
  console.log("No issue: empty string =>", defUpperStr(""));
  console.log("No issue: 0 =>", defUpperStr(0));
}

console.log("******************************");

{
  console.log(
    "Variant 2 - standard solution, but doesn't match the task requirements - without operator ||",
  );

  function defUpperStr(text = "default text") {
    return String(text).toUpperCase();
  }

  console.log(defUpperStr("My text")); // MY TEXT
  console.log(defUpperStr()); // DEFAULT TEXT
  console.log("No issue: undefined =>", defUpperStr(undefined));
  console.log("No issue: empty string =>", defUpperStr(""));
  console.log("No issue: 0 =>", defUpperStr(0));
}

/*
 * #4
 *
 * Створіть функцію evenFn(n), яка приймає параметром число - кількість ітерацій циклу, тобто for 0..n.
 * Функція повинна повернути масив, що складається тільки з парних значень, які генеруються в циклі.
 *
 * Причому:
 * 0 не повинен потрапляти до результуючого масиву,
 * цикл має працювати до n включно,
 * дозволено тільки оператор for.
 *
 * Наприклад:
 * evenFn(10) → [2, 4, 6, 8, 10]
 * evenFn(15) → [2, 4, 6, 8, 10, 12, 14]
 * evenFn(20) → [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
 */

console.log(
  "******************************\n" +
    "Task 4 (the task requirements are conflicting)\n" +
    "******************************",
);

{
  console.log(
    "C style - manual add (according to the task requirement 'for 0..n' && 'цикл має працювати до n включно', but not according 'приймає параметром число - кількість ітерацій циклу'):",
  );

  function evenFn(n) {
    const arr = [];
    for (let i = 0; i <= n; i++) {
      if (i !== 0 && i % 2 === 0) {
        arr[arr.length] = i;
      }
    }
    return arr;
  }

  console.log(evenFn(10)); // [2, 4, 6, 8, 10]
  console.log(evenFn(15)); // [2, 4, 6, 8, 10, 12, 14]
  console.log(evenFn(20)); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
}

console.log("******************************");

{
  console.log(
    "Standard, modern - method push (according to the task requirement 'for 0..n' && 'цикл має працювати до n включно', but not according 'приймає параметром число - кількість ітерацій циклу'):",
  );

  function evenFn(n) {
    const arr = [];
    for (let i = 0; i <= n; i++) {
      if (i !== 0 && i % 2 === 0) {
        arr.push(i);
      }
    }
    return arr;
  }

  console.log(evenFn(10)); // [2, 4, 6, 8, 10]
  console.log(evenFn(15)); // [2, 4, 6, 8, 10, 12, 14]
  console.log(evenFn(20)); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
}

console.log("******************************");

{
  console.log(
    "Start loop from 1, no i !== 0 checks (more efficient, according to the task requirement 'приймає параметром число - кількість ітерацій циклу', but not according 'for 0..n'):",
  );

  function evenFn(n) {
    const arr = [];
    for (let i = 1; i <= n; i++) {
      if (i % 2 === 0) {
        arr.push(i);
      }
    }
    return arr;
  }

  console.log(evenFn(10)); // [2, 4, 6, 8, 10]
  console.log(evenFn(15)); // [2, 4, 6, 8, 10, 12, 14]
  console.log(evenFn(20)); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
}

console.log("******************************");

{
  console.log(
    "Best variant, start loop from 2, no checks at all, fully optimised (the most optimal, but doesn't match the task requirements at all):",
  );

  function evenFn(n) {
    const arr = [];
    for (let i = 2; i <= n; i += 2) {
      arr.push(i);
    }
    return arr;
  }

  console.log(evenFn(10)); // [2, 4, 6, 8, 10]
  console.log(evenFn(15)); // [2, 4, 6, 8, 10, 12, 14]
  console.log(evenFn(20)); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
}

/*
 * #5
 *
 * Створіть функцію weekFn(n), яка приймає номер дня тижня, а повертає його назву.
 * Якщо вводиться рядок, будь-яке дробове число або число поза діапазоном 1...7 - функція повинна повернути null.
 *
 * Наприклад:
 * 1   → 'Понеділок'
 * 2   → 'Вівторок'
 * ...
 * 7   → 'Неділя'
 * 9   → null
 * 1.5 → null
 * '2' → null
 * У реалізації функції обов'язково мають бути використані оператори switch / case / default.
 */

// console.log(weekFn(1))   // 'Понеділок'
// console.log(weekFn(3))   // 'Середа'
// console.log(weekFn(7))   // 'Неділя'
// console.log(weekFn(9))   // null
// console.log(weekFn(1.5)) // null
// console.log(weekFn('2')) // null

/*
 * #6
 *
 * створіть функцію ageClassification(n), яка буде як параметр приймати будь-які числа і повертатиме рядок згідно з такими умовами, n:
 * менше 0   - null (зверніть увагу, що це саме null, а не рядок)
 * 0..24     - 'Дитинство'
 * 24+...44  - 'Молодість'
 * 44+..65   - 'Зрілість'
 * 65+..75   - 'Старість'
 * 75+..90   - 'Довголіття'
 * 90+..122  - 'Рекорд'
 * понад 122 - null (зверніть увагу, що це саме null, а не рядок)
 *
 * При виконанні завдання допускається використовувати тільки тернарний оператор ?.
 * Використання операторів if, switch - заборонено.
 */

// console.log('    -1 :', ageClassification(-1)) // -1 : null
// console.log('     0 :', ageClassification(0)) // 0 : null
// console.log('     1 :', ageClassification(1)) // 1 : Дитинство
// console.log('    24 :', ageClassification(24)) // 24 : Дитинство
// console.log(' 24.01 :', ageClassification(24.01)) // 24.01 : Молодість
// console.log('    44 :', ageClassification(44)) // 44 : Молодість
// console.log(' 44.01 :', ageClassification(44.01)) // 44.01 : Зрілість
// console.log('    65 :', ageClassification(65)) // 65 : Зрілість
// console.log('  65.1 :', ageClassification(65.1)) // 65.1 : Старість
// console.log('    75 :', ageClassification(75)) // 75 : Старість
// console.log(' 75.01 :', ageClassification(75.01)) // 75.01 : Довголіття
// console.log('    90 :', ageClassification(90)) // 90 : Довголіття
// console.log(' 90.01 :', ageClassification(90.01)) // 90.01 : Рекорд
// console.log('   122 :', ageClassification(122)) // 122 : Рекорд
// console.log('122.01 :', ageClassification(122.01)) // 122.01 : null
// console.log('   150 :', ageClassification(150)) // 150 : null

/*
 Блок тестирования, везде должны быть true:
 console.log('    -1 :', ageClassification(-1) === null); // -1 : null
 console.log('     0 :', ageClassification(0) === null) // 0 : null
 console.log('     1 :', ageClassification(1) === 'Дитинство'); // 1 : Дитинство
 console.log('    24 :', ageClassification(24) === 'Дитинство'); // 24 : Дитинство
 console.log(' 24.01 :', ageClassification(24.01) === 'Молодість'); // 24.01 : Молодість
 console.log('    44 :', ageClassification(44) === 'Молодість'); // 44 : Молодість
 console.log(' 44.01 :', ageClassification(44.01) === 'Зрілість'); // 44.01 : Зрілість
 console.log('    65 :', ageClassification(65) === 'Зрілість'); // 65 : Зрілість
 console.log('  65.1 :', ageClassification(65.1) === 'Старість'); // 65.1 : Старість
 console.log('    75 :', ageClassification(75) === 'Старість'); // 75 : Старість
 console.log(' 75.01 :', ageClassification(75.01) === 'Довголіття'); // 75.01 : Довголіття
 console.log('    90 :', ageClassification(90) === 'Довголіття'); // 90 : Довголіття
 console.log(' 90.01 :', ageClassification(90.01) === 'Рекорд'); // 90.01 : Рекорд
 console.log('   122 :', ageClassification(122) === 'Рекорд'); // 122 : Рекорд
 console.log('122.01 :', ageClassification(122.01) === null); // 122.01 : null
 console.log('   150 :', ageClassification(150) === null); // 150 : null
*/

/*
 * #7
 *
 * Створіть функцію oddFn(n), яка приймає параметром число - кількість ітерацій циклу.
 * Функція повинна повернути масив, що складається тільки з непарних значень, які генеруються в циклі.
 *
 * Причому:
 * 0 не повинен потрапляти в результуючий масив,
 * цикл має працювати до n включно,
 * дозволено тільки оператор while.
 *
 * Наприклад:
 * oddFn(10) → [1, 3, 5, 7, 9]
 * oddFn(15) → [1, 3, 5, 7, 9, 11, 13, 15]
 * oddFn(20) → [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
 */

// console.log(oddFn(10)) // [1, 3, 5, 7, 9]
// console.log(oddFn(15)) // [1, 3, 5, 7, 9, 11, 13, 15]
// console.log(oddFn(20)) // [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]

/*
 * #8
 *
 * Створіть основну функцію mainFunc(a, b, callback), яка приймає три параметри:
 * a - число,
 * b - число,
 * callback - функція зворотнього виклику, що обробляє параметри a і b.
 *
 * Реалізуйте перевірку: якщо третім параметром передається не функція, потрібно повернути false.
 */

// function mainFunc(a, b, cb) { }

/*
 * Реалізуйте callback функції (cbRandom, cbPow, cbAdd) до основної функції (mainFunc), що повертатимуть відповідні результати обчислень.
 * Використовуйте Math для піднесення до ступеня (Math.pow) та генерації випадкових чисел (Math.floor, Math.random).
 */

// cbRandom(a, b) - обчислює і повертає довільне ціле число в діапазоні між a і b включно.
// function cbRandom(min, max) { }

// cbPow(a, b) - обчислює і повертає результат піднесення числа a у ступінь b.
// function cbPow(num, pow) { }

// cbAdd(a, b) - обчислює і повертає суму двох чисел a і b.
// function cbAdd(a, b) { }

/*
 * mainFunc() повинна повертати результат роботи переданої їй поворотної функції, наприклад:
 * mainFunc(2, 5, cbRandom) → випадково від 2 до 5 включно
 * mainFunc(10, 30, cbRandom) → випадково 10..30 включно
 * mainFunc(2, 5, cbPow) → 32
 * mainFunc(2, 5, cbAdd) → 7
 * mainFunc(2, 5, 'not a func') → false
 */

// console.log(mainFunc(2, 5, cbRandom)) // цілі числа в діапазоні 2..5
// console.log(mainFunc(2, 5, cbPow)) // 32
// console.log(mainFunc(2, 5, cbAdd)) // 7
// console.log(mainFunc(2, 5, 'not a func')) // false
