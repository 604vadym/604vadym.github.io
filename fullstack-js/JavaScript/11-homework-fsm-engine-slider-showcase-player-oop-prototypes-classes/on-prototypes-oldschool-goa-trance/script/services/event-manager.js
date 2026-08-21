"use strict";

export default function EventManager() {}

EventManager.prototype = {
    constructor: EventManager,

    init(instance, eventMapKey) {
        this._initEventHandlerTable(instance, eventMapKey);
    },

    handleEvent(e) {
        const handle = this._eventHandlerTable[e.type];

        if (handle) handle(e);
    },

    _initEventHandlerTable(instance, eventMapKey) {
        let proto = Object.getPrototypeOf(instance);

        this._eventHandlerTable = {};
        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            const eventMap = constructor[eventMapKey];
            const className = constructor.name;

            if (eventMap) {
                this._assertEventMapContract(eventMap, className, instance);

                Object.entries(eventMap).forEach(([event, eventConfig]) => {
                    const [targetKey, handlerKey] = Object.keys(eventConfig);
                    const target = eventConfig[targetKey];
                    const handler = eventConfig[handlerKey];

                    if (!this._eventHandlerTable[event]) {
                        const targetElement = target(instance);

                        this._assertTargetElement(
                            targetElement,
                            event,
                            className,
                        );

                        this._eventHandlerTable[event] = (e) =>
                            handler.call(instance, e);

                        targetElement.addEventListener(event, this);
                    }
                });
            }
            proto = Object.getPrototypeOf(proto);
        }
    },

    _assertEventMapContract(eventMap, className, instance) {
        Object.entries(eventMap).forEach(([event, eventConfig]) => {
            const [targetKey, handlerKey] = Object.keys(eventConfig);
            const target = eventConfig[targetKey];
            const handler = eventConfig[handlerKey];

            if (typeof target !== "function" || typeof handler !== "function") {
                throw new TypeError(
                    `[EventManager]: broken contract in "${className}"\n` +
                        `event "${event}" must provide valid functions`,
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
