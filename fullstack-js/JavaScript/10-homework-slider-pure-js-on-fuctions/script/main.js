"use strict";

console.log(
    "JS #10. Розробка повнофункціонального слайдера на чистому JavaScript з використанням функціонального підходу",
);

/*
 * #1
 *
 * Опис функціональності для розробки
 *
 * 1. Динамічну зміну слайдів з можливістю навігації вперед та назад через кнопки управління.
 * 2. Автоматичне перегортання слайдів з заданим інтервалом часу.
 * 3. Паузу/відновлення автоматичного перегортання при кліку на відповідну кнопку.
 * 4. Відображення індикаторів поточного слайду, які вказують на поточну позицію слайдера та дозволяють переміщатися до конкретного слайду.
 * 5. Відгук на клавіатурні команди для управління слайдером (наприклад, стрілки вліво/вправо для навігації).
 * 6. Підтримку тач-жестів для навігації слайдами на мобільних пристроях та аналогічні дії мишею на десктопних пристроях, що дозволяє
 * користувачам легко перегортати слайди, використовуючи свайпи на тачскрінах або перетягування мишею.
 *
 * Хоча кінцевий дизайн слайдера залишається на ваш вибір, рекомендуємо приділити увагу якісному стайлінгу. Пріоритетом є розробка логіки
 * слайдера на чистому JavaScript та ефективна взаємодія з DOM, щоб забезпечити його плавну та інтуїтивно зрозумілу функціональність у різноманітних середовищах.
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

function initSlider() {
    let slides = document.querySelectorAll(".slider__slide");
    const slider = document.querySelector(".slider");
    const track = document.querySelector(".slider__track");
    const btnNext = document.querySelector(".slider__btn--next");
    const btnPrev = document.querySelector(".slider__btn--prev");
    const btnAutoscrollOn = document.querySelector(
        ".slider__btn--autoscroll-on",
    );
    const btnAutoscrollOff = document.querySelector(
        ".slider__btn--autoscroll-off",
    );
    const pagination = document.querySelector(".slider__pagination");
    const btnAudioPlay = document.querySelector(".slider__btn-audio--play");
    const btnAudioPause = document.querySelector(".slider__btn-audio--pause");
    const btnAudioNext = document.querySelector(".slider__btn-audio--next");
    const btnAudioPrev = document.querySelector(".slider__btn-audio--prev");
    const audioTrackTitle = document.querySelector(
        ".slider__audio-track-title",
    );
    const audioTrackFullTime = document.querySelector(
        ".slider__audio-track-full-time",
    );
    const audioTrackCurrentTime = document.querySelector(
        ".slider__audio-track-current-time",
    );
    const linkShop = document.querySelector(".slider__link-shop");

    if (
        !isDOMElementsFound({
            elements: {
                slider,
                track,
                btnNext,
                btnPrev,
                btnAutoscrollOn,
                btnAutoscrollOff,
                pagination,
                btnAudioPlay,
                btnAudioPause,
                btnAudioNext,
                btnAudioPrev,
                audioTrackTitle,
                audioTrackFullTime,
                audioTrackCurrentTime,
                linkShop,
            },
            collections: { slides },
        })
    )
        return;

    const audioPlayer = new Audio();
    audioPlayer.preload = "none";
    let currentAudioTrackIndex = 0;
    let activeAudioAlbumIndex = null;
    const MAIN_THEME_SRC = "../assets/audio/asura-main-theme.mp3";
    audioPlayer.src = MAIN_THEME_SRC;
    const ASURA_MASTERPIECES = initAudioData();

    const SLIDES_COUNT = slides.length;
    const TRACK_TRANSITION = track.style.transition;
    const teleportMap = { 0: SLIDES_COUNT, [SLIDES_COUNT + 1]: 1 };
    let currentIndex = 1;
    let slideWidth = 0;
    let pointerStartX = 0;
    let autoscrollPauseTimestamp = 0;
    let isTabActive = true;
    let isDragging = false;
    let isDraggingInterrupted = false;
    let isMouseOver = false;
    let isMoving = false;
    let isAutoscrollOn = false;
    let autoscrollId = null;

    const paginationDots = initPagination();
    slides = initInfiniteLoop();

    updateSlideWidth();
    teleportSlides();
    updateSlider();

    slider.addEventListener("click", handleClick);
    slider.addEventListener("mouseover", handleMouseOver);
    slider.addEventListener("mouseout", handleMouseOut);
    slider.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);
    audioPlayer.addEventListener("pause", handlePause);
    audioPlayer.addEventListener("ended", handleEnded);
    audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
    track.addEventListener("transitionend", handleTransitionEnd);
    document.addEventListener("visibilitychange", handleVisibilitychange);
    window.addEventListener("resize", handleResize);

    function handleClick(e) {
        if (e.target.closest(".slider__link-shop")) {
            e.preventDefault();
            openLinkShop();
            return;
        }

        const button = e.target.closest("button");
        if (!button || isMoving) return;

        if (e.pointerType === "mouse" || e.pointerType === "touch") {
            button.blur();
        }

        let oldIndex = currentIndex;

        if (button.classList.contains("slider__btn--next")) {
            ++currentIndex;
        } else if (button.classList.contains("slider__btn--prev")) {
            --currentIndex;
        } else if (button.classList.contains("pagination__dot")) {
            currentIndex = paginationDots.indexOf(button) + 1;
        } else if (button.classList.contains("slider__btn--autoscroll-on")) {
            if (!audioPlayer.paused) {
                return;
            }

            isAutoscrollOn = true;
            slider.classList.add("slider--autoscroll-on");
            ++currentIndex;
            updateSlider();
            startAutoscroll();

            if (!isMainThemeLoaded()) {
                audioPlayer.src = MAIN_THEME_SRC;
            }
            tryResetMainThemeTime();
            audioPlayer.play();
        } else if (button.classList.contains("slider__btn--autoscroll-off")) {
            stopAutoscroll();
            if (!isMainThemeLoaded()) {
                return;
            }
            audioPlayer.pause();
        } else if (button.classList.contains("slider__btn-audio--play")) {
            startAudio();
        } else if (button.classList.contains("slider__btn-audio--pause")) {
            stopAudio();
        } else if (button.classList.contains("slider__btn-audio--next")) {
            if (audioPlayer.paused) {
                return;
            }
            currentAudioTrackIndex =
                (currentAudioTrackIndex + 1) % getTotalAudioTracks();
            startAudio();
        } else if (button.classList.contains("slider__btn-audio--prev")) {
            if (audioPlayer.paused) {
                return;
            }
            currentAudioTrackIndex =
                (currentAudioTrackIndex - 1 + getTotalAudioTracks()) %
                getTotalAudioTracks();
            startAudio();
        }

        if (currentIndex !== oldIndex) {
            updateSlider();
        }
    }

    function handleKeyDown(e) {
        if (isMoving) return;

        if (e.key === "Enter") {
            const targetButton = document.activeElement;

            const isPressTarget = targetButton?.closest(".js-pressed-target");
            if (isPressTarget) {
                targetButton.classList.add("is-pressed");
            }

            const isResetTarget = targetButton?.closest(".js-autoscroll-reset");
            if (isResetTarget) {
                tryKillAutoscroll();
                tryResurrectAutoscroll();
            }

            const isButton = targetButton?.closest(".button");
            if (isButton) return;

            e.preventDefault();
            openLinkShop();
            return;
        }

        if (e.key === " ") {
            e.preventDefault();
            if (!isMainThemeLoaded()) {
                tryClearFocus();
                stopAutoscroll();
                return;
            }

            if (!isAutoscrollOn) {
                isAutoscrollOn = true;
                slider.classList.add("slider--autoscroll-on");
                ++currentIndex;
                updateSlider();
                startAutoscroll();

                if (!isMainThemeLoaded()) {
                    audioPlayer.src = MAIN_THEME_SRC;
                }
                tryResetMainThemeTime();
                audioPlayer.play();
                return;
            } else {
                tryClearFocus();
                stopAutoscroll();
                audioPlayer.pause();
                return;
            }
        }

        if (e.key === "ArrowRight") {
            tryKillAutoscroll();
            ++currentIndex;
        } else if (e.key === "ArrowLeft") {
            tryKillAutoscroll();
            --currentIndex;
        } else {
            return;
        }

        updateSlider();
        tryResurrectAutoscroll();
    }

    function handleKeyUp() {
        const pressedBtn = document.querySelector(".is-pressed");
        if (pressedBtn) {
            pressedBtn.classList.remove("is-pressed");
        }
    }

    function handleMouseDown(e) {
        if (isMoving) return;

        if (e.target.closest(".slider__track")) {
            startDragging(e);
        }
    }

    function handleMouseMove(e) {
        if (!isDragging) return;

        moveConveyor(getClientX(e));
    }

    function handleMouseUp(e) {
        if (isDraggingInterrupted) {
            tryResurrectAutoscroll();
            isDraggingInterrupted = false;
            return;
        }
        if (!isDragging) return;

        const pointerOffset = getClientX(e) - pointerStartX;
        stopDragging(pointerOffset);
    }

    function handleTouchStart(e) {
        if (isMoving) return;

        if (e.target.closest(".slider__track")) {
            if (e.touches.length > 1) return;
            startDragging(e);
        }
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        if (e.touches.length > 1) {
            stopDragging(0); // TODO: Test on real mobile device
            return;
        }

        moveConveyor(getClientX(e));
    }

    function handleTouchEnd(e) {
        if (isDraggingInterrupted) {
            tryResurrectAutoscroll();
            isDraggingInterrupted = false;
            return;
        }
        if (!isDragging) return;

        const pointerOffset = getClientX(e) - pointerStartX;
        stopDragging(pointerOffset);
    }

    function handleMouseOver(e) {
        const isPauseTarget = e.target.closest(".js-autoscroll-pause");

        if (isPauseTarget) {
            isMouseOver = true;
            tryKillAutoscroll();
        } else {
            isMouseOver = false;
            tryResurrectAutoscroll();
        }
    }

    function handleMouseOut(e) {
        if (!slider.contains(e.relatedTarget)) {
            isMouseOver = false;
            tryResurrectAutoscroll();
        }
    }

    function handlePause() {
        if (isAudioModeActive()) return;
        if (isAutoscrollOn) {
            audioPlayer.src = MAIN_THEME_SRC;
            audioPlayer.play();
        }
        tryResurrectAutoscroll();
    }

    function handleEnded() {
        if (isMainThemeLoaded()) {
            audioPlayer.play();
            return;
        }
        if (currentAudioTrackIndex === getTotalAudioTracks() - 1) {
            ++currentIndex;

            if (!isTabActive) {
                track.style.transition = "none";
                updateSlider();
                track.offsetHeight;
                track.style.transition = TRACK_TRANSITION;
                startAudio();
            } else {
                updateSlider();
            }
        } else {
            ++currentAudioTrackIndex;
            startAudio();
        }
    }

    function handleTimeUpdate() {
        audioTrackCurrentTime.style.width = `${Math.round((audioPlayer.currentTime / audioPlayer.duration) * 100)}%`;
    }

    function handleTransitionEnd() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        } else {
            isMoving = false;
        }

        if (isMainThemeLoaded()) return;

        if (activeAudioAlbumIndex !== currentIndex - 1) {
            currentAudioTrackIndex = 0;
            startAudio();
        }
    }

    function handleVisibilitychange() {
        if (document.hidden === true) {
            isTabActive = false;
            tryKillAutoscroll();
        } else {
            isTabActive = true;
            tryResurrectAutoscroll();
        }
    }

    function handleResize() {
        track.style.transition = "none";
        updateSlideWidth();
        updateSlider();
        track.offsetHeight;
        track.style.transition = TRACK_TRANSITION;
    }

    function startDragging(e) {
        isDragging = true;
        pointerStartX = getClientX(e);
        updateSlideWidth();
        killAutoscroll();
        track.style.transition = "none";
    }

    function moveConveyor(currentPointerX) {
        const pointerOffset = currentPointerX - pointerStartX;
        const trackOffset = currentIndex * slideWidth - pointerOffset;

        if (Math.abs(pointerOffset) < slideWidth) {
            track.style.transform = `translateX(-${trackOffset}px)`;
        } else {
            isDragging = false;
            isDraggingInterrupted = true;
            track.style.transition = TRACK_TRANSITION;

            if (pointerOffset < 0) {
                ++currentIndex;
            } else {
                --currentIndex;
            }
            updateSlider();
        }
    }

    function stopDragging(pointerOffset) {
        isDragging = false;
        track.style.transition = TRACK_TRANSITION;

        const offset = pointerOffset || 0;
        const triggerThreshold = slideWidth * 0.2;

        if (offset) {
            if (Math.abs(offset) > triggerThreshold) {
                if (offset < 0) {
                    ++currentIndex;
                } else {
                    --currentIndex;
                }
            }
            updateSlider();
        } else {
            if (audioPlayer.paused) {
                startAudio();
            } else {
                if (isMainThemeLoaded()) {
                    return;
                }
                stopAudio();
            }
        }
        tryResurrectAutoscroll();
    }

    function startAudio() {
        if (!isAudioModeActive()) {
            slider.classList.add("slider--audio-play");
            btnAudioNext.tabIndex = 0;
            btnAudioPrev.tabIndex = 0;
            btnAutoscrollOn.tabIndex = -1;
        }

        if (activeAudioAlbumIndex !== currentIndex - 1) {
            currentAudioTrackIndex = 0;
            activeAudioAlbumIndex = getAlbumIndex();
        }
        const currentAlbum = ASURA_MASTERPIECES[activeAudioAlbumIndex];

        if (isSameAudioTrack(currentAlbum)) {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        } else {
            audioTrackTitle.textContent = `${(currentAudioTrackIndex + 1).toString().padStart(2, `0`)} / ${currentAlbum.tracks.length.toString().padStart(2, `0`)} • ${currentAlbum.tracks[currentAudioTrackIndex].name}`;
            audioPlayer.src = currentAlbum.tracks[currentAudioTrackIndex].src;
            audioPlayer.play();
        }
    }

    function stopAudio() {
        slider.classList.remove("slider--audio-play");
        btnAudioNext.tabIndex = -1;
        btnAudioPrev.tabIndex = -1;
        btnAutoscrollOn.tabIndex = 0;
        audioPlayer.pause();
    }

    function updateSlider() {
        if (track.style.transition !== "none") {
            isMoving = true;
        }

        const offset = currentIndex * slideWidth;
        track.style.transform = `translateX(-${offset}px)`;

        updatePagination();
    }

    function updatePagination() {
        const activeDot = document.querySelector(".pagination__dot--active");
        if (activeDot) {
            activeDot.classList.remove("pagination__dot--active");
        }
        paginationDots[getAlbumIndex()].classList.add(
            "pagination__dot--active",
        );
    }

    function teleportSlides() {
        track.style.transition = "none";
        updateSlider();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = TRACK_TRANSITION;
                isMoving = false;
            });
        });
    }

    function openLinkShop() {
        window.open(ASURA_MASTERPIECES[getAlbumIndex()].shopUrl, "_blank");
    }

    function tryResurrectAutoscroll() {
        if (
            !isAutoscrollOn ||
            !isTabActive ||
            isDragging ||
            isMouseOver ||
            !isMainThemeLoaded()
        )
            return;

        killAutoscroll();
        startAutoscroll();
    }

    function tryKillAutoscroll() {
        if (!isAutoscrollOn) return;
        killAutoscroll();
    }

    function killAutoscroll() {
        clearInterval(autoscrollId);
        autoscrollId = null;
    }

    function startAutoscroll() {
        if (autoscrollId) {
            killAutoscroll();
        }
        autoscrollId = setInterval(() => {
            if (isMoving || !isAutoscrollOn) return;

            ++currentIndex;
            updateSlider();
        }, 4500);
    }

    function stopAutoscroll() {
        isAutoscrollOn = false;
        slider.classList.remove("slider--autoscroll-on");
        autoscrollPauseTimestamp = Date.now();
        killAutoscroll();
    }

    function tryResetMainThemeTime() {
        if (
            autoscrollPauseTimestamp > 0 &&
            Date.now() - autoscrollPauseTimestamp > 300000
        ) {
            audioPlayer.currentTime = 0;
        }
    }

    function tryClearFocus() {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }

    function updateSlideWidth() {
        slideWidth = slides[0].getBoundingClientRect().width;
    }

    function getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    function getAlbumIndex() {
        return (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
    }

    function getTotalAudioTracks() {
        return ASURA_MASTERPIECES[activeAudioAlbumIndex].tracks.length;
    }

    function isAudioModeActive() {
        return slider.classList.contains("slider--audio-play");
    }

    function isMainThemeLoaded() {
        return audioPlayer.src.includes(MAIN_THEME_SRC.substring(2));
    }

    function isSameAudioTrack(currentAlbum) {
        return audioPlayer.src.includes(
            currentAlbum.tracks[currentAudioTrackIndex].src.substring(2),
        );
    }

    function initPagination() {
        const dots = [];

        for (let i = 0; i < SLIDES_COUNT; i++) {
            const dot = document.createElement("button");
            dot.classList.add("button");
            dot.classList.add("pagination__dot");
            dot.classList.add("js-autoscroll-pause");
            dot.classList.add("js-autoscroll-reset");
            dots.push(pagination.appendChild(dot));
        }
        dots[0].classList.add("pagination__dot--active");

        return dots;
    }

    function initInfiniteLoop() {
        const cloneOfFirst = slides[0].cloneNode(true);
        const cloneOfLast = slides[SLIDES_COUNT - 1].cloneNode(true);
        track.append(cloneOfFirst);
        track.prepend(cloneOfLast);
        return document.querySelectorAll(".slider__slide");
    }

    function initAudioData() {
        return [
            {
                title: "Code Eternity",
                year: 2000,
                shopUrl: "https://ultimae.bandcamp.com/album/code-eternity",
                tracks: [
                    {
                        name: "Raindust1",
                        src: "../assets/audio/2000-code-eternity/04.raindust-preview.mp3",
                    },
                    {
                        name: "Raindust2",
                        src: "../assets/audio/2000-code-eternity/raindust-final.mp3",
                    },
                ],
            },
            {
                title: "Lost Eden",
                year: 2003,
                shopUrl: "https://www.discogs.com/sell/release/419254",
                tracks: [
                    {
                        name: "Raindust3",
                        src: "../assets/audio/2003-lost-eden/04.raindust-preview.mp3",
                    },
                    {
                        name: "Raindust4",
                        src: "../assets/audio/2003-lost-eden/raindust-final.mp3",
                    },
                ],
            },
            {
                title: "Life²",
                year: 2007,
                shopUrl: "https://ultimae.bandcamp.com/album/life",
                tracks: [
                    {
                        name: "Raindust5",
                        src: "../assets/audio/2007-life-squared/04.raindust-preview.mp3",
                    },
                    {
                        name: "Raindust6",
                        src: "../assets/audio/2007-life-squared/raindust-final.mp3",
                    },
                ],
            },
            {
                title: "360",
                year: 2010,
                shopUrl: "https://ultimae.bandcamp.com/album/360",
                tracks: [
                    {
                        name: "Raindust7",
                        src: "../assets/audio/2010-360/04.raindust-preview.mp3",
                    },
                    {
                        name: "Raindust8",
                        src: "../assets/audio/2010-360/raindust-final.mp3",
                    },
                ],
            },
        ];
    }
}

initSlider();
