"use strict";

import * as helper from "../utils/helpers.js";
import DOMValidator from "../services/dom-validator.js";
import EventManager from "../services/event-manager.js";

BaseSlider.STATES = {
    IDLE: "IDLE",
    MOVING: "MOVING",
};

BaseSlider.EVENTS = {
    CLICK: "click",
    TRANSITIONEND: "transitionend",
};

export default function BaseSlider(options) {
    this._options = options;

    Object.defineProperty(this, "_DOMValidator", {
        value: new DOMValidator(BaseSlider),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_EventManager", {
        value: new EventManager(),
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
        this._initClickActionTable();
        this._initEventListeners();
        this._initEventHandlersTable();
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

        this._DOMValidator.validate(this, childElements, {
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
        this._startIndex = 0;
        this._currentIndex = this._startIndex;
        this._slideWidth = 0;
    },

    _initEventListeners() {
        this._slider.addEventListener(BaseSlider.EVENTS.CLICK, this);
        this._track.addEventListener(BaseSlider.EVENTS.TRANSITIONEND, this);
    },

    _initEventHandlersTable() {
        this._eventTable = this._EventManager.createEventTable(this);
    },

    handleEvent(e) {
        const handle = this._eventTable[e.type];
        if (handle) handle(e);
    },

    _handleClick(e) {
        const button = e.target.closest(`.${this._options.classes.button}`);
        if (!button || this._state === BaseSlider.STATES.MOVING) return;

        const clickAction = this._getClickAction(button);

        clickAction?.action(button);
    },

    _handleTransitionEnd() {
        this._state = BaseSlider.STATES.IDLE;
    },

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

    _getClickAction(button) {
        const classList = button.classList;

        const actionIndex = this._clickActionTable.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1 ? this._clickActionTable[actionIndex] : null;
    },

    _nextSlide() {
        this._goToSlide(this._currentIndex + 1);
    },

    _prevSlide() {
        this._goToSlide(this._currentIndex - 1);
    },

    _goToSlide(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = this._normaliseIndex(index);
        if (this._currentIndex !== oldIndex) {
            this._updateSlider();
        }
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

BaseSlider.EVENT_MAP = {
    [BaseSlider.EVENTS.CLICK]: BaseSlider.prototype._handleClick,
    [BaseSlider.EVENTS.TRANSITIONEND]:
        BaseSlider.prototype._handleTransitionEnd,
};
