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

KeyboardSlider.prototype._initEventListeners = function () {
    PaginationSlider.prototype._initEventListeners.call(this);
    document.addEventListener(
        KeyboardSlider.EVENTS.KEYDOWN,
        this._EventManager,
    );
    document.addEventListener(KeyboardSlider.EVENTS.KEYUP, this._EventManager);
};

KeyboardSlider.prototype._handleKeyDown = function (e) {
    if (e.key === "Enter") {
        const activeElement = document.activeElement;
        const isButton = activeElement?.closest(".button");

        if (isButton && this._state === this.constructor.STATES.MOVING) {
            e.preventDefault();
            return;
        }

        const isPressTarget = activeElement?.closest(".js-pressed-target");
        if (isPressTarget) {
            activeElement.classList.add("is-pressed");
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
    const pressedBtn = document.querySelector(".is-pressed");
    if (pressedBtn) {
        pressedBtn.classList.remove("is-pressed");
    }
};

KeyboardSlider.EVENT_MAP = {
    [KeyboardSlider.EVENTS.KEYDOWN]: KeyboardSlider.prototype._handleKeyDown,
    [KeyboardSlider.EVENTS.KEYUP]: KeyboardSlider.prototype._handleKeyUp,
};
