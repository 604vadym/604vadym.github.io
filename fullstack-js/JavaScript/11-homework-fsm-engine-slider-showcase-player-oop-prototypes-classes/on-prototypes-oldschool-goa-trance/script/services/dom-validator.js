"use strict";

export default function DOMValidator(baseClass) {
    this._baseClass = baseClass.name;
}

DOMValidator.prototype = {
    constructor: DOMValidator,

    validate(instance, childElements, ...elements) {
        if (elements.length === 0) {
            throw new Error(
                `[DOMValidator]: base class [${this._baseClass}] must provide validation elements`,
            );
        }

        const className = instance.constructor.name;
        const isPayloadEmpty =
            !childElements || Object.keys(childElements).length === 0;

        if (className !== this._baseClass && isPayloadEmpty) {
            throw new Error(
                `[DOMValidator]: validation payload is missing or empty\n` +
                    `subclass initiated the DOM verification process, but failed to provide any elements\n`,
            );
        }

        const DOMElements = {
            elements: {},
            collections: {},
        };

        const totalElements = Object.assign({}, childElements, ...elements);

        Object.entries(totalElements).forEach(([key, value]) => {
            if (!value || value instanceof Element) {
                DOMElements.elements[key] = value;
            } else {
                DOMElements.collections[key] = value;
            }
        });

        if (!DOMValidator.isDOMElementsFound(DOMElements)) {
            throw new Error(`[DOMValidator]: [${className}] validation failed`);
        }
    },
};

DOMValidator.isDOMElementsFound = function ({
    elements = null,
    collections = null,
} = {}) {
    if (!elements && !collections) {
        console.warn(
            `[DOMValidator.isDOMElementsFound()]: invalid function call`,
        );
        return false;
    }

    if (elements) {
        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.error(
                    `[DOMValidator.isDOMElementsFound()] DOM error: element ${name} not found`,
                );
                return false;
            }
        }
    }

    if (collections) {
        for (const [name, element] of Object.entries(collections)) {
            if (element.length === 0) {
                console.error(
                    `[DOMValidator.isDOMElementsFound()] DOM error: elements ${name} not found`,
                );
                return false;
            }
        }
    }

    return true;
};
