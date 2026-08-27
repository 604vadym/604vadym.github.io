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
        this._initProps();
        this._keyboardManager.init(this, "press");
    },

    handleKeyDown(e) {
        return this._keyboardManager.manage(e);
    },

    _initDOMElements(childElements) {
        const link = document.querySelector(this._options.singleSelectors.link);

        this._domValidator.validate(this, childElements, {
            link,
        });

        this._link = link;
    },

    _initProps() {
        this._currentIndex = 0;
        this._initData();
    },

    _initData() {
        this._data = [
            {
                url: "https://ultimae.bandcamp.com/album/code-eternity",
            },
            {
                url: "https://www.discogs.com/sell/release/419254",
            },
            {
                url: "https://ultimae.bandcamp.com/album/life",
            },
            {
                url: "https://ultimae.bandcamp.com/album/360",
            },
        ];
    },

    _getCurrentUrl() {
        return this._data[this._currentIndex].url;
    },

    _pressExecute(e) {
        helper.prevent(e);
        const currentUrl = this._getCurrentUrl();
        window.open(currentUrl, "_blank");
        return true;
    },
};
