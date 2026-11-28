import querystring from "node:querystring";

class PayloadError extends Error {}

function escapeHTML(value) {
    return value.replace(/[&<>"']/g, (char) => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entities[char];
    });
}

function readPostData(req) {
    return new Promise((resolve, reject) => {
        const MAX_BODY_SIZE = 1024 * 1024;
        let payloadTooLarge = false;
        let body = "";
        let bodySize = 0;

        req.on("data", (chunk) => {
            if (payloadTooLarge) return;
            bodySize += chunk.length;

            if (bodySize > MAX_BODY_SIZE) {
                payloadTooLarge = true;
                return;
            }

            body += chunk;
        });

        req.on("end", () => {
            if (payloadTooLarge) {
                reject(new PayloadError());
                return;
            }

            try {
                resolve(querystring.parse(body));
            } catch (error) {
                reject(error);
            }
        });

        req.on("error", reject);
    });
}

async function submitForm(req) {
    if (
        req.headers["content-type"]?.split(";")[0].trim() ===
        "application/x-www-form-urlencoded"
    ) {
        try {
            const { name, email } = await readPostData(req);

            if (!name?.trim() || !email?.trim()) {
                return {
                    statusCode: 400,
                    body: createHTMLPage(
                        "Invalid form data",
                        `<h1>Invalid form data</h1>`,
                    ),
                };
            }

            return {
                statusCode: 200,
                body: createHTMLPage(
                    "Form Submitted",
                    `<h1>Form Submitted</h1>
                <p>Name: ${escapeHTML(name)}</p>
                <p>Email: ${escapeHTML(email)}</p>`,
                ),
            };
        } catch (error) {
            if (error instanceof PayloadError) {
                return {
                    statusCode: 413,
                    body: createHTMLPage(
                        "Payload Too Large",
                        `<h1>Payload Too Large</h1>`,
                    ),
                };
            }
            return {
                statusCode: 500,
                body: createHTMLPage("Server Error", `<h1>Server Error</h1>`),
            };
        }
    } else {
        return {
            statusCode: 400,
            body: createHTMLPage(
                "Unsupported Content-Type",
                `<h1>Unsupported Content-Type</h1>`,
            ),
        };
    }
}

function createHTMLPage(titleText, contentHTML) {
    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${escapeHTML(titleText)}</title>
    </head>
    <body>
        ${contentHTML}
    </body>
  </html>`;
}

export { submitForm, createHTMLPage };
