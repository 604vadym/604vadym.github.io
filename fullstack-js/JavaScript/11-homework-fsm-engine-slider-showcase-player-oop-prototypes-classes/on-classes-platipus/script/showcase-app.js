"use strict";

import * as helper from "./utils/helpers.js";
import DOMValidator from "./services/dom-validator.js";
import EventManager from "./services/event-manager.js";
import KeyboardManager from "./services/keyboard-manager.js";

export default function ShowcaseApp(
    slider,
    audioPlayer,
    audioDeckView,
    shop,
    options,
) {
    this._slider = slider;
    this._audioPlayer = audioPlayer;
    this._audioDeckView = audioDeckView;
    this._shop = shop;
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(ShowcaseApp),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_keyboardManager", {
        value: new KeyboardManager(),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

ShowcaseApp.EVENT_MAP_KEY = "EVENT_MAP";

const shiftAudioTrackMap = {
    ")": 10,
    "!": 11,
    "@": 12,
    "#": 13,
    $: 14,
    "%": 15,
    "^": 16,
    "&": 17,
    "*": 18,
    "(": 19,
};

const MOUSE_BUTTON_LEFT = 0;
const MOUSE_BUTTON_MIDDLE = 1;
const MOUSE_BUTTON_RIGHT = 2;

ShowcaseApp.KEYBOARD_MODES = Object.freeze({
    REVERSE: "reverse",
    REPEAT_FILTERED: "repeatFiltered",
    REPEAT_ALLOWED: "repeatAllowed",
});

const MODES = ShowcaseApp.KEYBOARD_MODES;

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._initDOMElements();
        this._initProps();
        this._slider.init();
        this._audioPlayer.init();
        this._audioDeckView.init();
        this._shop.init();
        this._keyboardManager.init(this, "press");
        this._eventManager.init(this, ShowcaseApp.EVENT_MAP_KEY);
    },

    _initDOMElements(childElements) {
        const showcase = document.querySelector(
            this._options.singleSelectors.app,
        );

        this._domValidator.validate(this, childElements, {
            showcase,
        });

        this._showcase = showcase;
    },

    _initProps() {
        this._isSliderMoving = false;
        this._btnNoActive = null;
    },

    _tryResetBtnNoActive() {
        if (this._btnNoActive) {
            this._btnNoActive.classList.remove(
                this._options.jsClasses.btnNoActive,
            );
            this._eventManager.unsubscribe(this, ShowcaseApp.DYNAMIC_EVENT_MAP);
            this._btnNoActive = null;
        }
    },

    _isRepeatAllowed(e) {
        if (e.repeat && !this._isPassthrougOnActiveAudio(e)) {
            return true;
        }
        return false;
    },

    _isPassthrougOnActiveAudio(e) {
        if (helper.isPassthroughKey(e)) {
            if (this._audioPlayer.isAlbumPlaying()) {
                return true;
            }
        }
        return false;
    },

    _pressStep(e) {
        helper.prevent(e);
        if (this._isRepeatAllowed(e)) return MODES.REPEAT_ALLOWED;
        if (e.repeat) return MODES.REPEAT_FILTERED;
        if (this._isPassthrougOnActiveAudio(e)) return MODES.REVERSE;
        return e;
    },

    _pressSwitchaudiotrack(e) {
        let audioTrackIndex;
        if (helper.isOverrideKey(e) && e.key in shiftAudioTrackMap) {
            audioTrackIndex = shiftAudioTrackMap[e.key] - 1;
        } else {
            audioTrackIndex = parseInt(e.key, 10) - 1;
        }

        this._audioPlayer.audioTrackInQueue = audioTrackIndex;
        return e;
    },

    _pressExecute(e) {
        return MODES.REPEAT_ALLOWED;
    },

    _pressToggle(e) {
        helper.prevent(e);
        return MODES.REVERSE;
    },

    _pressEscape(e) {
        if (helper.hasPlatformModifiers(e)) return false;
        helper.prevent(e);
        helper.tryClearFocus();
        return e;
    },

    _pressCheckplatformmodifiers(e) {
        if (helper.hasPlatformModifiers(e)) return false;
        helper.prevent(e);
        return e;
    },

    _pressIgnore(e) {
        helper.prevent(e);
        return false;
    },

    _pressPrevent(e) {
        helper.prevent(e);
        return e;
    },

    _stream(e, handlerName, EventClass, pump) {
        let pipeline;
        if (pump === MODES.REVERSE) {
            pipeline = [this._audioPlayer, this._slider, this._shop];
        } else {
            pipeline = [this._slider, this._audioPlayer, this._shop];
        }
        return this._pipe(e, handlerName, EventClass, pipeline);
    },

    _pipe(e, handlerName, EventClass, pipeline) {
        for (const component of pipeline) {
            if (!(e instanceof EventClass)) return e;
            if (typeof component[handlerName] === "function") {
                e = component[handlerName](e);
            }
        }
        return e;
    },

    _handleClick(e) {
        this._stream(e, "handleClick", MouseEvent);
    },

    _handleAuxClick(e) {
        if (e.button === MOUSE_BUTTON_RIGHT) {
            return;
        }

        if (e.target.closest(`.${this._options.classes.app}`)) {
            if (e.button === MOUSE_BUTTON_MIDDLE) {
                const isInteractiveTarget =
                    e.target.closest(`.${this._options.classes.linkShop}`) ||
                    e.target.closest(`.${this._options.classes.button}`) ||
                    e.target.closest("a");

                if (isInteractiveTarget) {
                    this._stream(e, "handleClick", MouseEvent);
                    return;
                }
            }
        }

        this._stream(e, "handleAuxClick", MouseEvent);
    },

    _handleKeyDown(e) {
        let pump;
        if (!(pump = this._keyboardManager.manage(e))) return;

        if (pump === MODES.REPEAT_FILTERED) return;
        if (pump !== MODES.REPEAT_ALLOWED && e.repeat) {
            helper.prevent(e);
            return;
        }
        if (pump === MODES.REVERSE && this._isSliderMoving) return;

        const result = this._stream(e, "handleKeyDown", KeyboardEvent, pump);
        if (result === true) {
            const activeElement = document.activeElement;
            const isPressTarget = activeElement?.closest(
                `.${this._options.jsClasses.keyboardPressBtn}`,
            );
            if (isPressTarget) {
                activeElement.classList.add(
                    this._options.states.keyboardBtnPressed,
                );
            }
        }
    },

    _handleKeyUp(e) {
        const pressedBtn = document.querySelector(
            `.${this._options.states.keyboardBtnPressed}`,
        );
        if (pressedBtn) {
            pressedBtn.classList.remove(
                this._options.states.keyboardBtnPressed,
            );
        }
    },

    _handleMouseDown(e) {
        if (e.button === MOUSE_BUTTON_MIDDLE) {
            helper.prevent(e);
        }
        if (!this._showcase.contains(e.target)) return;

        if (e.button === MOUSE_BUTTON_RIGHT) {
            const button = e.target.closest(`.${this._options.classes.button}`);
            if (button && !this._btnNoActive) {
                button.classList.add(this._options.jsClasses.btnNoActive);
                this._btnNoActive = button;
                this._eventManager.subscribe(
                    this,
                    ShowcaseApp.DYNAMIC_EVENT_MAP,
                );
            }
        } else if (
            e.button === MOUSE_BUTTON_LEFT ||
            e.button === MOUSE_BUTTON_MIDDLE
        ) {
            this._tryResetBtnNoActive();
        }
    },

    _handleViewportClick(e) {
        this._audioPlayer.toggle();
    },

    _handleSlideMove(e) {
        this._isSliderMoving = true;
    },

    _handleSlideChange(e) {
        this._isSliderMoving = false;
        this._shop.setActiveIndex(e.detail.index);
        if (helper.isTabActive()) {
            this._audioPlayer.switchAlbum(e.detail.index);
        }
    },

    _handleAutoscrollChange(e) {
        this._toggleAudioPlayerTheme(e.detail.isActive);
        this._toggleAutoscrollLayout(e.detail.isActive);
    },

    _toggleAudioPlayerTheme(isActive) {
        if (isActive) {
            this._audioPlayer.playTheme();
        } else {
            this._audioPlayer.resetTheme();
        }
    },

    _toggleAutoscrollLayout(isActive) {
        if (this._isAutoscrollActive() === isActive) return;
        this._showcase.classList.toggle(
            this._options.states.autoscrollActive,
            isActive,
        );
        this._slider.toggleTabIndex(isActive);
        helper.tryClearFocus();
    },

    _isAutoscrollActive() {
        return this._showcase.classList.contains(
            this._options.states.autoscrollActive,
        );
    },

    _handleAlbumPlay(e) {
        this._slider.lockAutoscroll();
        this._toggleAudioPlayerLayout(true);
    },

    _handleAlbumPause(e) {
        this._slider.unlockAutoscroll();
        this._toggleAudioPlayerLayout(false);
    },

    _handleAlbumPlayPassthrough(e) {
        this._slider.disableAutoscroll();
    },

    _toggleAudioPlayerLayout(isActive) {
        if (this._isAudioActive() === isActive) return;
        this._showcase.classList.toggle(
            this._options.states.audioActive,
            isActive,
        );
        this._audioPlayer.toggleTabIndex(isActive);
        helper.tryClearFocus();
    },

    _isAudioActive() {
        return this._showcase.classList.contains(
            this._options.states.audioActive,
        );
    },

    _handleAlbumEnd(e) {
        if (helper.isTabActive()) {
            helper.prevent(e);
            this._slider.next();
        } else {
            this._slider.nextInstantly();
        }
    },

    _handleAudioTrackChange(e) {
        const { trackIndex, albumIndex, totalTracks } = e.detail;
        const trackName =
            this._options.albums[albumIndex].tracks[trackIndex].name;
        this._audioDeckView.renderAudioTrackTitle(
            trackIndex + 1,
            totalTracks,
            trackName,
        );
        this._audioDeckView.renderTimeline(0, null);
    },

    _handleTimeChange(e) {
        const { currentTime, duration } = e.detail;
        this._audioDeckView.renderTimeline(currentTime, duration);
    },

    _handleMouseLeave(e) {
        this._tryResetBtnNoActive();
    },
};

