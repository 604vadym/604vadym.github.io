/** ЗАДАЧА 47 - Использование метода "reduce" для создания массива
 *
 * 1. Создайте функцию "popularPostsIds" с двумя параметрами "posts" и "minimalComentsQty"
 *
 * 2. Эта функция "popularPostsIds" должна возвращать массив идентификаторов постов сообщений,
 * у которых количество комментариев не меньше "minimalComentsQty"
 */
"use strict";

const inputPosts = [
    {
        title: "Как быстро выучить JavaScript?",
        postId: 3421,
        comments: 25,
    },
    {
        title: "Где используется JavaScript?",
        postId: 5216,
        comments: 3,
    },
    {
        title: "Какая разница между React и Angular?",
        postId: 8135,
        comments: 12,
    },
];

function popularPostsIds(posts, minimalComentsQty) {
    const arr = [];
    posts.reduce((prev, current) => {
        if (current.comments >= minimalComentsQty) {
            arr.push(current.postId);
        }
        return current;
    }, null);
    return arr;
}

console.log(popularPostsIds(inputPosts, 10)); // [3421, 8135]

console.log(popularPostsIds(inputPosts, 15)); // [3421]

console.log(popularPostsIds(inputPosts, 50)); // []

console.log("******************************");

function popularPostsIdsViaAccum(posts, minimalComentsQty) {
    return posts.reduce(
        (postsIds, post) =>
            post.comments >= minimalComentsQty
                ? postsIds.concat([post.postId])
                : postsIds,
        [],
    );
}

console.log(popularPostsIdsViaAccum(inputPosts, 10)); // [3421, 8135]

console.log(popularPostsIdsViaAccum(inputPosts, 15)); // [3421]

console.log(popularPostsIdsViaAccum(inputPosts, 50)); // []
