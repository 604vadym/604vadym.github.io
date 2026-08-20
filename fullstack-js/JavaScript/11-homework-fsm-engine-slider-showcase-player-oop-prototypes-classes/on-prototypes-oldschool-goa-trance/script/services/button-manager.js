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

        Object.entries(config).forEach(([actionName, className]) => {
            const methodName = `_${configName}${actionName.charAt(0).toUpperCase()}${actionName.slice(1)}`;
            const action = instance[methodName];

            if (className && typeof action === "function") {
                this._clickActionTable.push({
                    className: className,
                    action: (button) => action.call(instance, button),
                });
            }
        });
    },

    getClickAction(button) {
        const classList = button.classList;

        const actionIndex = this._clickActionTable.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1 ? this._clickActionTable[actionIndex] : null;
    },
};
