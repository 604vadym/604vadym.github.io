const terminal = document.getElementById("terminal");
const select = document.getElementById("hw-select");

console.log = function (...args) {
  const msg = args
    .map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg,
    )
    .join(" ");
  terminal.innerHTML += `<div class="line">${msg}</div>`;
  terminal.scrollTop = terminal.scrollHeight;
};

window.onerror = function (message) {
  terminal.innerHTML += `<div class="line error">[Runtime Error]: ${message}</div>`;
  terminal.scrollTop = terminal.scrollHeight;
  return false;
};

select.addEventListener("change", (e) => {
  if (!e.target.value) {
    terminal.innerHTML =
      '<div class="line system">[System]: Console cleared. Waiting for selection...</div>';
    return;
  }

  terminal.innerHTML =
    '<div class="line system">[System]: Executing script...</div><div class="line system">--------------------------------------------------</div>';

  if (e.target.value === "hw1") {
    loadScript("01.homework-variables-dataTypes-operators/script/main.js");
  }
});

function loadScript(src) {
  const oldScript = document.getElementById("active-hw");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.src = src;
  script.id = "active-hw";
  document.body.appendChild(script);
}
