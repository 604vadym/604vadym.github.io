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

    init(instance) {
        let proto = Object.getPrototypeOf(instance);

        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            if (constructor.EVENT_MAP) {
                this._assertEventMapContract(
                    constructor.EVENT_MAP,
                    constructor.name,
                );

                Object.entries(constructor.EVENT_MAP).forEach(
                    ([event, { target, handler }]) => {
                        if (!this._eventTable[event]) {
                            const targetElement = target(instance);

                            this._assertTargetElement(
                                targetElement,
                                event,
                                constructor.name,
                            );

                            this._eventTable[event] = (e) =>
                                handler.call(instance, e);

                            targetElement.addEventListener(event, this);
                        }
                    },
                );
            }
            proto = Object.getPrototypeOf(proto);
        }
    },

    _assertEventMapContract(eventMap, className) {
        Object.entries(eventMap).forEach(([event, { target, handler }]) => {
            if (typeof target !== "function" || typeof handler !== "function") {
                throw new Error(
                    `EventManager: broken contract in "${className}"\n` +
                        `event "${event}" must provide valid execution functions`,
                );
            }
        });
    },

    _assertTargetElement(targetElement, event, className) {
        if (!targetElement) {
            throw new Error(
                `EventManager: target element missing\n` +
                    `class "${className}" failed to resolve target element for event "${event}"`,
            );
        }
    },
};
