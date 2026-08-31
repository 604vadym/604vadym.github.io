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
    this._state = STATES.IDLE;
};

KeyboardSlider.prototype._pressNext = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this.next();
};

KeyboardSlider.prototype._pressPrev = function (e) {
    helper.prevent(e);
    if (this._isInputBlocked()) return;
    this.prev();
};

KeyboardSlider.prototype._pressExecute = function (e) {
    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(
        `.${this._options.classes.sliderBtn}`,
    );
    const isPaginationDot = activeElement?.closest(
        `.${this._options.classes.paginationDot}`,
    );
    if (!isButton && !isPaginationDot) return e;

    if ((isButton || isPaginationDot) && this._isInputBlocked()) {
        helper.prevent(e);
        return false;
    }

    return true;
};

KeyboardSlider.prototype._pressReset = function (e) {
    if (helper.isOverrideKey(e)) {
        this._hardReset();
    }
    return e;
};
