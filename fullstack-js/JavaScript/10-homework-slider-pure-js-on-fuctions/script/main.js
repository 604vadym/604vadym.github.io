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
    let activeAlbumIndex = 0;
    const MAIN_THEME_SRC = "../assets/audio/asura-main-theme.mp3";
    audioPlayer.src = MAIN_THEME_SRC;
    const ASURA_MASTERPIECES = initAudioData();

    const AUTOSCROLL_DELAY = 4500;
    const AUTOSCROLL_WAKE_UP_DELAY = 1500;
    const THEME_RESET_PAUSE_THRESHOLD = 300000;
    const SLIDES_COUNT = slides.length;
    const TRACK_TRANSITION = track.style.transition;
    const teleportMap = { 0: SLIDES_COUNT, [SLIDES_COUNT + 1]: 1 };
    let currentIndex = 1;
    let slideWidth = 0;
    let pointerStartX = 0;
    let autoscrollPauseTimestamp = 0;
    let autoscrollStartTimestamp = 0;
    let slideStandTimestamp = 0;
    let lastClickTimestamp = 0;
    let isTabActive = true;
    let isDragging = false;
    let isDraggingInterrupted = false;
    let isMouseOver = false;
    let isMoving = false;
    let isAutoscrollOn = false;
    let isResizing = false;
    let autoscrollId = null;
    let resizeTimeoutId = null;

    const paginationDots = initPagination();
    slides = initInfiniteLoop();

    updateSlideWidth();
    teleportSlides();

    slider.addEventListener("click", handleClick);
    slider.addEventListener("auxclick", handleClick);
    slider.addEventListener("mouseover", handleMouseOver);
    slider.addEventListener("mouseout", handleMouseOut);
    slider.addEventListener("mousedown", handleMouseDownTouchStart);
    slider.addEventListener("touchstart", handleMouseDownTouchStart);
    document.addEventListener("mousemove", handleMouseMoveTouchMove);
    document.addEventListener("touchmove", handleMouseMoveTouchMove);
    document.addEventListener("mouseup", handleMouseUpTouchEnd);
    document.addEventListener("touchend", handleMouseUpTouchEnd);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("mousedown", handleDocumentMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    audioPlayer.addEventListener("pause", handlePause);
    audioPlayer.addEventListener("ended", handleEnded);
    audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
    linkShop.addEventListener("pointerover", handlePointerOver);
    linkShop.addEventListener("pointerdown", handlePointerOver);
    track.addEventListener("transitionend", handleTransitionEnd);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleResize);

    function handleClick(e) {
        const button = e.target.closest(".button");
        if (!button || isMoving) return;

        lastClickTimestamp = Date.now();

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
            if (toggleAutoscrollMode()) return;
        } else if (button.classList.contains("slider__btn--autoscroll-off")) {
            if (!toggleAutoscrollMode()) return;
        } else if (button.classList.contains("slider__btn-audio--play")) {
            if (e.shiftKey) {
                if (isAutoscrollOn) {
                    toggleAutoscrollMode();
                }
            }
            startAudio("album");
        } else if (button.classList.contains("slider__btn-audio--pause")) {
            stopAudio();
        } else if (button.classList.contains("slider__btn-audio--next")) {
            nextAudioTrack();
            startAudio("album");
        } else if (button.classList.contains("slider__btn-audio--prev")) {
            prevAudioTrack();
            startAudio("album");
        }

        if (currentIndex !== oldIndex) {
            updateSlider();
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            const activeElement = document.activeElement;
            const isButton = activeElement?.closest(".button");

            if (isButton && isMoving) {
                e.preventDefault();
                return;
            }

            const isPressTarget = activeElement?.closest(".js-pressed-target");
            if (isPressTarget) {
                activeElement.classList.add("is-pressed");
            }

            const isResetTarget = activeElement?.closest(
                ".js-autoscroll-reset",
            );
            if (isResetTarget) {
                tryKillAutoscroll();
                tryResurrectAutoscroll();
            }

            if (isButton) return;

            e.preventDefault();
            window.open(getCurrentShopUrl(), "_blank");
            return;
        }

        if (e.repeat && e.shiftKey) {
            e.preventDefault();
            return;
        }

        {
            let oldIndex = currentIndex;

            if (e.code === "ArrowRight" || e.code === "KeyD") {
                e.preventDefault();
                if (isMoving) return;

                if (e.shiftKey) {
                    if (isAudioModeActive()) {
                        nextAudioTrack();
                        startAudio("album");
                        return;
                    }
                }
                tryKillAutoscroll();
                ++currentIndex;
            } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
                e.preventDefault();
                if (isMoving) return;

                if (e.shiftKey) {
                    if (isAudioModeActive()) {
                        prevAudioTrack();
                        startAudio("album");
                        return;
                    }
                }
                tryKillAutoscroll();
                --currentIndex;
            }

            if (currentIndex !== oldIndex) {
                updateSlider();
                tryResurrectAutoscroll();
                return;
            }
        }

        if (e.repeat) {
            e.preventDefault();
            return;
        }

        if (e.key === " ") {
            e.preventDefault();
            if (e.shiftKey) {
                if (isAutoscrollOn) {
                    toggleAutoscrollMode();
                }
                if (audioPlayer.paused) {
                    startAudio("album");
                } else {
                    stopAudio();
                }
            } else {
                toggleAutoscrollMode();
            }
            return;
        }

        if (e.code === "ArrowUp" || e.code === "KeyW") {
            e.preventDefault();
            if (e.shiftKey) {
                if (isAutoscrollOn) {
                    toggleAutoscrollMode();
                }
            }
            if (!isAutoscrollOn) {
                if (audioPlayer.paused) {
                    startAudio("album");
                }
            }
            return;
        }

        if (
            e.code === "ArrowDown" ||
            e.code === "KeyS" ||
            e.code === "Pause" ||
            e.key === "Pause"
        ) {
            e.preventDefault();
            if (!audioPlayer.paused) {
                stopAudio();
            }
            return;
        }

        if (e.key === "MediaPlayPause") {
            e.preventDefault();
            if (!isAutoscrollOn) {
                if (audioPlayer.paused) {
                    startAudio("album");
                } else {
                    stopAudio();
                }
            }
            return;
        }

        if (
            e.key === "MediaTrackPrevious" ||
            e.key === "_" ||
            e.key === "-" ||
            e.code === "NumpadMinus" ||
            e.code === "BracketLeft" ||
            e.code === "KeyP"
        ) {
            e.preventDefault();
            if (isAudioModeActive()) {
                prevAudioTrack();
                startAudio("album");
            }
            return;
        }

        if (
            e.key === "MediaTrackNext" ||
            e.key === "=" ||
            e.key === "+" ||
            e.code === "NumpadAdd" ||
            e.code === "BracketRight" ||
            e.code === "KeyN"
        ) {
            e.preventDefault();
            if (isAudioModeActive()) {
                nextAudioTrack();
                startAudio("album");
            }
            return;
        }

        if (e.key >= "1" && e.key <= "9") {
            if (isAudioModeActive()) {
                const targetAudioTrack = parseInt(e.key, 10);
                if (targetAudioTrack <= getTotalAudioTracks()) {
                    currentAudioTrackIndex = targetAudioTrack - 1;
                    startAudio("album");
                }
            }
            return;
        }

        if (e.key === "0" || e.code === "Home") {
            e.preventDefault();
            if (isAudioModeActive()) {
                audioPlayer.currentTime = 0;
            }
            return;
        }

        if (e.code === "Backspace") {
            e.preventDefault();
            if (isAudioModeActive()) {
                currentAudioTrackIndex = 0;
                audioPlayer.currentTime = 0;
                startAudio("album");
            }
            return;
        }

        if (e.code === "Escape") {
            e.preventDefault();
            if (isAutoscrollOn) {
                toggleAutoscrollMode();
            }
            stopAudio();
            if (e.shiftKey) {
                hardResetSlider();
            }
            return;
        }

        if (e.code === "PageDown" || e.code === "PageUp" || e.code === "End") {
            e.preventDefault();
        }
    }

    function handleKeyUp() {
        const pressedBtn = document.querySelector(".is-pressed");
        if (pressedBtn) {
            pressedBtn.classList.remove("is-pressed");
        }
    }

    function handleMouseDownTouchStart(e) {
        if (isMoving) return;

        if (e.target.closest(".slider__track")) {
            if (e.touches && e.touches.length > 1) return;
            startDragging(e);
        }
    }

    function handleMouseMoveTouchMove(e) {
        if (!isDragging) return;

        if (e.touches && e.touches.length > 1) {
            stopDragging(0); // TODO: Test on real mobile device
            return;
        }

        moveConveyor(getClientX(e));
    }

    function handleMouseUpTouchEnd(e) {
        if (isDraggingInterrupted) {
            tryResurrectAutoscroll();
            isDraggingInterrupted = false;
            return;
        }
        if (!isDragging) return;

        const pointerOffset = getClientX(e) - pointerStartX;
        stopDragging(pointerOffset, e);
    }

    function handleDocumentMouseDown(e) {
        if (e.button === 1) {
            if (isMoving) {
                e.preventDefault();
                return;
            }
            const isInteractiveTarget =
                e.target.closest(".slider__link-shop") ||
                e.target.closest(".button") ||
                e.target.closest("a");
            if (isInteractiveTarget) return;

            e.preventDefault();
            if (isAutoscrollOn) {
                toggleAutoscrollMode();
            }
            if (audioPlayer.paused) {
                startAudio("album");
            } else {
                stopAudio();
            }
        }
    }

    function handlePointerOver(e) {
        const linkShop = e.target.closest(".slider__link-shop");

        if (linkShop) {
            const currentShopUrl = getCurrentShopUrl();

            if (linkShop.getAttribute("href") !== currentShopUrl) {
                linkShop.setAttribute("href", currentShopUrl);
            }
        }
    }

    function handleMouseOver(e) {
        if (!hasFinePointer()) return;
        const isPauseTarget = e.target.closest(".js-autoscroll-pause");

        if (isPauseTarget) {
            const msSinceStart = Date.now() - autoscrollStartTimestamp;
            if (msSinceStart < 100) {
                isMouseOver = true;
                return;
            }
            if (isMouseOver) return;

            isMouseOver = true;
            tryKillAutoscroll();
        } else {
            if (!isMouseOver) return;
            isMouseOver = false;
            tryResurrectAutoscroll("hover");
        }
    }

    function handleMouseOut(e) {
        if (!hasFinePointer()) return;
        if (
            e.relatedTarget &&
            e.relatedTarget.closest(".js-autoscroll-pause")
        ) {
            return;
        }

        if (!slider.contains(e.relatedTarget)) {
            isMouseOver = false;
            tryResurrectAutoscroll("hover");
        }
    }

    function handlePause() {
        if (isAudioModeActive()) return;
        if (isAutoscrollOn) {
            startAudio("theme");
        }
        tryResurrectAutoscroll();
    }

    function handleEnded() {
        if (!isAudioModeActive()) {
            startAudio("theme");
            return;
        }

        if (currentAudioTrackIndex === getTotalAudioTracks() - 1) {
            ++currentIndex;

            if (!isTabActive) {
                updateSliderInstantly();
                startAudio("album");
            } else {
                updateSlider();
            }
        } else {
            ++currentAudioTrackIndex;
            startAudio("album");
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

        onAlbumViewChanged(getAlbumIndex());
    }

    function handleVisibilityChange() {
        if (document.hidden === true) {
            isTabActive = false;
            tryKillAutoscroll();
        } else {
            isTabActive = true;
            tryResurrectAutoscroll();
        }
    }

    function handleResize() {
        clearTimeout(resizeTimeoutId);
        tryKillAutoscroll();

        isResizing = true;
        slider.classList.add("slider--resizing");
        updateSliderInstantly();

        resizeTimeoutId = setTimeout(() => {
            isResizing = false;
            slider.classList.remove("slider--resizing");
            updateSlideWidth();
            updateSliderInstantly();
            tryResurrectAutoscroll();
        }, 8);
    }

    function startDragging(e) {
        isDragging = true;
        pointerStartX = getClientX(e);
        updateSlideWidth();
        tryKillAutoscroll();
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

    function stopDragging(pointerOffset, e = null) {
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
            if (e && hasFinePointer() && e.button === 1) {
                e.preventDefault();
                return;
            }
            if (e && hasFinePointer() && e.shiftKey) {
                if (isAutoscrollOn) {
                    toggleAutoscrollMode();
                }
            }
            if (audioPlayer.paused) {
                startAudio("album");
            } else {
                if (!isAudioModeActive()) {
                    return;
                }
                stopAudio();
            }
        }
        tryResurrectAutoscroll();
    }

    function startAudio(context) {
        if (context === "theme") {
            if (!isMainThemeLoaded()) {
                audioPlayer.src = MAIN_THEME_SRC;
            }
            tryResetMainThemeTime();
            audioPlayer.play();
            return;
        }

        if (context === "album") {
            if (!isAudioModeActive()) {
                toggleAudioMode(true);
                tryKillAutoscroll();
            }

            const currentAlbum = ASURA_MASTERPIECES[activeAlbumIndex];
            if (!isSameAudioTrack(currentAlbum, audioPlayer.src)) {
                updateAudioTrackTitle(currentAlbum);
                audioPlayer.src =
                    currentAlbum.tracks[currentAudioTrackIndex].src;
            }

            audioPlayer.play();
        }
    }

    function stopAudio() {
        if (isAudioModeActive()) {
            toggleAudioMode(false);
        }
        audioPlayer.pause();
    }

    function updateSlider() {
        if (track.style.transition !== "none") {
            isMoving = true;
        }

        if (hasFinePointer() || isResizing) {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            const offset = currentIndex * slideWidth;
            track.style.transform = `translateX(-${offset}px)`;
        }

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

    function updateSliderInstantly() {
        track.style.transition = "none";
        updateSlider();
        track.offsetHeight;
        track.style.transition = TRACK_TRANSITION;
        isMoving = false;
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

    function tryResurrectAutoscroll(context) {
        if (
            !isAutoscrollOn ||
            !isTabActive ||
            isDragging ||
            isMouseOver ||
            isAudioModeActive()
        )
            return;

        if (isAutoscrollFirstCycle()) return;

        if (context === "hover" && hasFinePointer()) {
            if (isPostClickDriftActive()) {
                context = null;
            }
        } else {
            context = null;
        }

        killAutoscroll();
        if (context === "hover") {
            startAutoscroll(getAdaptiveWakeUpDelay());
        } else {
            startAutoscroll();
        }
    }

    function tryKillAutoscroll() {
        if (!isAutoscrollOn) return;

        if (isTabActive && !isAudioModeActive()) {
            if (isAutoscrollFirstCycle()) return;
        }

        killAutoscroll();
    }

    function killAutoscroll() {
        if (autoscrollId) {
            clearInterval(autoscrollId);
            autoscrollId = null;
        }
    }

    function startAutoscroll(delay) {
        isAutoscrollOn = true;
        slider.classList.add("slider--autoscroll-on");
        killAutoscroll();

        const currentDelay = delay || AUTOSCROLL_DELAY;

        autoscrollId = setInterval(() => {
            if (isMoving || !isAutoscrollOn) return;

            if (currentIndex === SLIDES_COUNT) {
                currentIndex = 0;
                updateSliderInstantly();
            }

            ++currentIndex;
            updateSlider();

            slideStandTimestamp = Date.now();

            const isMouseStillOver =
                hasFinePointer() &&
                document.querySelector(".js-autoscroll-pause:hover");

            if (isMouseStillOver) {
                isMouseOver = true;
                tryKillAutoscroll();
            } else {
                isMouseOver = false;
            }

            if (currentDelay !== AUTOSCROLL_DELAY) {
                startAutoscroll();
            }
        }, currentDelay);
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
            Date.now() - autoscrollPauseTimestamp > THEME_RESET_PAUSE_THRESHOLD
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

    function nextAudioTrack() {
        currentAudioTrackIndex =
            (currentAudioTrackIndex + 1) % getTotalAudioTracks();
    }

    function prevAudioTrack() {
        currentAudioTrackIndex =
            (currentAudioTrackIndex - 1 + getTotalAudioTracks()) %
            getTotalAudioTracks();
    }

    function hasFinePointer() {
        return window.matchMedia("(pointer: fine)").matches;
    }

    function getCurrentShopUrl() {
        return ASURA_MASTERPIECES[activeAlbumIndex].shopUrl;
    }

    function getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    function getAlbumIndex() {
        return (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
    }

    function getTotalAudioTracks() {
        return ASURA_MASTERPIECES[activeAlbumIndex].tracks.length;
    }

    function isAudioModeActive() {
        return slider.classList.contains("slider--audio-play");
    }

    function isMainThemeLoaded() {
        return audioPlayer.src.includes(MAIN_THEME_SRC.substring(2));
    }

    function isSameAudioTrack(album, src) {
        return src.includes(
            album.tracks[currentAudioTrackIndex].src.substring(2),
        );
    }

    function isAutoscrollFirstCycle() {
        const msSinceStart = Date.now() - autoscrollStartTimestamp;
        return msSinceStart < AUTOSCROLL_DELAY;
    }

    function isPostClickDriftActive() {
        const msSinceLastClick = Date.now() - lastClickTimestamp;
        return msSinceLastClick < AUTOSCROLL_WAKE_UP_DELAY;
    }

    function getAdaptiveWakeUpDelay() {
        const msSlideStand = Date.now() - slideStandTimestamp;
        if (msSlideStand < AUTOSCROLL_DELAY - AUTOSCROLL_WAKE_UP_DELAY) {
            return AUTOSCROLL_DELAY - msSlideStand;
        }
        return AUTOSCROLL_WAKE_UP_DELAY;
    }

    function updateAudioTrackTitle(album) {
        const trackNumber = (currentAudioTrackIndex + 1)
            .toString()
            .padStart(2, `0`);
        const totalTracks = album.tracks.length.toString().padStart(2, `0`);
        const trackName = album.tracks[currentAudioTrackIndex].name;

        audioTrackTitle.textContent = `${trackNumber} / ${totalTracks} • ${trackName}`;
    }

    function onAlbumViewChanged(nextAlbumIndex) {
        if (activeAlbumIndex !== nextAlbumIndex) {
            activeAlbumIndex = nextAlbumIndex;
            currentAudioTrackIndex = 0;

            if (isAudioModeActive()) {
                startAudio("album");
            }
        }
    }

    function toggleAudioMode(isActive) {
        slider.classList.toggle("slider--audio-play", isActive);
        btnAudioNext.tabIndex = isActive ? 0 : -1;
        btnAudioPrev.tabIndex = isActive ? 0 : -1;
        btnAutoscrollOn.tabIndex = isActive ? -1 : 0;
    }

    function toggleAutoscrollMode() {
        if (isAudioModeActive()) {
            tryClearFocus();
            stopAutoscroll();
            return false;
        }
        if (!isAutoscrollOn) {
            ++currentIndex;
            updateSlider();
            startAutoscroll();
            autoscrollStartTimestamp = Date.now();
            slideStandTimestamp = Date.now();
            startAudio("theme");
            return true;
        } else {
            tryClearFocus();
            stopAutoscroll();
            stopAudio();
            return false;
        }
    }

    function hardResetSlider() {
        currentAudioTrackIndex = 0;
        activeAlbumIndex = 0;
        audioPlayer.src = MAIN_THEME_SRC;

        currentIndex = 1;
        pointerStartX = 0;
        autoscrollPauseTimestamp = 0;
        autoscrollStartTimestamp = 0;
        slideStandTimestamp = 0;
        lastClickTimestamp = 0;
        isDragging = false;
        isDraggingInterrupted = false;
        isMouseOver = false;
        isResizing = false;

        clearTimeout(resizeTimeoutId);
        slider.classList.remove("slider--resizing");
        updateSliderInstantly();
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
