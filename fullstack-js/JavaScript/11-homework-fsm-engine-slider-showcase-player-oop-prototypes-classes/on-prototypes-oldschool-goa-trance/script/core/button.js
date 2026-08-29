"use strict";

export default function Button(className, manager) {
    this._className = className;
    this._assertManager(manager);
    this._manager = manager;
}

Button.prototype = {
    constructor: Button,

    execute(input) {
        if (!(input instanceof MouseEvent)) return input;

        const button = input.target.closest(`.${this._className}`);
        if (!button) return input;

        if (input.pointerType === "mouse" || input.pointerType === "touch") {
            button.blur();
        }

        this._manager.manage(button);
        return true;
    },

    _assertManager(manager) {
        if (!manager || typeof manager.manage !== "function") {
            throw new TypeError(
                `[Button]: Invalid ButtonManager instance passed`,
            );
        }
    },
};
