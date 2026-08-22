"use strict";

import * as helper from "../utils/helpers.js";
import DraggableSlider from "./draggable-slider.js";
import Timer from "../services/timer.js";

export default function AutoscrollSlider(options) {
    DraggableSlider.call(this, options);

    Object.defineProperty(this, "_timer", {
        value: new Timer(this, this._nextSlideAuto),
        writable: false,
        configurable: false,
    });
}

AutoscrollSlider.AUTOSCROLL_DELAY = 4500;
AutoscrollSlider.AUTOSCROLL_WAKE_UP_DELAY = 1500;

AutoscrollSlider.prototype = Object.create(DraggableSlider.prototype);
AutoscrollSlider.prototype.constructor = AutoscrollSlider;
Object.setPrototypeOf(AutoscrollSlider, DraggableSlider);

AutoscrollSlider.prototype.init = function () {
    DraggableSlider.prototype.init.call(this);
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
    this._isAutoscrollOn = Boolean(this._options.autoplay);

    this._autoscrollPauseTimestamp = 0;
    this._autoscrollManualStartTimestamp = 0;
    this._slideStandTimestamp = 0;
    this._lastClickTimestamp = 0;
    this._isTabActive = true;
    this._isMouseOver = false;
    this._isKeyboardFocused = false;
    this._isKeyboardDynamicFocused = false;
};

AutoscrollSlider.prototype._nextSlideAuto = function () {
    if (this.state === "MOVING" || !this._isAutoscrollOn) return;

    if (this._currentIndex === this._slidesCount) {
        this._currentIndex = 0;
        this._updateSliderInstantly();
    }

    ++this._currentIndex;
    this._updateSlider();

    // const isMouseStillOver =
    //     helper.hasFinePointer() &&
    //     document.querySelector(
    //         ".js-autoscroll-pause:not(.slider__btn--autoscroll-off):hover",
    //     );

    // if (isMouseStillOver) {
    //     this._isMouseOver = true;
    //     this._tryKillAutoscroll("hover");
    // } else {
    //     this._isMouseOver = false;
    // }
};

AutoscrollSlider.prototype._tryResurrectAutoscroll = function (context = null) {
    const isDriftingAfterClick = this._isPostClickDriftActive();
    if (
        !this._isAutoscrollOn ||
        !this._isTabActive ||
        (context !== "visibility" && this._isDragging) ||
        this._isKeyboardFocused ||
        // isAudioModeActive() ||
        (this._isMouseOver && !isDriftingAfterClick)
    )
        return;

    // if (
    //     context === "hover" &&
    //     isAutoscrollFirstCycle() &&
    //     !isDriftingAfterClick
    // )
    //     return;

    // if (context === "hover" && hasFinePointer()) {
    //     if (isDriftingAfterClick) {
    //         context = null;
    //     }
    // } else if (context !== "visibility") {
    //     context = null;
    // }

    if (context === "hover") {
        this._startAutoscroll(this._getAdaptiveWakeUpDelay());
    } else {
        this._startAutoscroll(null, context);
    }
};

AutoscrollSlider.prototype._tryKillAutoscroll = function (context = null) {
    if (!this._isAutoscrollOn) return;

    // if (isTabActive && !isAudioModeActive() && !isKeyboardFocused) {
    //     if (context === "hover" && isAutoscrollFirstCycle()) return;
    // }

    this._killAutoscroll();
};

