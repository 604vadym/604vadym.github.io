"use strict";

import * as helper from "../utils/helpers.js";
import InfiniteSlider from "./infinite-slider.js";

export default function DraggableSlider(options) {
    InfiniteSlider.call(this, options);
}

DraggableSlider.prototype = Object.create(InfiniteSlider.prototype);
DraggableSlider.prototype.constructor = DraggableSlider;
Object.setPrototypeOf(DraggableSlider, InfiniteSlider);

Object.defineProperty(DraggableSlider, "TRIGGER_THRESHOLD_COEF", {
    value: 0.2,
    writable: false,
    configurable: false,
});

const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

DraggableSlider.prototype.init = function () {
    InfiniteSlider.prototype.init.call(this);
};

DraggableSlider.prototype._initProps = function () {
    InfiniteSlider.prototype._initProps.call(this);

    const triggerThresholdCoef = Number(
        this._options.slideTriggerThresholdCoef,
    );
    this._triggerThresholdCoef =
        Number.isFinite(this._options.slideTriggerThresholdCoef) &&
        triggerThresholdCoef >= 0 &&
        triggerThresholdCoef <= 0.33
            ? triggerThresholdCoef
            : this.constructor.TRIGGER_THRESHOLD_COEF;

    this._pointerStartX = 0;
    this._isDragging = false;
};

DraggableSlider.prototype._hardReset = function () {
    InfiniteSlider.prototype._hardReset.call(this);
    this._pointerStartX = 0;
    this._isDragging = false;
};

DraggableSlider.prototype._isInputBlocked = function () {
    return (
        InfiniteSlider.prototype._isInputBlocked.call(this) || this._isDragging
    );
};

DraggableSlider.prototype._startDragging = function (e) {
    this._onDragStarted();
    this._pointerStartX = this._getClientX(e);
    this._updateSlideWidth();
};

DraggableSlider.prototype._moveConveyor = function (pointerCurrentX) {
    const pointerOffset = pointerCurrentX - this._pointerStartX;
    const trackOffset = this._currentIndex * this._slideWidth - pointerOffset;
    if (Math.abs(pointerOffset) < this._slideWidth) {
        this._track.style.transform = `translateX(-${trackOffset}px)`;
    } else {
        this._stopDragging(pointerOffset);
    }
};

DraggableSlider.prototype._stopDragging = function (pointerOffset = null) {
    if (
        pointerOffset === null ||
        (!helper.hasFinePointer() && Math.abs(pointerOffset) < 6)
    ) {
        pointerOffset = 0;
    }

    this._onDragEnded();
    if (pointerOffset) {
        const triggerThreshold = this._slideWidth * this._triggerThresholdCoef;
        if (Math.abs(pointerOffset) > triggerThreshold) {
            if (pointerOffset < 0) {
                this.next();
            } else {
                this.prev();
            }
        } else {
            this._updateTrack();
        }
    } else {
        this._updateTrack();
    }
};

DraggableSlider.prototype._onDragStarted = function () {
    this._isDragging = true;
    this._disableAnimation();
    this._eventManager.subscribe(this, this.constructor.DYNAMIC_EVENT_MAP);
};

DraggableSlider.prototype._onDragEnded = function () {
    this._isDragging = false;
    this._enableAnimation();
    this._eventManager.unsubscribe(this, this.constructor.DYNAMIC_EVENT_MAP);
};

DraggableSlider.prototype._getClientX = function (e) {
    return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
};

DraggableSlider.prototype._handleMouseDownTouchStart = function (e) {
    if (InfiniteSlider.prototype._isInputBlocked.call(this)) return;
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
    if (!this._isDragging) return;

    const pointerOffset = this._getClientX(e) - this._pointerStartX;
    this._stopDragging(pointerOffset);
};

DraggableSlider.prototype._handleTouchCancel = function (e) {
    this._stopDragging();
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
        handler: DraggableSlider.prototype._handleTouchCancel,
    },
};
