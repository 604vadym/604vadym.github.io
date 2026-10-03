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

const totalPrice = getTotalPrice(orders);
console.log("Total price: $" + totalPrice);
