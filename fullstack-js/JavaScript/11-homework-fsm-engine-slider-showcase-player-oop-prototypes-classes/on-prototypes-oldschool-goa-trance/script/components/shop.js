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

Object.defineProperty(Shop, "DEFAULT_URL", {
    value: "https://bandcamp.com",
    writable: false,
    configurable: false,
});

Shop.prototype = {
    constructor: Shop,

    init() {
        this._initDOMElements();
        this._initProps();
        this._updateUrl();
        this._keyboardManager.init(this, "press");
    },

    setActiveIndex(index) {
        const isValidIndex =
            Number.isFinite(index) && index >= 0 && index < this._data.length;

        if (isValidIndex) {
            this._currentIndex = index;
            this._updateUrl();
        } else {
            console.warn(
                `[Shop]: index ${index} is out of bounds [0..${this._data.length - 1}]. ` +
                    `Falling back to shop default link`,
            );
            this._link.setAttribute("href", this._defaultUrl);
        }
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
        this._initDefaultUrl();
        this._initData();
    },

    _updateUrl() {
        const currentUrl = this._getUrl();
        if (this._link.getAttribute("href") !== currentUrl) {
            this._link.setAttribute("href", currentUrl);
        }
    },

    _getUrl() {
        return this._data[this._currentIndex].url;
    },

    _pressExecute(e) {
        helper.prevent(e);
        window.open(this._getUrl(), "_blank");
        return true;
    },

    _initDefaultUrl() {
        const defaultUrl = this._options.defaultUrl;
        if (helper.isValidUrl(defaultUrl)) {
            this._defaultUrl = defaultUrl;
        } else if (helper.isValidUrl(this.constructor.DEFAULT_URL)) {
            this._defaultUrl = this.constructor.DEFAULT_URL;
        } else {
            throw new Error(
                `[Shop]: Master initialisation aborted\n` +
                    `Both custom options.defaultUrl ("${defaultUrl}") ` +
                    `and fallback DEFAULT_URL ("${this.constructor.DEFAULT_URL}")\n` +
                    `failed to validate against the required URL specification protocol`,
            );
        }
    },

    _initData() {
        this._data =
            Array.isArray(this._options.data) && this._options.data.length > 0
                ? this._options.data
                : [
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
        this._validateData();
    },

    _validateData() {
        this._data.forEach((item, index) => {
            if (!helper.isValidUrl(item.url)) {
                throw new Error(
                    `[Shop]: Dataset verification failed during master initialisation\n` +
                        `The URL provided at index ${index} ("${item.url}") is invalid or broken\n` +
                        `Ensure all links conform to the standard URL specification protocol\n` +
                        `Expected format: "http://example.com/path" or "https://example.com/path" ` +
                        `(must include valid transfer protocol, domain name and clean path string)\n` +
                        `Check your array source in main.js or local shop fallback definitions`,
                );
            }
        });
    },
};
