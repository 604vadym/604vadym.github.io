"use strict";

export default function Timer(instance, action) {
    this._id = null;
    this._delay = null;
    this._bootstrap = null;
    this._onTick = () => action.call(instance);
}

Timer.prototype = {
    constructor: Timer,

    start(delay) {
        this._kill();
        this._id = setInterval(() => this._tick(delay), delay);
    },

    stop() {
        this._kill();
    },

    initBootstrap(instance, bootstrapMethod, delay) {
        this._delay = delay;
        if (instance && bootstrapMethod) {
            this._bootstrap = (currentDelay) =>
                bootstrapMethod.call(instance, currentDelay);
        }
    },

    _tick(delay) {
        this._onTick();
        if (this._bootstrap && delay !== this._delay) {
            this._bootstrap(this._delay);
        }
    },

    _kill() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
        }
    },
};
