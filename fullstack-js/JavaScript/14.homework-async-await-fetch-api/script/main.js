"use strict";

console.log("JS #14. Асинхронні операції та робота з API в JavaScript");

const httpErrorMsg = "HTTP error! status:";
const url = "https://jsonplaceholder.typicode.com";
const urlPosts = "https://jsonplaceholder.typicode.com/posts/";

async function getData(segment) {
    const response = await fetch(`${url}${segment}`);

    if (!response.ok) {
        throw new Error(`${httpErrorMsg} ${response.status}`);
    }

    return response.json();
}

getData("/posts/1")
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

getData("/posts/nonexistent")
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

try {
    console.log(await getData("/posts/2"));
} catch (error) {
    console.error(error.message);
}

try {
    console.log(await getData("/posts/nonexistent"));
} catch (error) {
    console.error(error.message);
}

async function postData(segment, data) {
    const response = await fetch(`${url}${segment}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`${httpErrorMsg} ${response.status}`);
    }

    return response.json();
}

postData("/posts", { userName: "John", role: "admin" })
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

postData("/nonexistent", { userName: "nhoJ", role: "admin" })
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

try {
    console.log(await postData("/posts", { userName: "Jack", role: "admin" }));
} catch (error) {
    console.error(error.message);
}

try {
    console.log(
        await postData("/nonexistent", {
            userName: "kcaJ",
            role: "admin",
        }),
    );
} catch (error) {
    console.error(error.message);
}

async function putData(id, data) {
    const response = await fetch(`${urlPosts}${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`${httpErrorMsg} ${response.status}`);
    }

    return response.json();
}

putData(33, { userName: "Fred", role: "user" })
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

putData(-33, { userName: "derF", role: "user" })
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

try {
    console.log(await putData(88, { userName: "Mike", role: "user" }));
} catch (error) {
    console.error(error.message);
}

try {
    console.log(
        await putData(-88, {
            userName: "ekiM",
            role: "user",
        }),
    );
} catch (error) {
    console.error(error.message);
}

/*
 *
 * #4
 * Функціональні вимоги:
 *
 * 1. Вхідні параметри:
 *  - `id`: Ідентифікатор об'єкта, який потрібно оновити.
 *  - `data`: Об'єкт з даними для оновлення.
 *
 * 2. Виконання запиту:
 *  - Виконати асинхронний HTTP PATCH запит до `https://jsonplaceholder.typicode.com/posts/${id}` з використанням `id` та `data`.
 *  - Встановити заголовок `Content-Type: application/json`.
 *
 * 3. Обробка відповідей:
 *  - У разі успішної відповіді, конвертувати відповідь у формат JSON і повернути отримані дані.
 *  - Якщо відповідь вказує на помилку (наприклад, неіснуючий ресурс або проблеми з сервером), повернути повідомлення про помилку.
 *
 * 4. Логування:
 *  - Логувати у консоль результат або повідомлення про помилку.
 *
 * Технічні Вимоги:
 * - Використання асинхронних функцій (`async/await`) для обробки HTTP запитів.
 * - Належне управління помилками та відповідями від API.
 *
 */

async function patchData(id, data) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );

        if (!response.ok) {
            console.error("HTTP error! status:", response.status);
            return `HTTP error! status: ${response.status}`;
        }

        const responseData = await response.json();
        console.log("PATCH data:", responseData);

        return responseData;
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

/*
 *
 * #5
 * Функціональні вимоги:
 *
 * 1. Вхідні дані:
 *  - Функція приймає один параметр id — ідентифікатор ресурсу, який потрібно видалити.
 *
 * 2. Запит на видалення:
 *  - Виконати асинхронний HTTP DELETE запит до API за адресою https://jsonplaceholder.typicode.com/posts/${id}, де ${id} замінюється на конкретний ідентифікатор ресурсу для видалення.
 *
 * 3. Обробка відповіді:
 *  - Якщо запит успішний (HTTP статус відповіді 200-299), логувати успішне повідомлення і повертати true.
 *  - У випадку отримання відповіді зі статусом, що вказує на помилку (все, що поза діапазоном 200-299), логувати помилку зі статусом і повертати сам статус помилки.
 *  - При виникненні помилки в процесі виконання запиту (наприклад, мережева помилка), логувати повідомлення про помилку і повертати текст помилки.
 *
 * 4. Логування:
 *  - Успішне видалення: Логувати повідомлення у консоль у форматі: "Post with id [id] has been successfully deleted.", де [id] — це ідентифікатор видаленого ресурсу.
 *  - Неуспішне видалення: Логувати повідомлення у консоль у форматі: "Failed to delete post with id [id]. Status: [status]", де [id] — ідентифікатор ресурсу, а [status] — HTTP статус відповіді.
 *  - Помилка виконання запиту: Логувати повідомлення у консоль у форматі: "Error during deletion: [error message]", де [error message] — текст помилки.
 *
 * Технічні вимоги:
 * - Використання асинхронних функцій (async/await) для обробки HTTP запитів.
 * - Забезпечити належну обробку помилок та відповідей від API.
 * - Функція повинна бути експортована для подальшого використання або тестування.
 *
 */

async function deleteData(id) {
    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts/${id}`,
            {
                method: "DELETE",
            },
        );

        if (!response.ok) {
            console.error(
                `Failed to delete post with id ${id}. Status: ${response.status}`,
            );
            return response.status;
        }

        console.log(`Post with id ${id} has been successfully deleted.`);
        return true;
    } catch (error) {
        console.error(`Error during deletion: ${error.message}`);
        return error.message;
    }
}
