"use strict";

export default function DOMValidator(baseClass) {
    this._baseClass = baseClass.name;
}

DOMValidator.prototype = {
    constructor: DOMValidator,

    validate(instance, childElements, ...elements) {
        if (elements.length === 0) {
            throw new Error(
                `DOMValidator: base class [${this._baseClass}] must provide validation elements`,
            );
        }

        const className = instance.constructor.name;
        if (className !== this._baseClass && childElements === null) {
            throw new Error(
                `DOMValidator: subclass "${className}" must provide validation elements`,
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
            throw new Error(`DOMValidator: [${className}] validation failed`);
        }
    },
};

DOMValidator.isDOMElementsFound = function ({
    elements = null,
    collections = null,
} = {}) {
    if (!elements && !collections) {
        console.warn(
            `DOMValidator.isDOMElementsFound(): invalid function call`,
        );
    }

    if (elements) {
        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`DOM Error: element ${name} not found`);
                return false;
            }
        }
    }

    if (collections) {
        for (const [name, element] of Object.entries(collections)) {
            if (element.length === 0) {
                console.error(`DOM Error: elements ${name} not found`);
                return false;
            }
        }
    }

    return true;
};
