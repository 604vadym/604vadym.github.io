"use strict";

import KeyboardManager from "./services/keyboard-manager.js";
import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(slider, shop) {
    this._slider = slider;
    this._shop = shop;

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

ShowcaseApp.EVENT_MAP_KEY = "EVENT_MAP";

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._slider.init();
        this._shop.init();
        this._eventManager.init(this, ShowcaseApp.EVENT_MAP_KEY);
    },

    _handleKeyDown(e) {
        const pipeline = [this._slider, this._shop];
        for (const component of pipeline) {
            if (!(e instanceof KeyboardEvent)) break;
            e = component.handleKeyDown(e);
        }
    },
};

ShowcaseApp[ShowcaseApp.EVENT_MAP_KEY] = {
    keydown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyDown,
    },
};
