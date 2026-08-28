"use strict";

import * as helper from "./utils/helpers.js";
import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(slider, audioPlayer, shop) {
    this._slider = slider;
    this._audioPlayer = audioPlayer;
    this._shop = shop;

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

ShowcaseApp.EVENT_MAP_KEY = "EVENT_MAP";

const MOUSE_BUTTON_MIDDLE = 1;

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._slider.init();
        this._audioPlayer.init();
        this._shop.init();
        this._eventManager.init(this, ShowcaseApp.EVENT_MAP_KEY);
    },

    _pipe(e, handlerName) {
        const pipeline = [this._slider, this._shop];
        for (const component of pipeline) {
            if (!(e instanceof KeyboardEvent)) break;
            if (typeof component[handlerName] === "function") {
                e = component[handlerName](e);
            }
        }
    },

    _handleKeyDown(e) {
        this._pipe(e, "handleKeyDown");
    },

    _handleKeyUp(e) {
        this._pipe(e, "handleKeyUp");
    },

    _handleMouseDown(e) {
        if (e.button === MOUSE_BUTTON_MIDDLE) {
            helper.prevent(e);
        }
    },

    _handleSlideChange(e) {
        this._shop.setActiveIndex(e.detail.index);
    },
};

ShowcaseApp[ShowcaseApp.EVENT_MAP_KEY] = {
    keydown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyDown,
    },
    keyup: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyUp,
    },
    mousedown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleMouseDown,
    },
    slidechange: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleSlideChange,
    },
};
