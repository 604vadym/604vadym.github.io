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

function Slider(options) {
    this._slider = document.querySelector(options.singleSelectors.slider);
    this._track = document.querySelector(options.singleSelectors.track);
    this._btnAutoscrollOn = document.querySelector(
        options.singleSelectors.btnAutoscrollOn,
    );
    this._btnAutoscrollOff = document.querySelector(
        options.singleSelectors.btnAutoscrollOff,
    );
    this._pagination = document.querySelector(
        options.singleSelectors.pagination,
    );
    this._btnAudioNext = document.querySelector(
        options.singleSelectors.btnAudioNext,
    );
    this._btnAudioPrev = document.querySelector(
        options.singleSelectors.btnAudioPrev,
    );
    this._audioTrackTitle = document.querySelector(
        options.singleSelectors.audioTrackTitle,
    );
    this._audioTrackCurrentTime = document.querySelector(
        options.singleSelectors.audioTrackCurrentTime,
    );
    this._linkShop = document.querySelector(options.singleSelectors.linkShop);
    this._slides = document.querySelectorAll(options.groupSelectors.slides);

    if (
        !isDOMElementsFound({
            elements: {
                slider: this._slider,
                track: this._track,
                btnAutoscrollOn: this._btnAutoscrollOn,
                btnAutoscrollOff: this._btnAutoscrollOff,
                pagination: this._pagination,
                btnAudioNext: this._btnAudioNext,
                btnAudioPrev: this._btnAudioPrev,
                audioTrackTitle: this._audioTrackTitle,
                audioTrackCurrentTime: this._audioTrackCurrentTime,
                linkShop: this._linkShop,

                viewport: document.querySelector(
                    options.singleSelectors.viewport,
                ),
                btnNext: document.querySelector(
                    options.singleSelectors.btnNext,
                ),
                btnPrev: document.querySelector(
                    options.singleSelectors.btnPrev,
                ),
                btnAudioPlay: document.querySelector(
                    options.singleSelectors.btnAudioPlay,
                ),
                btnAudioPause: document.querySelector(
                    options.singleSelectors.btnAudioPause,
                ),
                audioTrackFullTime: document.querySelector(
                    options.singleSelectors.audioTrackFullTime,
                ),
            },
            collections: {
                slides: this._slides,

                images: document.querySelectorAll(
                    options.groupSelectors.images,
                ),
            },
        })
    )
        throw new Error("DOM elements validation failed");
}

const slider = new Slider({
    singleSelectors: {
        slider: ".slider",
        track: ".slider__track",
        btnAutoscrollOn: ".slider__btn--autoscroll-on",
        btnAutoscrollOff: ".slider__btn--autoscroll-off",
        pagination: ".slider__pagination",
        btnAudioNext: ".slider__btn-audio--next",
        btnAudioPrev: ".slider__btn-audio--prev",
        audioTrackTitle: ".slider__audio-track-title",
        audioTrackCurrentTime: ".slider__audio-track-current-time",
        linkShop: ".slider__link-shop",
        viewport: ".slider__viewport",
        btnNext: ".slider__btn--next",
        btnPrev: ".slider__btn--prev",
        btnAudioPlay: ".slider__btn-audio--play",
        btnAudioPause: ".slider__btn-audio--pause",
        audioTrackFullTime: ".slider__audio-track-full-time",
    },

    groupSelectors: { slides: ".slider__slide", images: ".slider__image" },
});
