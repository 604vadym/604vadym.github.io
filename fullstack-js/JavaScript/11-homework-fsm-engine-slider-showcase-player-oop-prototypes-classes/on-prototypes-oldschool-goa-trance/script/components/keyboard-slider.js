"use strict";

import KeyboardManager from "../services/keyboard-manager.js";
import PaginationSlider from "./pagination-slider.js";

KeyboardSlider.STATES = PaginationSlider.STATES;

export default function KeyboardSlider(options) {
    PaginationSlider.call(this, options);
}

KeyboardSlider.prototype = Object.create(PaginationSlider.prototype);
KeyboardSlider.prototype.constructor = KeyboardSlider;

KeyboardSlider.prototype._initActionTables = function () {
    PaginationSlider.prototype._initActionTables.call(this);
    this._initKeyActionTable();
};

KeyboardSlider.prototype._execute = function (e) {
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

KeyboardSlider.prototype._reset = function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    if (e.shiftKey) {
        // hardResetSlider();
    }
};

KeyboardSlider.prototype._next = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._nextSlide();
};

KeyboardSlider.prototype._prev = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._prevSlide();
};

KeyboardSlider.prototype._ignore = function (e) {
    e.preventDefault();
};

KeyboardSlider.prototype._initKeyActionTable = function () {
    const keysConfig = this._options.keys;
    this._keyActionTable = [];

    Object.entries(keysConfig).forEach(([keysAction, keys]) => {
        const action = this[`_${keysAction}`];
        if (keys && typeof action === "function") {
            this._keyActionTable.push({
                match: this._matchKey(keys),
                action: (e) => action.call(this, e),
            });
        }
    });
};

KeyboardSlider.prototype._matchKey = function (keys) {
    const [firstKey] = keys;
    const param = KeyboardManager.getKeyParam(firstKey);
    return (e) => keys.includes(e[param]);
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
    keydown: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyDown,
    },
    keyup: {
        target: () => document,
        handler: KeyboardSlider.prototype._handleKeyUp,
    },
};
