"use strict";

import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(slider) {
    this._slider = slider;
}

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._slider.init();
    },
};
