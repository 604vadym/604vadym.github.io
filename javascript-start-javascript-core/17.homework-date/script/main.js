"use strict";

console.log("JavaScript Core #17. Домашнє завдання. Робота з датами");

/**
 * Завдання
 * Порахувати свій вік ввівши дату народження: const dateOfBirth = new Date("1912-04-15");
 * Вивести отримане число на екран: 113 років
 * Важливо: в цьому завданні допускається розбіг з реальним значенням в +/- 1 рік, через округлення, у даному випадку з 113.5 до 114.
 */

const dateOfBirth = new Date("1991-02-23");
const ageMs = Date.now() - dateOfBirth.getTime();
const age = Math.floor(ageMs / 1000 / 60 / 60 / 24 / 365.2425);

console.log(age + " years");
