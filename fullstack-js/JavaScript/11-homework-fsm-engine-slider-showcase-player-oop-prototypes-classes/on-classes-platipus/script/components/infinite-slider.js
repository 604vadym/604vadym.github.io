"use strict";

import KeyboardSlider from "./keyboard-slider.js";

export default class InfiniteSlider extends KeyboardSlider {
    init() {
        super.init();
        this._initInfiniteLoop();
        this._teleportSlides();
    }

    _initInfiniteLoop() {
        const cloneOfFirst = this._slides[0].cloneNode(true);
        const cloneOfLast = this._slides[this._slidesCount - 1].cloneNode(true);
        this._track.append(cloneOfFirst);
        this._track.prepend(cloneOfLast);
        this._slides = this._slider.querySelectorAll(
            this._options.groupSelectors.slides,
        );
    }

    _initProps() {
        super._initProps();
        this._startIndex = 1;
        this._currentIndex = this._startIndex;
        this._activeIndex = this._currentIndex;
        this._teleportMap = {
            [this._startIndex - 1]: this._slidesCount,
            [this._slidesCount + 1]: this._startIndex,
        };
    }

    _hardReset() {
        super._hardReset();
        this._currentIndex = this._startIndex;
    }

    _normaliseIndex(index = null) {
        return index !== null
            ? index + 1
            : (this._currentIndex - 1 + this._slidesCount) % this._slidesCount;
    }

    _onIndexChangedInstantly() {
        this._resetLoop();
        super._onIndexChangedInstantly();
    }

    _teleportSlides() {
        this._disableAnimation();
        this._updateTrack();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this._enableAnimation();
                this._onSlideChanged();
            });
        });
    }

    _resetLoop() {
        if (this._currentIndex in this._teleportMap) {
            this._currentIndex = this._teleportMap[this._currentIndex];
            return true;
        }
        return false;
    }

    _handleTransitionEnd(e) {
        if (this._resetLoop()) {
            this._teleportSlides();
        } else {
            super._handleTransitionEnd(e);
        }
    }

    static {
        InfiniteSlider[InfiniteSlider.EVENT_MAP_KEY] = {
            transitionend: {
                target: (instance) => instance._track,
                handler: InfiniteSlider.prototype._handleTransitionEnd,
            },
        };
    }
}
