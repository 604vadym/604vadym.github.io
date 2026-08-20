"use strict";

export default function ButtonManager() {}

ButtonManager.prototype = {
    constructor: ButtonManager,

    init(instance, configName) {
        this._initButtonActionTable(instance, configName);
    },

    manage(button) {
        const request = this._buttonActionTable.find((entry) =>
            button.classList.contains(entry.buttonName),
        );

        request?.action(button);
    },

    _initButtonActionTable(instance, configName) {
        const config = instance._options[configName];

        this._assertConfig(config, configName, instance.constructor.name);

        this._buttonActionTable = [];
        Object.entries(config).forEach(([clickAction, buttonName]) => {
            const methodName = `_${configName}${clickAction.charAt(0).toUpperCase()}${clickAction.slice(1)}`;
            const action = instance[methodName];

            if (buttonName) {
                this._assertMethodContract(
                    action,
                    methodName,
                    configName,
                    instance.constructor.name,
                );

                this._buttonActionTable.push({
                    buttonName: buttonName,
                    action: (button) => action.call(instance, button),
                });
            }
        });
    },

    _assertConfig(config, configName, className) {
        if (!config) {
            throw new Error(
                `[ButtonManager]: configuration section "${configName}" is missing in options for "${className}"`,
            );
        }
    },

    _assertMethodContract(method, methodName, configName, className) {
        if (typeof method !== "function") {
            throw new TypeError(
                `[ButtonManager]: broken contract in "${className}"\n` +
                    `method "${methodName}" declared in "${configName}" options must be a valid function`,
            );
        }
    },
};
