"use strict";

import * as helper from "../utils/helpers.js";
import Button from "../core/button.js";
import BaseSlider from "./base-slider.js";

export default class PaginationSlider extends BaseSlider {
    init() {
        super.init();
        this._initPagination();
    }

    handleClick(e) {
        return this._buttonPagination.execute(super.handleClick(e));
    }

    _initPagination() {
        this._paginationDots = [];

        for (let i = 0; i < this._slidesCount; i++) {
            const dot = document.createElement("button");
            dot.classList.add(this._options.classes.button);
            dot.classList.add(this._options.classes.paginationDot);
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            this._paginationDots.push(this._pagination.appendChild(dot));
        }
        this._paginationDots[0].classList.add(
            this._options.classesActive.paginationDot,
        );
        this._paginationDots[0].setAttribute("aria-current", "true");
    }

    _initDOMElements(childElements) {
        const pagination = document.querySelector(
            this._options.singleSelectors.pagination,
        );

        super._initDOMElements({
            pagination,
            ...childElements,
        });

        this._pagination = pagination;
    }

    _onIndexChanged() {
        super._onIndexChanged();
        this._updatePagination();
    }

    _onIndexChangedInstantly() {
        super._onIndexChangedInstantly();
        this._updatePagination();
    }

    _updatePagination() {
        const activeDot = this._pagination.querySelector(
            `.${this._options.classesActive.paginationDot}`,
        );
        if (activeDot) {
            activeDot.classList.remove(
                this._options.classesActive.paginationDot,
            );
            activeDot.removeAttribute("aria-current");
        }

        const currentIndex = this._normaliseIndex();
        this._paginationDots[currentIndex].classList.add(
            this._options.classesActive.paginationDot,
        );
        this._paginationDots[currentIndex].setAttribute("aria-current", "true");
    }

    _initButtons() {
        super._initButtons();
        this._buttonPagination = new Button(
            this._options.classes.paginationDot,
            this._buttonManager,
            this._buttonManager.manage,
        );
    }

    _clickGoto(button) {
        this.goto(this._paginationDots.indexOf(button));
    }
}
