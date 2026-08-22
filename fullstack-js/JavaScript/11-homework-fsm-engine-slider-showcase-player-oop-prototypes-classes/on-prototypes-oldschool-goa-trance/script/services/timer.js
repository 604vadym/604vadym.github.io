"use strict";

export default function Timer(instance, action) {
    this._client = instance;
    this._onTick = action;
    this._id = null;
}

Timer.prototype = {
    constructor: Timer,

    start(delay) {
        this._kill();
        this._id = setInterval(this._tick.bind(this), delay);
    },

    stop() {
        this._kill();
    },

    _tick() {
        this._onTick.call(this._client);
    },

    _kill() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
        }
    },
};
