"use strict";

import * as helper from "./utils/helpers.js";
import DOMValidator from "./services/dom-validator.js";
import EventManager from "./services/event-manager.js";
import KeyboardManager from "./services/keyboard-manager.js";

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
        this._keyboardManager.init(this, "press");
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

    _pressToggle(e) {
        helper.prevent(e);
        return "reverse";
    },

    _pressReset(e) {
        if (helper.hasPlatformModifiers(e)) return false;
        helper.prevent(e);
        helper.tryClearFocus();
        return e;
    },

    _pressIgnore(e) {
        helper.prevent(e);
        return false;
    },

    _handleClick(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            helper.prevent(e);
            return;
        }

        this._stream(e, "handleClick", MouseEvent);
    },

    _handleKeyDown(e) {
        let pump;
        if (!(pump = this._keyboardManager.manage(e))) return;

        const result = this._stream(e, "handleKeyDown", KeyboardEvent, pump);
        if (result === true) {
            const activeElement = document.activeElement;
            const isPressTarget = activeElement?.closest(
                `.${this._options.jsClasses.keyboardPressBtn}`,
            );
            if (isPressTarget) {
                activeElement.classList.add(
                    this._options.states.keyboardBtnPressed,
                );
            }
        }
    },

    _stream(e, handlerName, EventClass, pump) {
        let pipeline;
        if (pump === "reverse") {
            pipeline = [this._audioPlayer, this._slider, this._shop];
        } else {
            pipeline = [this._slider, this._audioPlayer, this._shop];
        }
        return this._pipe(e, handlerName, EventClass, pipeline);
    },

    _pipe(e, handlerName, EventClass, pipeline) {
        for (const component of pipeline) {
            if (!(e instanceof EventClass)) return e;
            if (typeof component[handlerName] === "function") {
                e = component[handlerName](e);
            }
        }
    },

    _handleKeyUp(e) {
        const pressedBtn = document.querySelector(
            `.${this._options.states.keyboardBtnPressed}`,
        );
        if (pressedBtn) {
            pressedBtn.classList.remove(
                this._options.states.keyboardBtnPressed,
            );
        }
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
        this._audioPlayer.switchAlbum(e.detail.index);
    },

    _handleAutoscrollChange(e) {
        this._toggleAudioPlayerTheme(e.detail.isActive);
        this._toggleAutoscrollLayout(e.detail.isActive);
    },

    _toggleAudioPlayerTheme(isActive) {
        if (isActive) {
            this._audioPlayer.playTheme();
        } else {
            this._audioPlayer.resetTheme();
        }
    },

    _toggleAutoscrollLayout(isActive) {
        if (this._isAutoscrollActive() === isActive) return;
        this._showcase.classList.toggle(
            this._options.states.autoscrollActive,
            isActive,
        );
        this._slider.btnAutoscrollOn.tabIndex = isActive ? -1 : 0;
        this._slider.btnAutoscrollOff.tabIndex = isActive ? 0 : -1;
        helper.tryClearFocus();
    },

    _isAutoscrollActive() {
        return this._showcase.classList.contains(
            this._options.states.autoscrollActive,
        );
    },

    _handleAlbumPlay(e) {
        this._slider.lockAutoscroll();
        this._toggleAudioPlayerLayout(true);
    },

    _handleAlbumPause(e) {
        this._slider.unlockAutoscroll();
        this._toggleAudioPlayerLayout(false);
    },

    _handleAlbumEnd(e) {
        if (helper.isTabActive()) {
            helper.prevent(e);
            this._slider.next();
        } else {
            this._slider.nextInstantly();
        }
    },

    _toggleAudioPlayerLayout(isActive) {
        if (this._isAudioActive() === isActive) return;
        this._showcase.classList.toggle(
            this._options.states.audioActive,
            isActive,
        );
        this._audioPlayer.btnPlay.tabIndex = isActive ? -1 : 0;
        this._audioPlayer.btnPause.tabIndex = isActive ? 0 : -1;
        this._audioPlayer.btnNext.tabIndex = isActive ? 0 : -1;
        this._audioPlayer.btnPrev.tabIndex = isActive ? 0 : -1;
        // helper.tryClearFocus();
    },

    _isAudioActive() {
        return this._showcase.classList.contains(
            this._options.states.audioActive,
        );
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
    autoscrollchange: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleAutoscrollChange,
    },
    albumplay: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumPlay,
    },
    albumpause: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumPause,
    },
    albumend: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumEnd,
    },
};

ShowcaseApp.DYNAMIC_EVENT_MAP = {
    mouseleave: {
        target: (instance) => instance._btnNoActive,
        handler: ShowcaseApp.prototype._handleMouseLeave,
    },
};
