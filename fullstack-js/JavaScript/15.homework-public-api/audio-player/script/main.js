"use strict";

import { getArtistTracks } from "../../script/api.js";
import ShowcaseApp from "./showcase-app.js";
import Slider from "./components/autoscroll-slider.js";
import AudioPlayer from "./components/audio-player.js";
import AudioDeckView from "./components/audio-deck-view.js";
import Shop from "./components/shop.js";

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

    mainThemeSrc: null,

    playlist: [
        {
            tracks: [
                {
                    src: "",
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
            url: "",
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
            artist: "Artist",
            title: "Album",
            year: 2026,
            tracks: [
                {
                    name: "track name",
                },
            ],
        },
    ],
});

const params = new URLSearchParams(window.location.search);
const artisId = params.get("artistId");
getArtistTracks(artisId)
    .then(({ results }) => {
        const artistName = results[0].name;
        const tracks = results[0].tracks;
        console.log(artistName, tracks);
    })
    .catch((error) => console.log(error.message));

app.init();
