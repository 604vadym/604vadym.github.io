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

    subscribe(instance, eventMap) {
        if (!eventMap) return;

        const className = instance.constructor.name;

        try {
            this._assertEventMapContract(eventMap, className, instance);
        } catch (error) {
            console.warn(error);
        }

        Object.entries(eventMap).forEach(([event, eventConfig]) => {
            const [targetKey, handlerKey, optionsKey] =
                Object.keys(eventConfig);
            const target = eventConfig[targetKey];
            const handler = eventConfig[handlerKey];
            const options = eventConfig[optionsKey];

            const targetElement = target(instance);

            try {
                this._assertTargetElement(targetElement, event, className);
            } catch (error) {
                console.warn(error);
                return;
            }

            this._eventHandlerTable[event] = (e) => handler?.call(instance, e);
            targetElement.addEventListener(event, this, options);
        });
    },

    unsubscribe(instance, eventMap) {
        if (!eventMap) return;

        const className = instance.constructor.name;

        Object.entries(eventMap).forEach(([event, eventConfig]) => {
            const [targetKey, handlerKey, optionsKey] =
                Object.keys(eventConfig);
            const target = eventConfig[targetKey];
            const options = eventConfig[optionsKey];
            const targetElement = target(instance);

            try {
                this._assertTargetElement(targetElement, event, className);
            } catch (error) {
                console.warn(error);
                return;
            }

            targetElement.removeEventListener(event, this, options);
            delete this._eventHandlerTable[event];
        });
    },

    _initEventHandlerTable(client, eventMapKey) {
        let proto = Object.getPrototypeOf(client);

        this._assertEventMapKey(client, eventMapKey);

        this._eventHandlerTable = {};
        while (proto && proto.constructor !== Object) {
            const constructor = proto.constructor;
            const eventMap = constructor[eventMapKey];
            const className = constructor.name;

            if (eventMap) {
                this._assertEventMapContract(eventMap, className);

                Object.entries(eventMap).forEach(([event, eventConfig]) => {
                    const [targetKey, handlerKey, optionsKey] =
                        Object.keys(eventConfig);
                    const target = eventConfig[targetKey];
                    const handler = eventConfig[handlerKey];
                    const options = eventConfig[optionsKey];

                    if (!this._eventHandlerTable[event]) {
                        const targetElement = target(client);

                        this._assertTargetElement(
                            targetElement,
                            event,
                            className,
                        );

                        this._eventHandlerTable[event] = (e) =>
                            handler.call(client, e);

                        targetElement.addEventListener(event, this, options);
                    }
                });
            }
            proto = Object.getPrototypeOf(proto);
        }
    },

    _assertEventMapKey(client, eventMapKey) {
        if (
            !eventMapKey ||
            (typeof eventMapKey !== "string" && typeof eventMapKey !== "symbol")
        ) {
            throw new TypeError(
                `[EventManager]: Cannot initialise event handlers for class "${client.constructor.name}"\n` +
                    `The provided eventMapKey is invalid ("${eventMapKey}")\n` +
                    `Expecting a valid String or Symbol identifier`,
            );
        }
    },

    _assertEventMapContract(eventMap, className) {
        Object.entries(eventMap).forEach(([event, eventConfig]) => {
            const [targetKey, handlerKey] = Object.keys(eventConfig);
            const target = eventConfig[targetKey];
            const handler = eventConfig[handlerKey];

            if (typeof target !== "function" || typeof handler !== "function") {
                throw new TypeError(
                    `[EventManager]: Broken contract in "${className}"\n` +
                        `Event "${event}" must provide valid functions`,
                );
            }
        });
    },

    _assertTargetElement(targetElement, event, className) {
        if (!targetElement) {
            throw new Error(
                `[EventManager]: Target element missing\n` +
                    `Class "${className}" failed to resolve target element for event "${event}"`,
            );
        }
    },
};
