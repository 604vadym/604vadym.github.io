console.log(
    "JavaScript Core #18. Домашнє завдання. Модулі JavaScript (import / export)",
);

/**
 * Завдання
 * Створити файл orders.js з массивом ордерів
 * Створити файл getPrice.js з функцією getTotalPrice()
 * getTotalPrice() має приймати масив об’єктів і порахувати загальну вартість
 * Створити файл main.js та імпортувати масив замовлень і getTotalPrice()
 * Отримати загальну вартість замовлень і вивести на екран
 * Вхідні дані:
 *
 * const orders = [
 *                {id: 1, price: 29.99, type: "book", name: "The Hobbit"},
 *                {id: 2, price: 14.99, type: "book", name: "Rapunzel"},
 *                {id: 3, price: 10.50, type: "book", name: "Shoe Dog"},
 *                {id: 4, price: 19.84, type: "book", name: "1984"},
 *            ];
 * Очікуємий результат:
 *
 * Total price: $75.32
 */

import { orders } from "./orders.js";
import { getTotalPrice } from "./getPrice.js";

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

const totalPrice = getTotalPrice(orders);
console.log("Total price: $" + totalPrice);

/**
 * Дано дві строки. Повернути true якщо вони є анаграмою, і false якщо ні.
 * Анаграма - це слово, утворене шляхом перестановки літер іншого, наприклад, cat, утворене від act, (приклади в нашій мові: "банка" і "кабан").
 *
 * Приклади:
 *
 * "listen", "silent" → true
 * "abba", "baab" → true
 * "abba", "baaa" → false
 * "abba", "baaba" → false
 */

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

function isAnagram(word1, word2) {
    if (word1.length !== word2.length) return false;

    for (const char of word1) {
        const index = word2.indexOf(char);
        if (index !== -1) {
            word2 = word2.replace(char, "");
            continue;
        }
        return false;
    }
    return true;
}

console.log(isAnagram("listen", "silent")); // → true
console.log(isAnagram("abba", "baab")); // → true
console.log(isAnagram("abba", "baaa")); // → false
console.log(isAnagram("abba", "baaba")); // → false

/**
 * Створити функцію яка повертає кількість унікальних чисел в масиві. Гарантовано, що масив має лише числа.
 *
 * Приклади:
 *
 * [1, 2, 2, 3, 4, 4, 5] → 5
 * [2, 2, 2, 2] → 1
 * [1, 1, 5, 5] → 2
 * [0] → 1
 */

console.log(
    "******************************\n" +
        "Task 3\n" +
        "******************************",
);

function countUniqueNumbers(array) {
    let countUnique = 0;
    for (let i = 0; i < array.length; i++) {
        if (array.indexOf(array[i]) === i) countUnique++;
    }
    return countUnique;
}

console.log(countUniqueNumbers([1, 2, 2, 3, 4, 4, 5])); // → 5
console.log(countUniqueNumbers([2, 2, 2, 2])); // → 1
console.log(countUniqueNumbers([1, 1, 5, 5])); // → 2
console.log(countUniqueNumbers([0])); // → 1

/**
 * Дано масив чисел, повернути масив який містить тільки ті числа з оригінального масиву, які мають дублікати.
 *
 * Пояснення:
 *
 * [1, 2, 3, 2, 4, 3, 5] → [2, 3] (має дві 2 і дві 3)
 * [-2, 7, 0, 14, 0, 5, 0] → [0]
 * [1, 1, 3, 2, 0, 3, 4, 5, 0, 8, -2, 12] → [1, 3, 0]
 */

console.log(
    "******************************\n" +
        "Task 4\n" +
        "******************************",
);

function findDuplicates(array) {
    return array.reduce((duplicates, value, i) => {
        if (!duplicates.includes(value) && array.indexOf(value, i + 1) !== -1) {
            duplicates.push(value);
        }
        return duplicates;
    }, []);
}

console.log(findDuplicates([1, 2, 3, 2, 4, 3, 5])); // → [2, 3]
console.log(findDuplicates([-2, 7, 0, 14, 0, 5, 0])); // → [0]
console.log(findDuplicates([1, 1, 3, 2, 0, 3, 4, 5, 0, 8, -2, 12])); // → [1, 3, 0]
console.log(findDuplicates([1, 2, 3, 3, 1, 4, 5, 4, 8, 9, -1, -1, 23, 90])); // → [1, 3, 4, -1]
