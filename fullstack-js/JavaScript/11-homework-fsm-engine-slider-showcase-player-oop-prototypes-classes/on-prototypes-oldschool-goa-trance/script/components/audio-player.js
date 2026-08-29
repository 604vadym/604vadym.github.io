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

    _initButton() {
        this._button = new Button(
            this._options.classes.playerBtn,
            this._buttonManager,
        );
    },

    _clickPlay() {},

    _clickPause() {},

    _clickNext() {},

    _clickPrev() {},

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
