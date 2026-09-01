"use strict";

import ShowcaseApp from "./showcase-app.js";
import Slider from "./components/autoscroll-slider.js";
import AudioPlayer from "./components/audio-player.js";
import Shop from "./components/shop.js";

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
        viewport: ".slider__viewport",
        // audioTrackTitle: ".slider__audio-track-title",
        // audioTrackCurrentTime: ".slider__audio-track-current-time",
        btnNext: ".slider__btn--next",
        btnPrev: ".slider__btn--prev",
        pagination: ".slider__pagination",
        btnAutoscrollOn: ".slider__btn--autoscroll-on",
        btnAutoscrollOff: ".slider__btn--autoscroll-off",
        // audioTrackFullTime: ".slider__audio-track-full-time",
    },

    groupSelectors: { slides: ".slider__slide", images: ".slider__image" },

    classes: {
        track: "slider__track",
        button: "button",
        sliderBtn: "slider__btn",
        paginationDot: "pagination__dot",
        btnAutoscrollOff: "slider__btn--autoscroll-off",
    },

    classesActive: {
        paginationDot: "pagination__dot--active",
    },

    jsClasses: {
        autoscrollPause: "js-autoscroll-pause",
        dynamicFocus: "js-dynamic-focus",
    },

    states: {
        resizing: "slider--resizing",
    },

    click: {
        next: "slider__btn--next",
        prev: "slider__btn--prev",
        goto: "pagination__dot",
        autoscrollon: "slider__btn--autoscroll-on",
        autoscrolloff: "slider__btn--autoscroll-off",
    },

    press: {
        next: ["ArrowRight", "KeyD"],
        prev: ["ArrowLeft", "KeyA"],
        up: ["ArrowUp", "KeyW"],
        execute: ["Enter"],
        toggleautoscroll: [" "],
        reset: ["Escape"],
    },

    autoplay: false,
    autoscrollDelay: null,
    autoscrollWakeUpDelay: null,

    slideTriggerThresholdCoef: null,
});

const audioPlayer = new AudioPlayer({
    singleSelectors: {
        deck: ".showcase",
        btnPlay: ".slider__btn-audio--play",
        btnPause: ".slider__btn-audio--pause",
        btnNext: ".slider__btn-audio--next",
        btnPrev: ".slider__btn-audio--prev",
    },

    classes: {
        playerBtn: "slider__btn-audio",
    },

    click: {
        play: "slider__btn-audio--play",
        pause: "slider__btn-audio--pause",
        next: "slider__btn-audio--next",
        prev: "slider__btn-audio--prev",
    },

    press: {
        next: ["ArrowRight", "KeyD"],
        prev: ["ArrowLeft", "KeyA"],
        up: ["ArrowUp", "KeyW"],
        restartaudiotrack: ["0"],
        restartalbum: ["Backspace"],
        toggleaudiomode: [" "],
        reset: ["Escape"],
    },

    mainThemeResetPauseThreshold: null,

    mainThemeSrc: "./assets/audio/asura/main-theme-rare-mix-preview.mp3",

    playlist: [
        {
            tracks: [
                {
                    src: "./assets/audio/asura/2000-code-eternity/01-like-a-summer-day-preview.mp3",
                },
                {
                    src: "./assets/audio/asura/2000-code-eternity/02-trinity-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/asura/2003-lost-eden/01-lost-eden-preview.mp3",
                },
                {
                    src: "./assets/audio/asura/2003-lost-eden/02-from-the-abyss-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/asura/2007-life-squared/01-golgotha-preview.mp3",
                },
                {
                    src: "./assets/audio/asura/2007-life-squared/02-back-to-light-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/asura/2010-360/01-el-hai-preview.mp3",
                },
                {
                    src: "./assets/audio/asura/2010-360/02-regenesis-preview.mp3",
                },
            ],
        },
    ],
});

const shop = new Shop({
    singleSelectors: {
        link: ".slider__link-shop",
    },

    press: {
        execute: ["Enter"],
    },

    defaultUrl: null,

    data: [
        {
            url: "https://ultimae.bandcamp.com/album/code-eternity",
        },
        {
            url: "https://www.discogs.com/sell/release/419254",
        },
        {
            url: "https://ultimae.bandcamp.com/album/life",
        },
        {
            url: "https://ultimae.bandcamp.com/album/360",
        },
    ],
});

const app = new ShowcaseApp(slider, audioPlayer, shop, {
    singleSelectors: {
        app: ".showcase",
    },

    classes: {
        app: "showcase",
        button: "button",
        linkShop: "slider__link-shop",
    },

    jsClasses: {
        keyboardPressBtn: "js-pressed-target",
        btnNoActive: "js-no-active",
    },

    states: {
        autoscrollActive: "slider--autoscroll-on",
        audioActive: "slider--audio-play",
        keyboardBtnPressed: "is-pressed",
    },

    press: {
        next: ["ArrowRight", "KeyD"],
        prev: ["ArrowLeft", "KeyA"],
        up: ["ArrowUp", "KeyW"],
        execute: ["Enter"],
        toggle: [" "],
        reset: ["Escape"],
        ignore: ["PageDown", "PageUp", "End"],
    },
});

app.init();
