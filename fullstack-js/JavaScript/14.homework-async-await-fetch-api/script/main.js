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

async function patchData(id, data) {
    const response = await fetch(`${urlPosts}${id}`, {
        method: "PATCH",
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

patchData(77, { userName: "Sam", role: "guest" })
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

try {
    console.log(await patchData(55, { userName: "Vincent", role: "guest" }));
} catch (error) {
    console.error(error.message);
}

async function deleteData(id) {
    const response = await fetch(`${urlPosts}${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`${httpErrorMsg} ${response.status}`);
    }

    return response.json();
}

deleteData(17)
    .then((data) => console.log(data))
    .catch((error) => console.error(error.message));

try {
    console.log(await deleteData(18));
} catch (error) {
    console.error(error.message);
}
