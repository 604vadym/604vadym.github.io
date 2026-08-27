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

    _initButtonActionTable(client, configName) {
        const config = client._options[configName];

        this._assertConfig(config, configName, client.constructor.name);

        this._buttonActionTable = [];
        Object.entries(config).forEach(([buttonAction, buttonName]) => {
            const methodName = `_${configName}${buttonAction.charAt(0).toUpperCase()}${buttonAction.slice(1)}`;
            const action = client[methodName];

            this._assertMethodContract(
                action,
                methodName,
                configName,
                client.constructor.name,
            );

            this._buttonActionTable.push({
                buttonName: buttonName,
                action: (button) => action.call(client, button),
            });
        });
    },

    _assertConfig(config, configName, className) {
        if (!config) {
            throw new Error(
                `[ButtonManager]: Configuration section "${configName}" is missing in options for "${className}"`,
            );
        }
    },

    _assertMethodContract(method, methodName, configName, className) {
        if (typeof method !== "function") {
            throw new TypeError(
                `[ButtonManager]: Broken contract in "${className}"\n` +
                    `Method "${methodName}" declared in "${configName}" options must be a valid function`,
            );
        }
    },
};
