"use strict";

export default function KeyboardManager() {}

KeyboardManager.KEY_MAP = {
    Enter: "key",
    Escape: "key",
    ArrowRight: "code",
    ArrowLeft: "code",
    KeyD: "code",
    KeyA: "code",
    PageDown: "code",
    PageUp: "code",
    End: "code",
};

KeyboardManager.getKeyParam = function (key) {
    return KeyboardManager.KEY_MAP[key] || "code";
};
