const terminal = document.getElementById("terminal");
const select = document.getElementById("hw-select");

const homeworkMap = {
    hw1: "01.homework-variables-data-types-operators/script/main.js",
    hw2: "02.homework-math-string/script/main.js",
    hw3: "03.homework-if-else-loops-functions/script/main.js",
    hw4: "04.homework-functional-programming-currying-closures-higher-order-functions/script/main.js",
    hw5: "05.homework-closures-recursion-apply-bind/script/main.js",
    hw6: "06.homework-classes-map-set/script/main.js",
};

function logToTerminal(...args) {
    const msg = args
        .map((arg) => {
            if (arg === null) {
                return "null";
            }
            if (typeof arg === "bigint") {
                return `${arg}n`;
            }
            if (typeof arg === "object") {
                return JSON.stringify(
                    arg,
                    (key, value) =>
                        typeof value === "bigint" ? `${value}n` : value,
                    2,
                );
            }
            return arg;
        })
        .join(" ");
    terminal.innerHTML += `<div class="line">${msg}</div>`;
}

function logErrorToTerminal(message) {
    terminal.innerHTML += `<div class="line error">[Runtime Error]: ${message}</div>`;
}

select.addEventListener("change", (e) => {
    if (!e.target.value) {
        terminal.innerHTML =
            '<div class="line system">[System]: Console cleared. Waiting for selection...</div>';
        return;
    }

    terminal.innerHTML =
        '<div class="line system">[System]: Executing script...</div><div class="line system">--------------------------------------------------</div>';

    const path = homeworkMap[e.target.value];

    if (path) {
        runScriptInSandbox(path);
    } else {
        logErrorToTerminal(
            `Path for homework key "${e.target.value}" was not found.`,
        );
    }
});

function runScriptInSandbox(src) {
    const oldSandbox = document.getElementById("sandbox");
    if (oldSandbox) oldSandbox.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "sandbox";
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;

    iframeWindow.console.log = logToTerminal;
    iframeWindow.onerror = function (message) {
        logErrorToTerminal(message);
        return false;
    };

    const script = iframeWindow.document.createElement("script");
    script.src = src;
    iframeWindow.document.body.appendChild(script);
}
