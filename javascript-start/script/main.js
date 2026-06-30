const terminal = document.getElementById("terminal");
const select = document.getElementById("hw-select");

function logToTerminal(...args) {
  const msg = args
    .map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
    )
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
    runScriptInSandbox(
      "01.homework-variables-dataTypes/script/main.js",
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
