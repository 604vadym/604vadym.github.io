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
                className:
                    this._instance._options.singleSelectors.btnNext.replace(
                        /^\./,
                        "",
                    ),
                action: () => this._instance._nextSlide(),
            },
            {
                className:
                    this._instance._options.singleSelectors.btnPrev.replace(
                        /^\./,
                        "",
                    ),
                action: () => this._instance._prevSlide(),
            },
            {
                className: this._instance._options.classes.paginationDot,
                action: (button) =>
                    this._instance._goToSlide(
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
