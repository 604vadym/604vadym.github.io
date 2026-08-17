"use strict";

export function hasFinePointer() {
    return window.matchMedia("(pointer: fine)").matches;
}
