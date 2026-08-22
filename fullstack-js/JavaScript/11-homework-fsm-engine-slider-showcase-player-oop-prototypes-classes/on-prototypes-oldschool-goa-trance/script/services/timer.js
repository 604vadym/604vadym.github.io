"use strict";

export default function Timer(instance, action) {
    this._id = null;
    this._onTick = () => action.call(instance);
}

Timer.prototype = {
    constructor: Timer,

    start(delay) {
        this._kill();
        this._id = setInterval(() => this._tick(), delay);
    },

    stop() {
        this._kill();
    },

    _tick() {
        this._onTick();
    },

    _kill() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
        }
    },
};
