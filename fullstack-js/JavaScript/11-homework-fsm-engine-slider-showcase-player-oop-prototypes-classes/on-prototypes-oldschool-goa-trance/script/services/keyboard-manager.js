"use strict";

export default function KeyboardManager() {}

KeyboardManager.KEY_MAP = {
    Enter: "key",
    Escape: "key",
    " ": "key",
    0: "key",
    1: "key",
    2: "key",
    3: "key",
    4: "key",
    5: "key",
    6: "key",
    7: "key",
    8: "key",
    9: "key",
    "-": "key",
    _: "key",
    "+": "key",
    "=": "key",
    ArrowUp: "code",
    ArrowDown: "code",
    ArrowRight: "code",
    ArrowLeft: "code",
    KeyW: "code",
    KeyS: "code",
    KeyD: "code",
    KeyA: "code",
    KeyN: "code",
    KeyP: "code",
    PageDown: "code",
    PageUp: "code",
    Home: "code",
    End: "code",
    Backspace: "code",
    Pause: "key",
    Pause: "code",
    MediaPlayPause: "key",
    MediaTrackNext: "key",
    MediaTrackPrevious: "key",
    NumpadAdd: "code",
    NumpadMinus: "code",
    BracketRight: "code",
    BracketLeft: "code",
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
        const [firstKey] = keys;
        const param = KeyboardManager.getKeyParam(firstKey);
        return (e) => keys.includes(e[param]);
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
