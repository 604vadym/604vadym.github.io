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
                    ([event, handler]) => {
                        if (!this._eventTable[event]) {
                            this._eventTable[event] = (e) =>
                                handler.call(instance, e);
                        }
                    },
                );
            }
            proto = Object.getPrototypeOf(proto);
        }
    },
};
