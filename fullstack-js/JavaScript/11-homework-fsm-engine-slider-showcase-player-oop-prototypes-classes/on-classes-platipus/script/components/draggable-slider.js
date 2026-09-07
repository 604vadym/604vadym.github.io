"use strict";

import * as helper from "../utils/helpers.js";
import InfiniteSlider from "./infinite-slider.js";

const TRIGGER_THRESHOLD_COEF = 0.2;

const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

export default class DraggableSlider extends InfiniteSlider {
    static get TRIGGER_THRESHOLD_COEF() {
        return TRIGGER_THRESHOLD_COEF;
    }

    constructor(options) {
        super(options);
    }

    init() {
        super.init();
    }

    _initProps() {
        super._initProps();

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
    }

    _hardReset() {
        super._hardReset();
        this._pointerStartX = 0;
        this._isDragging = false;
    }

    _isInputBlocked() {
        return super._isInputBlocked() || this._isDragging;
    }

    _startDragging(e) {
        this._onDragStarted();
        this._pointerStartX = this._getClientX(e);
        this._updateSlideWidth();
    }

    _moveConveyor(pointerCurrentX) {
        const pointerOffset = pointerCurrentX - this._pointerStartX;
        const trackOffset =
            this._currentIndex * this._slideWidth - pointerOffset;
        if (Math.abs(pointerOffset) < this._slideWidth) {
            this._track.style.transform = `translateX(-${trackOffset}px)`;
        } else {
            this._stopDragging(pointerOffset);
        }
    }

    _stopDragging(pointerOffset = null, e = null) {
        let isClick = pointerOffset
            ? false
            : pointerOffset === null
              ? false
              : true;
        if (!helper.hasFinePointer() && Math.abs(pointerOffset) < 6) {
            pointerOffset = 0;
            isClick = true;
        }

        this._onDragEnded();
        if (pointerOffset) {
            const triggerThreshold =
                this._slideWidth * this._triggerThresholdCoef;
            if (Math.abs(pointerOffset) > triggerThreshold) {
                if (pointerOffset < 0) {
                    this.next();
                } else {
                    this.prev();
                }
            } else {
                this._moveTrack();
            }
        } else {
            if (isClick) {
                this._onViewportClicked(e);
            }
            this._updateTrack();
        }
    }

    _onDragStarted() {
        this._isDragging = true;
        this._disableAnimation();
        this._eventManager.subscribe(this, this.constructor.DYNAMIC_EVENT_MAP);
    }

    _onDragEnded() {
        this._isDragging = false;
        this._enableAnimation();
        this._eventManager.unsubscribe(
            this,
            this.constructor.DYNAMIC_EVENT_MAP,
        );
    }

    _onViewportClicked(e) {
        const event = new Event("viewportclick", { bubbles: true });
        this._slider.dispatchEvent(event);
    }

    _getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    _handleMouseDownTouchStart(e) {
        if (super._isInputBlocked()) return;
        if (e.type === "mousedown" && !helper.hasFinePointer()) {
            return;
        }

        if (
            e.button === MOUSE_BUTTON_MIDDLE ||
            e.button === MOUSE_BUTTON_RIGHT
        ) {
            return;
        }

        if (e.target.closest(`.${this._options.classes.track}`)) {
            if (helper.isMultiTouch(e)) {
                this._stopDragging();
                return;
            }

            this._startDragging(e);
        }
    }

    _handleMouseMoveTouchMove(e) {
        if (!this._isDragging) return;

        if (helper.isMultiTouch(e)) {
            this._stopDragging();
            return;
        }

        this._moveConveyor(this._getClientX(e));
    }

    _handleMouseUpTouchEnd(e) {
        if (!this._isDragging) return;

        const pointerOffset = this._getClientX(e) - this._pointerStartX;
        this._stopDragging(pointerOffset, e);
    }

    _handleTouchCancel(e) {
        this._stopDragging();
    }

    static {
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
    }

    static {
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
    }
}
