"use strict";

export default function KeyboardManager() {}

KeyboardManager.KEY_MAP = {
    Enter: "key",
    Escape: "key",
    " ": "key",
    ArrowRight: "code",
    ArrowLeft: "code",
    KeyD: "code",
    KeyA: "code",
    PageDown: "code",
    PageUp: "code",
    End: "code",
};

KeyboardManager.getKeyParam = function (key) {
    return KeyboardManager.KEY_MAP[key] || "code";
};

KeyboardManager.prototype = {
    constructor: KeyboardManager,

    init(instance, configName) {
        this._initKeyActionTable(instance, configName);
    },

    manage(e) {
        const request = this._keyActionTable.find((entry) => entry.match(e));

        request?.action(e);
    },

    _initKeyActionTable(instance, configName) {
        const config = instance._options[configName];

        this._assertConfig(config, configName, instance.constructor.name);

        this._keyActionTable = [];
        Object.entries(config).forEach(([keyAction, keys]) => {
            const methodName = `_${configName}${keyAction.charAt(0).toUpperCase()}${keyAction.slice(1)}`;
            const action = instance[methodName];

            this._assertMethodContract(
                action,
                methodName,
                configName,
                instance.constructor.name,
            );

            this._keyActionTable.push({
                match: this._matchKeys(keys),
                action: (e) => action.call(instance, e),
            });
        });
    },

    _matchKeys(keys) {
        const [firstKey] = keys;
        const param = KeyboardManager.getKeyParam(firstKey);
        return (e) => keys.includes(e[param]);
    },

    _assertConfig(config, configName, className) {
        if (!config) {
            throw new Error(
                `[KeyboardManager]: configuration section "${configName}" is missing in options for "${className}"`,
            );
        }
    },

    _assertMethodContract(method, methodName, configName, className) {
        if (typeof method !== "function") {
            throw new TypeError(
                `[KeyboardManager]: broken contract in "${className}"\n` +
                    `method "${methodName}" declared in "${configName}" options must be a valid function`,
            );
        }
    },
};
