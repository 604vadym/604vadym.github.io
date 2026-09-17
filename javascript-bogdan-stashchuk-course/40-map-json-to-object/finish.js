/** ЗАДАЧА 40 - Конвертация JSON в JavaScript объекты
 *
 * 1. Конвертируйте массив JSON объектов в массив объектов JavaScript
 *
 * 2. Выведите в консоль результирующий массив
 *
 * 3. Выведите в консоль "postId" второго объекта
 *
 * 4. Выведите в консоль "commentsQuantity" последнего объекта
 */
"use strict";

const postsJSON = [
    '{"postId":1355,"commentsQuantity":5}',
    '{"postId":5131,"commentsQuantity":13}',
    '{"postId":6134,"commentsQuantity":2}',
    '{"postId":2351,"commentsQuantity":8}',
];

const posts = new Array(postsJSON.length);

postsJSON.forEach((json, i) => (posts[i] = JSON.parse(json)));

console.log(posts);
console.log(posts[1].postId);
console.log(posts[posts.length - 1].commentsQuantity);

console.log("******************************");

const postsViaMap = postsJSON.map((post) => JSON.parse(post));
console.log(postsViaMap);
console.log(postsViaMap[1].postId);
console.log(postsViaMap[postsViaMap.length - 1].commentsQuantity);

console.log("******************************");

const postsViaMapShort = postsJSON.map(JSON.parse);
console.log(postsViaMapShort);
console.log(postsViaMapShort[1].postId);
console.log(postsViaMapShort[postsViaMapShort.length - 1].commentsQuantity);
