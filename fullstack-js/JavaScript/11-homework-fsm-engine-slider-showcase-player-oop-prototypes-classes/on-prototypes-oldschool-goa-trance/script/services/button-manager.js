"use strict";

export default function ButtonManager() {}

ButtonManager.prototype = {
    constructor: ButtonManager,

    init(instance, configName) {
        this._initClickActionTable(instance, configName);
    },

    _initClickActionTable(instance, configName) {
        const config = instance._options[configName];
        if (!config) return;
        this._clickActionTable = [];

        Object.entries(config).forEach(([clickAction, className]) => {
            const methodName = `_${configName}${clickAction.charAt(0).toUpperCase()}${clickAction.slice(1)}`;
            const action = instance[methodName];

            if (className && typeof action === "function") {
                this._clickActionTable.push({
                    className: className,
                    action: (button) => action.call(instance, button),
                });
            }
        });
    },

    manage(button) {
        const request = this._clickActionTable.find((entry) =>
            button.classList.contains(entry.className),
        );

        request?.action(button);
    },
};
