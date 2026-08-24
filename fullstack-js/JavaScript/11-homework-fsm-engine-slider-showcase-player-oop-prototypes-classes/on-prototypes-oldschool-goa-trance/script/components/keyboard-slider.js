"use strict";

import * as helper from "../utils/helpers.js";
import PaginationSlider from "./pagination-slider.js";
import KeyboardManager from "../services/keyboard-manager.js";

export default function KeyboardSlider(options) {
    PaginationSlider.call(this, options);

    Object.defineProperty(this, "_keyboardManager", {
        value: new KeyboardManager(),
        writable: false,
        configurable: false,
    });
}

KeyboardSlider.prototype = Object.create(PaginationSlider.prototype);
KeyboardSlider.prototype.constructor = KeyboardSlider;
Object.setPrototypeOf(KeyboardSlider, PaginationSlider);

KeyboardSlider.prototype.init = function () {
    PaginationSlider.prototype.init.call(this);
    this._keyboardManager.init(this, "press");
};

KeyboardSlider.prototype._hardReset = function () {
    this._currentIndex = this._startIndex;
    this._isResizing = false;
    clearTimeout(this._resizeTimeoutId);
    this._slider.classList.remove(this._options.states.resizing);
    this._updateSliderInstantly();
    helper.tryClearFocus();
};

KeyboardSlider.prototype._pressNext = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this._nextSlide();
};

KeyboardSlider.prototype._pressPrev = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this._prevSlide();
};

KeyboardSlider.prototype._pressExecute = function (e) {
    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(`.${this._options.classes.button}`);

    if (isButton && this._isInputBlocked()) {
        helper.prevent(e);
        return false;
    }

    const isPressTarget = activeElement?.closest(
        `.${this._options.jsClasses.keyboardPressBtn}`,
    );
    if (isPressTarget) {
        activeElement.classList.add(this._options.states.keyboardBtnPressed);
    }

    return true;
};

KeyboardSlider.prototype._pressReset = function (e) {
    if (helper.hasPlatformModifiers(e)) return false;

    helper.prevent(e);
    if (helper.isOverrideKey(e)) {
        this._hardReset();
    }

    return true;
};

KeyboardSlider.prototype._pressIgnore = function (e) {
    helper.prevent(e);
};

KeyboardSlider.prototype._handleKeyDown = function (e) {
    this._keyboardManager.manage(e);
};

KeyboardSlider.prototype._handleKeyUp = function (e) {
    const pressedBtn = document.querySelector(
        `.${this._options.states.keyboardBtnPressed}`,
    );
    if (pressedBtn) {
        pressedBtn.classList.remove(this._options.states.keyboardBtnPressed);
    }
};

KeyboardSlider[KeyboardSlider.EVENT_MAP_KEY] = {
    keydown: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyDown,
    },
    keyup: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyUp,
    },
};
