"use strict";

export default function KeyboardManager() {}

// prettier-ignore
KeyboardManager.KEY_MAP = {
    "Enter": "key",
    "Escape": "key",
    "ArrowRight": "code",
    "ArrowLeft": "code",
    "KeyD": "code",
    "KeyA": "code",
    "PageDown": "code",
    "PageUp": "code",
    "End": "code"
};

KeyboardManager.getParam = function ([firstKey]) {
    return KeyboardManager.KEY_MAP[firstKey] || "code";
};
