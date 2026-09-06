"use strict";

export default function KeyboardManager() {}

KeyboardManager.prototype = {
    constructor: KeyboardManager,

    init(instance, configName) {
        this._initKeyActionTable(instance, configName);
    },

    manage(e) {
        const request = this._keyActionTable.find((entry) => entry.match(e));

        return request?.action(e) ?? e;
    },

    _initKeyActionTable(client, configName) {
        const config = client._options[configName];

        this._assertConfig(config, configName, client.constructor.name);

        this._keyActionTable = [];
        Object.entries(config).forEach(([keyAction, keys]) => {
            const methodName = `_${configName}${keyAction.charAt(0).toUpperCase()}${keyAction.slice(1)}`;
            const action = client[methodName];

            this._assertMethodContract(
                action,
                methodName,
                configName,
                client.constructor.name,
            );

            this._keyActionTable.push({
                match: this._matchKeys(keys),
                action: (e) => action.call(client, e),
            });
        });
    },

    _matchKeys(keys) {
        return (e) => keys.includes(e.code) || keys.includes(e.key);
    },

    _assertConfig(config, configName, className) {
        if (!config) {
            throw new Error(
                `[KeyboardManager]: Configuration section "${configName}" is missing in options for "${className}"`,
            );
        }
    },

    _assertMethodContract(method, methodName, configName, className) {
        if (typeof method !== "function") {
            throw new TypeError(
                `[KeyboardManager]: Broken contract in "${className}"\n` +
                    `Method "${methodName}" declared in "${configName}" options must be a valid function`,
            );
        }
    },
};
