const terminal = document.getElementById("terminal");
const select = document.getElementById("hw-select");

const homeworkMap = {
    hw1: "01-variable-declaration/finish.js",
    hw2: "02-value-reassignment/finish.js",
    hw3: "03-numbers-multiplication/finish.js",
    hw4: "04-strings-concatenation/finish.js",
    hw5: "05-comments/finish.js",
    hw6: "06-data-types/finish.js",
    hw7: "07-regular-function/finish.js",
    hw8: "08-function-expression/finish.js",
    hw9: "09-arrow-function/finish.js",
    hw10: "10-jsdoc/finish.js",
    hw11: "11-callback-function/finish.js",
    hw12: "12-create-object/finish.js",
    hw13: "13-string-length/finish.js",
    hw14: "14-uppercase-string/finish.js",
    hw15: "15-replace-part-string/finish.js",
    hw16: "16-create-array/finish.js",
    hw17: "17-replace-element-array/finish.js",
    hw18: "18-iterate-over-array/finish.js",
    hw19: "19-push-to-array/finish.js",
    hw20: "20-date/finish.js",
    hw21: "21-compare-variables/finish.js",
    hw22: "22-division-remainder/finish.js",
    hw23: "23-or-and-operators/finish.js",
    hw24: "24-alternative-binary-operators/finish.js",
    hw25: "25-expression-or-statement/finish.js",
    hw26: "26-what-will-be-logged/finish.js",
    hw27: "27-const/finish.js",
    hw28: "28-let/finish.js",
    hw29: "29-strict-mode/finish.js",
    hw30: "30-callback-function/finish.js",
    hw31: "31-intervals-timeouts/finish.js",
    hw32: "32-add-start-of-the-array/finish.js",
    hw33: "33-add-at-index-array/finish.js",
    hw34: "34-array-of-objects/finish.js",
    hw35: "35-object-iteration/finish.js",
    hw36: "36-random-numbers/finish.js",
    hw37: "37-for-in-loop/finish.js",
    hw38: "38-ternary-operator/finish.js",
    hw39: "39-foreach-with-index/finish.js",
    hw40: "40-map-json-to-object/finish.js",
    hw41: "41-find-single-post/finish.js",
    hw42: "42-is-array-sorted-or-not/finish.js",
    hw43: "43-compare-two-arrays/finish.js",
    hw44: "44-element-is-in-array/finish.js",
    hw45: "45-includes-object-or-array/finish.js",
    hw46: "46-push-to-array-if-not-exists/finish.js",
    hw47: "47-reduce-array-of-objects/finish.js",
    hw48: "48-reduce-to-object/finish.js",
    hw49: "49-sort-array-of-objects/finish.js",
    hw50: "50-template-literals/finish.js",
    hw51: "51-rest-and-spread-operators/finish.js",
    hw52: "52-default-function-parameters/finish.js",
    hw53: "53-enhanced-object-literals/finish.js",
    hw54: "54-array-destructuring/finish.js",
    hw55: "55-destructure-function-result/finish.js",
    hw56: "56-object-destructuring/finish.js",
    hw57: "57-array-transformation/finish.js",
    hw58: "58-delete-object-properties/finish.js",
    hw59: "59-extend-array/finish.js",
    hw60: "60-custom-push-method-for-arrays/finish.js",
    hw61: "61-sum-numbers/finish.js",
    hw62: "62-different-functions/finish.js",
    hw63: "63-function-scope/finish.js",
    hw64: "64-hoisting/finish.js",
    hw65: "65-ternary-operator/finish.js",
    hw66: "66-arrow-functions/finish.js",
    hw67: "67-default-parameters/finish.js",
    hw68: "68-presence-of-the-function-parameters/finish.js",
    hw69: "69-object-destructuring/finish.js",
    hw70: "70-destructuring-and-rest-operator/finish.js",
    hw71: "71-spread-operator/finish.js",
    hw72: "72-copy-array/finish.js",
    hw73: "73-template-literals/finish.js",
    hw74: "74-object-destructuring/finish.js",
    hw75: "75-iterate-over-string/finish.js",
    hw76: "76-swap-values/finish.js",
    hw77: "77-function-closures/finish.js",
    hw78: "78-classes/finish.js",
    hw79: "79-iterate-over-object/finish.js",
    hw80: "80-sum-of-positive-and-negative-numbers/finish.js",
};

function logToTerminal(...args) {
    const msg = args
        .map((arg) => {
            if (typeof arg === "bigint") {
                return `${arg}n`;
            }

            const typeStr = Object.prototype.toString.call(arg);

            if (typeStr === "[object Set]") {
                arg = Array.from(arg);
            } else if (typeStr === "[object Map]") {
                arg = Object.fromEntries(arg);
            }

            if (typeof arg === "object" && arg !== null) {
                return JSON.stringify(
                    arg,
                    (key, value) => {
                        if (typeof value === "bigint") return `${value}n`;

                        const innerType = Object.prototype.toString.call(value);
                        if (innerType === "[object Set]")
                            return Array.from(value);
                        if (innerType === "[object Map]")
                            return Object.fromEntries(value);

                        return value;
                    },
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

    const path = homeworkMap[e.target.value];

    if (path) {
        terminal.innerHTML =
            '<div class="line system">[System]: Executing script...</div><div class="line system">--------------------------------------------------</div>';

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
