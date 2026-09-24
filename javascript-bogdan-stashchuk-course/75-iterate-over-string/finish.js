/** ЗАДАЧА 75 - Перебор символов строки
 *
 * Подсчитайте количество строчных гласных букв в строке.
 * Гласные буквы - a, e, i, o, u
 */
"use strict";

let vowelsCount = 0;
let vowelsCount2 = 0;
const vowels = ["a", "e", "i", "o", "u"];

const str = "Today is the best day of my life";

for (let i = 0; i < str.length; i++) {
    if (vowels.includes(str.charAt(i))) vowelsCount++;
}

for (const char of str) {
    if (vowels.includes(char)) vowelsCount2++;
}

console.log(vowelsCount);
// 9
console.log(vowelsCount2);
