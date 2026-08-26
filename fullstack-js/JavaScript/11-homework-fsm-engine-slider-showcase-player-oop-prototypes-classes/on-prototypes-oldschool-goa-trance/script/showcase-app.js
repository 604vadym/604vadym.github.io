"use strict";

import KeyboardManager from "./services/keyboard-manager.js";
import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(options, slider, shop) {
    this._options = options;
    this._slider = slider;
    this._shop = shop;

    Object.defineProperty(this, "_keyboardManager", {
        value: new KeyboardManager(),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._slider.init();
        this._shop.init();
        this._keyboardManager.init(this, "press");
        this._eventManager.init(this, ShowcaseApp.EVENT_MAP_KEY);
    },

    _pressExecute(e) {},

    _handleKeyDown(e) {
        this._keyboardManager.manage(e);
    },
};

ShowcaseApp[ShowcaseApp.EVENT_MAP_KEY] = {
    keydown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyDown,
    },
};
