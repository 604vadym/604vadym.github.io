"use strict";

import DOMValidator from "../services/dom-validator.js";

export default function Shop() {
    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(Shop),
        writable: false,
        configurable: false,
    });
}

Shop.prototype = {
    constructor: Shop,

    init() {},
};
