"use strict";

export default function Timer() {
    this._id = null;
}

Timer.prototype = {
    constructor: Timer,

    tick(action, delay, instance) {
        this._id = setInterval(action.bind(instance), delay);
    },

    kill() {
        if (this._id) {
            clearInterval(this._id);
            this._id = null;
        }
    },
};
