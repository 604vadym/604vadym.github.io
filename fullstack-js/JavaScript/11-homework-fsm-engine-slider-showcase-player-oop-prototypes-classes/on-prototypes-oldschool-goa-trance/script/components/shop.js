"use strict";

import * as helper from "../utils/helpers.js";
import DOMValidator from "../services/dom-validator.js";
import KeyboardManager from "../services/keyboard-manager.js";

export default function Shop(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(Shop),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_keyboardManager", {
        value: new KeyboardManager(),
        writable: false,
        configurable: false,
    });
}

Shop.prototype = {
    constructor: Shop,

    init() {
        this._initDOMElements();
        this._keyboardManager.init(this, "press");
    },

    handleKeyDown(e) {
        return this._keyboardManager.manage(e);
    },

    _initDOMElements(childElements) {
        const linkShop = document.querySelector(
            this._options.singleSelectors.linkShop,
        );

        this._domValidator.validate(this, childElements, {
            linkShop,
        });

        this._linkShop = linkShop;
    },

    _pressExecute(e) {
        helper.prevent(e);
        const currentShopUrl = this._linkShop.getAttribute("href");
        window.open(currentShopUrl, "_blank");
        return true;
    },
};
