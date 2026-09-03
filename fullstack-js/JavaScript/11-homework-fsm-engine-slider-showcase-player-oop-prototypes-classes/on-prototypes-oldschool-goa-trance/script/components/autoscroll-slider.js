"use strict";

import * as helper from "../utils/helpers.js";
import DraggableSlider from "./draggable-slider.js";
import Timer from "../services/timer.js";

const CONTEXTS = Object.freeze({
    HOVER: "hover",
    VISIBILITY: "visibility",
});

export default function AutoscrollSlider(options) {
    DraggableSlider.call(this, options);

    Object.defineProperty(this, "_timer", {
        value: new Timer(this, this._nextAuto),
        writable: false,
        configurable: false,
    });
}

AutoscrollSlider.prototype = Object.create(DraggableSlider.prototype);
AutoscrollSlider.prototype.constructor = AutoscrollSlider;
Object.setPrototypeOf(AutoscrollSlider, DraggableSlider);

Object.defineProperty(AutoscrollSlider, "AUTOSCROLL_DELAY", {
    value: 5000,
    writable: false,
    configurable: false,
});

Object.defineProperty(AutoscrollSlider, "AUTOSCROLL_WAKE_UP_DELAY", {
    value: 2000,
    writable: false,
    configurable: false,
});

AutoscrollSlider.STATES_AUTOSCROLL = Object.freeze({
    ON: "ON",
    OFF: "OFF",
    LOCKED: "LOCKED",
});

const STATES = AutoscrollSlider.STATES;
const STATES_AUTOSCROLL = AutoscrollSlider.STATES_AUTOSCROLL;

Object.defineProperty(AutoscrollSlider.prototype, "stateAutoscroll", {
    get: function () {
        return this.__stateAutoscroll;
    },

    configurable: false,
    enumerable: true,
});

Object.defineProperty(AutoscrollSlider.prototype, "_stateAutoscroll", {
    set: function (stateKey) {
        const state = this.constructor.STATES_AUTOSCROLL[stateKey];

        if (!state) {
            throw new TypeError(
                `[FSM Autoscroll]: Invalid state transition token "${stateKey}"`,
            );
        }

        this.__stateAutoscroll = state;
    },

    configurable: false,
    enumerable: false,
});

AutoscrollSlider.prototype.init = function () {
    DraggableSlider.prototype.init.call(this);
    this._initAutoscroll();
};

AutoscrollSlider.prototype.handleClick = function (e) {
    const result = DraggableSlider.prototype.handleClick.call(this, e);

    if (result === true) {
        this._lastClickTimestamp = Date.now();
    }

    return result;
};

AutoscrollSlider.prototype.handleAuxClick = function (e) {
    if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
        this._toggleAutoscrollMode();
    }
    return e;
};

AutoscrollSlider.prototype._initAutoscroll = function () {
    if (this._options.autoplay === true) {
        this._toggleAutoscrollMode();
    }
};

