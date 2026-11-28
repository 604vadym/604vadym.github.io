import http from "node:http";
import { ROUTER } from "./router.mjs";
import { createHTMLPage } from "./actions.mjs";
// Реалізація HTTP-сервера відповідно до завдання, описаного у файлі ASSIGNMENT.md

const PORT = Number(process.env.PORT) || 3000;

async function executeRoute(route, req) {
    if (route === null) {
        return {
            statusCode: 405,
            body: createHTMLPage(
                "Method Not Allowed",
                `<h1>Method Not Allowed</h1>`,
            ),
        };
    }

    return typeof route === "function" ? await route(req) : route;
}

function normalizeResponse(res) {
    if (typeof res === "object" && res !== null) {
        return res;
    }

    return { statusCode: 200, body: res };
}

const server = http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url, "http://localhost");

    const route = Object.hasOwn(ROUTER.METHODS, req.method)
        ? (ROUTER.METHODS[req.method][pathname] ?? {
              statusCode: 404,
              body: ROUTER.NOT_FOUND,
          })
        : null;

    const result = await executeRoute(route, req);
    const response = normalizeResponse(result);

    res.writeHead(response.statusCode, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": Buffer.byteLength(response.body || ""),
        "X-Content-Type-Options": "nosniff",
    });
    res.end(response.body);
});

server.listen(PORT, () => {
    console.log("Server listen on port", PORT);
});

export { server };
