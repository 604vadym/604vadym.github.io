"use strict";

import Slider from "./components/draggable-slider.js";

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

const slider = new Slider({
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

    classes: {
        button: "button",
        paginationDot: "pagination__dot",
        track: "slider__track",
    },

    classesActive: {
        paginationDot: "pagination__dot--active",
    },

    jsClasses: {
        keyboardPressBtn: "js-pressed-target",
    },

    states: {
        keyboardBtnPressed: "is-pressed",
    },

    click: {
        next: "slider__btn--next",
        prev: "slider__btn--prev",
        goto: "pagination__dot",
    },

    press: {
        next: ["ArrowRight", "KeyD"],
        prev: ["ArrowLeft", "KeyA"],
        execute: ["Enter"],
        reset: ["Escape"],
        ignore: ["PageDown", "PageUp", "End"],
    },
});

slider.init();