AutoscrollSlider.prototype._startAutoscroll = function (
    delay = null,
    context = null,
) {
    this._isAutoscrollOn = true;
    this._slider.classList.add(this._options.states.autoscrollon);
    this._btnAutoscrollOff.tabIndex = 0;

    if (context === "visibility") {
        this._state = "IDLE";
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

function isAutoscrollFirstCycle() {
    const msSinceStart = Date.now() - autoscrollManualStartTimestamp;
    return msSinceStart < AUTOSCROLL_DELAY;
}

function isPostClickDriftActive() {
    const msSinceLastClick = Date.now() - lastClickTimestamp;
    return msSinceLastClick < AUTOSCROLL_WAKE_UP_DELAY;
}

function getAdaptiveWakeUpDelay() {
    const msSlideStand = Date.now() - slideStandTimestamp;
    if (msSlideStand < AUTOSCROLL_DELAY - AUTOSCROLL_WAKE_UP_DELAY) {
        return AUTOSCROLL_DELAY - msSlideStand;
    }
    return AUTOSCROLL_WAKE_UP_DELAY;
}

AutoscrollSlider.prototype._clickAutoscrollon = function () {
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._clickAutoscrolloff = function () {
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._pressAutoscrollon = function () {
    // e.preventDefault();
    this._toggleAutoscrollMode();
};

AutoscrollSlider.prototype._pressAutoscrolloff = function () {
    // e.preventDefault();
    this._toggleAutoscrollMode();
};

function handleFocus(e) {
    if (
        e.target.closest(".js-autoscroll-pause") &&
        !e.target.closest(".js-dynamic-focus")
    ) {
        isKeyboardFocused = true;
        tryKillAutoscroll();
    }
}

function handleBlur(e) {
    if (
        e.target.closest(".js-autoscroll-pause") &&
        !e.target.closest(".js-dynamic-focus")
    ) {
        isKeyboardFocused = false;
        tryResurrectAutoscroll();
    }
}

function handleMouseDown(e) {
    if (e.button === 1) {
        if (isMoving) {
            e.preventDefault();
            return;
        }
        const isInteractiveTarget =
            e.target.closest(".slider__link-shop") ||
            e.target.closest(".button") ||
            e.target.closest("a");
        if (isInteractiveTarget) return;

        e.preventDefault();
        if (isAutoscrollOn) {
            toggleAutoscrollMode();
        }
        if (audioPlayer.paused) {
            startAudio("album");
        } else {
            stopAudio();
        }
    }
}

function handleMouseOver(e) {
    if (!hasFinePointer()) return;
    const isPauseTarget = e.target.closest(".js-autoscroll-pause");

    if (isPauseTarget) {
        const msSinceStart = Date.now() - autoscrollManualStartTimestamp;
        if (msSinceStart < 100) {
            isMouseOver = true;
            return;
        }
        if (isMouseOver) return;

        isMouseOver = true;
        tryKillAutoscroll("hover");
    } else {
        if (!isMouseOver) return;
        isMouseOver = false;
        tryResurrectAutoscroll("hover");
    }
}

function handleMouseOut(e) {
    if (!hasFinePointer()) return;
    if (e.relatedTarget && e.relatedTarget.closest(".js-autoscroll-pause")) {
        return;
    }

    if (!slider.contains(e.relatedTarget)) {
        isMouseOver = false;
        tryResurrectAutoscroll("hover");
    }
}

function handleTransitionEnd() {
    if (resetLoop()) {
        teleportSlides();
    } else {
        isMoving = false;
    }

    slideStandTimestamp = Date.now();

    const albumIndex = getAlbumIndex();
    if (activeAlbumIndex !== albumIndex) {
        onAlbumChanged(albumIndex);
    }

    if (isKeyboardDynamicFocused) {
        isKeyboardDynamicFocused = false;
        tryKillAutoscroll();
        tryResurrectAutoscroll();
    }
}

function handleVisibilityChange() {
    if (document.hidden === true) {
        isTabActive = false;
        tryKillAutoscroll();
    } else {
        isTabActive = true;
        tryResurrectAutoscroll("visibility");
    }
}

AutoscrollSlider[AutoscrollSlider.EVENT_MAP_KEY] = {
    // click: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleClick,
    // },
    // auxclick: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleClick,
    // },
    // mouseover: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleMouseOver,
    // },
    // mouseout: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleMouseOut,
    // },
    // focus: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleClick,
    // },
    // blur: {
    //     target: (instance) => instance._slider,
    //     handler: AutoscrollSlider.prototype._handleClick,
    // },
    // transitionend: {
    //     target: (instance) => instance._track,
    //     handler: AutoscrollSlider.prototype._handleTransitionEnd,
    // },
    // mousedown: {
    //     target: () => document,
    //     handler: AutoscrollSlider.prototype._handleMouseDown,
    // },
    // keydown: {
    //     target: () => document,
    //     handler: AutoscrollSlider.prototype._handleKeyDown,
    // },
    // visibilitychange: {
    //     target: () => document,
    //     handler: AutoscrollSlider.prototype._handleVisibilityChange,
    // },
};

// slider.addEventListener("focus", handleFocus, { capture: true });
// slider.addEventListener("blur", handleBlur, { capture: true });
