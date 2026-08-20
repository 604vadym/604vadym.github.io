"use strict";

import * as helper from "../utils/helpers.js";
import DOMValidator from "../services/dom-validator.js";
import ButtonManager from "../services/button-manager.js";
import EventManager from "../services/event-manager.js";

BaseSlider.EVENT_MAP_KEY = "EVENT_MAP";

BaseSlider.STATES = {
    IDLE: "IDLE",
    MOVING: "MOVING",
};

export default function BaseSlider(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(BaseSlider),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_buttonManager", {
        value: new ButtonManager(this),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(BaseSlider.EVENT_MAP_KEY),
        writable: false,
        configurable: false,
    });
}

BaseSlider.prototype = {
    constructor: BaseSlider,

    get state() {
        return this._state;
    },

    init() {
        this._initDOMElements();
        this._initProps();
        this._updateSlideWidth();
        this._initActionTables();
        this._buttonManager.init(this);
        this._eventManager.init(this);
    },

    _initDOMElements(childElements) {
        const slider = document.querySelector(
            this._options.singleSelectors.slider,
        );
        const track = slider?.querySelector(
            this._options.singleSelectors.track,
        );
        const viewport = slider?.querySelector(
            this._options.singleSelectors.viewport,
        );
        const btnNext = slider?.querySelector(
            this._options.singleSelectors.btnNext,
        );
        const btnPrev = slider?.querySelector(
            this._options.singleSelectors.btnPrev,
        );
        const slides = slider?.querySelectorAll(
            this._options.groupSelectors.slides,
        );
        const images = slider?.querySelectorAll(
            this._options.groupSelectors.images,
        );

        this._domValidator.validate(this, childElements, {
            slider,
            track,
            viewport,
            btnNext,
            btnPrev,
            slides,
            images,
        });

        this._slider = slider;
        this._track = track;
        this._slides = slides;
    },

    _initProps() {
        this._state = BaseSlider.STATES.IDLE;
        this._slidesCount = this._slides.length;
        this._trackTransition = this._track.style.transition;
        this._currentIndex = 0;
        this._slideWidth = 0;
    },

    _initActionTables() {},

    _updateSlider() {
        this._state = BaseSlider.STATES.MOVING;

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

    _nextSlide() {
        this._goToSlide(this._normaliseIndex() + 1);
    },

    _prevSlide() {
        this._goToSlide(this._normaliseIndex() - 1);
    },

    _goToSlide(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = this._normaliseIndex(index);
        if (this._currentIndex !== oldIndex) {
            this._updateSlider();
        }
    },

    _clickNext() {
        this._nextSlide();
    },

    _clickPrev() {
        this._prevSlide();
    },

    _handleClick(e) {
        const button = e.target.closest(`.${this._options.classes.button}`);
        if (!button || this._state === BaseSlider.STATES.MOVING) return;

        const clickAction = this._buttonManager.getClickAction(button);

        clickAction?.action(button);
    },

    _handleTransitionEnd() {
        this._state = BaseSlider.STATES.IDLE;
    },
};

BaseSlider[BaseSlider.EVENT_MAP_KEY] = {
    click: {
        target: (instance) => instance._slider,
        handler: BaseSlider.prototype._handleClick,
    },
    transitionend: {
        target: (instance) => instance._track,
        handler: BaseSlider.prototype._handleTransitionEnd,
    },
};
