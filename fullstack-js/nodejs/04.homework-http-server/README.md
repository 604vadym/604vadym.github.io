# HTTP Server

A simple HTTP server built with Node.js core modules. It serves HTML pages, handles URL-encoded form submissions, validates required fields, and returns appropriate HTTP status codes.

## Requirements

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/604vadym/604vadym.github.io.git
cd 604vadym.github.io/fullstack-js/nodejs/04.homework-http-server
```

Install the project dependencies:

```bash
npm install
```

The HTTP server itself uses only built-in Node.js modules. The installed development dependencies are used for running the server with `nodemon` and for testing.

## Running the Server

Start the server directly with Node.js:

```bash
node src/server.mjs
```

Or start it in development mode with automatic restarts:

```bash
npm run dev
```

By default, the server listens on port `3000`. You can override the port using the `PORT` environment variable:

```bash
PORT=4000 node src/server.mjs
```

On Windows Command Prompt:

```cmd
set PORT=4000 && node src/server.mjs
```

The server is then available at `http://localhost:3000` (or the configured port).

## Routes

| Method | Path       | Description                  |
| ------ | ---------- | ---------------------------- |
| `GET`  | `/`        | Returns the Home page.       |
| `GET`  | `/about`   | Returns the About page.      |
| `GET`  | `/contact` | Returns the Contact page.    |
| `POST` | `/submit`  | Processes a form submission. |

### GET `/`

Returns the Home page with status `200 OK`.

```bash
curl -i http://localhost:3000/
```

### GET `/about`

Returns the About page with status `200 OK`.

```bash
curl -i http://localhost:3000/about
```

### GET `/contact`

Returns the Contact page with status `200 OK`.

```bash
curl -i http://localhost:3000/contact
```

### POST `/submit`

Accepts form data encoded as `application/x-www-form-urlencoded`. The request must contain non-empty `name` and `email` fields.

Example request:

```bash
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "name=John+Doe&email=john%40example.com"
```

A successful request returns status `200 OK` and an HTML confirmation page containing the submitted name and email.

Example response body:

```html
<h1>Form Submitted</h1>
<p>Name: John Doe</p>
<p>Email: john@example.com</p>
```

## Error Responses

| Status                      | Condition                                                        | Response body                         |
| --------------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `400 Bad Request`           | `name` or `email` is missing or contains only whitespace.        | `Invalid form data`                   |
| `400 Bad Request`           | The request uses an unsupported Content-Type.                    | `Unsupported Content-Type`            |
| `404 Not Found`             | The requested path is not registered for the HTTP method.        | HTML page containing `Page Not Found` |
| `405 Method Not Allowed`    | The HTTP method is not supported by the router.                  | `Method Not Allowed`                  |
| `413 Payload Too Large`     | The POST request body exceeds the size limit.                    | `Payload Too Large`                   |
| `500 Internal Server Error` | An unexpected error occurs while processing the form submission. | HTML page containing `Server Error`   |

Examples:

Request to an unknown path:

```bash
curl -i http://localhost:3000/unknown
```

POST request with missing required fields:

```bash
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "name=John"
```

POST request with an unsupported Content-Type:

```bash
curl -i -X POST http://localhost:3000/submit \
  -H "Content-Type: application/json" \
  --data '{"name":"John","email":"john@example.com"}'
```

Request using an unsupported HTTP method:

```bash
curl -i -X PUT http://localhost:3000/
```

## Implementation Details and Limitations

- **Built-in modules:** The server uses Node.js `http` and `querystring` modules, along with the global `URL` and `Buffer` APIs. No HTTP framework or third-party routing library is used.
- **Manual routing:** Routes are configured in `src/router.mjs` and grouped by HTTP method.
- **Request body size:** The maximum accepted POST request body is **1 MiB (1,048,576 bytes)**. Larger bodies are rejected with status `413 Payload Too Large`.
- **Supported form encoding:** The `/submit` handler accepts `application/x-www-form-urlencoded` only. Other content types receive `400 Bad Request`.
- **Required fields:** Both `name` and `email` must be present and contain at least one non-whitespace character.
- **Email validation:** The email value is not checked against an email-address format; only the required-field check is performed.
- **HTML escaping:** Submitted values are escaped before being inserted into the HTML response to prevent HTML injection.
- **Response headers:** Every response includes `Content-Type: text/html; charset=utf-8`, `Content-Length` (calculated in bytes), and `X-Content-Type-Options: nosniff`.
- **Exact route paths:** The router matches the pathname exactly. Query strings do not affect route matching, but a trailing slash is not treated as equivalent to the route without it (for example, `/about/` is not the same route as `/about`).

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

The tests cover the defined GET routes, successful and invalid form submissions, requests to unknown paths, unexpected form-processing errors, and unsupported HTTP methods. They also check the response headers.

## Project Structure

```text
04.homework-http-server/
├── src/
│   ├── __test__/
│   │   └── task1.test.js
│   ├── actions.mjs       # Form processing and HTML page generation
│   ├── router.mjs        # Route configuration and page definitions
│   ├── server.mjs        # HTTP server and request dispatching
│   └── ASSIGNMENT.md     # Original assignment description
├── package.json
├── package-lock.json
├── yarn.lock
├── vitest.config.js
├── vitest.setup.js
└── README.md
```
