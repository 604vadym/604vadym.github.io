"use strict";

/* 
  ============================================================================
  ⚠️ COPYRIGHT NOTICE & DISCLAIMER (Non-Commercial Educational Fan Project)
  All media assets (short audio previews, album covers) are property of Asura,
  Ultimae Records and E-FrenchSound Records. Created strictly for portfolio
  presentation. If requested by the author or copyright owners, any materials
  will be removed immediately.
  =============================================================================
*/

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

    const MAIN_THEME_SRC =
        "./assets/audio/asura/main-theme-rare-mix-preview.mp3";
    let currentAudioTrackIndex = 0;
    let activeAlbumIndex = 0;

    const audioPlayer = new Audio();
    audioPlayer.src = MAIN_THEME_SRC;
    setTimeout(() => {
        audioPlayer.preload = "none";
    }, 300);

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

    const CLICK_ACTION_TABLE = initClickActionTable();
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
    slider.addEventListener("touchcancel", () => stopDragging());
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

        const clickAction = getClickAction(button);

        if (clickAction && clickAction(button, e)) {
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

        {
            if (
                e.repeat &&
                e.shiftKey &&
                (e.code === "ArrowRight" ||
                    e.code === "KeyD" ||
                    e.code === "ArrowLeft" ||
                    e.code === "KeyA")
            ) {
                if (isAudioModeActive()) {
                    e.preventDefault();
                    return;
                }
            }

            const oldIndex = currentIndex;

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

        {
            // prettier-ignore
            const shiftAudioTrackMap = {
                ")": 10,
                "!": 11,
                "@": 12,
                "#": 13,
                "$": 14,
                "%": 15,
                "^": 16,
                "&": 17,
                "*": 18,
                "(": 19,
            };

            if (e.shiftKey && e.key in shiftAudioTrackMap) {
                if (isAudioModeActive()) {
                    const targetAudioTrack = shiftAudioTrackMap[e.key];
                    if (givenAudioTrack(targetAudioTrack)) {
                        startAudio("album");
                    }
                }
                return;
            }
        }

        {
            const numpadKeys = [
                "Insert",
                "End",
                "ArrowDown",
                "PageDown",
                "ArrowLeft",
                "Clear",
                "ArrowRight",
                "Home",
                "ArrowUp",
                "PageUp",
            ];

            if (e.code.startsWith("Numpad") && numpadKeys.includes(e.key)) {
                e.preventDefault();
                if (isAudioModeActive()) {
                    const numpadDigit = parseInt(
                        e.code.replace("Numpad", ""),
                        10,
                    );
                    const targetAudioTrack = numpadDigit + 10;
                    if (givenAudioTrack(targetAudioTrack)) {
                        startAudio("album");
                    }
                }
                return;
            }
        }

        if (e.key >= "1" && e.key <= "9") {
            if (isAudioModeActive()) {
                const targetAudioTrack = parseInt(e.key, 10);
                if (givenAudioTrack(targetAudioTrack)) {
                    startAudio("album");
                }
            }
            return;
        }

        if (e.key === "0" || e.code === "Home") {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            e.preventDefault();
            if (isAudioModeActive()) {
                audioPlayer.currentTime = 0;
            }
            return;
        }

        if (e.code === "Backspace") {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
            e.preventDefault();
            if (isAudioModeActive()) {
                currentAudioTrackIndex = 0;
                audioPlayer.currentTime = 0;
                startAudio("album");
            }
            return;
        }

        if (e.code === "Escape") {
            if (e.ctrlKey || e.altKey || e.metaKey) return;
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

        if (e.type === "mousedown" && !hasFinePointer()) {
            return;
        }

        if (e.target.closest(".slider__track")) {
            if (e.touches && e.touches.length > 1) {
                stopDragging();
                return;
            }
            startDragging(e);
        }
    }

    function handleMouseMoveTouchMove(e) {
        if (!isDragging) return;

        if (e.touches && e.touches.length > 1) {
            stopDragging();
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
                resetLoop();
                updateSliderInstantly();
                onAlbumChanged(getAlbumIndex());
            } else {
                updateSlider();
            }
        } else {
            ++currentAudioTrackIndex;
            startAudio("album");
        }
    }

    function handleTimeUpdate() {
        if (!audioPlayer.duration || isNaN(audioPlayer.duration)) return;
        audioTrackCurrentTime.style.width = `${Math.round((audioPlayer.currentTime / audioPlayer.duration) * 100)}%`;
    }

    function handleTransitionEnd() {
        if (resetLoop()) {
            teleportSlides();
        } else {
            isMoving = false;
        }

        const albumIndex = getAlbumIndex();
        if (activeAlbumIndex !== albumIndex) {
            onAlbumChanged(albumIndex);
        }
    }

    function handleVisibilityChange() {
        if (document.hidden === true) {
            isTabActive = false;
            tryKillAutoscroll();
        } else {
            isTabActive = true;
            tryResurrectAutoscroll("visibility");
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

    function stopDragging(pointerOffset = null, e = null) {
        isDragging = false;
        track.style.transition = TRACK_TRANSITION;

        if (pointerOffset === null) {
            updateSlider();
            tryResurrectAutoscroll();
            return;
        }

        const triggerThreshold = slideWidth * 0.2;

        if (!hasFinePointer() && Math.abs(pointerOffset) < 6) {
            pointerOffset = 0;
        }

        if (pointerOffset) {
            if (Math.abs(pointerOffset) > triggerThreshold) {
                if (pointerOffset < 0) {
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
            audioPlayer.play().catch(() => {});
            return;
        }

        if (context === "album") {
            if (!isAudioModeActive()) {
                toggleAudioMode(true);
                tryKillAutoscroll();
            }

            if (isNewAudioTrack(audioPlayer.src)) {
                updateAudioTrackTitle();
                audioTrackCurrentTime.style.width = "0";
                const currentAlbum = ASURA_MASTERPIECES[activeAlbumIndex];
                audioPlayer.src =
                    currentAlbum.tracks[currentAudioTrackIndex].src;
            }

            audioPlayer.play().catch(() => {});
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
            (context !== "visibility" && isDragging) ||
            isMouseOver ||
            isAudioModeActive()
        )
            return;

        if (isAutoscrollFirstCycle()) return;

        if (context === "hover" && hasFinePointer()) {
            if (isPostClickDriftActive()) {
                context = null;
            }
        } else if (context !== "visibility") {
            context = null;
        }

        killAutoscroll();
        if (context === "hover") {
            startAutoscroll(getAdaptiveWakeUpDelay());
        } else {
            startAutoscroll(null, context);
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

    function startAutoscroll(delay, context) {
        isAutoscrollOn = true;
        slider.classList.add("slider--autoscroll-on");
        killAutoscroll();

        if (context === "visibility") {
            isMoving = false;
            isDragging = false;
        }

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
                document.querySelector(
                    ".js-autoscroll-pause:not(.slider__btn--autoscroll-off):hover",
                );

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

    function resetLoop() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            return true;
        }
        return false;
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

    function givenAudioTrack(targetAudioTrack) {
        if (targetAudioTrack <= getTotalAudioTracks()) {
            currentAudioTrackIndex = targetAudioTrack - 1;
            return true;
        }
        return false;
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

    function isNewAudioTrack(currentSrc) {
        return !currentSrc.includes(
            ASURA_MASTERPIECES[activeAlbumIndex].tracks[
                currentAudioTrackIndex
            ].src.substring(2),
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

    function updateAudioTrackTitle() {
        const trackNumber = (currentAudioTrackIndex + 1)
            .toString()
            .padStart(2, `0`);
        const totalTracks = ASURA_MASTERPIECES[activeAlbumIndex].tracks.length
            .toString()
            .padStart(2, `0`);
        const trackName =
            ASURA_MASTERPIECES[activeAlbumIndex].tracks[currentAudioTrackIndex]
                .name;

        audioTrackTitle.textContent = `${trackNumber} / ${totalTracks} • ${trackName}`;
    }

    function onAlbumChanged(newAlbumIndex) {
        activeAlbumIndex = newAlbumIndex;
        currentAudioTrackIndex = 0;

        if (isAudioModeActive()) {
            startAudio("album");
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
            return;
        }
        if (!isAutoscrollOn) {
            ++currentIndex;
            updateSlider();
            startAutoscroll();
            autoscrollStartTimestamp = Date.now();
            slideStandTimestamp = Date.now();
            startAudio("theme");
        } else {
            tryClearFocus();
            stopAutoscroll();
            stopAudio();
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

    function getClickAction(button) {
        const classList = button.classList;

        const actionIndex = CLICK_ACTION_TABLE.findIndex((entry) =>
            classList.contains(entry.className),
        );

        return actionIndex !== -1
            ? CLICK_ACTION_TABLE[actionIndex].action
            : null;
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

    function initClickActionTable() {
        return [
            {
                className: "slider__btn--next",
                action: () => {
                    ++currentIndex;
                    return true;
                },
            },
            {
                className: "slider__btn--prev",
                action: () => {
                    --currentIndex;
                    return true;
                },
            },
            {
                className: "pagination__dot",
                action: (button) => {
                    const oldIndex = currentIndex;
                    currentIndex = paginationDots.indexOf(button) + 1;
                    return currentIndex !== oldIndex;
                },
            },
            {
                className: "slider__btn--autoscroll-on",
                action: () => {
                    toggleAutoscrollMode();
                    return false;
                },
            },
            {
                className: "slider__btn--autoscroll-off",
                action: () => {
                    toggleAutoscrollMode();
                    return false;
                },
            },
            {
                className: "slider__btn-audio--play",
                action: (button, e) => {
                    if (e.shiftKey && isAutoscrollOn) toggleAutoscrollMode();
                    startAudio("album");
                    return false;
                },
            },
            {
                className: "slider__btn-audio--pause",
                action: () => {
                    stopAudio();
                    return false;
                },
            },
            {
                className: "slider__btn-audio--next",
                action: () => {
                    nextAudioTrack();
                    startAudio("album");
                    return false;
                },
            },
            {
                className: "slider__btn-audio--prev",
                action: () => {
                    prevAudioTrack();
                    startAudio("album");
                    return false;
                },
            },
        ];
    }

    function initAudioData() {
        return [
            {
                title: "Code Eternity",
                year: 2000,
                shopUrl: "https://ultimae.bandcamp.com/album/code-eternity",
                tracks: [
                    {
                        name: "Like a Summer Day",
                        src: "./assets/audio/asura/2000-code-eternity/01-like-a-summer-day-preview.mp3",
                    },
                    {
                        name: "Trinity",
                        src: "./assets/audio/asura/2000-code-eternity/02-trinity-preview.mp3",
                    },
                    {
                        name: "Simply Blue",
                        src: "./assets/audio/asura/2000-code-eternity/03-simply-blue-preview.mp3",
                    },
                    {
                        name: "Phoenix",
                        src: "./assets/audio/asura/2000-code-eternity/04-phoenix-preview.mp3",
                    },
                    {
                        name: "Code Eternity",
                        src: "./assets/audio/asura/2000-code-eternity/05-code-eternity-preview.mp3",
                    },
                    {
                        name: "Territories Part One",
                        src: "./assets/audio/asura/2000-code-eternity/06-territories-part-one-preview.mp3",
                    },
                    {
                        name: "XP Continuum",
                        src: "./assets/audio/asura/2000-code-eternity/07-xp-continuum-preview.mp3",
                    },
                ],
            },
            {
                title: "Lost Eden",
                year: 2003,
                shopUrl: "https://www.discogs.com/sell/release/419254",
                tracks: [
                    {
                        name: "Lost Eden",
                        src: "./assets/audio/asura/2003-lost-eden/01-lost-eden-preview.mp3",
                    },
                    {
                        name: "From the Abyss",
                        src: "./assets/audio/asura/2003-lost-eden/02-from-the-abyss-preview.mp3",
                    },
                    {
                        name: "Raindust",
                        src: "./assets/audio/asura/2003-lost-eden/03-raindust-preview.mp3",
                    },
                    {
                        name: "Land & Freedom",
                        src: "./assets/audio/asura/2003-lost-eden/04-land-and-freedom-preview.mp3",
                    },
                    {
                        name: "Fahrenheit",
                        src: "./assets/audio/asura/2003-lost-eden/05-fahrenheit-preview.mp3",
                    },
                    {
                        name: "Requiem from Nowhere",
                        src: "./assets/audio/asura/2003-lost-eden/06-requiem-from-nowhere-preview.mp3",
                    },
                    {
                        name: "Incoming",
                        src: "./assets/audio/asura/2003-lost-eden/07-incoming-preview.mp3",
                    },
                    {
                        name: "The Battle of Devas",
                        src: "./assets/audio/asura/2003-lost-eden/08-the-battle-of-devas-preview.mp3",
                    },
                    {
                        name: "Le Vol d'Icare",
                        src: "./assets/audio/asura/2003-lost-eden/09-le-vol-d'icare-preview.mp3",
                    },
                ],
            },
            {
                title: "Life²",
                year: 2007,
                shopUrl: "https://ultimae.bandcamp.com/album/life",
                tracks: [
                    {
                        name: "Golgotha",
                        src: "./assets/audio/asura/2007-life-squared/01-golgotha-preview.mp3",
                    },
                    {
                        name: "Back to Light",
                        src: "./assets/audio/asura/2007-life-squared/02-back-to-light-preview.mp3",
                    },
                    {
                        name: "Galaxies Part One",
                        src: "./assets/audio/asura/2007-life-squared/03-galaxies-part-one-preview.mp3",
                    },
                    {
                        name: "Celestial Tendencies",
                        src: "./assets/audio/asura/2007-life-squared/04-celestial-tendencies-preview.mp3",
                    },
                    {
                        name: "The Prophecy",
                        src: "./assets/audio/asura/2007-life-squared/05-the-prophecy-preview.mp3",
                    },
                    {
                        name: "Five Lines",
                        src: "./assets/audio/asura/2007-life-squared/06-five-lines-preview.mp3",
                    },
                    {
                        name: "Life²",
                        src: "./assets/audio/asura/2007-life-squared/07-life-squared-preview.mp3",
                    },
                    {
                        name: "Galaxies Part Two",
                        src: "./assets/audio/asura/2007-life-squared/08-galaxies-part-two-preview.mp3",
                    },
                    {
                        name: "Butterfly FX",
                        src: "./assets/audio/asura/2007-life-squared/09-butterfly-fx-preview.mp3",
                    },
                    {
                        name: "La Chanson de Carla",
                        src: "./assets/audio/asura/2007-life-squared/10-la-chanson-de-carla-preview.mp3",
                    },
                ],
            },
            {
                title: "360",
                year: 2010,
                shopUrl: "https://ultimae.bandcamp.com/album/360",
                tracks: [
                    {
                        name: "El Hai",
                        src: "./assets/audio/asura/2010-360/01-el-hai-preview.mp3",
                    },
                    {
                        name: "Regenesis",
                        src: "./assets/audio/asura/2010-360/02-regenesis-preview.mp3",
                    },
                    {
                        name: "Altered State",
                        src: "./assets/audio/asura/2010-360/03-altered-state-preview.mp3",
                    },
                    {
                        name: "Atlantis Child",
                        src: "./assets/audio/asura/2010-360/04-atlantis-child-preview.mp3",
                    },
                    {
                        name: "Erase",
                        src: "./assets/audio/asura/2010-360/05-erase-preview.mp3",
                    },
                    {
                        name: "Halley Road",
                        src: "./assets/audio/asura/2010-360/06-halley-road-preview.mp3",
                    },
                    {
                        name: "Longing for Silence",
                        src: "./assets/audio/asura/2010-360/07-longing-for-silence-preview.mp3",
                    },
                    {
                        name: "Getsemani",
                        src: "./assets/audio/asura/2010-360/08-getsemani-preview.mp3",
                    },
                    {
                        name: "Le Dernier Voyage",
                        src: "./assets/audio/asura/2010-360/09-le-dernier-voyage-preview.mp3",
                    },
                    {
                        name: "Virgin Delight",
                        src: "./assets/audio/asura/2010-360/10-virgin-delight-preview.mp3",
                    },
                ],
            },
        ];
    }
}

initSlider();
