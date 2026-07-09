const terminal = document.getElementById("terminal");
const select = document.getElementById("hw-select");

function logToTerminal(...args) {
    const msg = args
        .map((arg) => {
            if (typeof arg === "bigint") {
                return `${arg}n`;
            }
            if (typeof arg === "object" && arg !== null) {
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

    if (e.target.value === "hw1") {
        runScriptInSandbox("01-variable-declaration/finish.js");
    } else if (e.target.value === "hw2") {
        runScriptInSandbox("02-value-reassignment/finish.js");
    } else if (e.target.value === "hw3") {
        runScriptInSandbox("03-numbers-multiplication/finish.js");
    } else if (e.target.value === "hw4") {
        runScriptInSandbox("04-strings-concatenation/finish.js");
    } else if (e.target.value === "hw5") {
        runScriptInSandbox("05-comments/finish.js");
    } else if (e.target.value === "hw6") {
        runScriptInSandbox("06-data-types/finish.js");
    } else if (e.target.value === "hw7") {
        runScriptInSandbox("07-regular-function/finish.js");
    } else if (e.target.value === "hw8") {
        runScriptInSandbox("08-function-expression/finish.js");
    } else if (e.target.value === "hw9") {
        runScriptInSandbox("09-arrow-function/finish.js");
    } else if (e.target.value === "hw10") {
        runScriptInSandbox("10-jsdoc/finish.js");
    } else if (e.target.value === "hw11") {
        runScriptInSandbox("11-callback-function/finish.js");
    } else if (e.target.value === "hw12") {
        runScriptInSandbox("12-create-object/finish.js");
    } else if (e.target.value === "hw13") {
        runScriptInSandbox("13-string-length/finish.js");
    } else if (e.target.value === "hw14") {
        runScriptInSandbox("14-uppercase-string/finish.js");
    } else if (e.target.value === "hw15") {
        runScriptInSandbox("15-replace-part-string/finish.js");
    } else if (e.target.value === "hw16") {
        runScriptInSandbox("16-create-array/finish.js");
    } else if (e.target.value === "hw17") {
        runScriptInSandbox("17-replace-element-array/finish.js");
    } else if (e.target.value === "hw18") {
        runScriptInSandbox("18-iterate-over-array/finish.js");
    } else if (e.target.value === "hw19") {
        runScriptInSandbox("19-push-to-array/finish.js");
    } else if (e.target.value === "hw20") {
        runScriptInSandbox("20-date/finish.js");
    } else if (e.target.value === "hw21") {
        runScriptInSandbox("21-compare-variables/finish.js");
    } else if (e.target.value === "hw22") {
        runScriptInSandbox("22-division-remainder/finish.js");
    } else if (e.target.value === "hw23") {
        runScriptInSandbox("23-or-and-operators/finish.js");
    } else if (e.target.value === "hw24") {
        runScriptInSandbox("24-alternative-binary-operators/finish.js");
    } else if (e.target.value === "hw25") {
        runScriptInSandbox("25-expression-or-statement/finish.js");
    } else if (e.target.value === "hw26") {
        runScriptInSandbox("26-what-will-be-logged/finish.js");
    } else if (e.target.value === "hw27") {
        runScriptInSandbox("27-const/finish.js");
    } else if (e.target.value === "hw28") {
        runScriptInSandbox("28-let/finish.js");
    } else if (e.target.value === "hw29") {
        runScriptInSandbox("29-strict-mode/finish.js");
    } else if (e.target.value === "hw30") {
        runScriptInSandbox("30-callback-function/finish.js");
    } else if (e.target.value === "hw31") {
        runScriptInSandbox("31-intervals-timeouts/finish.js");
    } else if (e.target.value === "hw32") {
        runScriptInSandbox("32-add-start-of-the-array/finish.js");
    } else if (e.target.value === "hw33") {
        runScriptInSandbox("33-add-at-index-array/finish.js");
    } else if (e.target.value === "hw34") {
        runScriptInSandbox("34-array-of-objects/finish.js");
    } else if (e.target.value === "hw35") {
        runScriptInSandbox("35-object-iteration/finish.js");
    } else if (e.target.value === "hw36") {
        runScriptInSandbox("36-random-numbers/finish.js");
    } else if (e.target.value === "hw37") {
        runScriptInSandbox("37-for-in-loop/finish.js");
    } else if (e.target.value === "hw38") {
        runScriptInSandbox("38-ternary-operator/finish.js");
    } else if (e.target.value === "hw39") {
        runScriptInSandbox("39-foreach-with-index/finish.js");
    } else if (e.target.value === "hw40") {
        runScriptInSandbox("40-map-json-to-object/finish.js");
    } else if (e.target.value === "hw41") {
        runScriptInSandbox("41-find-single-post/finish.js");
    } else if (e.target.value === "hw42") {
        runScriptInSandbox("42-is-array-sorted-or-not/finish.js");
    } else if (e.target.value === "hw43") {
        runScriptInSandbox("43-compare-two-arrays/finish.js");
    } else if (e.target.value === "hw44") {
        runScriptInSandbox("44-element-is-in-array/finish.js");
    } else if (e.target.value === "hw45") {
        runScriptInSandbox("45-includes-object-or-array/finish.js");
    } else if (e.target.value === "hw46") {
        runScriptInSandbox("46-push-to-array-if-not-exists/finish.js");
    } else if (e.target.value === "hw47") {
        runScriptInSandbox("47-reduce-array-of-objects/finish.js");
    } else if (e.target.value === "hw48") {
        runScriptInSandbox("48-reduce-to-object/finish.js");
    } else if (e.target.value === "hw49") {
        runScriptInSandbox("49-sort-array-of-objects/finish.js");
    } else if (e.target.value === "hw50") {
        runScriptInSandbox("50-template-literals/finish.js");
    } else if (e.target.value === "hw51") {
        runScriptInSandbox("51-rest-and-spread-operators/finish.js");
    } else if (e.target.value === "hw52") {
        runScriptInSandbox("52-default-function-parameters/finish.js");
    } else if (e.target.value === "hw53") {
        runScriptInSandbox("53-enhanced-object-literals/finish.js");
    } else if (e.target.value === "hw54") {
        runScriptInSandbox("54-array-destructuring/finish.js");
    } else if (e.target.value === "hw55") {
        runScriptInSandbox("55-destructure-function-result/finish.js");
    } else if (e.target.value === "hw56") {
        runScriptInSandbox("56-object-destructuring/finish.js");
    } else if (e.target.value === "hw57") {
        runScriptInSandbox("57-array-transformation/finish.js");
    } else if (e.target.value === "hw58") {
        runScriptInSandbox("58-delete-object-properties/finish.js");
    } else if (e.target.value === "hw59") {
        runScriptInSandbox("59-extend-array/finish.js");
    } else if (e.target.value === "hw60") {
        runScriptInSandbox("60-custom-push-method-for-arrays/finish.js");
    } else if (e.target.value === "hw61") {
        runScriptInSandbox("61-sum-numbers/finish.js");
    } else if (e.target.value === "hw62") {
        runScriptInSandbox("62-different-functions/finish.js");
    } else if (e.target.value === "hw63") {
        runScriptInSandbox("63-function-scope/finish.js");
    } else if (e.target.value === "hw64") {
        runScriptInSandbox("64-hoisting/finish.js");
    } else if (e.target.value === "hw65") {
        runScriptInSandbox("65-ternary-operator/finish.js");
    } else if (e.target.value === "hw66") {
        runScriptInSandbox("66-arrow-functions/finish.js");
    } else if (e.target.value === "hw67") {
        runScriptInSandbox("67-default-parameters/finish.js");
    } else if (e.target.value === "hw68") {
        runScriptInSandbox("68-presence-of-the-function-parameters/finish.js");
    } else if (e.target.value === "hw69") {
        runScriptInSandbox("69-object-destructuring/finish.js");
    } else if (e.target.value === "hw70") {
        runScriptInSandbox("70-destructuring-and-rest-operator/finish.js");
    } else if (e.target.value === "hw71") {
        runScriptInSandbox("71-spread-operator/finish.js");
    } else if (e.target.value === "hw72") {
        runScriptInSandbox("72-copy-array/finish.js");
    } else if (e.target.value === "hw73") {
        runScriptInSandbox("73-template-literals/finish.js");
    } else if (e.target.value === "hw74") {
        runScriptInSandbox("74-object-destructuring/finish.js");
    } else if (e.target.value === "hw75") {
        runScriptInSandbox("75-iterate-over-string/finish.js");
    } else if (e.target.value === "hw76") {
        runScriptInSandbox("76-swap-values/finish.js");
    } else if (e.target.value === "hw77") {
        runScriptInSandbox("77-function-closures/finish.js");
    } else if (e.target.value === "hw78") {
        runScriptInSandbox("78-classes/finish.js");
    } else if (e.target.value === "hw79") {
        runScriptInSandbox("79-iterate-over-object/finish.js");
    } else if (e.target.value === "hw80") {
        runScriptInSandbox("80-sum-of-positive-and-negative-numbers/finish.js");
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
