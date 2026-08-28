"use strict";

import DOMValidator from "../services/dom-validator.js";

export default function AudioPlayer(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(AudioPlayer),
        writable: false,
        configurable: false,
    });
}

Object.defineProperty(AudioPlayer, "MAIN_THEME_SRC", {
    value: "./assets/audio/asura/main-theme-rare-mix-preview.mp3",
    writable: false,
    configurable: false,
});

AudioPlayer.prototype = {
    constructor: AudioPlayer,

    init() {
        this._initDOMElements();
        this._initProps();
    },

    _initDOMElements(childElements) {
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
            btnNext,
            btnPrev,
            btnPlay,
            btnPause,
        });

        this._btnNext = btnNext;
        this._btnPrev = btnPrev;
    },

    _initProps() {
        this._currentAlbumIndex = 0;
        this._currentAudioTrackIndex = 0;
        this._player = new Audio();
        this._player.src = this.constructor.MAIN_THEME_SRC;
        setTimeout(() => {
            this._player.preload = "none";
        }, 300);
        this._initData();
    },

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
