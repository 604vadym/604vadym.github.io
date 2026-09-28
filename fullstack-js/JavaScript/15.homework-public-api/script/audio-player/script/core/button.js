"use strict";

import * as helper from "../utils/helpers.js";

export default class Button {
    constructor(className, instance, command) {
        this._className = className;
        this._assertCommand(command);
        this._command = (element, input) =>
            command.call(instance, element, input);
    }

    execute(input) {
        if (!(input instanceof MouseEvent)) return input;

        const button = input.target.closest(`.${this._className}`);
        if (!button) return input;

        if (helper.isPointerInteraction(input)) {
            button.blur();
        }

        this._command(button, input);
        return true;
    }

    isActive() {
        return document.activeElement?.closest(`.${this._className}`);
    }

    _assertCommand(command) {
        if (typeof command !== "function") {
            throw new TypeError(
                `[Button]: Failed to instantiate "${this.constructor.name}"\n` +
                    `The command parameter must be a valid function`,
            );
        }
    }
}
