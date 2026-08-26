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

const STATES = PaginationSlider.STATES;

KeyboardSlider.prototype.init = function () {
    PaginationSlider.prototype.init.call(this);
    this._keyboardManager.init(this, "press");
};

KeyboardSlider.prototype.handleKeyDown = function (e) {
    return this._keyboardManager.manage(e);
};

KeyboardSlider.prototype._hardReset = function () {
    this._currentIndex = this._startIndex;
    this._isResizing = false;
    clearTimeout(this._resizeTimeoutId);
    this._slider.classList.remove(this._options.states.resizing);
    this._updateTrackInstantly();
    this._updatePagination();
    helper.tryClearFocus();
    this._state = STATES.IDLE;
};

KeyboardSlider.prototype._pressNext = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this._nextIndex();
};

KeyboardSlider.prototype._pressPrev = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this._prevIndex();
};

KeyboardSlider.prototype._pressExecute = function (e) {
    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(`.${this._options.classes.button}`);

    if (!isButton) return e;

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

KeyboardSlider.prototype._handleKeyUp = function (e) {
    const pressedBtn = document.querySelector(
        `.${this._options.states.keyboardBtnPressed}`,
    );
    if (pressedBtn) {
        pressedBtn.classList.remove(this._options.states.keyboardBtnPressed);
    }
};

KeyboardSlider[KeyboardSlider.EVENT_MAP_KEY] = {
    keyup: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyUp,
    },
};
