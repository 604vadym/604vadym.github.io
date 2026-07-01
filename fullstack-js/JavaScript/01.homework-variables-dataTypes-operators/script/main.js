"use strict";

console.log(
  "JS #1. Домашнє завдання. Основи JavaScript: Працюємо зі змінними, типами даних",
);

/*
 * #1
 *
 * Створіть змінні зі значеннями.
 */

// ім'я змінної: myNum, значення: 10
// ім'я змінної: myStr, значення: 'some string'
// ім'я змінної: myBool, значення: true
// ім'я змінної: myArr, значення: 1, 2, 3, 4, 5
// ім'я змінної: myObj, значення: first: 'First Name', last: 'Last Name'

console.log(
  "******************************\n" +
    "Task 1\n" +
    "******************************",
);

const myNum = 10;
let myNumLet = 100;
var myNumVar = 1000;
console.log("myNum = " + myNum);
console.log("myNumLet = " + myNumLet);
console.log("myNumVar = " + myNumVar);

const myStr = "some string";
console.log("myStr = " + myStr);

const myBool = true;
console.log("myBool = " + myBool);

const myArr = [1, 2, 3, 4, 5];
console.log("myArr = " + myArr);

const myObj = { first: "First Name", last: "Last Name" };
console.log(`myObj.first = ${myObj.first}\nmyObj.last = ${myObj.last}`);

/*
 * #2
 *
 * Відформатуйте ціле число, яке зберігається в змінній myNum, щоб отримати результат з 2 знаками після коми.
 * Результат збережіть у змінній decimal2.
 */

// decimal2

console.log(
  "******************************\n" +
    "Task 2\n" +
    "******************************",
);

const decimal2 = myNum.toFixed(2);
console.log("myNum = " + myNum);
console.log("decimal2 = " + decimal2);

/*
 * #3
 *
 * Створіть змінну myBigInt і запишіть в неї число 123n (BigInt).
 * Потім збільште його на 1 та запищіть в цю ж саму змінну.
 */

// myBigInt

console.log(
  "******************************\n" +
    "Task 3\n" +
    "******************************",
);

let myBigInt = 123n;
myBigInt = 123n + 1n;
console.log("myBigInt = " + myBigInt);

let myBigInt2 = 123n;
myBigInt2 += 1n;
console.log("myBigInt2 = " + myBigInt2);

let myBigInt3 = 123n;
myBigInt3 = 124n;
console.log("myBigInt3 = " + myBigInt3);

let myBigInt4 = 123n;
++myBigInt4;
console.log("MyBigInt4 = " + myBigInt4);

let myBigInt5 = 123n;
myBigInt5 = 123n + BigInt(1);
console.log("MyBigInt5 = " + myBigInt5);

let myBigInt6 = 123n;
myBigInt6 += BigInt(1);
console.log("MyBigInt6 = " + myBigInt6);

let myBigInt7 = 123n;
const number = 1;
myBigInt7 += BigInt(number);
console.log("MyBigInt7 = " + myBigInt7);