ShowcaseApp[ShowcaseApp.EVENT_MAP_KEY] = {
    click: {
        target: (instance) => instance._showcase,
        handler: ShowcaseApp.prototype._handleClick,
    },
    auxclick: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleAuxClick,
    },
    keydown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyDown,
    },
    keyup: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleKeyUp,
    },
    mousedown: {
        target: () => document,
        handler: ShowcaseApp.prototype._handleMouseDown,
    },
    viewportclick: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleViewportClick,
    },
    slidemove: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleSlideMove,
    },
    slidechange: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleSlideChange,
    },
    autoscrollchange: {
        target: (instance) => instance._slider.element,
        handler: ShowcaseApp.prototype._handleAutoscrollChange,
    },
    albumplay: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumPlay,
    },
    albumpause: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumPause,
    },
    albumplaypassthrough: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumPlayPassthrough,
    },
    albumend: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAlbumEnd,
    },
    audiotrackchange: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleAudioTrackChange,
    },
    timechange: {
        target: (instance) => instance._audioPlayer.element,
        handler: ShowcaseApp.prototype._handleTimeChange,
    },
};

ShowcaseApp.DYNAMIC_EVENT_MAP = {
    mouseleave: {
        target: (instance) => instance._btnNoActive,
        handler: ShowcaseApp.prototype._handleMouseLeave,
    },
};
