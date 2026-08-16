"use strict";

/*
 * JS #11. Розробка повнофункціонального слайдера на чистому JavaScript з використанням прототипів, класів та наслідування
 *
 * Опис завдання
 *
 * На цьому етапі курсу ви продовжите розробку слайдера, розпочату на попередньому занятті, із застосуванням більш складних концепцій програмування:
 *
 * Переписування коду з використанням прототипу та наслідування:Використовуйте вже розроблений код слайдера як основу.
 * Реорганізуйте код, застосовуючи прототипи для основних функцій слайдера та наслідування для розширення функціональності (наприклад, тач та перетягування мишею).
 * Динамічна генерація елементів управління через JavaScript:Відмовтеся від статичної верстки елементів управління в HTML.
 * Реалізуйте створення кнопок навігації та індикаторів слайдів динамічно через JavaScript.
 * Додавання налаштувань конфігурації слайдера:Розширте можливості вашого слайдера, додавши об'єкт конфігурації, який дозволить налаштовувати його поведінку (наприклад, інтервал автопрогортання, відображення індикаторів).
 * Розробка нової версії слайдера з використанням класів:Створіть альтернативну версію слайдера, яка використовує класи для організації коду.
 * Додайте у цій версії додаткові функції, такі як автоматична пауза при наведенні миші на слайдер.
 *
 * Вимоги до виконання:
 *
 * Ваше домашнє завдання має містити дві версії слайдера: на основі прототипів та класів.
 * Обидві версії повинні бути доступні в окремих гілках у вашому репозиторії на GitHub.
 * Подбайте про чітку документацію вашого коду та налаштувань конфігурації слайдера.
 * Переконайтеся, що ваш слайдер адаптований для роботи в різних браузерах та на різних пристроях.
 *
 */

