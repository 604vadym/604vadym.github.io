"use strict";

export default function AudioPlayer(options) {
    this._options = options;
}

AudioPlayer.prototype = {
    constructor: AudioPlayer,

    init() {
        this._initDOMElements();
        this._initProps();
    },

    _initDOMElements(childElements) {},

    _initProps() {},
};
