"use strict";

import { getArtistTracks } from "../../script/api.js";
import ShowcaseApp from "./showcase-app.js";
import Slider from "./components/autoscroll-slider.js";
import AudioPlayer from "./components/audio-player.js";
import AudioDeckView from "./components/audio-deck-view.js";
import Shop from "./components/shop.js";

const albumsData = [];
const playlistData = [];
const shopData = [];
const sliderTrack = document.querySelector(".slider__track");
const params = new URLSearchParams(window.location.search);
const artistId = params.get("artistId");
const shareUrl = params.get("shareurl");

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

    playlist: playlistData,
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

    data: shopData,
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

    albums: albumsData,
});

getArtistTracks(artistId)
    .then(({ results }) => {
        const artistName = results[0].name;
        const tracks = results[0].tracks;

        tracks.sort((a, b) => {
            return (
                new Date(a.releasedate).getTime() -
                new Date(b.releasedate).getTime()
            );
        });

        tracks.forEach((track) => {
            const albumIndex = albumsData.findIndex(
                (data) => data.title === track.album_name,
            );

            if (albumIndex === -1) {
                const albumReleaseYear = parseInt(track.releasedate, 10);

                albumsData.push({
                    artist: artistName,
                    title: track.album_name,
                    year: albumReleaseYear,
                    tracks: [
                        {
                            name: track.name,
                        },
                    ],
                });

                playlistData.push({
                    tracks: [
                        {
                            src: track.audio,
                        },
                    ],
                });

                shopData.push({
                    url: shareUrl,
                });

                const sliderSlide = document.createElement("div");
                const sliderImg = document.createElement("div");
                const img = document.createElement("img");

                sliderSlide.classList.add("slider__slide");
                sliderImg.classList.add("image", "slider__image");
                img.classList.add("image__img");

                img.src = track.album_image;
                img.alt = `${artistName} - ${track.album_name} (${albumReleaseYear})`;

                sliderImg.append(img);
                sliderSlide.append(sliderImg);
                sliderTrack.append(sliderSlide);

                return;
            }

            albumsData[albumIndex].tracks.push({ name: track.name });
            playlistData[albumIndex].tracks.push({ src: track.audio });
        });

        app.init();
    })
    .catch((error) => console.error(error.message));
