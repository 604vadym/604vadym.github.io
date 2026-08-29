"use strict";

import * as helper from "../utils/helpers.js";
import Button from "../core/button.js";
import DOMValidator from "../services/dom-validator.js";
import ButtonManager from "../services/button-manager.js";
import EventManager from "../services/event-manager.js";

export default function BaseSlider(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(BaseSlider),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_buttonManager", {
        value: new ButtonManager(),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

BaseSlider.EVENT_MAP_KEY = "EVENT_MAP";

BaseSlider.STATES = Object.freeze({
    IDLE: "IDLE",
    MOVING: "MOVING",
});

const STATES = BaseSlider.STATES;

BaseSlider.prototype = {
    constructor: BaseSlider,

    get state() {
        return this.__state;
    },

    set _state(stateKey) {
        const state = this.constructor.STATES[stateKey];

        if (!state) {
            throw new TypeError(
                `[FSM]: Invalid state transition token "${stateKey}"`,
            );
        }

        this.__state = state;
    },

    get element() {
        return this._slider;
    },

    init() {
        this._initDOMElements();
        this._initProps();
        this._updateSlideWidth();
        this._buttonManager.init(this, "click");
        this._initButtons();
        this._eventManager.init(this, BaseSlider.EVENT_MAP_KEY);
    },

    next() {
        this.goto(this._normaliseIndex() + 1);
    },

    prev() {
        this.goto(this._normaliseIndex() - 1);
    },

    goto(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = this._normaliseIndex(index);
        if (this._currentIndex !== oldIndex) {
            this._onIndexChanged();
            return true;
        }
        return false;
    },

    handleClick(e) {
        if (this._isInputBlocked()) return false;
        return this._button.execute(e);
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
        this._trackTransition = this._track.style.transition;
        this._slidesCount = this._slides.length;
        this._state = STATES.IDLE;
        this._startIndex = 0;
        this._currentIndex = this._startIndex;
        this._slideWidth = 0;
        this._isResizing = false;
        this._resizeTimeoutId = null;
    },

    _initButtons() {
        this._button = new Button(
            this._options.classes.sliderBtn,
            this._buttonManager,
            this._buttonManager.manage,
        );
    },

    _updateTrack() {
        if (helper.hasFinePointer() || this._isResizing) {
            this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
        } else {
            const offset = this._currentIndex * this._slideWidth;
            this._track.style.transform = `translateX(-${offset}px)`;
        }
    },

    _updateTrackInstantly() {
        this._disableAnimation();
        this._updateTrack();
        this._track.offsetHeight;
        this._enableAnimation();
    },

    _updateSlideWidth() {
        this._slideWidth = this._slides[0].getBoundingClientRect().width;
    },

    _normaliseIndex(index = null) {
        const sourceIndex = index !== null ? index : this._currentIndex;

        return (sourceIndex + this._slidesCount) % this._slidesCount;
    },

    _onIndexChanged() {
        this._state = STATES.MOVING;
        this._updateTrack();
    },

    _enableAnimation() {
        this._track.style.transition = this._trackTransition;
    },

    _disableAnimation() {
        this._track.style.transition = "none";
    },

    _isInputBlocked() {
        return this.state === STATES.MOVING;
    },

    _clickNext() {
        this.next();
    },

    _clickPrev() {
        this.prev();
    },

    _handleDragStart(e) {
        helper.prevent(e);
    },

    _handleTransitionEnd(e) {
        this._onSlideChanged();
    },

    _onSlideChanged() {
        this._state = STATES.IDLE;
        const e = new CustomEvent("slidechange", {
            detail: { index: this._normaliseIndex() },
            bubbles: true,
        });
        this._slider.dispatchEvent(e);
    },

    _handleResize(e) {
        this._beforeResize();
        this._resizeTimeoutId = setTimeout(() => {
            this._afterResize();
        }, 8);
    },

    _beforeResize() {
        this._isResizing = true;
        clearTimeout(this._resizeTimeoutId);
        this._slider.classList.add(this._options.states.resizing);
        this._updateTrackInstantly();
    },

    _afterResize() {
        this._isResizing = false;
        this._slider.classList.remove(this._options.states.resizing);
        this._updateSlideWidth();
        this._updateTrackInstantly();
        this._state = STATES.IDLE;
    },
};

BaseSlider[BaseSlider.EVENT_MAP_KEY] = {
    dragstart: {
        target: (instance) => instance._slider,
        handler: BaseSlider.prototype._handleDragStart,
    },
    transitionend: {
        target: (instance) => instance._track,
        handler: BaseSlider.prototype._handleTransitionEnd,
    },
    resize: {
        target: () => window,
        handler: BaseSlider.prototype._handleResize,
    },
};