AutoscrollSlider.prototype.enableAutoscroll = function () {
    if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) return;
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype.disableAutoscroll = function () {
    if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype.lockAutoscroll = function () {
    if (this.stateAutoscroll !== STATES_AUTOSCROLL.ON) return;
    this._stateAutoscroll = STATES_AUTOSCROLL.LOCKED;
    this._tryPauseAutoscroll();
};

AutoscrollSlider.prototype.unlockAutoscroll = function () {
    if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;
    this._stateAutoscroll = STATES_AUTOSCROLL.ON;
    this._tryResumeAutoscroll();
};

AutoscrollSlider.prototype._initDOMElements = function (childElements) {
    const btnAutoscrollOn = document.querySelector(
        this._options.singleSelectors.btnAutoscrollOn,
    );
    const btnAutoscrollOff = document.querySelector(
        this._options.singleSelectors.btnAutoscrollOff,
    );

    DraggableSlider.prototype._initDOMElements.call(this, {
        btnAutoscrollOn,
        btnAutoscrollOff,
        ...childElements,
    });

    this._btnAutoscrollOn = btnAutoscrollOn;
    this._btnAutoscrollOff = btnAutoscrollOff;
};

AutoscrollSlider.prototype._initProps = function () {
    DraggableSlider.prototype._initProps.call(this);

    const autoscrollDelay = Number(this._options.autoscrollDelay);
    const autoscrollWakeUpDelay = Number(this._options.autoscrollWakeUpDelay);

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
};

AutoscrollSlider.prototype._initPagination = function () {
    DraggableSlider.prototype._initPagination.call(this);
    for (let i = 0; i < this._slidesCount; i++) {
        this._paginationDots[i].classList.add(
            this._options.jsClasses.autoscrollPause,
        );
        this._paginationDots[i].classList.add(
            this._options.jsClasses.dynamicFocus,
        );
    }
};

AutoscrollSlider.prototype._hardReset = function () {
    DraggableSlider.prototype._hardReset.call(this);
    this._autoscrollManualStartTimestamp = 0;
    this._indexChangeTimestamp = 0;
    this._lastClickTimestamp = 0;
    this._isMouseOver = false;
    this._isKeyboardFocused = false;
    this._isAutoscrollAction = false;
};

AutoscrollSlider.prototype._onIndexChanged = function () {
    DraggableSlider.prototype._onIndexChanged.call(this);
    this._onAutoscrollIndexChanged();
};

AutoscrollSlider.prototype._onIndexChangedInstantly = function () {
    DraggableSlider.prototype._onIndexChangedInstantly.call(this);
    this._onAutoscrollIndexChanged();
};

AutoscrollSlider.prototype._onAutoscrollIndexChanged = function () {
    this._indexChangeTimestamp = Date.now();
    if (!this._isAutoscrollAction) {
        this._tryPauseAutoscroll();
        this._tryResumeAutoscroll();
    }
};

AutoscrollSlider.prototype._onDragStarted = function () {
    this._tryPauseAutoscroll();
    DraggableSlider.prototype._onDragStarted.call(this);
};

AutoscrollSlider.prototype._onDragEnded = function () {
    DraggableSlider.prototype._onDragEnded.call(this);
    this._tryResumeAutoscroll();
};

AutoscrollSlider.prototype._onViewportClicked = function (e) {
    if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
        if (e && helper.isPassthroughKey(e)) {
            this._toggleAutoscrollMode();
        }
    }
    DraggableSlider.prototype._onViewportClicked.call(this, e);
};

AutoscrollSlider.prototype._nextAuto = function () {
    if (this._isInputBlocked() || this.stateAutoscroll !== STATES_AUTOSCROLL.ON)
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
};

AutoscrollSlider.prototype._nextAutoLazy = function () {
    this._currentIndex = this._startIndex - 1;
    this._updateTrackInstantly();
    this.goto(this._currentIndex);
};

AutoscrollSlider.prototype._isMouseStillOver = function () {
    return (
        helper.hasFinePointer() &&
        Boolean(
            document.querySelector(
                `.${this._options.jsClasses.autoscrollPause}:not(.${this._options.classes.btnAutoscrollOff}):hover`,
            ),
        )
    );
};

AutoscrollSlider.prototype._tryResumeAutoscroll = function (context = null) {
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
};

AutoscrollSlider.prototype._isPostClickDriftActive = function () {
    const msSinceLastClick = Date.now() - this._lastClickTimestamp;
    return msSinceLastClick < this._autoscrollWakeUpDelay;
};

AutoscrollSlider.prototype._getAdaptiveWakeUpDelay = function () {
    const msSlideStand = Date.now() - this._indexChangeTimestamp;
    if (msSlideStand < this._autoscrollDelay - this._autoscrollWakeUpDelay) {
        return this._autoscrollDelay - msSlideStand;
    }
    return this._autoscrollWakeUpDelay;
};

AutoscrollSlider.prototype._tryPauseAutoscroll = function (context = null) {
    if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) return;

    if (this._isTabActive && !this._isKeyboardFocused) {
        if (context === CONTEXTS.HOVER && this._isAutoscrollFirstCycle())
            return;
    }

    this._timer.stop();
};

AutoscrollSlider.prototype._startAutoscroll = function (
    delay = null,
    context = null,
) {
    if (context === CONTEXTS.VISIBILITY) {
        this._state = STATES.IDLE;
        this._isDragging = false;
    }

    this._timer.start(delay || this._autoscrollDelay);
};

AutoscrollSlider.prototype._stopAutoscroll = function () {
    this._timer.stop();
};

