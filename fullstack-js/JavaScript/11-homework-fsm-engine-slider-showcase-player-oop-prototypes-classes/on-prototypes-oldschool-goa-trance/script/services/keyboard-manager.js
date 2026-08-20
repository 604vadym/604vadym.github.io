"use strict";

KeyboardManager.KEY_MAP = {
    Enter: "key",
    Escape: "key",
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

export default function KeyboardManager() {}

KeyboardManager.prototype = {
    constructor: KeyboardManager,

    init(instance, configName) {
        this._initKeyActionTable(instance, configName);
    },

    _initKeyActionTable(instance, configName) {
        const config = instance._options[configName];
        if (!config) return;
        this._keyActionTable = [];

        Object.entries(config).forEach(([keyAction, keys]) => {
            const methodName = `_${configName}${keyAction.charAt(0).toUpperCase()}${keyAction.slice(1)}`;
            const action = instance[methodName];

            if (keys && typeof action === "function") {
                this._keyActionTable.push({
                    match: this._matchKeys(keys),
                    action: (e) => action.call(instance, e),
                });
            }
        });
    },

    _matchKeys(keys) {
        const [firstKey] = keys;
        const param = KeyboardManager.getKeyParam(firstKey);
        return (e) => keys.includes(e[param]);
    },

    manage(e) {
        const request = this._keyActionTable.find((entry) => entry.match(e));

        request?.action(e);
    },
};
