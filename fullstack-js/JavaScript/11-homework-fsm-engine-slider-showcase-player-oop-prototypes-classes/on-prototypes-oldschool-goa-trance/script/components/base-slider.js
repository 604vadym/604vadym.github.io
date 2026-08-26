"use strict";

import * as helper from "../utils/helpers.js";
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

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

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

    init() {
        this._initDOMElements();
        this._initProps();
        this._updateSlideWidth();
        this._buttonManager.init(this, "click");
        this._eventManager.init(this, BaseSlider.EVENT_MAP_KEY);
    },

    next() {
        this._nextIndex();
    },

    prev() {
        this._prevIndex();
    },

    goto(index) {
        this._goToIndex(index);
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

    _nextIndex() {
        this._goToIndex(this._normaliseIndex() + 1);
    },

    _prevIndex() {
        this._goToIndex(this._normaliseIndex() - 1);
    },

    _goToIndex(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = this._normaliseIndex(index);
        if (this._currentIndex !== oldIndex) {
            this._onIndexChanged();
        }
    },

    _onIndexChanged() {
        this._updateSlider();
    },

    _updateSlider() {
        if (this._track.style.transition !== "none") {
            this._state = STATES.MOVING;
        }

        if (helper.hasFinePointer() || this._isResizing) {
            this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
        } else {
            const offset = this._currentIndex * this._slideWidth;
            this._track.style.transform = `translateX(-${offset}px)`;
        }
    },

    _updateSliderInstantly() {
        this._disableAnimation();
        this._updateSlider();
        this._track.offsetHeight;
        this._enableAnimation();
        this._state = STATES.IDLE;
    },

    _updateSlideWidth() {
        this._slideWidth = this._slides[0].getBoundingClientRect().width;
    },

    _normaliseIndex(index = null) {
        const sourceIndex = index !== null ? index : this._currentIndex;

        return (sourceIndex + this._slidesCount) % this._slidesCount;
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

    _tryResetBtnNoActive() {
        if (this._btnNoActive) {
            this._btnNoActive.classList.remove(
                this._options.jsClasses.btnNoActive,
            );
            this._eventManager.unsubscribe(this, BaseSlider.DYNAMIC_EVENT_MAP);
            delete this._btnNoActive;
        }
    },

    _clickNext() {
        this._nextIndex();
    },

    _clickPrev() {
        this._prevIndex();
    },

    _handleClick(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            helper.prevent(e);
            return false;
        }

        const button = e.target.closest(`.${this._options.classes.button}`);
        if (!button || this._isInputBlocked()) return false;

        if (e.pointerType === "mouse" || e.pointerType === "touch") {
            button.blur();
        }

        this._buttonManager.manage(button);

        return true;
    },

    _handleMouseDown(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            const button = e.target.closest(`.${this._options.classes.button}`);
            if (button && !this._btnNoActive) {
                button.classList.add(this._options.jsClasses.btnNoActive);
                this._btnNoActive = button;
                this._eventManager.subscribe(
                    this,
                    BaseSlider.DYNAMIC_EVENT_MAP,
                );
            }
        } else if (
            e.button === MOUSE_BUTTON_LEFT ||
            e.button === MOUSE_BUTTON_MIDDLE
        ) {
            this._tryResetBtnNoActive();
        }
    },

    _handleDragStart(e) {
        helper.prevent(e);
    },

    _handleTransitionEnd(e) {
        this._state = STATES.IDLE;
        this._onSlideChanged(this._normaliseIndex());
    },

    _onSlideChanged(index) {},

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
        this._updateSliderInstantly();
    },

    _afterResize() {
        this._isResizing = false;
        this._slider.classList.remove(this._options.states.resizing);
        this._updateSlideWidth();
        this._updateSliderInstantly();
    },

    _handleMouseLeave(e) {
        this._tryResetBtnNoActive();
    },
};

BaseSlider[BaseSlider.EVENT_MAP_KEY] = {
    click: {
        target: (instance) => instance._slider,
        handler: BaseSlider.prototype._handleClick,
    },
    auxclick: {
        target: (instance) => instance._slider,
        handler: BaseSlider.prototype._handleClick,
    },
    mousedown: {
        target: (instance) => instance._slider,
        handler: BaseSlider.prototype._handleMouseDown,
    },
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

BaseSlider.DYNAMIC_EVENT_MAP = {
    mouseleave: {
        target: (instance) => instance._btnNoActive,
        handler: BaseSlider.prototype._handleMouseLeave,
    },
};
