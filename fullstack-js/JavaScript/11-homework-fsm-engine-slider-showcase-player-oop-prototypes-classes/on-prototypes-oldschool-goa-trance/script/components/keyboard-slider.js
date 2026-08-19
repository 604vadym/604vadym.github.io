"use strict";

import PaginationSlider from "./pagination-slider.js";

KeyboardSlider.EVENTS = {
    KEYDOWN: "keydown",
    KEYUP: "keyup",
};

export default function KeyboardSlider(options) {
    PaginationSlider.call(this, options);
}

KeyboardSlider.prototype = Object.create(PaginationSlider.prototype);

KeyboardSlider.prototype.constructor = KeyboardSlider;

KeyboardSlider.STATES = PaginationSlider.STATES;

KeyboardSlider.prototype._initActionTables = function () {
    PaginationSlider.prototype._initActionTables.call(this);
    this._initKeyActionTable();
};

KeyboardSlider.prototype._enter = function (e) {
    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(`.${this._options.classes.button}`);

    if (isButton && this._state === this.constructor.STATES.MOVING) {
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

KeyboardSlider.prototype._escape = function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    if (e.shiftKey) {
        // hardResetSlider();
    }
};

KeyboardSlider.prototype._right = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._nextSlide();
};

KeyboardSlider.prototype._left = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._prevSlide();
};

KeyboardSlider.prototype._void = function (e) {
    e.preventDefault();
};

KeyboardSlider.prototype._initKeyActionTable = function () {
    this._keyActionTable = [
        {
            match: (e) => e.key === "Enter",
            action: (e) => this._enter(e),
        },
        {
            match: (e) => e.key === "Escape",
            action: (e) => this._escape(e),
        },
        {
            match: (e) => ["ArrowRight", "KeyD"].includes(e.code),
            action: (e) => this._right(e),
        },
        {
            match: (e) => ["ArrowLeft", "KeyA"].includes(e.code),
            action: (e) => this._left(e),
        },
        {
            match: (e) => ["PageDown", "PageUp", "End"].includes(e.code),
            action: (e) => this._void(e),
        },
    ];
};

KeyboardSlider.prototype._getKeyAction = function (e) {
    return this._keyActionTable.find((entry) => entry.match(e));
};

KeyboardSlider.prototype._handleKeyDown = function (e) {
    const keyAction = this._getKeyAction(e);

    keyAction?.action(e);
};

KeyboardSlider.prototype._handleKeyUp = function () {
    const pressedBtn = document.querySelector(
        `.${this._options.states.keyboardBtnPressed}`,
    );
    if (pressedBtn) {
        pressedBtn.classList.remove(this._options.states.keyboardBtnPressed);
    }
};

KeyboardSlider.EVENT_MAP = {
    [KeyboardSlider.EVENTS.KEYDOWN]: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyDown,
    },
    [KeyboardSlider.EVENTS.KEYUP]: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyUp,
    },
};
