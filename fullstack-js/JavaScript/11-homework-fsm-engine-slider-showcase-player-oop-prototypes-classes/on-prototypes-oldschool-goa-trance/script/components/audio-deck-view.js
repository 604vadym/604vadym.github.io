"use strict";

import DOMValidator from "../services/dom-validator.js";

export default function AudioDeckView(options) {
    this._options = options;

    Object.defineProperty(this, "_domValidator", {
        value: new DOMValidator(AudioDeckView),
        writable: false,
        configurable: false,
    });
}

AudioDeckView.prototype = {
    constructor: AudioDeckView,

    init() {
        this._initDOMElements();
    },

    _initDOMElements(childElements) {
        const audioTrackTitle = document.querySelector(
            this._options.singleSelectors.audioTrackTitle,
        );
        const progressBarCurrentTime = document.querySelector(
            this._options.singleSelectors.progressBarCurrentTime,
        );
        const progressBarFullTime = document.querySelector(
            this._options.singleSelectors.progressBarFullTime,
        );

        this._domValidator.validate(this, childElements, {
            audioTrackTitle,
            progressBarCurrentTime,
            progressBarFullTime,
        });

        this._audioTrackTitle = audioTrackTitle;
        this._progressBar = progressBarCurrentTime;
    },

    renderAudioTrackTitle(trackNumber, totalTracks, trackName) {
        this._audioTrackTitle.textContent = `${trackNumber.toString().padStart(2, `0`)} / ${totalTracks.toString().padStart(2, `0`)} • ${trackName}`;
    },

    renderTimeline(currentTime, duration) {
        if (!duration) {
            this._progressBar.style.width = "0";
            return;
        }

        this._progressBar.style.width = `${Math.round((currentTime / duration) * 100)}%`;
    },
};
