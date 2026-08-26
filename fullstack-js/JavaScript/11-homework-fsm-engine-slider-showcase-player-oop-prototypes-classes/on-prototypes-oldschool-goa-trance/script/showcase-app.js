"use strict";

import EventManager from "./services/event-manager.js";

export default function ShowcaseApp(slider, shop) {
    this._slider = slider;
    this._shop = shop;
}

ShowcaseApp.prototype = {
    constructor: ShowcaseApp,

    init() {
        this._slider.init();
        this._shop.init();
    },
};
