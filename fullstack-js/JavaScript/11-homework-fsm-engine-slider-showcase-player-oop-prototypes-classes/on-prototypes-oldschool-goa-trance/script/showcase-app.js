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

const MOUSE_BUTTON_LEFT = 0;
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

    _tryResetBtnNoActive() {
        if (this._btnNoActive) {
            this._btnNoActive.classList.remove(
                this._options.jsClasses.btnNoActive,
            );
            this._eventManager.unsubscribe(this, ShowcaseApp.DYNAMIC_EVENT_MAP);
            delete this._btnNoActive;
        }
    },

    _pipe(e, handlerName, EventClass) {
        const pipeline = [this._slider, this._shop];
        for (const component of pipeline) {
            if (!(e instanceof EventClass)) break;
            if (typeof component[handlerName] === "function") {
                e = component[handlerName](e);
            }
        }
    },

    _handleClick(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            helper.prevent(e);
            return;
        }

        this._pipe(e, "handleClick", MouseEvent);
    },

    _handleKeyDown(e) {
        this._pipe(e, "handleKeyDown", KeyboardEvent);
    },

    _handleKeyUp(e) {
        this._pipe(e, "handleKeyUp", KeyboardEvent);
    },

    _handleMouseDown(e) {
        if (e.button === MOUSE_BUTTON_MIDDLE) {
            helper.prevent(e);
        }
        if (!this._showcase.contains(e.target)) return;

        if (e.button === MOUSE_BUTTON_RIGHT) {
            const button = e.target.closest(`.${this._options.classes.button}`);
            if (button && !this._btnNoActive) {
                button.classList.add(this._options.jsClasses.btnNoActive);
                this._btnNoActive = button;
                this._eventManager.subscribe(
                    this,
                    ShowcaseApp.DYNAMIC_EVENT_MAP,
                );
            }
        } else if (
            e.button === MOUSE_BUTTON_LEFT ||
            e.button === MOUSE_BUTTON_MIDDLE
        ) {
            this._tryResetBtnNoActive();
        }
    },

    _handleSlideChange(e) {
        this._shop.setActiveIndex(e.detail.index);
    },

    _handleMouseLeave(e) {
        this._tryResetBtnNoActive();
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

ShowcaseApp.DYNAMIC_EVENT_MAP = {
    mouseleave: {
        target: (instance) => instance._btnNoActive,
        handler: ShowcaseApp.prototype._handleMouseLeave,
    },
};
