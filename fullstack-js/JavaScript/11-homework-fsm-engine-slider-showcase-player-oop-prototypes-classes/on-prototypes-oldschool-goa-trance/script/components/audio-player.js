"use strict";

import * as helper from "../utils/helpers.js";
import Button from "../core/button.js";
import DOMValidator from "../services/dom-validator.js";
import ButtonManager from "../services/button-manager.js";
import KeyboardManager from "../services/keyboard-manager.js";
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

Object.defineProperty(AudioPlayer, "MAIN_THEME_RESET_PAUSE_THRESHOLD", {
    value: 300000,
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
        this.__currentAudioTrackIndex = this._normaliseIndex(
            index,
            this._getTotalAudioTracks(),
        );
    },

    get _currentAlbumIndex() {
        return this.__currentAlbumIndex;
    },

    set _currentAlbumIndex(index) {
        this.__currentAlbumIndex = this._normaliseIndex(
            index,
            this._getTotalAlbums(),
        );
    },

    init() {
        this._initDOMElements();
        this._initProps();
        this._buttonManager.init(this, "click");
        this._initButtons();
        this._keyboardManager.init(this, "press");
        this._eventManager.init(this, AudioPlayer.EVENT_MAP_KEY);
    },

    play() {
        this.playAlbum();
    },

    playAlbum() {
        if (!this._isAudioModeActive()) {
            this._toggleAudioMode(true);
            // tryKillAutoscroll();
        }

        if (this._isNewAudioTrack(this._player.src)) {
            // updateAudioTrackTitle();
            // audioTrackCurrentTime.style.width = "0";
            const currentAlbum = this._goaMasterpieces[this._currentAlbumIndex];
            this._player.src =
                currentAlbum.tracks[this._currentAudioTrackIndex].src;
        }

        this._player.play().catch(() => {});
    },

    playTheme() {
        if (this._hasMainTheme) {
            if (!this._isMainThemeLoaded()) {
                this._player.src = this._mainThemeSrc;
            }
            this._tryResetMainThemeTime();
            this._player.play().catch(() => {});
        }
    },

    pause() {
        if (this._isMainThemeLoaded()) {
            this._mainThemePauseTimestamp = Date.now();
        }
        if (this._isAudioModeActive()) {
            this._toggleAudioMode(false);
        }
        this._player.pause();
    },

    nextAudioTrack() {
        this._nextAudioTrack();
        this.playAlbum();
    },

    prevAudioTrack() {
        this._prevAudioTrack();
        this.playAlbum();
    },

    switchAudioTrack(index) {
        const isTrackChanged = this._givenAudioTrack(index);

        if (isTrackChanged && this._isAudioModeActive()) {
            this.playAlbum();
        }

        return isTrackChanged;
    },

    nextAlbum() {
        this.switchAlbum(
            this._normaliseIndex(
                this._currentAlbumIndex + 1,
                this._getTotalAlbums(),
            ),
        );
    },

    prevAlbum() {
        this.switchAlbum(
            this._normaliseIndex(
                this._currentAlbumIndex - 1,
                this._getTotalAlbums(),
            ),
        );
    },

    switchAlbum(index) {
        const isAlbumChanged = this._setAlbum(index);

        if (isAlbumChanged && this._isAudioModeActive()) {
            this.playAlbum();
        }

        return isAlbumChanged;
    },

    handleClick(e) {
        return this._button.execute(e);
    },

    handleKeyDown(e) {
        return this._keyboardManager.manage(e);
    },

    _initDOMElements(childElements) {
        const deck = document.querySelector(this._options.singleSelectors.deck);
        const btnPlay = document.querySelector(
            this._options.singleSelectors.btnPlay,
        );
        const btnPause = document.querySelector(
            this._options.singleSelectors.btnPause,
        );
        const btnNext = document.querySelector(
            this._options.singleSelectors.btnNext,
        );
        const btnPrev = document.querySelector(
            this._options.singleSelectors.btnPrev,
        );

        this._domValidator.validate(this, childElements, {
            deck,
            btnPlay,
            btnPause,
            btnNext,
            btnPrev,
        });

        this._deck = deck;
        this._btnPlay = btnPlay;
        this._btnPause = btnPause;
        this._btnNext = btnNext;
        this._btnPrev = btnPrev;
    },

    _initProps() {
        this._player = new Audio();
        this._mainThemeSrc = this._options.mainThemeSrc || null;
        this._hasMainTheme = Boolean(this._mainThemeSrc);
        this._initMainTheme();
        this._initPreload();
        this._initData();
        this._currentAlbumIndex = 0;
        this._currentAudioTrackIndex = 0;
        this._mainThemePauseTimestamp = 0;

        const mainThemeResetPauseThreshold = Number(
            this._options.mainThemeResetPauseThreshold,
        );
        this._mainThemeResetPauseThreshold =
            mainThemeResetPauseThreshold > 0
                ? mainThemeResetPauseThreshold
                : this.constructor.MAIN_THEME_RESET_PAUSE_THRESHOLD;
    },

    _initMainTheme() {
        if (this._hasMainTheme) {
            this._player.src = this._mainThemeSrc;
        }
    },

    _initPreload() {
        if (this._hasMainTheme) {
            setTimeout(() => {
                this._player.preload = "none";
            }, 300);
        } else {
            this._player.preload = "none";
        }
    },

    _initData() {
        this._goaMasterpieces = this._options.playlist;
        this._validateData();
    },

    _initButtons() {
        this._button = new Button(
            this._options.classes.playerBtn,
            this._buttonManager,
            this._buttonManager.manage,
        );
    },

    _nextAudioTrack() {
        this._currentAudioTrackIndex++;
    },

    _prevAudioTrack() {
        this._currentAudioTrackIndex--;
    },

    _givenAudioTrack(index) {
        if (index < 0 || index >= this._getTotalAudioTracks()) {
            return false;
        }

        const oldIndex = this._currentAudioTrackIndex;
        this._currentAudioTrackIndex = index;
        return this._currentAudioTrackIndex !== oldIndex;
    },

    _setAlbum(index) {
        if (index < 0 || index >= this._getTotalAlbums()) {
            return false;
        }

        const oldIndex = this._currentAlbumIndex;
        this._currentAlbumIndex = index;
        this._currentAudioTrackIndex = 0;
        this._player.currentTime = 0;
        return this._currentAlbumIndex !== oldIndex;
    },

    _getTotalAudioTracks() {
        return this._goaMasterpieces[this._currentAlbumIndex].tracks.length;
    },

    _getTotalAlbums() {
        return this._goaMasterpieces.length;
    },

    _isAudioModeActive() {
        return this._deck.classList.contains(this._options.states.active);
    },

    _isMainThemeLoaded() {
        if (!this._hasMainTheme) return false;
        return this._player.src.includes(this._mainThemeSrc.substring(2));
    },

    _isNewAudioTrack(currentSrc) {
        return !currentSrc.includes(
            this._goaMasterpieces[this._currentAlbumIndex].tracks[
                this._currentAudioTrackIndex
            ].src.substring(2),
        );
    },

    _normaliseIndex(index, totalCount) {
        return (index + totalCount) % totalCount;
    },

    _tryResetMainThemeTime() {
        if (
            this._mainThemePauseTimestamp > 0 &&
            Date.now() - this._mainThemePauseTimestamp >
                this._mainThemeResetPauseThreshold
        ) {
            this._player.currentTime = 0;
        }
    },

    _toggleAudioMode(isActive) {
        this._deck.classList.toggle(this._options.states.active, isActive);
        this._btnPlay.tabIndex = isActive ? -1 : 0;
        this._btnPause.tabIndex = isActive ? 0 : -1;
        this._btnNext.tabIndex = isActive ? 0 : -1;
        this._btnPrev.tabIndex = isActive ? 0 : -1;
    },

    _hardReset() {
        if (this._hasMainTheme) {
            this._player.src = this._mainThemeSrc;
            this._mainThemePauseTimestamp = 0;
        }
        this._currentAlbumIndex = 0;
        this._currentAudioTrackIndex = 0;
        this._player.currentTime = 0;
    },

    _clickPlay(e) {
        // if (e.shiftKey && isAutoscrollOn) toggleAutoscrollMode();
        this.play();
    },

    _clickPause() {
        this.pause();
    },

    _clickNext() {
        this.nextAudioTrack();
    },

    _clickPrev() {
        this.prevAudioTrack();
    },

    _pressReset(e) {
        this.pause();
        if (helper.isOverrideKey(e)) {
            this._hardReset();
        }
        return e;
    },

    _validateData() {
        if (
            !Array.isArray(this._goaMasterpieces) ||
            this._goaMasterpieces.length === 0
        ) {
            throw new TypeError(
                `[AudioPlayer]: Dataset verification failed during core bootstrap\n` +
                    `The required "playlist" configuration array is missing, empty or malformed\n` +
                    `Ensure that a valid array containing album matrices is explicitly ` +
                    `passed into the AudioPlayer constructor\n` +
                    `Expected Configuration Format:\n` +
                    `  new AudioPlayer({\n` +
                    `      playlist: [\n` +
                    `          { tracks: [{ src: "./path/to/track1.mp3" }, { src: "./path/to/track2.mp3" }, { src: "./path/to/track3.mp3" }] },\n` +
                    `          { tracks: [{ src: "./other/path/to/track1.mp3" }, { src: "./other/path/to/track2.mp3" }, { src: "./other/path/to/track3.mp3" }] },\n` +
                    `          { tracks: [{ src: "./another/path/to/track1.mp3" }, { src: "./another/path/to/track2.mp3" }, { src: "./another/path/to/track3.mp3" }] }\n` +
                    `      ]\n` +
                    `  });\n`,
            );
        }
    },
};
