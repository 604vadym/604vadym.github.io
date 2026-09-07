"use strict";

import * as helper from "../utils/helpers.js";
import PaginationSlider from "./pagination-slider.js";
import KeyboardManager from "../services/keyboard-manager.js";

export default class KeyboardSlider extends PaginationSlider {
    constructor(options) {
        super(options);
        this._keyboardManager = new KeyboardManager();
    }

    init() {
        super.init();
        this._keyboardManager.init(this, "press");
    }

    handleKeyDown(e) {
        return this._keyboardManager.manage(e);
    }

    _hardReset() {
        this._currentIndex = this._startIndex;
        this._activeIndex = this._currentIndex;
        this._isResizing = false;
        clearTimeout(this._resizeTimeoutId);
        this._slider.classList.remove(this._options.states.resizing);
        this._updateTrackInstantly();
        this._updatePagination();
        this._state = STATES.IDLE;
    }

    _pressNext(e) {
        if (this._isInputBlocked()) return false;
        this.next();
        return true;
    }

    _pressPrev(e) {
        if (this._isInputBlocked()) return false;
        this.prev();
        return true;
    }

    _pressExecute(e) {
        const isButton = this._button.isActive();
        const isPaginationDot = this._buttonPagination.isActive();

        if (!isButton && !isPaginationDot) return e;

        if ((isButton || isPaginationDot) && this._isInputBlocked()) {
            return false;
        }

        return true;
    }

    _pressReset(e) {
        if (helper.isOverrideKey(e)) {
            this._hardReset();
        }
        return e;
    }
}
