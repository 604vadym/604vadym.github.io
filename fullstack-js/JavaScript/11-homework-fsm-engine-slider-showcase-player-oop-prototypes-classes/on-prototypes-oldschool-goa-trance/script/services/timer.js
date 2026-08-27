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
        this._delay = Number(delay);

        this._assertBootstrapContract(
            bootstrapMethod,
            this._delay,
            delay,
            instance.constructor.name,
        );

        this._bootstrap = (currentDelay) =>
            bootstrapMethod.call(instance, currentDelay);
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

    _assertBootstrapContract(bootstrapMethod, delay, paramDelay, className) {
        if (typeof bootstrapMethod !== "function") {
            throw new TypeError(
                `[Timer]: Broken initBootstrap contract in "${className}"\n` +
                    `Expected a function for bootstrapMethod, received "${typeof bootstrapMethod}"`,
            );
        }

        if (!Number.isFinite(delay) || delay <= 0) {
            throw new TypeError(
                `[Timer]: Broken initBootstrap contract in "${className}"\n` +
                    `Valid positive number required for delay, received "${paramDelay}"`,
            );
        }
    },
};
