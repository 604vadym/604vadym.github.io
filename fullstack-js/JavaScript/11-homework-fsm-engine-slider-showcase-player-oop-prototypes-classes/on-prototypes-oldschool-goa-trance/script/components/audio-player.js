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

AudioPlayer.STATES = Object.freeze({
    ALBUM: "ALBUM",
    THEME: "THEME",
    ALBUMTHEME: "ALBUMTHEME",
    IDLE: "IDLE",
});

const STATES = AudioPlayer.STATES;

AudioPlayer.prototype = {
    constructor: AudioPlayer,

    get element() {
        return this._deck;
    },

    get audioTrackInQueue() {
        return this._audioTrackInQueue;
    },

    set audioTrackInQueue(index) {
        if (
            !Number.isFinite(index) ||
            index < 0 ||
            index >= this._getTotalAudioTracks()
        )
            return;
        this._audioTrackInQueue = index;
    },

    get state() {
        return this.__state;
    },

    set _state(stateKey) {
        const state = this.constructor.STATES[stateKey];

        if (!state) {
            throw new TypeError(
                `[FSM AudioPlayer]: Invalid state transition token "${stateKey}"`,
            );
        }

        if (state === STATES.ALBUM && this.__state === STATES.THEME) {
            this.__state = STATES.ALBUMTHEME;
            return;
        }

        if (state === STATES.IDLE && this.__state === STATES.ALBUMTHEME) {
            this.__state = STATES.THEME;
            return;
        }

        this.__state = state;
    },

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
        if (this.state === STATES.ALBUM) return;
        this._onPlayAlbum();
        this._state = STATES.ALBUM;
        this._playAudio("album");
    },

    playTheme() {
        if (this.state !== STATES.IDLE) return;
        this._state = STATES.THEME;
        this._playAudio("theme");
    },

    pause() {
        if (this.state === STATES.IDLE) return;
        if (this.isAlbumPlaying()) {
            this._onPauseAlbum();
        }
        this._state = STATES.IDLE;
        this._pauseAudio();
    },

    toggle() {
        if (this.state === STATES.IDLE) {
            this.play();
            return true;
        } else if (this.isAlbumPlaying()) {
            this.pause();
            return false;
        }
    },

    nextAudioTrack() {
        this._currentAudioTrackIndex++;
        this._tryPlayAudio();
    },

    prevAudioTrack() {
        this._currentAudioTrackIndex--;
        this._tryPlayAudio();
    },

    switchAudioTrack(index) {
        if (!Number.isFinite(index)) {
            return false;
        }

        const isTrackChanged = this._setAudioTrack(index);
        if (isTrackChanged) {
            this._tryPlayAudio();
        }
        return isTrackChanged;
    },

    restartAudioTrack() {
        this.rewindAudioTrack();
        if (this.state === STATES.IDLE) {
            this.play();
        }
    },

    rewindAudioTrack() {
        this._player.currentTime = 0;
    },

    stopAudioTrack() {
        this.pause();
        this.rewindAudioTrack();
    },

    nextAlbum() {
        this._currentAlbumIndex++;
        this._setAlbum(this._currentAlbumIndex);
        this._tryPlayAudio();
    },

    prevAlbum() {
        this._currentAlbumIndex--;
        this._setAlbum(this._currentAlbumIndex);
        this._tryPlayAudio();
    },

    switchAlbum(index) {
        if (!Number.isFinite(index)) {
            return false;
        }

        const isAlbumChanged = this._setAlbum(index);
        if (isAlbumChanged) {
            this._tryPlayAudio();
        }
        return isAlbumChanged;
    },

    restartAlbum() {
        this.rewindAlbum();
        this.restartAudioTrack();
    },

    rewindAlbum() {
        this._currentAudioTrackIndex = 0;
        this.rewindAudioTrack();
        this._tryPlayAudio();
    },

    stopAlbum() {
        this._currentAudioTrackIndex = 0;
        this.stopAudioTrack();
    },

    restartPlaylist() {
        this._currentAlbumIndex = 0;
        this.restartAlbum();
    },

    rewindPlaylist() {
        this._currentAudioTrackIndex = 0;
        this.rewindAlbum();
    },

    stopPlaylist() {
        this._currentAlbumIndex = 0;
        this.stopAlbum();
    },

    resetTheme() {
        if (this.state === STATES.ALBUMTHEME) {
            this._state = "ALBUM";
        } else if (this.state === STATES.THEME) {
            this.pause();
        }
    },

    toggleTabIndex(isActive) {
        this._btnPlay.tabIndex = isActive ? -1 : 0;
        this._btnPause.tabIndex = isActive ? 0 : -1;
        this._btnNext.tabIndex = isActive ? 0 : -1;
        this._btnPrev.tabIndex = isActive ? 0 : -1;
    },

    isAlbumPlaying() {
        return this.state === STATES.ALBUM || this.state === STATES.ALBUMTHEME;
    },

    handleClick(e) {
        return this._button.execute(e);
    },

    handleAuxClick(e) {
        return this.toggle() ? false : e;
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
        this._initMediaSession();
        this._state = STATES.IDLE;
        this._currentAlbumIndex = 0;
        this._currentAudioTrackIndex = 0;
        this._mainThemePauseTimestamp = 0;
        this._audioTrackInQueue = null;

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

    _initMediaSession() {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => {});
            navigator.mediaSession.setActionHandler("pause", () => {});
        }
    },

    _initButtons() {
        this._button = new Button(
            this._options.classes.playerBtn,
            this._buttonManager,
            this._buttonManager.manage,
        );
    },

    _onPlayAlbum() {
        const e = new Event("albumplay", { bubbles: true });
        this._deck.dispatchEvent(e);
    },

    _onPauseAlbum() {
        const e = new Event("albumpause", { bubbles: true });
        this._deck.dispatchEvent(e);
    },

    _onPlayAlbumPassthrough() {
        const e = new Event("albumplaypassthrough", { bubbles: true });
        this._deck.dispatchEvent(e);
    },

    _onAlbumEnded() {
        const e = new CustomEvent("albumend", {
            detail: {
                index: this._normaliseIndex(
                    this._currentAlbumIndex + 1,
                    this._getTotalAlbums(),
                ),
            },
            bubbles: true,
            cancelable: true,
        });
        this._deck.dispatchEvent(e);
        return e.defaultPrevented;
    },

    _onAudioTrackChanged() {
        const trackIndex = this._currentAudioTrackIndex;
        const albumIndex = this._currentAlbumIndex;
        const totalTracks =
            this._goaMasterpieces[this._currentAlbumIndex].tracks.length;

        const e = new CustomEvent("audiotrackchange", {
            detail: {
                trackIndex,
                albumIndex,
                totalTracks,
            },
            bubbles: true,
        });
        this._deck.dispatchEvent(e);
    },

    _onTimeChanged() {
        const e = new CustomEvent("timechange", {
            detail: {
                currentTime: this._player.currentTime,
                duration: this._player.duration,
            },
            bubbles: true,
        });
        this._deck.dispatchEvent(e);
    },

    _tryPlayAudio() {
        if (this.isAlbumPlaying()) {
            this._playAudio("album");
        }
    },

    _tryPlayTheme() {
        if (this.state === STATES.THEME) {
            this._playAudio("theme");
            return true;
        }
        return false;
    },

    _playAudio(context) {
        if (context === "theme") {
            if (this._hasMainTheme) {
                if (!this._isMainThemeLoaded()) {
                    this._player.src = this._mainThemeSrc;
                }
                this._tryResetMainThemeTime();
                this._player.play().catch(() => {});
            }
            return;
        }

        if (context === "album") {
            if (this._isNewAudioTrack(this._player.src)) {
                this._onAudioTrackChanged();
                const currentAlbum =
                    this._goaMasterpieces[this._currentAlbumIndex];
                this._player.src =
                    currentAlbum.tracks[this._currentAudioTrackIndex].src;
            }
            this._player.play().catch(() => {});
        }
    },

    _pauseAudio() {
        if (this._isAudioPlaying()) {
            if (this._isMainThemeLoaded()) {
                this._mainThemePauseTimestamp = Date.now();
            }
            this._player.pause();
        }
    },

    _setAudioTrack(index) {
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

        if (!this._isAudioPlaying()) {
            this.rewindAudioTrack();
        }
        this._currentAudioTrackIndex = 0;
        const oldIndex = this._currentAlbumIndex;
        this._currentAlbumIndex = index;
        return this._currentAlbumIndex !== oldIndex;
    },

    _getTotalAudioTracks() {
        return this._goaMasterpieces[this._currentAlbumIndex].tracks.length;
    },

    _getTotalAlbums() {
        return this._goaMasterpieces.length;
    },

    _isAudioPlaying() {
        return Boolean(this._player.src) && !this._player.paused;
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
            this.rewindAudioTrack();
        }
    },

    _hardReset() {
        if (this._hasMainTheme) {
            this._player.src = this._mainThemeSrc;
            this._mainThemePauseTimestamp = 0;
        } else {
            this._player.src = "";
        }
        this.stopPlaylist();
    },

    _clickPlay(button, e) {
        this.play();
        if (helper.isPassthroughKey(e)) {
            this._onPlayAlbumPassthrough();
        }
    },

    _clickPause() {
        this.pause();
        this._tryPlayTheme();
    },

    _clickNext() {
        this.nextAudioTrack();
    },

    _clickPrev() {
        this.prevAudioTrack();
    },

    _pressNext(e) {
        if (this.isAlbumPlaying()) {
            this.nextAudioTrack();
            return false;
        }
        return e;
    },

    _pressPrev(e) {
        if (this.isAlbumPlaying()) {
            this.prevAudioTrack();
            return false;
        }
        return e;
    },

    _pressSwitchaudiotrack(e) {
        if (this.audioTrackInQueue !== null) {
            const isSwitched = this.switchAudioTrack(this.audioTrackInQueue);
            this._audioTrackInQueue = null;
            if (isSwitched) return false;
        }
        return e;
    },

    _pressPlay(e) {
        if (!this.isAlbumPlaying()) {
            this.play();
        }
        return false;
    },

    _pressPause(e) {
        if (this.isAlbumPlaying()) {
            this.pause();
            if (this._tryPlayTheme()) {
                return false;
            }
        }
        return e;
    },

    _pressPlaypause(e) {
        if (this.isAlbumPlaying()) {
            this.pause();
            if (this._tryPlayTheme()) {
                return false;
            }
        } else {
            this.play();
            return false;
        }
        return e;
    },

    _pressRestartaudiotrack(e) {
        if (this.isAlbumPlaying()) {
            this.restartAudioTrack();
            return false;
        }
        return e;
    },

    _pressRestartalbum(e) {
        if (this.isAlbumPlaying()) {
            this.restartAlbum();
            return false;
        }
        return e;
    },

    _pressExecute(e) {
        if (!this._button.isActive()) return e;
        return true;
    },

    _pressToggleaudiomode(e) {
        if (helper.isPassthroughKey(e)) {
            if (this.state !== STATES.ALBUM) {
                this.play();
            } else {
                this.pause();
            }
            return e;
        }
        if (this.state === STATES.ALBUM) {
            return false;
        }
        return e;
    },

    _pressReset(e) {
        if (helper.isOverrideKey(e)) {
            this._hardReset();
        } else {
            this.pause();
        }
        return e;
    },

    _handleEnded() {
        if (this.state === STATES.THEME) {
            this._playAudio("theme");
            return;
        }

        if (this._currentAudioTrackIndex === this._getTotalAudioTracks() - 1) {
            if (!this._onAlbumEnded()) {
                this.nextAlbum();
            }
        } else {
            this.nextAudioTrack();
        }
    },

    _handleTimeUpdate() {
        if (!this._player.duration || isNaN(this._player.duration)) return;
        this._onTimeChanged();
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

AudioPlayer[AudioPlayer.EVENT_MAP_KEY] = {
    ended: {
        target: (instance) => instance._player,
        handler: AudioPlayer.prototype._handleEnded,
    },
    timeupdate: {
        target: (instance) => instance._player,
        handler: AudioPlayer.prototype._handleTimeUpdate,
    },
};
