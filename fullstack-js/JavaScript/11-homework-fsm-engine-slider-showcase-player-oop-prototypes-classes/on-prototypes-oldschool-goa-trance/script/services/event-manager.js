"use strict";

export default function EventManager() {}

EventManager.prototype = {
    constructor: EventManager,

    createEventTable(instance, baseMap = {}) {
        const eventTable = Object.assign({}, baseMap);
        let proto = Object.getPrototypeOf(instance);

        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            if (constructor.EVENT_MAP) {
                Object.entries(constructor.EVENT_MAP).forEach(
                    ([event, handler]) => {
                        if (!eventTable[event]) {
                            eventTable[event] = (e) =>
                                handler.call(instance, e);
                        }
                    },
                );
            }
            proto = Object.getPrototypeOf(proto);
        }

        return eventTable;
    },
};
