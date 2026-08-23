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
        value: new Timer(this, this._nextSlideAuto),
        writable: false,
        configurable: false,
    });
}

AutoscrollSlider.prototype = Object.create(DraggableSlider.prototype);
AutoscrollSlider.prototype.constructor = AutoscrollSlider;
Object.setPrototypeOf(AutoscrollSlider, DraggableSlider);

Object.defineProperty(AutoscrollSlider, "AUTOSCROLL_DELAY", {
    value: 4500,
    writable: false,
    configurable: false,
});

Object.defineProperty(AutoscrollSlider, "AUTOSCROLL_WAKE_UP_DELAY", {
    value: 1500,
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

    this._autoscrollPauseTimestamp = 0;
    this._autoscrollManualStartTimestamp = 0;
    this._slideStandTimestamp = 0;
    this._lastClickTimestamp = 0;

    this._isTabActive = true;
    this._isMouseOver = false;
    this._isKeyboardFocused = false;
    this._isKeyboardDynamicFocused = false;
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
    this._autoscrollPauseTimestamp = 0;
    this._autoscrollManualStartTimestamp = 0;
    this._slideStandTimestamp = 0;
    this._lastClickTimestamp = 0;
    this._isMouseOver = false;
    this._isKeyboardFocused = false;
    this._isKeyboardDynamicFocused = false;
};

AutoscrollSlider.prototype._nextSlideAuto = function () {
    if (this.state === STATES.MOVING || !this._isAutoscrollOn) return;

    if (this._currentIndex === this._slidesCount) {
        this._nextSlideAutoLazy();
    } else {
        this._nextSlide();
    }

    if (this._isMouseStillOver()) {
        this._isMouseOver = true;
        this._tryPauseAutoscroll(CONTEXTS.HOVER);
    } else {
        this._isMouseOver = false;
    }
};

AutoscrollSlider.prototype._nextSlideAutoLazy = function () {
    this._currentIndex = this._startIndex - 1;
    this._updateSliderInstantly();
    this._goToSlide(this._currentIndex);
};

AutoscrollSlider.prototype._isMouseStillOver = function () {
    return (
        helper.hasFinePointer() &&
        !!document.querySelector(
            `.${this._options.jsClasses.autoscrollPauseHover}:not(.${this._options.classes.btnAutoscrollOff}):hover`,
        )
    );
};

AutoscrollSlider.prototype._tryResumeAutoscroll = function (context = null) {
    const isDriftingAfterClick = this._isPostClickDriftActive();
    if (
        !this._isAutoscrollOn ||
        !this._isTabActive ||
        (context !== CONTEXTS.VISIBILITY && this._isDragging) ||
        this._isKeyboardFocused ||
        (this._isMouseOver && !isDriftingAfterClick)
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
    const msSlideStand = Date.now() - this._slideStandTimestamp;
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
    this._isAutoscrollOn = true;
    this._slider.classList.add(this._options.states.autoscrollon);
    this._btnAutoscrollOff.tabIndex = 0;

    if (context === CONTEXTS.VISIBILITY) {
        this._state = STATES.IDLE;
        this._isDragging = false;
        this._isKeyboardDynamicFocused = false;
    }

    const currentDelay = delay || this._autoscrollDelay;

    this._timer.start(currentDelay);
};

AutoscrollSlider.prototype._stopAutoscroll = function () {
    this._isAutoscrollOn = false;
    this._slider.classList.remove(this._options.states.autoscrollon);
    this._btnAutoscrollOff.tabIndex = -1;
    this._autoscrollPauseTimestamp = Date.now();
    this._timer.stop();
};

AutoscrollSlider.prototype._toggleAutoscrollMode = function () {
    if (this._isAutoscrollOn) {
        helper.tryClearFocus();
        this._stopAutoscroll();
    } else {
        this._nextSlide();
        this._startAutoscroll();
        this._autoscrollManualStartTimestamp = Date.now();
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

AutoscrollSlider.prototype._pressExecute = function (e) {
    DraggableSlider.prototype._pressExecute.call(this, e);

    const activeElement = document.activeElement;
    const isButton = activeElement?.closest(`.${this._options.classes.button}`);

    if (isButton && this._isInputBlocked()) return;

    this._isKeyboardDynamicFocused = !!activeElement?.closest(
        `.${this._options.jsClasses.dynamicFocus}`,
    );
};

AutoscrollSlider.prototype._pressReset = function (e) {
    const isResetExecuted = DraggableSlider.prototype._pressReset.call(this, e);

    if (isResetExecuted) {
        if (this._isAutoscrollOn) {
            this._toggleAutoscrollMode();
        }
    }

    return isResetExecuted;
};

AutoscrollSlider.prototype._pressAutoscrollon = function (e) {
    e.preventDefault();
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._pressAutoscrolloff = function (e) {
    e.preventDefault();
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
    const validButton = DraggableSlider.prototype._validateButtonInput.call(
        this,
        e,
    );
    if (validButton) {
        this._lastClickTimestamp = Date.now();
        this._tryPauseAutoscroll();
    }

    DraggableSlider.prototype._handleClick.call(this, e);
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

AutoscrollSlider.prototype._handleTransitionEnd = function () {
    DraggableSlider.prototype._handleTransitionEnd.call(this);

    this._slideStandTimestamp = Date.now();

    // const albumIndex = getAlbumIndex();
    // if (activeAlbumIndex !== albumIndex) {
    //     onAlbumChanged(albumIndex);
    // }

    if (this._isKeyboardDynamicFocused) {
        this._isKeyboardDynamicFocused = false;
        this._tryPauseAutoscroll();
        this._tryResumeAutoscroll();
    }
};

AutoscrollSlider.prototype._handleVisibilityChange = function () {
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
    transitionend: {
        target: (instance) => instance._track,
        handler: AutoscrollSlider.prototype._handleTransitionEnd,
    },
    // keydown: {
    //     target: () => document,
    //     handler: AutoscrollSlider.prototype._handleKeyDown,
    // },
    visibilitychange: {
        target: () => document,
        handler: AutoscrollSlider.prototype._handleVisibilityChange,
    },
};
