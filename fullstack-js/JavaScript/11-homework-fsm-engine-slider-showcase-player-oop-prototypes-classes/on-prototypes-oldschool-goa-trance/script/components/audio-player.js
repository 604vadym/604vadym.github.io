"use strict";

import Button from "../core/button.js";
import DOMValidator from "../services/dom-validator.js";
import ButtonManager from "../services/button-manager.js";
import EventManager from "../services/event-manager.js";

export default function AudioPlayer(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(AudioPlayer),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_buttonManager", {
        value: new ButtonManager(),
        writable: false,
        configurable: false,
    });

    Object.defineProperty(this, "_eventManager", {
        value: new EventManager(),
        writable: false,
        configurable: false,
    });
}

Object.defineProperty(AudioPlayer, "MAIN_THEME_SRC", {
    value: "./assets/audio/asura/main-theme-rare-mix-preview.mp3",
    writable: false,
    configurable: false,
});

AudioPlayer.EVENT_MAP_KEY = "EVENT_MAP";

AudioPlayer.prototype = {
    constructor: AudioPlayer,

    get _currentAudioTrackIndex() {
        return this.__currentAudioTrackIndex;
    },

    set _currentAudioTrackIndex(index) {
        const totalAudioTracks = this._getTotalAudioTracks();
        this.__currentAudioTrackIndex =
            (index + totalAudioTracks) % totalAudioTracks;
    },

    init() {
        this._initDOMElements();
        this._initProps();
        this._buttonManager.init(this, "click");
        this._initButton();
        this._eventManager.init(this, AudioPlayer.EVENT_MAP_KEY);
    },

    handleClick(e) {
        return this._button.execute(e);
    },

    _initDOMElements(childElements) {
        const deck = document.querySelector(this._options.singleSelectors.deck);
        const btnNext = document.querySelector(
            this._options.singleSelectors.btnNext,
        );
        const btnPrev = document.querySelector(
            this._options.singleSelectors.btnPrev,
        );
        const btnPlay = document.querySelector(
            this._options.singleSelectors.btnPlay,
        );
        const btnPause = document.querySelector(
            this._options.singleSelectors.btnPause,
        );

        this._domValidator.validate(this, childElements, {
            deck,
            btnNext,
            btnPrev,
            btnPlay,
            btnPause,
        });

        this._deck = deck;
        this._btnNext = btnNext;
        this._btnPrev = btnPrev;

        if (this._options.defaultMode === true) {
            const btnPlayTheme = document.querySelector(
                this._options.singleSelectors.btnPlayTheme,
            );
            const btnPauseTheme = document.querySelector(
                this._options.singleSelectors.btnPauseTheme,
            );

            this._domValidator.validate(this, childElements, {
                btnPlayTheme,
                btnPauseTheme,
            });

            this._btnPlayTheme = btnPlayTheme;
            this._btnPauseTheme = btnPauseTheme;
        }
    },

    _initProps() {
        this._player = new Audio();
        this._initMode();
        this._initData();
        this._currentAlbumIndex = 0;
        this._currentAudioTrackIndex = 0;
    },

    _initMode() {
        if (this._options.defaultMode === true) {
            this._player.src = this.constructor.MAIN_THEME_SRC;
            setTimeout(() => {
                this._player.preload = "none";
            }, 300);
        } else {
            this._player.preload = "none";
        }
    },

    _initButton() {
        this._button = new Button(
            this._options.classes.playerBtn,
            this._buttonManager,
            this._buttonManager.manage,
        );
    },

    _startAudio(context) {
        if (context === "theme" && this._options.defaultMode === true) {
            if (!this._isMainThemeLoaded()) {
                this._player.src = MAIN_THEME_SRC;
            }
            // tryResetMainThemeTime();
            this._player.play().catch(() => {});
            return;
        }

        if (context === "album") {
            if (!this._isAudioModeActive()) {
                this._toggleAudioMode(true);
                // tryKillAutoscroll();
            }

            if (this._isNewAudioTrack(this._player.src)) {
                // updateAudioTrackTitle();
                // audioTrackCurrentTime.style.width = "0";
                const currentAlbum =
                    this._goaMasterpieces[this._currentAlbumIndex];
                this._player.src =
                    currentAlbum.tracks[this._currentAudioTrackIndex].src;
            }

            this._player.play().catch(() => {});
        }
    },

    _stopAudio() {
        if (this._isAudioModeActive()) {
            this._toggleAudioMode(false);
        }
        this._player.pause();
    },

    _nextAudioTrack() {
        this._currentAudioTrackIndex++;
    },

    _prevAudioTrack() {
        this._currentAudioTrackIndex--;
    },

    _getTotalAudioTracks() {
        return this._goaMasterpieces[this._currentAlbumIndex].tracks.length;
    },

    _isAudioModeActive() {
        return this._deck.classList.contains(this._options.states.active);
    },

    _isMainThemeLoaded() {
        return this._player.src.includes(
            this.constructor.MAIN_THEME_SRC.substring(2),
        );
    },

    _isNewAudioTrack(currentSrc) {
        return !currentSrc.includes(
            this._goaMasterpieces[this._currentAlbumIndex].tracks[
                this._currentAudioTrackIndex
            ].src.substring(2),
        );
    },

    _toggleAudioMode(isActive) {
        this._deck.classList.toggle(this._options.states.active, isActive);
        this._btnNext.tabIndex = isActive ? 0 : -1;
        this._btnPrev.tabIndex = isActive ? 0 : -1;
        if (this._options.defaultMode === true) {
            this._btnPlayTheme.tabIndex = isActive ? -1 : 0;
        }
    },

    _clickPlay(e) {
        // if (e.shiftKey && isAutoscrollOn) toggleAutoscrollMode();
        this._startAudio("album");
    },

    _clickPause() {
        this._stopAudio();
    },

    _clickNext() {
        this._nextAudioTrack();
        this._startAudio("album");
    },

    _clickPrev() {
        this._prevAudioTrack();
        this._startAudio("album");
    },

    _clickPlaytheme() {},

    _clickPausetheme() {},

    _initData() {
        this._goaMasterpieces = [
            {
                tracks: [
                    {
                        src: "./assets/audio/asura/2000-code-eternity/01-like-a-summer-day-preview.mp3",
                    },
                    {
                        src: "./assets/audio/asura/2000-code-eternity/02-trinity-preview.mp3",
                    },
                ],
            },
            {
                tracks: [
                    {
                        src: "./assets/audio/asura/2003-lost-eden/01-lost-eden-preview.mp3",
                    },
                    {
                        src: "./assets/audio/asura/2003-lost-eden/02-from-the-abyss-preview.mp3",
                    },
                ],
            },
            {
                tracks: [
                    {
                        src: "./assets/audio/asura/2007-life-squared/01-golgotha-preview.mp3",
                    },
                    {
                        src: "./assets/audio/asura/2007-life-squared/02-back-to-light-preview.mp3",
                    },
                ],
            },
            {
                tracks: [
                    {
                        src: "./assets/audio/asura/2010-360/01-el-hai-preview.mp3",
                    },
                    {
                        src: "./assets/audio/asura/2010-360/02-regenesis-preview.mp3",
                    },
                ],
            },
        ];
    },
};
