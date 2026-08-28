"use strict";

import * as helper from "./utils/helpers.js";
import DOMValidator from "./services/dom-validator.js";
import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(slider, audioPlayer, shop, options) {
    this._slider = slider;
    this._audioPlayer = audioPlayer;
    this._shop = shop;
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(ShowcaseApp),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

ShowcaseApp.EVENT_MAP_KEY = "EVENT_MAP";

const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._initDOMElements();
        this._slider.init();
        this._audioPlayer.init();
        this._shop.init();
        this._eventManager.init(this, ShowcaseApp.EVENT_MAP_KEY);
    },

    _initDOMElements(childElements) {
        const showcase = document.querySelector(
            this._options.singleSelectors.app,
        );

        this._domValidator.validate(this, childElements, {
            showcase,
        });

        this._showcase = showcase;
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

    _pipeClicks(e) {
        const pipeline = [this._slider, this._audioPlayer, this._shop];
        for (const component of pipeline) {
            if (!(e instanceof MouseEvent)) break;
            if (typeof component.handleClick === "function") {
                e = component.handleClick(e);
            }
        }
    },

    _handleClick(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            helper.prevent(e);
            return;
        }

        this._pipeClicks(e);
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
    click: {
        target: (instance) => instance._showcase,
        handler: ShowcaseApp.prototype._handleClick,
    },
    auxclick: {
        target: (instance) => instance._showcase,
        handler: ShowcaseApp.prototype._handleClick,
    },
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
