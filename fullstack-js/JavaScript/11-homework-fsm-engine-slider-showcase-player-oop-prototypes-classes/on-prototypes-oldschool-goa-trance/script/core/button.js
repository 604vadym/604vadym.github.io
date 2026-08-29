"use strict";

export default function Button(className, instance, command) {
    this._className = className;
    this._assertCommand(command);
    this._onCommand = (element) => command.call(instance, element);
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

        this._onCommand(button);
        return true;
    },

    _assertCommand(command) {
        if (typeof command !== "function") {
            throw new TypeError(
                `[Button]: Failed to instantiate "${this.constructor.name}"\n` +
                    `A valid executable callback function is required`,
            );
        }
    },
};
