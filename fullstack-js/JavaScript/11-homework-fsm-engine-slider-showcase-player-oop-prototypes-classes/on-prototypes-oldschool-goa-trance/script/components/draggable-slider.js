"use strict";

import * as helper from "../utils/helpers.js";
import InfiniteSlider from "./infinite-slider.js";

export default function DraggableSlider(options) {
    InfiniteSlider.call(this, options);
}

DraggableSlider.prototype = Object.create(InfiniteSlider.prototype);
DraggableSlider.prototype.constructor = DraggableSlider;
Object.setPrototypeOf(DraggableSlider, InfiniteSlider);

const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

const STATES = DraggableSlider.STATES;

DraggableSlider.prototype.init = function () {
    InfiniteSlider.prototype.init.call(this);
};

DraggableSlider.prototype._initProps = function () {
    InfiniteSlider.prototype._initProps.call(this);
    this._pointerStartX = 0;
    this._isDragging = false;
    this._isDraggingInterrupted = false;
};

DraggableSlider.prototype._hardReset = function () {
    InfiniteSlider.prototype._hardReset.call(this);
    this._pointerStartX = 0;
    this._isDragging = false;
    this._isDraggingInterrupted = false;
};

DraggableSlider.prototype._isInputBlocked = function () {
    return (
        InfiniteSlider.prototype._isInputBlocked.call(this) || this._isDragging
    );
};

DraggableSlider.prototype._startDragging = function (e) {
    this._isDragging = true;
    this._pointerStartX = this._getClientX(e);
    this._updateSlideWidth();
    this._disableAnimation();
    this._eventManager.subscribe(this, this.constructor.DYNAMIC_EVENT_MAP);
};

DraggableSlider.prototype._moveConveyor = function (pointerCurrentX) {
    const pointerOffset = pointerCurrentX - this._pointerStartX;
    const trackOffset = this._currentIndex * this._slideWidth - pointerOffset;

    if (Math.abs(pointerOffset) < this._slideWidth) {
        this._track.style.transform = `translateX(-${trackOffset}px)`;
    } else {
        this._isDragging = false;
        this._isDraggingInterrupted = true;
        this._enableAnimation();

        if (pointerOffset < 0) {
            this._nextSlide();
        } else {
            this._prevSlide();
        }
    }
};

DraggableSlider.prototype._stopDragging = function (
    pointerOffset = null,
    e = null,
) {
    this._isDragging = false;
    this._enableAnimation();
    this._eventManager.unsubscribe(this, this.constructor.DYNAMIC_EVENT_MAP);

    if (pointerOffset === null) {
        this._updateSlider();
        return;
    }

    const triggerThreshold = this._slideWidth * 0.2;

    if (!helper.hasFinePointer() && Math.abs(pointerOffset) < 6) {
        pointerOffset = 0;
    }

    if (pointerOffset) {
        if (Math.abs(pointerOffset) > triggerThreshold) {
            if (pointerOffset < 0) {
                this._nextSlide();
            } else {
                this._prevSlide();
            }
        } else {
            this._updateSlider();
        }
    }
};

DraggableSlider.prototype._getClientX = function (e) {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
};

DraggableSlider.prototype._handleMouseDownTouchStart = function (e) {
    if (this.state === STATES.MOVING) return;

    if (e.type === "mousedown" && !helper.hasFinePointer()) {
        return;
    }

    if (e.button === MOUSE_BUTTON_MIDDLE || e.button === MOUSE_BUTTON_RIGHT) {
        helper.prevent(e);
        return;
    }

    if (e.target.closest(`.${this._options.classes.track}`)) {
        if (helper.isMultiTouch(e)) {
            this._stopDragging();
            return;
        }

        this._startDragging(e);
    }
};

DraggableSlider.prototype._handleMouseMoveTouchMove = function (e) {
    if (!this._isDragging) return;

    if (helper.isMultiTouch(e)) {
        this._stopDragging();
        return;
    }

    this._moveConveyor(this._getClientX(e));
};

DraggableSlider.prototype._handleMouseUpTouchEnd = function (e) {
    if (this._isDraggingInterrupted) {
        this._isDraggingInterrupted = false;
        return;
    }
    if (!this._isDragging) return;

    const pointerOffset = this._getClientX(e) - this._pointerStartX;
    this._stopDragging(pointerOffset, e);
};

DraggableSlider.DYNAMIC_EVENT_MAP = {
    mousemove: {
        target: () => document,
        handler: DraggableSlider.prototype._handleMouseMoveTouchMove,
    },
    touchmove: {
        target: () => document,
        handler: DraggableSlider.prototype._handleMouseMoveTouchMove,
    },
    mouseup: {
        target: () => document,
        handler: DraggableSlider.prototype._handleMouseUpTouchEnd,
    },
    touchend: {
        target: () => document,
        handler: DraggableSlider.prototype._handleMouseUpTouchEnd,
    },
    touchcancel: {
        target: (instance) => instance._slider,
        handler: DraggableSlider.prototype._stopDragging,
    },
};

DraggableSlider[DraggableSlider.EVENT_MAP_KEY] = {
    mousedown: {
        target: (instance) => instance._slider,
        handler: DraggableSlider.prototype._handleMouseDownTouchStart,
    },
    touchstart: {
        target: (instance) => instance._slider,
        handler: DraggableSlider.prototype._handleMouseDownTouchStart,
    },
};