AutoscrollSlider.prototype._onAutoscrollStateChanged = function (isActive) {
    this._stateAutoscroll = isActive
        ? STATES_AUTOSCROLL.ON
        : STATES_AUTOSCROLL.OFF;
    const e = new CustomEvent("autoscrollchange", {
        detail: { isActive },
        bubbles: true,
    });
    this._slider.dispatchEvent(e);
};

AutoscrollSlider.prototype._toggleAutoscrollMode = function () {
    if (this.stateAutoscroll === STATES_AUTOSCROLL.OFF) {
        this.next();
        this._onAutoscrollStateChanged(true);
        this._startAutoscroll();
        this._autoscrollManualStartTimestamp = Date.now();
    } else {
        this._onAutoscrollStateChanged(false);
        this._stopAutoscroll();
    }
};

AutoscrollSlider.prototype._isAutoscrollFirstCycle = function () {
    const msSinceStart = Date.now() - this._autoscrollManualStartTimestamp;
    return msSinceStart < this._autoscrollDelay;
};

AutoscrollSlider.prototype._clickAutoscrollon = function () {
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._clickAutoscrolloff = function () {
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._pressReset = function (e) {
    const isExecuted = DraggableSlider.prototype._pressReset.call(this, e);

    if (isExecuted) {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
            this._toggleAutoscrollMode();
        }
    }

    return isExecuted;
};

AutoscrollSlider.prototype._pressAutoscrolloff = function (e) {
    if (this._isInputBlocked()) return false;
    if (helper.isOverrideKey(e)) {
        if (this.stateAutoscroll !== STATES_AUTOSCROLL.OFF) {
            this._toggleAutoscrollMode();
        }
        return e;
    }
    if (this.stateAutoscroll === STATES_AUTOSCROLL.ON) {
        return false;
    }
    return e;
};

AutoscrollSlider.prototype._pressToggleautoscroll = function (e) {
    if (this._isInputBlocked()) return false;
    if (helper.isOverrideKey(e)) {
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
};

AutoscrollSlider.prototype._pressIgnore = function (e) {
    if (this._isInputBlocked()) return false;
    if (this.stateAutoscroll === STATES_AUTOSCROLL.ON) {
        return false;
    }
    return e;
};

AutoscrollSlider.prototype._beforeResize = function () {
    DraggableSlider.prototype._beforeResize.call(this);
    this._tryPauseAutoscroll();
};

AutoscrollSlider.prototype._afterResize = function () {
    DraggableSlider.prototype._afterResize.call(this);
    this._tryResumeAutoscroll();
};

AutoscrollSlider.prototype._handleMouseOver = function (e) {
    if (!helper.hasFinePointer()) return;

    const isPauseTarget = e.target.closest(
        `.${this._options.jsClasses.autoscrollPause}`,
    );

    if (isPauseTarget) {
        const msSinceStart = Date.now() - this._autoscrollManualStartTimestamp;
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
};

AutoscrollSlider.prototype._handleMouseOut = function (e) {
    if (!helper.hasFinePointer()) return;

    if (
        e.relatedTarget &&
        e.relatedTarget.closest(`.${this._options.jsClasses.autoscrollPause}`)
    ) {
        return;
    }

    if (!this._slider.contains(e.relatedTarget)) {
        this._isMouseOver = false;
        this._tryResumeAutoscroll(CONTEXTS.HOVER);
    }
};

AutoscrollSlider.prototype._handleFocus = function (e) {
    if (
        e.target.closest(`.${this._options.jsClasses.autoscrollPause}`) &&
        !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
    ) {
        this._isKeyboardFocused = true;
        this._tryPauseAutoscroll();
    }
};

AutoscrollSlider.prototype._handleBlur = function (e) {
    if (
        e.target.closest(`.${this._options.jsClasses.autoscrollPause}`) &&
        !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
    ) {
        this._isKeyboardFocused = false;
        this._tryResumeAutoscroll();
    }
};

AutoscrollSlider.prototype._handleVisibilityChange = function (e) {
    if (helper.isTabActive()) {
        this._isTabActive = true;
        this._tryResumeAutoscroll(CONTEXTS.VISIBILITY);
    } else {
        this._isTabActive = false;
        this._tryPauseAutoscroll();
    }
};

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
