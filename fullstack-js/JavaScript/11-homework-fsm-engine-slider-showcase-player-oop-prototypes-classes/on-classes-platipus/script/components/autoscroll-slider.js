"use strict";

import * as helper from "../utils/helpers.js";
import DraggableSlider from "./draggable-slider.js";
import Timer from "../services/timer.js";

const STATES_AUTOSCROLL = Object.freeze({
    ON: "ON",
    OFF: "OFF",
    LOCKED: "LOCKED",
});

const CONTEXTS = Object.freeze({
    HOVER: "hover",
    VISIBILITY: "visibility",
});

const AUTOSCROLL_DELAY = 5000;
const AUTOSCROLL_WAKE_UP_DELAY = 2000;

export default class AutoscrollSlider extends DraggableSlider {
    static get STATES_AUTOSCROLL() {
        return STATES_AUTOSCROLL;
    }

    static get AUTOSCROLL_DELAY() {
        return AUTOSCROLL_DELAY;
    }

    static get AUTOSCROLL_WAKE_UP_DELAY() {
        return AUTOSCROLL_WAKE_UP_DELAY;
    }

    constructor(options) {
        super(options);
        this._timer = new Timer(this, this._nextAuto);
    }

    get stateAutoscroll() {
        return this.__stateAutoscroll;
    }

    set _stateAutoscroll(stateKey) {
        const state = this.constructor.STATES_AUTOSCROLL[stateKey];

        if (!state) {
            throw new TypeError(
                `[FSM Autoscroll]: Invalid state transition token "${stateKey}"`,
            );
        }

        this.__stateAutoscroll = state;
    }

    init() {
        super.init();
        this._initAutoscroll();
    }

    _initAutoscroll() {
        if (this._options.autoplay === true) {
            this._toggleAutoscrollMode();
        }
    }

    handleClick(e) {
        const result = super.handleClick(e);

        if (result === true) {
            this._lastClickTimestamp = Date.now();
        }

        return result;
    }

