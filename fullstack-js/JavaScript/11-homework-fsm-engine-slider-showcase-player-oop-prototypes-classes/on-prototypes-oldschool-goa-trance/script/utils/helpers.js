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
    return Boolean(e?.ctrlKey || e?.altKey || e?.metaKey);
}

export function prevent(e) {
    if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
    }
}

export function hasShift(e) {
    return Boolean(e?.shiftKey);
}

export function isOverrideKey(e) {
    return hasShift(e);
}

export function isPassthroughKey(e) {
    return hasShift(e);
}

export function isMultiTouch(e) {
    return Boolean(e?.touches && e.touches.length > 1);
}
