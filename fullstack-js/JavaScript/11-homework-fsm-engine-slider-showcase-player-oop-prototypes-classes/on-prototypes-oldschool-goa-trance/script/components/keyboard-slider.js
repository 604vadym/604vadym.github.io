"use strict";

import KeyboardManager from "../services/keyboard-manager.js";
import PaginationSlider from "./pagination-slider.js";

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

KeyboardSlider.prototype._pressExecute = function (e) {
    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(`.${this._options.classes.button}`);

    if (isButton && this._isInputBlocked()) {
        e.preventDefault();
        return;
    }

    const isPressTarget = activeElement?.closest(
        `.${this._options.jsClasses.keyboardPressBtn}`,
    );
    if (isPressTarget) {
        activeElement.classList.add(this._options.states.keyboardBtnPressed);
    }
};

KeyboardSlider.prototype._pressReset = function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    if (e.shiftKey) {
        // hardResetSlider();
    }
};

KeyboardSlider.prototype._pressNext = function (e) {
    e.preventDefault();
    if (this._isInputBlocked()) return;
    this._nextSlide();
};

KeyboardSlider.prototype._pressPrev = function (e) {
    e.preventDefault();
    if (this._isInputBlocked()) return;
    this._prevSlide();
};

KeyboardSlider.prototype._pressIgnore = function (e) {
    e.preventDefault();
};

KeyboardSlider.prototype._handleKeyDown = function (e) {
    this._keyboardManager.manage(e);
};

KeyboardSlider.prototype._handleKeyUp = function () {
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
