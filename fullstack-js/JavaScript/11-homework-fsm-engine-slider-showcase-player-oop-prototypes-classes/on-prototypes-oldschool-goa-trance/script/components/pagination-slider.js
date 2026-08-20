"use strict";

import * as helper from "../utils/helpers.js";
import BaseSlider from "./base-slider.js";

export default function PaginationSlider(options) {
    BaseSlider.call(this, options);
}

PaginationSlider.prototype = Object.create(BaseSlider.prototype);
PaginationSlider.prototype.constructor = PaginationSlider;
Object.setPrototypeOf(PaginationSlider, BaseSlider);

PaginationSlider.prototype.init = function () {
    BaseSlider.prototype.init.call(this);
    this._initPagination();
};

PaginationSlider.prototype._initDOMElements = function (childElements) {
    const pagination = document.querySelector(
        this._options.singleSelectors.pagination,
    );

    BaseSlider.prototype._initDOMElements.call(this, {
        pagination,
        ...childElements,
    });

    this._pagination = pagination;
};

PaginationSlider.prototype._updateSlider = function () {
    BaseSlider.prototype._updateSlider.call(this);
    this._updatePagination();
};

PaginationSlider.prototype._updatePagination = function () {
    const activeDot = this._pagination.querySelector(
        `.${this._options.classesActive.paginationDot}`,
    );
    if (activeDot) {
        activeDot.classList.remove(this._options.classesActive.paginationDot);
    }
    this._paginationDots[this._normaliseIndex()].classList.add(
        this._options.classesActive.paginationDot,
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
        this._options.classesActive.paginationDot,
    );
};

PaginationSlider.prototype._clickGoto = function (index) {
    this._goToSlide(index);
};