function isDOMElementsFound({ elements = null, collections = null } = {}) {
    if (!elements && !collections) {
        console.warn(`isDOMElementsFound(): invalid function call`);
        return false;
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
}

function hasFinePointer() {
    return window.matchMedia("(pointer: fine)").matches;
}

function BaseSlider(options) {
    this._options = options;
    this._DOMValidator = {
        validate: (baseConfig, childConfig) => {
            if (this.constructor !== BaseSlider && childConfig === null) {
                throw new Error(
                    `DOMValidator: Sub-class "${this.constructor.name}" must provide a validation config`,
                );
            }

            if (!baseConfig) {
                throw new Error("DOMValidator: Validation config is required");
            }

            if (!isDOMElementsFound(baseConfig)) {
                throw new Error("DOMValidator: DOM elements validation failed");
            }
        },
    };
}

BaseSlider.prototype = {
    constructor: BaseSlider,

    init() {
        this._initDOMElements({ elements: {}, collections: {} });
        this._initProps();
        this._updateSlideWidth();
        this._initClickActionTable();
        this._initEventListeners();
    },

    _initDOMElements(childConfig = null) {
        this._slider = document.querySelector(
            this._options.singleSelectors.slider,
        );
        this._track = document.querySelector(
            this._options.singleSelectors.track,
        );
        this._slides = document.querySelectorAll(
            this._options.groupSelectors.slides,
        );

        // this._btnAutoscrollOn = document.querySelector(
        //     options.singleSelectors.btnAutoscrollOn,
        // );
        // this._btnAutoscrollOff = document.querySelector(
        //     options.singleSelectors.btnAutoscrollOff,
        // );
        // this._btnAudioNext = document.querySelector(
        //     options.singleSelectors.btnAudioNext,
        // );
        // this._btnAudioPrev = document.querySelector(
        //     options.singleSelectors.btnAudioPrev,
        // );
        // this._audioTrackTitle = document.querySelector(
        //     options.singleSelectors.audioTrackTitle,
        // );
        // this._audioTrackCurrentTime = document.querySelector(
        //     options.singleSelectors.audioTrackCurrentTime,
        // );
        // this._linkShop = document.querySelector(options.singleSelectors.linkShop);

        const safeChildConfig = childConfig || {
            elements: {},
            collections: {},
        };

        this._DOMValidator.validate(
            {
                elements: {
                    slider: this._slider,
                    track: this._track,
                    // btnAutoscrollOn: this._btnAutoscrollOn,
                    // btnAutoscrollOff: this._btnAutoscrollOff,
                    // btnAudioNext: this._btnAudioNext,
                    // btnAudioPrev: this._btnAudioPrev,
                    // audioTrackTitle: this._audioTrackTitle,
                    // audioTrackCurrentTime: this._audioTrackCurrentTime,
                    // linkShop: this._linkShop,

                    viewport: document.querySelector(
                        this._options.singleSelectors.viewport,
                    ),
                    btnNext: document.querySelector(
                        this._options.singleSelectors.btnNext,
                    ),
                    btnPrev: document.querySelector(
                        this._options.singleSelectors.btnPrev,
                    ),
                    // btnAudioPlay: document.querySelector(
                    //     options.singleSelectors.btnAudioPlay,
                    // ),
                    // btnAudioPause: document.querySelector(
                    //     options.singleSelectors.btnAudioPause,
                    // ),
                    // audioTrackFullTime: document.querySelector(
                    //     options.singleSelectors.audioTrackFullTime,
                    // ),

                    ...safeChildConfig.elements,
                },
                collections: {
                    slides: this._slides,

                    images: document.querySelectorAll(
                        this._options.groupSelectors.images,
                    ),

                    ...safeChildConfig.collections,
                },
            },

            childConfig,
        );
    },

    _initProps() {
        this._slidesCount = this._slides.length;
        this._trackTransition = this._track.style.transition;
        this._startIndex = 0;
        this._currentIndex = this._startIndex;
        this._slideWidth = 0;
        this._isMoving = false;
    },

    _initEventListeners() {
        this._slider.addEventListener("click", this);
        this._track.addEventListener("transitionend", this);
    },

    handleEvent(e) {
        switch (e.type) {
            case "click":
                this._handleClick(e);
                break;
            case "transitionend":
                this._handleTransitionEnd();
                break;
        }
    },

    _handleClick(e) {
        const button = e.target.closest(".button");
        if (!button || this._isMoving) return;

        const clickAction = this._getClickAction(button);

        clickAction?.action(button) && this._updateSlider();
    },

    _handleTransitionEnd() {
        this._isMoving = false;
    },

    _updateSlider() {
        this._isMoving = true;

        if (hasFinePointer()) {
            this._track.style.transform = `translateX(-${this._currentIndex * 100}%)`;
        } else {
            const offset = this._currentIndex * this._slideWidth;
            this._track.style.transform = `translateX(-${offset}px)`;
        }
    },

    _updateSlideWidth() {
        this._slideWidth = this._slides[0].getBoundingClientRect().width;
    },

    _normaliseIndex(index = null) {
        const sourceIndex = index !== null ? index : this._currentIndex;

        return (sourceIndex + this._slidesCount) % this._slidesCount;
    },

    _getClickAction(button) {
        const classList = button.classList;

        const actionIndex = this._clickActionTable.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1 ? this._clickActionTable[actionIndex] : null;
    },

    _nextSlide() {
        this._currentIndex = (this._currentIndex + 1) % this._slidesCount;
        return true;
    },

    _prevSlide() {
        this._currentIndex =
            (this._currentIndex - 1 + this._slidesCount) % this._slidesCount;
        return true;
    },

    _goToSlide(index) {
        const oldIndex = this._currentIndex;
        this._currentIndex = (index + this._slidesCount) % this._slidesCount;
        return this._currentIndex !== oldIndex;
    },

    _initClickActionTable() {
        this._clickActionTable = [
            {
                className: this._options.singleSelectors.btnNext.replace(
                    /^\./,
                    "",
                ),
                action: () => this._nextSlide(),
            },
            {
                className: this._options.singleSelectors.btnPrev.replace(
                    /^\./,
                    "",
                ),
                action: () => this._prevSlide(),
            },
        ];
    },
};

function PaginationSlider(options) {
    BaseSlider.call(this, options);
}

PaginationSlider.prototype = Object.create(BaseSlider.prototype);

PaginationSlider.prototype.constructor = PaginationSlider;

PaginationSlider.prototype.init = function () {
    BaseSlider.prototype.init.call(this);
    this._initPagination();
};

PaginationSlider.prototype._initDOMElements = function () {
    this._pagination = document.querySelector(
        this._options.singleSelectors.pagination,
    );
    BaseSlider.prototype._initDOMElements.call(this, {
        elements: {
            pagination: this._pagination,
        },
        collections: {},
    });
};

PaginationSlider.prototype._initClickActionTable = function () {
    BaseSlider.prototype._initClickActionTable.call(this);
    this._clickActionTable.push({
        className: this._options.paginationClasses.dot,
        action: (button) =>
            this._goToSlide(
                this._normaliseIndex(this._paginationDots.indexOf(button)),
            ),
    });
};

PaginationSlider.prototype._updateSlider = function () {
    BaseSlider.prototype._updateSlider.call(this);
    this._updatePagination();
};

PaginationSlider.prototype._updatePagination = function () {
    const activeDot = this._pagination.querySelector(
        `.${this._options.paginationClasses.active}`,
    );
    if (activeDot) {
        activeDot.classList.remove(this._options.paginationClasses.active);
    }
    this._paginationDots[this._normaliseIndex()].classList.add(
        this._options.paginationClasses.active,
    );
};

PaginationSlider.prototype._initPagination = function () {
    this._paginationDots = [];

    for (let i = 0; i < this._slidesCount; i++) {
        const dot = document.createElement("button");
        dot.classList.add(this._options.paginationClasses.button);
        dot.classList.add(this._options.paginationClasses.dot);
        this._paginationDots.push(this._pagination.appendChild(dot));
    }
    this._paginationDots[0].classList.add(
        this._options.paginationClasses.active,
    );
};

const slider = new PaginationSlider({
    singleSelectors: {
        slider: ".slider",
        track: ".slider__track",
        // btnAutoscrollOn: ".slider__btn--autoscroll-on",
        // btnAutoscrollOff: ".slider__btn--autoscroll-off",
        pagination: ".slider__pagination",
        // btnAudioNext: ".slider__btn-audio--next",
        // btnAudioPrev: ".slider__btn-audio--prev",
        // audioTrackTitle: ".slider__audio-track-title",
        // audioTrackCurrentTime: ".slider__audio-track-current-time",
        // linkShop: ".slider__link-shop",
        viewport: ".slider__viewport",
        btnNext: ".slider__btn--next",
        btnPrev: ".slider__btn--prev",
        // btnAudioPlay: ".slider__btn-audio--play",
        // btnAudioPause: ".slider__btn-audio--pause",
        // audioTrackFullTime: ".slider__audio-track-full-time",
    },

    groupSelectors: { slides: ".slider__slide", images: ".slider__image" },

    paginationClasses: {
        dot: "pagination__dot",
        active: "pagination__dot--active",
        button: "button",
    },
});

slider.init();
