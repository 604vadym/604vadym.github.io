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
                `[Shop]: Index ${index} is out of bounds [0..${this._data.length - 1}]. ` +
                    `Falling back to shop default link`,
            );
            this._currentIndex = null;
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
        return this._currentIndex !== null
            ? this._data[this._currentIndex].url
            : this._defaultUrl;
    },

    _pressExecute(e) {
        helper.prevent(e);
        window.open(this._getUrl(), "_blank");
        return true;
    },

    _initDefaultUrl() {
        const configUrl = this._options.defaultUrl;
        const markupUrl = this._link.getAttribute("href");
        this._defaultUrl =
            configUrl || markupUrl || this.constructor.DEFAULT_URL;
        this._validateDefaultUrl(configUrl, markupUrl);
    },

    _validateDefaultUrl(configUrl, markupUrl) {
        if (!helper.isValidUrl(this._defaultUrl)) {
            throw new Error(
                `[Shop]: Master initialisation aborted\n` +
                    `Both custom options.defaultUrl("${configUrl})", markup ("${markupUrl}") ` +
                    `and fallback DEFAULT_URL ("${this.constructor.DEFAULT_URL}")\n` +
                    `Failed to validate against the required URL specification protocol\n` +
                    `Expected format: "http://example.com" or "https://example.com" ` +
                    `(must include valid transfer protocol and domain name)`,
            );
        }
    },

    _initData() {
        this._data = this._options.data;
        this._validateData();
    },

    _validateData() {
        if (
            !Array.isArray(this._options.data) ||
            this._options.data.length === 0
        ) {
            if (!Array.isArray(this._data) || this._data.length === 0) {
                throw new TypeError(
                    `[Shop]: Dataset verification failed during core bootstrap\n` +
                        `The required "data" configuration array is missing, empty or malformed\n` +
                        `Ensure that a valid array containing e-commerce URL targets is explicitly ` +
                        `passed into the Shop constructor\n` +
                        `Expected Configuration Format:\n` +
                        `  new Shop({\n` +
                        `      data: [\n` +
                        `          { url: "https://example.com" },\n` +
                        `          { url: "https://otherexample.com" },\n` +
                        `          { url: "https://anotherexample.com" }\n` +
                        `      ]\n` +
                        `  });\n`,
                );
            }
        }

        this._data.forEach((item, index) => {
            if (!helper.isValidUrl(item.url)) {
                throw new Error(
                    `[Shop]: Dataset verification failed during master initialisation\n` +
                        `The URL provided at index ${index} ("${item.url}") is invalid or broken\n` +
                        `Ensure all links conform to the standard URL specification protocol\n` +
                        `Expected format: "http://example.com" or "https://example.com" ` +
                        `(must include valid transfer protocol and domain name)\n` +
                        `Check your array source in main.js or local shop fallback definitions`,
                );
            }
        });
    },
};
