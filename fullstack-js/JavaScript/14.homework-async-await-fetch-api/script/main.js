"use strict";

console.log("JS #14. Асинхронні операції та робота з API в JavaScript");

const httpErrorMsg = "HTTP error! status:";
const url = "https://jsonplaceholder.typicode.com";
const urlPosts = "https://jsonplaceholder.typicode.com/posts/";

function printHttpResponse(httpRequest, data) {
    console.log(`${httpRequest}: OK. Response data:`, data);
}

function printHttpError(httpRequest, message) {
    console.error(`${httpRequest}: NOK.`, message);
}

async function getData(segment) {
    const response = await fetch(`${url}${segment}`);

    if (!response.ok) {
        throw new Error(`${httpErrorMsg} ${response.status}`);
    }

    return response.json();
}

getData("/posts/1")
    .then((data) => printHttpResponse("GET", data))
    .catch((error) => printHttpError("GET", error.message));

getData("/posts/nonexistent")
    .then((data) => printHttpResponse("GET", data))
    .catch((error) => printHttpError("GET", error.message));

try {
    printHttpResponse("GET", await getData("/posts/2"));
} catch (error) {
    printHttpError("GET", error.message);
}

try {
    printHttpResponse("GET", await getData("/posts/nonexistent"));
} catch (error) {
    printHttpError("GET", error.message);
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
    .then((data) => printHttpResponse("POST", data))
    .catch((error) => printHttpError("POST", error.message));

postData("/nonexistent", { userName: "nhoJ", role: "admin" })
    .then((data) => printHttpResponse("POST", data))
    .catch((error) => printHttpError("POST", error.message));

try {
    printHttpResponse(
        "POST",
        await postData("/posts", { userName: "Jack", role: "admin" }),
    );
} catch (error) {
    printHttpError("POST", error.message);
}

try {
    printHttpResponse(
        "POST",
        await postData("/nonexistent", {
            userName: "kcaJ",
            role: "admin",
        }),
    );
} catch (error) {
    printHttpError("POST", error.message);
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
    .then((data) => printHttpResponse("PUT", data))
    .catch((error) => printHttpError("PUT", error.message));

putData(-33, { userName: "derF", role: "user" })
    .then((data) => printHttpResponse("PUT", data))
    .catch((error) => printHttpError("PUT", error.message));

try {
    printHttpResponse(
        "PUT",
        await putData(88, { userName: "Mike", role: "user" }),
    );
} catch (error) {
    printHttpError("PUT", error.message);
}

try {
    printHttpResponse(
        "PUT",
        await putData(-88, {
            userName: "ekiM",
            role: "user",
        }),
    );
} catch (error) {
    printHttpError("PUT", error.message);
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
    .then((data) => printHttpResponse("PATCH", data))
    .catch((error) => printHttpError("PATCH", error.message));

try {
    printHttpResponse(
        "PATCH",
        await patchData(55, { userName: "Vincent", role: "guest" }),
    );
} catch (error) {
    printHttpError("PATCH", error.message);
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
    .then((data) => printHttpResponse("DELETE", data))
    .catch((error) => printHttpError("DELETE", error.message));

try {
    printHttpResponse("DELETE", await deleteData(18));
} catch (error) {
    printHttpError("DELETE", error.message);
}
