"use strict";

import KeyboardManager from "../services/keyboard-manager.js";
import PaginationSlider from "./pagination-slider.js";

export default function KeyboardSlider(options) {
    PaginationSlider.call(this, options);
}

KeyboardSlider.prototype = Object.create(PaginationSlider.prototype);
KeyboardSlider.prototype.constructor = KeyboardSlider;
Object.setPrototypeOf(KeyboardSlider, PaginationSlider);

KeyboardSlider.prototype._initActionTables = function () {
    PaginationSlider.prototype._initActionTables.call(this);
    this._initKeyActionTable("press");
};

KeyboardSlider.prototype._pressExecute = function (e) {
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

KeyboardSlider.prototype._pressReset = function (e) {
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    if (e.shiftKey) {
        // hardResetSlider();
    }
};

KeyboardSlider.prototype._pressNext = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._nextSlide();
};

KeyboardSlider.prototype._pressPrev = function (e) {
    e.preventDefault();
    if (this._state === this.constructor.STATES.MOVING) return;
    this._prevSlide();
};

KeyboardSlider.prototype._pressIgnore = function (e) {
    e.preventDefault();
};

KeyboardSlider.prototype._initKeyActionTable = function (configName) {
    const config = this._options[configName];
    if (!config) return;
    this._keyActionTable = [];

    Object.entries(config).forEach(([keyAction, keys]) => {
        const methodName = `_${configName}${keyAction.charAt(0).toUpperCase()}${keyAction.slice(1)}`;
        const action = this[methodName];

        if (keys && typeof action === "function") {
            this._keyActionTable.push({
                match: this._matchKeys(keys),
                action: (e) => action.call(this, e),
            });
        }
    });
};

KeyboardSlider.prototype._matchKeys = function (keys) {
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
