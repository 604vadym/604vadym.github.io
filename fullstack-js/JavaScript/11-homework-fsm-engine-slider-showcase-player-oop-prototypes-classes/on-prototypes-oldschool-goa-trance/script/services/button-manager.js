"use strict";

export default function ButtonManager() {}

ButtonManager.prototype = {
    constructor: ButtonManager,

    init(instance, configName) {
        this._initClickActionTable(instance, configName);
    },

    _initClickActionTable(instance, configName) {
        this._clickActionTable = [
            {
                className: instance._options[configName].next,
                action: () => instance._clickNext(),
            },
            {
                className: instance._options[configName].prev,
                action: () => instance._clickPrev(),
            },
            {
                className: instance._options[configName].goto,
                action: (button) =>
                    instance._clickGoto(
                        instance._paginationDots.indexOf(button),
                    ),
            },
        ];
    },

    getClickAction(button) {
        const classList = button.classList;

        const actionIndex = this._clickActionTable.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1 ? this._clickActionTable[actionIndex] : null;
    },
};
