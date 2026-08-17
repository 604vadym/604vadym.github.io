"use strict";

export function hasFinePointer() {
    return window.matchMedia("(pointer: fine)").matches;
}

export function mergeValidationConfigs(parentConfig, childConfig) {
    const safeParent = parentConfig || {};
    const safeChild = childConfig || {};

    return {
        elements: {
            ...safeParent.elements,
            ...safeChild.elements,
        },
        collections: {
            ...safeParent.collections,
            ...safeChild.collections,
        },
    };
}
