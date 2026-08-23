"use strict";

export function hasFinePointer() {
    return window.matchMedia("(pointer: fine)").matches;
}

export function tryClearFocus() {
    if (document.activeElement) {
        document.activeElement.blur();
    }
}

export function hasPlatformModifiers(e) {
    return !!(e.ctrlKey || e.altKey || e.metaKey);
}
