"use strict";

export default function EventManager() {}

EventManager.prototype = {
    constructor: EventManager,

    init(instance, eventMapKey, targetKey, handlerKey) {
        this._initEventTable(instance, eventMapKey, targetKey, handlerKey);
    },

    handleEvent(e) {
        const handle = this._eventTable[e.type];
        if (handle) handle(e);
    },

    _initEventTable(instance, eventMapKey, targetKey, handlerKey) {
        let proto = Object.getPrototypeOf(instance);

        this._eventTable = {};
        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            const eventMap = constructor[eventMapKey];
            const className = constructor.name;

            if (eventMap) {
                this._assertEventMapContract(
                    eventMap,
                    targetKey,
                    handlerKey,
                    className,
                    instance,
                );

                Object.entries(eventMap).forEach(([event, eventConfig]) => {
                    const target = eventConfig[targetKey];
                    const handler = eventConfig[handlerKey];
                    if (!this._eventTable[event]) {
                        const targetElement = target(instance);

                        this._assertTargetElement(
                            targetElement,
                            event,
                            className,
                        );

                        this._eventTable[event] = (e) =>
                            handler.call(instance, e);

                        targetElement.addEventListener(event, this);
                    }
                });
            }
            proto = Object.getPrototypeOf(proto);
        }
    },

    _assertEventMapContract(
        eventMap,
        targetKey,
        handlerKey,
        className,
        instance,
    ) {
        Object.entries(eventMap).forEach(([event, eventConfig]) => {
            const target = eventConfig[targetKey];
            const handler = eventConfig[handlerKey];
            const targetElement =
                typeof target === "function" ? target(instance) : null;

            if (targetElement) {
                const isEventSupported = `on${event}` in targetElement;
                if (!isEventSupported) {
                    throw new TypeError(
                        `[EventManager]: invalid or unsupported event "${event}" in "${className}"\n` +
                            `target element does not support this event`,
                    );
                }
            }

            if (typeof target !== "function" || typeof handler !== "function") {
                throw new TypeError(
                    `[EventManager]: broken contract in "${className}"\n` +
                        `event "${event}" must provide valid "${targetKey}" and "${handlerKey}" functions`,
                );
            }
        });
    },

    _assertTargetElement(targetElement, event, className) {
        if (!targetElement) {
            throw new Error(
                `[EventManager]: target element missing\n` +
                    `class "${className}" failed to resolve target element for event "${event}"`,
            );
        }
    },
};