    handleAuxClick(e) {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
            this._toggleAutoscrollMode();
        }
        return e;
    }

    enableAutoscroll() {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) return;
        this._toggleAutoscrollMode();
    }

    disableAutoscroll() {
        if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;
        this._toggleAutoscrollMode();
    }

    lockAutoscroll() {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.ON) return;
        this._stateAutoscroll = STATES_AUTOSCROLL.LOCKED;
        this._tryPauseAutoscroll();
    }

    unlockAutoscroll() {
        if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;
        this._stateAutoscroll = STATES_AUTOSCROLL.ON;
        this._tryResumeAutoscroll();
    }

    _initDOMElements(childElements) {
        const btnAutoscrollOn = document.querySelector(
            this._options.singleSelectors.btnAutoscrollOn,
        );
        const btnAutoscrollOff = document.querySelector(
            this._options.singleSelectors.btnAutoscrollOff,
        );

        super._initDOMElements({
            btnAutoscrollOn,
            btnAutoscrollOff,
            ...childElements,
        });

        this._btnAutoscrollOn = btnAutoscrollOn;
        this._btnAutoscrollOff = btnAutoscrollOff;
    }

    _initProps() {
        super._initProps();

        const autoscrollDelay = Number(this._options.autoscrollDelay);
        const autoscrollWakeUpDelay = Number(
            this._options.autoscrollWakeUpDelay,
        );

        this._autoscrollDelay =
            autoscrollDelay > 0
                ? autoscrollDelay
                : this.constructor.AUTOSCROLL_DELAY;
        this._autoscrollWakeUpDelay =
            autoscrollWakeUpDelay > 0
                ? autoscrollWakeUpDelay
                : this.constructor.AUTOSCROLL_WAKE_UP_DELAY;

        this._timer.initBootstrap(
            this._timer,
            this._timer.start,
            this._autoscrollDelay,
        );

        this._autoscrollManualStartTimestamp = 0;
        this._indexChangeTimestamp = 0;
        this._lastClickTimestamp = 0;

        this._isTabActive = true;
        this._isMouseOver = false;
        this._isKeyboardFocused = false;
        this._isAutoscrollAction = false;
        this._stateAutoscroll = STATES_AUTOSCROLL.OFF;
    }

    _initPagination() {
        super._initPagination();
        for (let i = 0; i < this._slidesCount; i++) {
            this._paginationDots[i].classList.add(
                this._options.jsClasses.autoscrollPause,
            );
            this._paginationDots[i].classList.add(
                this._options.jsClasses.dynamicFocus,
            );
        }
    }

    _hardReset() {
        super._hardReset();
        this._autoscrollManualStartTimestamp = 0;
        this._indexChangeTimestamp = 0;
        this._lastClickTimestamp = 0;
        this._isMouseOver = false;
        this._isKeyboardFocused = false;
        this._isAutoscrollAction = false;
    }

    _onIndexChanged() {
        super._onIndexChanged();
        this._onAutoscrollIndexChanged();
    }

    _onIndexChangedInstantly() {
        super._onIndexChangedInstantly();
        this._onAutoscrollIndexChanged();
    }

    _onAutoscrollIndexChanged() {
        this._indexChangeTimestamp = Date.now();
        if (!this._isAutoscrollAction) {
            this._tryPauseAutoscroll();
            this._tryResumeAutoscroll();
        }
    }

    _onDragStarted() {
        this._tryPauseAutoscroll();
        super._onDragStarted();
    }

    _onDragEnded() {
        super._onDragEnded();
        this._tryResumeAutoscroll();
    }

    _onViewportClicked(e) {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
            if (e && helper.isPassthroughKey(e)) {
                this._toggleAutoscrollMode();
            }
        }
        super._onViewportClicked(e);
    }

    _nextAuto() {
        if (
            this._isInputBlocked() ||
            this.stateAutoscroll !== STATES_AUTOSCROLL.ON
        )
            return;

        this._isAutoscrollAction = true;

        if (this._currentIndex === this._slidesCount) {
            this._nextAutoLazy();
        } else {
            this.next();
        }

        this._isAutoscrollAction = false;

        this._isMouseOver = this._isMouseStillOver();
        if (this._isMouseOver) {
            this._tryPauseAutoscroll(CONTEXTS.HOVER);
        }
    }

    _nextAutoLazy() {
        this._currentIndex = this._startIndex - 1;
        this._updateTrackInstantly();
        this.goto(this._currentIndex);
    }

    _isMouseStillOver() {
        return (
            helper.hasFinePointer() &&
            Boolean(
                document.querySelector(
                    `.${this._options.jsClasses.autoscrollPause}:not(.${this._options.classes.btnAutoscrollOff}):hover`,
                ),
            )
        );
    }

    _tryResumeAutoscroll(context = null) {
        const isDriftingAfterClick = this._isPostClickDriftActive();
        if (
            this.stateAutoscroll !== STATES_AUTOSCROLL.ON ||
            !this._isTabActive ||
            this._isKeyboardFocused ||
            (this._isMouseOver && !isDriftingAfterClick) ||
            (this._isDragging && context !== CONTEXTS.VISIBILITY)
        )
            return;

        if (
            context === CONTEXTS.HOVER &&
            this._isAutoscrollFirstCycle() &&
            !isDriftingAfterClick
        )
            return;

        if (context === CONTEXTS.HOVER && helper.hasFinePointer()) {
            if (isDriftingAfterClick) {
                context = null;
            }
        } else if (context !== CONTEXTS.VISIBILITY) {
            context = null;
        }

        if (context === CONTEXTS.HOVER) {
            this._startAutoscroll(this._getAdaptiveWakeUpDelay());
        } else {
            this._startAutoscroll(null, context);
        }
    }

    _isPostClickDriftActive() {
        const msSinceLastClick = Date.now() - this._lastClickTimestamp;
        return msSinceLastClick < this._autoscrollWakeUpDelay;
    }

    _getAdaptiveWakeUpDelay() {
        const msSlideStand = Date.now() - this._indexChangeTimestamp;
        if (
            msSlideStand <
            this._autoscrollDelay - this._autoscrollWakeUpDelay
        ) {
            return this._autoscrollDelay - msSlideStand;
        }
        return this._autoscrollWakeUpDelay;
    }

    _tryPauseAutoscroll(context = null) {
        if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;

        if (this._isTabActive && !this._isKeyboardFocused) {
            if (context === CONTEXTS.HOVER && this._isAutoscrollFirstCycle())
                return;
        }

        this._timer.stop();
    }

    _startAutoscroll(delay = null, context = null) {
        if (context === CONTEXTS.VISIBILITY) {
            this._state = this.constructor.IDLE;
            this._isDragging = false;
        }

        this._timer.start(delay || this._autoscrollDelay);
    }

    _stopAutoscroll() {
        this._timer.stop();
    }

    _onAutoscrollStateChanged(isActive) {
        this._stateAutoscroll = isActive
            ? STATES_AUTOSCROLL.ON
            : STATES_AUTOSCROLL.OFF;
        const e = new CustomEvent("autoscrollchange", {
            detail: { isActive },
            bubbles: true,
        });
        this._slider.dispatchEvent(e);
    }

    _toggleAutoscrollMode() {
        if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) {
            this.next();
            this._onAutoscrollStateChanged(true);
            this._startAutoscroll();
            this._autoscrollManualStartTimestamp = Date.now();
        } else {
            this._onAutoscrollStateChanged(false);
            this._stopAutoscroll();
        }
    }

    _isAutoscrollFirstCycle() {
        const msSinceStart = Date.now() - this._autoscrollManualStartTimestamp;
        return msSinceStart < this._autoscrollDelay;
    }

    _clickAutoscrollon() {
        this._toggleAutoscrollMode();
    }

    _clickAutoscrolloff() {
        this._toggleAutoscrollMode();
    }

    _pressReset(e) {
        const result = super._pressReset(e);

        if (result) {
            if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
                this._toggleAutoscrollMode();
            }
        }

        return result;
    }

    _pressAutoscrolloff(e) {
        if (this._isInputBlocked()) return false;
        if (helper.isPassthroughKey(e)) {
            if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
                this._toggleAutoscrollMode();
            }
            return e;
        }
        if (this.stateAutoscroll === STATES_AUTOSCROLL.ON) {
            return false;
        }
        return e;
    }

    _pressToggleautoscroll(e) {
        if (this._isInputBlocked()) return false;
        if (helper.isPassthroughKey(e)) {
            if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
                this._toggleAutoscrollMode();
            }
            return e;
        }
        this._toggleAutoscrollMode();
        if (this.stateAutoscroll === STATES_AUTOSCROLL.ON) {
            return true;
        }
        return e;
    }

    _pressIgnore(e) {
        if (this._isInputBlocked()) return false;
        if (this.stateAutoscroll === STATES_AUTOSCROLL.ON) {
            return false;
        }
        return e;
    }

    _beforeResize() {
        super._beforeResize();
        this._tryPauseAutoscroll();
    }

    _afterResize() {
        super._afterResize();
        this._tryResumeAutoscroll();
    }

    _handleMouseOver(e) {
        if (!helper.hasFinePointer()) return;

        const isPauseTarget = e.target.closest(
            `.${this._options.jsClasses.autoscrollPause}`,
        );

        if (isPauseTarget) {
            const msSinceStart =
                Date.now() - this._autoscrollManualStartTimestamp;
            if (msSinceStart < 100) {
                this._isMouseOver = true;
                return;
            }
            if (this._isMouseOver) return;
            this._isMouseOver = true;
            this._tryPauseAutoscroll(CONTEXTS.HOVER);
        } else {
            if (!this._isMouseOver) return;
            this._isMouseOver = false;
            this._tryResumeAutoscroll(CONTEXTS.HOVER);
        }
    }

    _handleMouseOut(e) {
        if (!helper.hasFinePointer()) return;

        if (
            e.relatedTarget &&
            e.relatedTarget.closest(
                `.${this._options.jsClasses.autoscrollPause}`,
            )
        ) {
            return;
        }

        if (!this._slider.contains(e.relatedTarget)) {
            this._isMouseOver = false;
            this._tryResumeAutoscroll(CONTEXTS.HOVER);
        }
    }

    _handleFocus(e) {
        if (
            e.target.closest(`.${this._options.jsClasses.autoscrollPause}`) &&
            !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
        ) {
            this._isKeyboardFocused = true;
            this._tryPauseAutoscroll();
        }
    }

    _handleBlur(e) {
        if (
            e.target.closest(`.${this._options.jsClasses.autoscrollPause}`) &&
            !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
        ) {
            this._isKeyboardFocused = false;
            this._tryResumeAutoscroll();
        }
    }

    _handleVisibilityChange(e) {
        if (helper.isTabActive()) {
            this._isTabActive = true;
            this._tryResumeAutoscroll(CONTEXTS.VISIBILITY);
        } else {
            this._isTabActive = false;
            this._tryPauseAutoscroll();
        }
    }

    static {
        AutoscrollSlider[AutoscrollSlider.EVENT_MAP_KEY] = {
            mouseover: {
                target: (instance) => instance._slider,
                handler: AutoscrollSlider.prototype._handleMouseOver,
            },
            mouseout: {
                target: (instance) => instance._slider,
                handler: AutoscrollSlider.prototype._handleMouseOut,
            },
            focus: {
                target: (instance) => instance._slider,
                handler: AutoscrollSlider.prototype._handleFocus,
                options: { capture: true },
            },
            blur: {
                target: (instance) => instance._slider,
                handler: AutoscrollSlider.prototype._handleBlur,
                options: { capture: true },
            },
            visibilitychange: {
                target: () => document,
                handler: AutoscrollSlider.prototype._handleVisibilityChange,
            },
        };
    }
}
