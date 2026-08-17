"use strict";

export default function DOMValidator(baseClass) {
    this._baseClass = baseClass.name;
}

DOMValidator.prototype = {
    constructor: DOMValidator,

    validate(config, childConfig, instance) {
        const className = instance.constructor.name;
        if (className !== this._baseClass && childConfig === null) {
            throw new Error(
                `DOMValidator: subclass "${className}" must provide validation config`,
            );
        }

        if (!config) {
            throw new Error(
                `DOMValidator: base class [${className}] must provide validation config`,
            );
        }

        if (!DOMValidator.isDOMElementsFound(config)) {
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
