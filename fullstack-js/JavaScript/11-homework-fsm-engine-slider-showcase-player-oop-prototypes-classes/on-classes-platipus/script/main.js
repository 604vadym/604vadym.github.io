"use strict";

import ShowcaseApp from "./showcase-app.js";
import Slider from "./components/autoscroll-slider.js";
import AudioPlayer from "./components/audio-player.js";
import AudioDeckView from "./components/audio-deck-view.js";
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
        btnNext: ".slider__btn--next",
        btnPrev: ".slider__btn--prev",
        pagination: ".slider__pagination",
        btnAutoscrollOn: ".slider__btn--autoscroll-on",
        btnAutoscrollOff: ".slider__btn--autoscroll-off",
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
        autoscrolloff: ["ArrowUp", "KeyW"],
        execute: ["Enter"],
        toggleautoscroll: [" "],
        reset: ["Escape"],
        ignore: ["MediaPlayPause"],
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
        next: [
            "ArrowRight",
            "KeyD",
            "MediaTrackNext",
            "=",
            "+",
            "NumpadAdd",
            "BracketRight",
            "KeyN",
        ],
        prev: [
            "ArrowLeft",
            "KeyA",
            "MediaTrackPrevious",
            "_",
            "-",
            "NumpadSubtract",
            "BracketLeft",
            "KeyP",
        ],
        switchaudiotrack: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ")",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "(",
        ],
        play: ["ArrowUp", "KeyW"],
        pause: ["ArrowDown", "KeyS", "Pause"],
        playpause: ["MediaPlayPause"],
        restartaudiotrack: ["0", "Home"],
        restartalbum: ["Backspace"],
        execute: ["Enter"],
        toggleaudiomode: [" "],
        reset: ["Escape"],
    },

    mainThemeResetPauseThreshold: null,

    mainThemeSrc:
        "./assets/audio/main-theme-the-mystery-of-the-yeti-preview.mp3",

    playlist: [
        {
            tracks: [
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/01-lunar-sunrise-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/02-fire-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/03-the-scream-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/04-visions-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/05-the-poet-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/06-floating-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/07-the-snakecharmer-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/08-planet-ogo-preview.mp3",
                },
                {
                    src: "./assets/audio/terra-ferma/1997-turtle-crossing/09-crazy-people-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/quietman/1998-shhhh/01-now-and-zen-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/02-theme-from-terminus-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/03-propeller-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/04-the-sleeper-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/05-approach-and-identify-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/06-kalahari-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/07-plastic-gourd-preview.mp3",
                },
                {
                    src: "./assets/audio/quietman/1998-shhhh/08-evolution-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/01-kaleidoscope-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/02-mosquito-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/03-gloria-transparent-mix-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/04-haagen-daaz-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/05-octopus-original-mix-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/06-golden-rain-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/07-deeper-than-deep-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/08-blue-owl-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/09-emerald-eyes-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1996-wildlife-on-one/10-cambodia-tunnel-vision-mix-preview.mp3",
                },
            ],
        },
        {
            tracks: [
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/01-breathe-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/02-monsoon-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/03-the-hummer-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/04-madagascar-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/05-requiem-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/06-dud-uk-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/07-easter-island-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/08-stealth-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/09-panorama-preview.mp3",
                },
                {
                    src: "./assets/audio/art-of-trance/1999-voice-of-earth/10-voice-of-earth-preview.mp3",
                },
            ],
        },
    ],
});

const audioDeckView = new AudioDeckView({
    singleSelectors: {
        audioTrackTitle: ".slider__audio-track-title",
        progressBarCurrentTime: ".slider__audio-track-current-time",
        progressBarFullTime: ".slider__audio-track-full-time",
    },
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
            url: "https://platipusmusic.bandcamp.com/album/turtle-crossing-2",
        },
        {
            url: "https://platipusmusic.bandcamp.com/album/shhhh",
        },
        {
            url: "https://artoftrance.bandcamp.com/album/wildlife-on-one",
        },
        {
            url: "https://artoftrance.bandcamp.com/album/voice-of-earth",
        },
    ],
});

const app = new ShowcaseApp(slider, audioPlayer, audioDeckView, shop, {
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
        step: ["ArrowRight", "ArrowLeft", "KeyD", "KeyA"],
        switchaudiotrack: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            ")",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "(",
        ],
        execute: ["Enter"],
        toggle: [" "],

        escape: ["Escape"],
        checkplatformmodifiers: ["0", "Home", "Backspace"],
        ignore: ["PageDown", "PageUp", "End"],
        prevent: [
            "=",
            "+",
            "_",
            "-",
            "ArrowUp",
            "ArrowDown",
            "BracketRight",
            "BracketLeft",
            "NumpadAdd",
            "NumpadSubtract",
        ],
    },

    albums: [
        {
            artist: "Terra Ferma",
            title: "Turtle Crossing",
            year: 1997,
            tracks: [
                {
                    name: "Lunar Sunrise",
                },
                {
                    name: "Fire",
                },
                {
                    name: "The Scream",
                },
                {
                    name: "Visions",
                },
                {
                    name: "The Poet",
                },
                {
                    name: "Floating",
                },
                {
                    name: "The Snakecharmer",
                },
                {
                    name: "Planet Ogo",
                },
                {
                    name: "Crazy People",
                },
            ],
        },
        {
            artist: "Quietman",
            title: "Shhhh",
            year: 1998,
            tracks: [
                {
                    name: "Now & Zen",
                },
                {
                    name: "Theme from Terminus",
                },
                {
                    name: "Propeller",
                },
                {
                    name: "The Sleeper",
                },
                {
                    name: "Approach & Identify",
                },
                {
                    name: "Kalahari",
                },
                {
                    name: "Plastic Gourd",
                },
                {
                    name: "Evolution",
                },
            ],
        },
        {
            artist: "Art Of Trance",
            title: "Wildlife On One",
            year: 1996,
            tracks: [
                {
                    name: "Kaleidoscope",
                },
                {
                    name: "Mosquito",
                },
                {
                    name: "Gloria (Transparent Mix)",
                },
                {
                    name: "Haagen Daaz",
                },
                {
                    name: "Octopus (Original Mix)",
                },
                {
                    name: "Golden Rain",
                },
                {
                    name: "Deeper than Deep",
                },
                {
                    name: "Blue Owl",
                },
                {
                    name: "Emerald Eyes",
                },
                {
                    name: "Cambodia (Tunnel Vision Mix)",
                },
            ],
        },
        {
            artist: "Art Of Trance",
            title: "Voice Of Earth",
            year: 1999,
            tracks: [
                {
                    name: "Breathe",
                },
                {
                    name: "Monsoon",
                },
                {
                    name: "The Hummer",
                },
                {
                    name: "Madagascar",
                },
                {
                    name: "Requiem",
                },
                {
                    name: "Dud UK",
                },
                {
                    name: "Easter Island",
                },
                {
                    name: "Stealth",
                },
                {
                    name: "Panorama",
                },
                {
                    name: "Voice of Earth",
                },
            ],
        },
    ],
});

app.init();
