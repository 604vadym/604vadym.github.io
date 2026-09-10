"use strict";

import DOMValidator from "../services/dom-validator.js";

export default class AudioDeckView {
    constructor(options) {
        this._options = options;
        this._domValidator = new DOMValidator(AudioDeckView);
    }

    init() {
        this._initDOMElements();
    }

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
    }

    renderAudioTrackTitle(trackNumber, totalTracks, trackName) {
        this._audioTrackTitle.textContent = `${trackNumber.toString().padStart(2, `0`)} / ${totalTracks.toString().padStart(2, `0`)} • ${trackName}`;
    }

    renderTimeline(currentTime, duration) {
        if (!duration) {
            this._progressBar.style.width = "0";
            return;
        }

        this._progressBar.style.width = `${Math.round((currentTime / duration) * 100)}%`;
    }
}
