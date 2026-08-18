"use strict";

export default function EventManager() {
    this._eventTable = {};
}

EventManager.prototype = {
    constructor: EventManager,

    handleEvent(e) {
        const handle = this._eventTable[e.type];
        if (handle) handle(e);
    },

    createEventTable(instance) {
        let proto = Object.getPrototypeOf(instance);

        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            if (constructor.EVENT_MAP) {
                Object.entries(constructor.EVENT_MAP).forEach(
                    ([event, config]) => {
                        if (!this._eventTable[event]) {
                            this._eventTable[event] = (e) =>
                                config.handler.call(instance, e);
                        }
                    },
                );
            }
            proto = Object.getPrototypeOf(proto);
        }
    },

    initEventListeners(instance) {
        let proto = Object.getPrototypeOf(instance);

        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            if (constructor.EVENT_MAP) {
                Object.entries(constructor.EVENT_MAP).forEach(
                    ([event, config]) => {
                        config.target(instance).addEventListener(event, this);
                    },
                );
            }
            proto = Object.getPrototypeOf(proto);
        }
    },
};
