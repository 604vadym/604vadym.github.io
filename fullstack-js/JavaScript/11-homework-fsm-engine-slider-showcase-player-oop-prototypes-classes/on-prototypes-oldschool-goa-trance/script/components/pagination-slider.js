"use strict";

import BaseSlider from "./base-slider.js";

export default function PaginationSlider(options) {
    BaseSlider.call(this, options);
}

PaginationSlider.prototype = Object.create(BaseSlider.prototype);

PaginationSlider.prototype.constructor = PaginationSlider;

PaginationSlider.prototype.init = function () {
    BaseSlider.prototype.init.call(this);
    this._initPagination();
};

PaginationSlider.prototype._initDOMElements = function () {
    this._pagination = document.querySelector(
        this._options.singleSelectors.pagination,
    );
    BaseSlider.prototype._initDOMElements.call(this, {
        elements: {
            pagination: this._pagination,
        },
    });
};

PaginationSlider.prototype._initClickActionTable = function () {
    BaseSlider.prototype._initClickActionTable.call(this);
    this._clickActionTable.push({
        className: this._options.classes.paginationDot,
        action: (button) =>
            this._goToSlide(
                this._normaliseIndex(this._paginationDots.indexOf(button)),
            ),
    });
};

PaginationSlider.prototype._updateSlider = function () {
    BaseSlider.prototype._updateSlider.call(this);
    this._updatePagination();
};

PaginationSlider.prototype._updatePagination = function () {
    const activeDot = this._pagination.querySelector(
        `.${this._options.classes.paginationDotActive}`,
    );
    if (activeDot) {
        activeDot.classList.remove(this._options.classes.paginationDotActive);
    }
    this._paginationDots[this._normaliseIndex()].classList.add(
        this._options.classes.paginationDotActive,
    );
};

PaginationSlider.prototype._initPagination = function () {
    this._paginationDots = [];

    for (let i = 0; i < this._slidesCount; i++) {
        const dot = document.createElement("button");
        dot.classList.add(this._options.classes.button);
        dot.classList.add(this._options.classes.paginationDot);
        this._paginationDots.push(this._pagination.appendChild(dot));
    }
    this._paginationDots[0].classList.add(
        this._options.classes.paginationDotActive,
    );
};
