"use strict";

import KeyboardSlider from "./keyboard-slider.js";

InfiniteSlider.EVENTS = {
    TRANSITIONEND: "transitionend",
};

InfiniteSlider.STATES = KeyboardSlider.STATES;

export default function InfiniteSlider(options) {
    KeyboardSlider.call(this, options);
}

InfiniteSlider.prototype = Object.create(KeyboardSlider.prototype);
InfiniteSlider.prototype.constructor = InfiniteSlider;

InfiniteSlider.prototype.init = function () {
    KeyboardSlider.prototype.init.call(this);
    this._initInfiniteLoop();
    this._teleportSlides();
};

InfiniteSlider.prototype._initProps = function () {
    KeyboardSlider.prototype._initProps.call(this);
    this._currentIndex = 1;
    this._teleportMap = { 0: this._slidesCount, [this._slidesCount + 1]: 1 };
};

InfiniteSlider.prototype._normaliseIndex = function (index = null) {
    const sourceIndex =
        index !== null
            ? index + 1
            : (this._currentIndex - 1 + this._slidesCount) % this._slidesCount;

    return sourceIndex;
};

InfiniteSlider.prototype._nextSlide = function () {
    ++this._currentIndex;
    this._updateSlider();
};

InfiniteSlider.prototype._prevSlide = function () {
    --this._currentIndex;
    this._updateSlider();
};

InfiniteSlider.prototype._initInfiniteLoop = function () {
    const cloneOfFirst = this._slides[0].cloneNode(true);
    const cloneOfLast = this._slides[this._slidesCount - 1].cloneNode(true);
    this._track.append(cloneOfFirst);
    this._track.prepend(cloneOfLast);
    this._slides = this._slider.querySelectorAll(
        this._options.groupSelectors.slides,
    );
};

InfiniteSlider.prototype._teleportSlides = function () {
    this._track.style.transition = "none";
    this._updateSlider();
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            this._track.style.transition = this._trackTransition;
            this._state = InfiniteSlider.STATES.IDLE;
        });
    });
};

InfiniteSlider.prototype._resetLoop = function () {
    if (this._currentIndex in this._teleportMap) {
        this._currentIndex = this._teleportMap[this._currentIndex];
        return true;
    }
    return false;
};

InfiniteSlider.prototype._handleTransitionEnd = function () {
    if (this._resetLoop()) {
        this._teleportSlides();
    } else {
        this._state = InfiniteSlider.STATES.IDLE;
    }
};

InfiniteSlider.EVENT_MAP = {
    [InfiniteSlider.EVENTS.TRANSITIONEND]: {
        target: (instance) => instance._track,
        handler: InfiniteSlider.prototype._handleTransitionEnd,
    },
};
