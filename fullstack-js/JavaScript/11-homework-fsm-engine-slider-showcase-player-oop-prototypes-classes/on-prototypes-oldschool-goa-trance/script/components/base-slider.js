"use strict";

import * as helper from "../utils/helpers.js";
import DOMValidator from "../services/dom-validator.js";

export default function BaseSlider(options) {
    this._options = options;

    Object.defineProperty(this, "_DOMValidator", {
        value: new DOMValidator(BaseSlider),
        writable: false,
        configurable: false,
    });
}

BaseSlider.prototype = {
    constructor: BaseSlider,

    init() {
        this._initDOMElements();
        this._initProps();
        this._updateSlideWidth();
        this._initClickActionTable();
        this._initEventListeners();
    },

    _initDOMElements(childConfig = null) {
        this._slider = document.querySelector(
            this._options.singleSelectors.slider,
        );
        this._track = this._slider.querySelector(
            this._options.singleSelectors.track,
        );
        this._slides = this._slider.querySelectorAll(
            this._options.groupSelectors.slides,
        );

        const config = {
            elements: {
                slider: this._slider,
                track: this._track,

                viewport: this._slider.querySelector(
                    this._options.singleSelectors.viewport,
                ),
                btnNext: this._slider.querySelector(
                    this._options.singleSelectors.btnNext,
                ),
                btnPrev: this._slider.querySelector(
                    this._options.singleSelectors.btnPrev,
                ),
            },
            collections: {
                slides: this._slides,

                images: this._slider.querySelectorAll(
                    this._options.groupSelectors.images,
                ),
            },
        };

        const mergedConfig = helper.mergeValidationConfigs(config, childConfig);

        this._DOMValidator.validate(mergedConfig, childConfig, this);
    },

    _initProps() {
        this._slidesCount = this._slides.length;
        this._trackTransition = this._track.style.transition;
        this._startIndex = 0;
        this._currentIndex = this._startIndex;
        this._slideWidth = 0;
        this._isMoving = false;
    },

    _initEventListeners() {
        this._slider.addEventListener("click", this);
        this._track.addEventListener("transitionend", this);
    },

    handleEvent(e) {
        switch (e.type) {
            case "click":
                this._handleClick(e);
                break;
            case "transitionend":
                this._handleTransitionEnd();
                break;
        }
    },

    _handleClick(e) {
        const button = e.target.closest(`.${this._options.classes.button}`);
        if (!button || this._isMoving) return;

        const clickAction = this._getClickAction(button);

        clickAction?.action(button) && this._updateSlider();
    },

    _handleTransitionEnd() {
        this._isMoving = false;
    },

    _updateSlider() {
        this._isMoving = true;

        if (helper.hasFinePointer()) {
            this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
        } else {
            const offset = this._currentIndex * this._slideWidth;
            this._track.style.transform = `translateX(-${offset}px)`;
        }
    },

    _updateSlideWidth() {
        this._slideWidth = this._slides[0].getBoundingClientRect().width;
    },

    _normaliseIndex(index = null) {
        const sourceIndex = index !== null ? index : this._currentIndex;

        return (sourceIndex + this._slidesCount) % this._slidesCount;
    },

    _getClickAction(button) {
        const classList = button.classList;

        const actionIndex = this._clickActionTable.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1 ? this._clickActionTable[actionIndex] : null;
    },

    _nextSlide() {
        this._currentIndex = (this._currentIndex + 1) % this._slidesCount;
        return true;
    },

    _prevSlide() {
        this._currentIndex =
            (this._currentIndex - 1 + this._slidesCount) % this._slidesCount;
        return true;
    },

    _goToSlide(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = this._normaliseIndex(index);
        return this._currentIndex !== oldIndex;
    },

    _initClickActionTable() {
        this._clickActionTable = [
            {
                className: this._options.singleSelectors.btnNext.replace(
                    /^\./,
                    "",
                ),
                action: () => this._nextSlide(),
            },
            {
                className: this._options.singleSelectors.btnPrev.replace(
                    /^\./,
                    "",
                ),
                action: () => this._prevSlide(),
            },
        ];
    },
};
