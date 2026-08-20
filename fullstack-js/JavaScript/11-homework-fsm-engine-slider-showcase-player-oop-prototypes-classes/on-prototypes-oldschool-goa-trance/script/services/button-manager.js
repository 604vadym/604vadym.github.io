"use strict";

export default function ButtonManager(instance) {
    this._instance = instance;
}

ButtonManager.prototype = {
    constructor: ButtonManager,

    init() {
        this._initClickActionTable();
    },

    _initClickActionTable() {
        this._clickActionTable = [
            {
                className: this._instance._options.buttons.next,
                action: () => this._instance._clickNext(),
            },
            {
                className: this._instance._options.buttons.prev,
                action: () => this._instance._clickPrev(),
            },
            {
                className: this._instance._options.buttons.goto,
                action: (button) =>
                    this._instance._clickGoto(
                        this._instance._paginationDots.indexOf(button),
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
