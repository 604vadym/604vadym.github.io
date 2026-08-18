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

KeyboardSlider.prototype._handleKeyDown = function (e) {
    if (e.key === "Enter") {
        const activeElement = document.activeElement;
        const isButton = activeElement?.closest(
            `.${this._options.classes.button}`,
        );

        if (isButton && this._state === this.constructor.STATES.MOVING) {
            e.preventDefault();
            return;
        }

        const isPressTarget = activeElement?.closest(
            `.${this._options.jsClasses.keyboardPressBtn}`,
        );
        if (isPressTarget) {
            activeElement.classList.add(
                this._options.states.keyboardBtnPressed,
            );
        }

        if (isButton) return;
    }

    if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault();
        if (this._state === this.constructor.STATES.MOVING) return;
        this._nextSlide();
        return;
    } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault();
        if (this._state === this.constructor.STATES.MOVING) return;
        this._prevSlide();
        return;
    }

    if (e.code === "Escape") {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        e.preventDefault();
        if (e.shiftKey) {
            // hardResetSlider();
        }
        return;
    }

    if (e.code === "PageDown" || e.code === "PageUp" || e.code === "End") {
        e.preventDefault();
    }
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
