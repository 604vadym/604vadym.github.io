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

const STATES = AutoscrollSlider.STATES;

AutoscrollSlider.prototype.init = function () {
    DraggableSlider.prototype.init.call(this);
    this._initAutoscroll();
};

AutoscrollSlider.prototype._initAutoscroll = function () {
    if (this._isAutoscrollOn) {
        this._startAutoscroll();
    }
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
    this._isAutoscrollOn = Boolean(this._options.autoplay);
};

AutoscrollSlider.prototype._initPagination = function () {
    DraggableSlider.prototype._initPagination.call(this);
    for (let i = 0; i < this._slidesCount; i++) {
        this._paginationDots[i].classList.add(
            this._options.jsClasses.autoscrollPauseHover,
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
    this._indexChangeTimestamp = Date.now();
    if (!this._isAutoscrollAction) {
        this._tryPauseAutoscroll();
        this._tryResumeAutoscroll();
    }
};

AutoscrollSlider.prototype._onDragStarted = function () {
    DraggableSlider.prototype._onDragStarted.call(this);
    this._tryPauseAutoscroll();
};

AutoscrollSlider.prototype._onDragEnded = function () {
    DraggableSlider.prototype._onDragEnded.call(this);
    this._tryResumeAutoscroll();
};

AutoscrollSlider.prototype._nextAuto = function () {
    if (this._isInputBlocked() || !this._isAutoscrollOn) return;

    this._isAutoscrollAction = true;

    if (this._currentIndex === this._slidesCount) {
        this._nextAutoLazy();
    } else {
        this._nextIndex();
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
    this._goToIndex(this._currentIndex);
};

AutoscrollSlider.prototype._isMouseStillOver = function () {
    return (
        helper.hasFinePointer() &&
        Boolean(
            document.querySelector(
                `.${this._options.jsClasses.autoscrollPauseHover}:not(.${this._options.classes.btnAutoscrollOff}):hover`,
            ),
        )
    );
};

AutoscrollSlider.prototype._tryResumeAutoscroll = function (context = null) {
    const isDriftingAfterClick = this._isPostClickDriftActive();
    if (
        !this._isAutoscrollOn ||
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
    if (!this._isAutoscrollOn) return;

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

    this._toggleAutoscrollState(true);
    this._timer.start(delay || this._autoscrollDelay);
};

AutoscrollSlider.prototype._stopAutoscroll = function () {
    this._toggleAutoscrollState(false);
    this._timer.stop();
};

AutoscrollSlider.prototype._toggleAutoscrollState = function (isActive) {
    this._isAutoscrollOn = isActive;
    this._slider.classList.toggle(this._options.states.autoscrollOn, isActive);
    this._btnAutoscrollOff.tabIndex = isActive ? 0 : -1;
    this._btnAutoscrollOn.tabIndex = isActive ? -1 : 0;
};

AutoscrollSlider.prototype._toggleAutoscrollMode = function () {
    if (this._isAutoscrollOn) {
        this._stopAutoscroll();
    } else {
        this.next();
        this._startAutoscroll();
        this._autoscrollManualStartTimestamp = Date.now();
    }
    helper.tryClearFocus();
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
        if (this._isAutoscrollOn) {
            this._toggleAutoscrollMode();
        }
    }

    return isExecuted;
};

AutoscrollSlider.prototype._pressAutoscrollon = function (e) {
    helper.prevent(e);
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._pressAutoscrolloff = function (e) {
    helper.prevent(e);
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._beforeResize = function () {
    DraggableSlider.prototype._beforeResize.call(this);
    this._tryPauseAutoscroll();
};

AutoscrollSlider.prototype._afterResize = function () {
    DraggableSlider.prototype._afterResize.call(this);
    this._tryResumeAutoscroll();
};

AutoscrollSlider.prototype._handleClick = function (e) {
    const isExecuted = DraggableSlider.prototype._handleClick.call(this, e);

    if (isExecuted) {
        this._lastClickTimestamp = Date.now();
    }

    return isExecuted;
};

AutoscrollSlider.prototype._handleMouseOver = function (e) {
    if (!helper.hasFinePointer()) return;

    const isPauseTarget = e.target.closest(
        `.${this._options.jsClasses.autoscrollPauseHover}`,
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
        e.relatedTarget.closest(
            `.${this._options.jsClasses.autoscrollPauseHover}`,
        )
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
        e.target.closest(`.${this._options.jsClasses.autoscrollPauseHover}`) &&
        !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
    ) {
        this._isKeyboardFocused = true;
        this._tryPauseAutoscroll();
    }
};

AutoscrollSlider.prototype._handleBlur = function (e) {
    if (
        e.target.closest(`.${this._options.jsClasses.autoscrollPauseHover}`) &&
        !e.target.closest(`.${this._options.jsClasses.dynamicFocus}`)
    ) {
        this._isKeyboardFocused = false;
        this._tryResumeAutoscroll();
    }
};

AutoscrollSlider.prototype._handleVisibilityChange = function (e) {
    if (document.hidden === true) {
        this._isTabActive = false;
        this._tryPauseAutoscroll();
    } else {
        this._isTabActive = true;
        this._tryResumeAutoscroll(CONTEXTS.VISIBILITY);
    }
};

AutoscrollSlider[AutoscrollSlider.EVENT_MAP_KEY] = {
    click: {
        target: (instance) => instance._slider,
        handler: AutoscrollSlider.prototype._handleClick,
    },
    auxclick: {
        target: (instance) => instance._slider,
        handler: AutoscrollSlider.prototype._handleClick,
    },
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
