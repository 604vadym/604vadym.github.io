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

function initPagination(pagination, slidesCount) {
    const dots = [];

    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement("button");
        dot.classList.add("button");
        dot.classList.add("pagination__dot");
        dots.push(pagination.appendChild(dot));
    }
    dots[0].classList.add("pagination__dot--active");

    return dots;
}

function initInfiniteLoop(track, slides, slidesCount) {
    const cloneOfFirst = slides[0].cloneNode(true);
    const cloneOfLast = slides[slidesCount - 1].cloneNode(true);
    track.append(cloneOfFirst);
    track.prepend(cloneOfLast);
    return document.querySelectorAll(".slider__slide");
}

function initSlider() {
    let slides = document.querySelectorAll(".slider__slide");
    const slider = document.querySelector(".slider");
    const track = document.querySelector(".slider__track");
    const btnNext = document.querySelector(".slider__btn--next");
    const btnPrev = document.querySelector(".slider__btn--prev");
    const btnAutoScrollOn = document.querySelector(
        ".slider__btn--auto-scroll-on",
    );
    const btnAutoScrollOff = document.querySelector(
        ".slider__btn--auto-scroll-off",
    );
    const pagination = document.querySelector(".slider__pagination");
    const btnAudioPlay = document.querySelector(".slider__btn-audio--play");
    const btnAudioPause = document.querySelector(".slider__btn-audio--pause");
    const btnAudioNext = document.querySelector(".slider__btn-audio--next");
    const btnAudioPrev = document.querySelector(".slider__btn-audio--prev");
    const trackTitle = document.querySelector(".slider__track-title");
    const trackFullTime = document.querySelector(".slider__track-full-time");
    const trackCurrentTime = document.querySelector(
        ".slider__track-current-time",
    );
    const linkShop = document.querySelector(".slider__link-shop");

    if (
        !isDOMElementsFound({
            elements: {
                slider,
                track,
                btnNext,
                btnPrev,
                btnAutoScrollOn,
                btnAutoScrollOff,
                pagination,
                btnAudioPlay,
                btnAudioPause,
                btnAudioNext,
                btnAudioPrev,
                trackTitle,
                trackFullTime,
                trackCurrentTime,
                linkShop,
            },
            collections: { slides },
        })
    )
        return;

    const audioPlayer = new Audio();
    audioPlayer.preload = "none";
    let currentTrackIndex = 0;
    let activeAudioAlbumIndex = null;
    const mainThemeSrc = "../assets/audio/asura-main-theme.mp3";
    audioPlayer.src = mainThemeSrc;
    const ASURA_MASTERPIECES = [
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

    const SLIDES_COUNT = slides.length;
    const TRACK_TRANSITION = track.style.transition;
    const teleportMap = { 0: SLIDES_COUNT, [SLIDES_COUNT + 1]: 1 };
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 1;
    let pointerStartX = 0;
    let isDragging = false;
    let isDraggingInterrupted = false;
    let isMouseOver = false;
    let isMoving = false;
    let isAutoScrollOn = false;
    let autoscrollPauseTimestamp = 0;
    let isTabActive = true;
    let autoScrollId = null;

    const paginationDots = initPagination(pagination, SLIDES_COUNT);
    slides = initInfiniteLoop(track, slides, SLIDES_COUNT);
    teleportSlides();
    updateSlider();

    slider.addEventListener("click", handleClick);
    slider.addEventListener("mouseover", handleMouseOver);
    slider.addEventListener("mouseout", handleMouseOut);
    slider.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    track.addEventListener("transitionend", handleTransitionEnd);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);
    audioPlayer.addEventListener("pause", handlePause);
    audioPlayer.addEventListener("ended", handleEnded);
    audioPlayer.addEventListener("timeupdate", handleTimeUpdate);
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

        isMoving = true;
        let oldIndex = currentIndex;

        if (button.classList.contains("slider__btn--next")) {
            ++currentIndex;
        } else if (button.classList.contains("slider__btn--prev")) {
            --currentIndex;
        } else if (button.classList.contains("pagination__dot")) {
            currentIndex = paginationDots.indexOf(button) + 1;
        } else if (button.classList.contains("slider__btn--auto-scroll-on")) {
            if (!audioPlayer.paused) {
                isMoving = false;
                return;
            }
            isAutoScrollOn = true;
            slider.classList.add("slider--auto-scroll-on");
            ++currentIndex;
            updateSlider();
            startAutoScroll();
            if (!audioPlayer.src.includes(mainThemeSrc.substring(2))) {
                audioPlayer.src = mainThemeSrc;
            }
            if (
                autoscrollPauseTimestamp > 0 &&
                Date.now() - autoscrollPauseTimestamp > 180000
            ) {
                audioPlayer.currentTime = 0;
            }
            audioPlayer.play();
        } else if (button.classList.contains("slider__btn--auto-scroll-off")) {
            stopAutoScroll();
            if (!audioPlayer.src.includes(mainThemeSrc.substring(2))) {
                return;
            }
            audioPlayer.pause();
        } else if (button.classList.contains("slider__btn-audio--play")) {
            slider.classList.add("slider--audio-play");
            btnAudioNext.tabIndex = 0;
            btnAudioPrev.tabIndex = 0;
            btnAutoScrollOn.tabIndex = -1;
            startAudio();
        } else if (button.classList.contains("slider__btn-audio--pause")) {
            slider.classList.remove("slider--audio-play");
            btnAudioNext.tabIndex = -1;
            btnAudioPrev.tabIndex = -1;
            btnAutoScrollOn.tabIndex = 0;
            stopAudio();
        } else if (button.classList.contains("slider__btn-audio--next")) {
            if (audioPlayer.paused) {
                isMoving = false;
                return;
            }
            const totalTracks =
                ASURA_MASTERPIECES[activeAudioAlbumIndex].tracks.length;
            currentTrackIndex = (currentTrackIndex + 1) % totalTracks;
            startAudio();
        } else if (button.classList.contains("slider__btn-audio--prev")) {
            if (audioPlayer.paused) {
                isMoving = false;
                return;
            }
            const totalTracks =
                ASURA_MASTERPIECES[activeAudioAlbumIndex].tracks.length;
            currentTrackIndex =
                (currentTrackIndex - 1 + totalTracks) % totalTracks;
            startAudio();
        }

        if (currentIndex !== oldIndex) {
            updateSlider();
        } else {
            isMoving = false;
        }
    }

    function handleKeyDown(e) {
        if (isMoving) return;

        const targetButton = document.activeElement;

        if (e.key === "Enter") {
            if (
                targetButton.classList.contains("slider__btn") ||
                targetButton.classList.contains("slider__btn-audio")
            ) {
                targetButton.classList.add("is-pressed");
                tryKillAutoScroll();
                tryResurrectAutoscroll();
                return;
            }

            if (
                targetButton &&
                targetButton.classList.contains("pagination__dot")
            ) {
                tryKillAutoScroll();
                tryResurrectAutoscroll();
                return;
            }

            e.preventDefault();
            openLinkShop();
            return;
        }

        if (e.key === " ") {
            e.preventDefault();
            if (!audioPlayer.src.includes(mainThemeSrc.substring(2))) {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                stopAutoScroll();
                return;
            }

            if (!isAutoScrollOn) {
                isAutoScrollOn = true;
                slider.classList.add("slider--auto-scroll-on");
                ++currentIndex;
                updateSlider();
                startAutoScroll();

                if (!audioPlayer.src.includes(mainThemeSrc.substring(2))) {
                    audioPlayer.src = mainThemeSrc;
                }

                if (
                    autoscrollPauseTimestamp > 0 &&
                    Date.now() - autoscrollPauseTimestamp > 180000
                ) {
                    audioPlayer.currentTime = 0;
                }

                audioPlayer.play();
                return;
            } else {
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                stopAutoScroll();
                audioPlayer.pause();
                return;
            }
        }

        if (e.key === "ArrowRight") {
            tryKillAutoScroll();
            isMoving = true;
            ++currentIndex;
        } else if (e.key === "ArrowLeft") {
            tryKillAutoScroll();
            isMoving = true;
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
        const isTargetValid =
            e.target.closest(".slider__viewport") ||
            e.target.closest(".slider__btn") ||
            e.target.closest(".slider__btn-audio") ||
            e.target.closest(".pagination__dot") ||
            e.target.closest(".slider__link-shop");

        if (isTargetValid) {
            isMouseOver = true;
            tryKillAutoScroll();
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
        if (isAutoScrollOn) {
            audioPlayer.src = mainThemeSrc;
            audioPlayer.play();
        }
        tryResurrectAutoscroll();
    }

    function handleEnded() {
        if (audioPlayer.src.includes(mainThemeSrc.substring(2))) {
            audioPlayer.play();
            return;
        }

        let currentAlbum = ASURA_MASTERPIECES[activeAudioAlbumIndex];
        const totalTracks = currentAlbum.tracks.length;

        if (currentTrackIndex === totalTracks - 1) {
            isMoving = true;
            ++currentIndex;

            if (!isTabActive) {
                track.style.transition = "none";
                updateSlider();
                track.offsetHeight;
                track.style.transition = TRACK_TRANSITION;
                isMoving = false;
                startAudio();
            } else {
                updateSlider();
            }
        } else {
            ++currentTrackIndex;
            startAudio();
        }
    }

    function handleTimeUpdate() {
        trackCurrentTime.style.width = `${Math.round((audioPlayer.currentTime / audioPlayer.duration) * 100)}%`;
    }

    function handleTransitionEnd() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        } else {
            isMoving = false;
        }

        if (audioPlayer.src.includes(mainThemeSrc.substring(2))) return;

        if (activeAudioAlbumIndex !== currentIndex - 1) {
            currentTrackIndex = 0;
            startAudio();
        }
    }

    function handleVisibilitychange() {
        if (document.hidden === true) {
            isTabActive = false;
            tryKillAutoScroll();
        } else {
            isTabActive = true;
            tryResurrectAutoscroll();
        }
    }

    function handleResize() {
        track.style.transition = "none";
        slideWidth = slides[0].getBoundingClientRect().width;
        updateSlider();
        track.offsetHeight;
        track.style.transition = TRACK_TRANSITION;
    }

    function startDragging(e) {
        isDragging = true;
        pointerStartX = getClientX(e);
        slideWidth = slides[0].getBoundingClientRect().width;
        killAutoScroll();
        track.style.transition = "none";
    }

    function moveConveyor(currentPointerX) {
        const pointerOffset = currentPointerX - pointerStartX;
        const trackOffset = currentIndex * slideWidth - pointerOffset;

        if (Math.abs(pointerOffset) < slideWidth) {
            track.style.transform = `translateX(-${trackOffset}px)`;
        } else {
            isMoving = true;
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

        if (Math.abs(offset) > triggerThreshold) {
            isMoving = true;
            if (offset < 0) {
                ++currentIndex;
            } else {
                --currentIndex;
            }
        }

        if (offset) {
            updateSlider();
        } else {
            if (audioPlayer.paused) {
                slider.classList.add("slider--audio-play");
                startAudio();
            } else {
                if (audioPlayer.src.includes(mainThemeSrc.substring(2))) {
                    return;
                }
                slider.classList.remove("slider--audio-play");
                stopAudio();
            }
            isMoving = false;
        }

        tryResurrectAutoscroll();
    }

    function updateSlider() {
        const offset = currentIndex * slideWidth;
        track.style.transform = `translateX(-${offset}px)`;

        const activeDot = document.querySelector(".pagination__dot--active");
        activeDot.classList.remove("pagination__dot--active");
        let dotIndex = (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        paginationDots[dotIndex].classList.add("pagination__dot--active");
    }

    function startAudio() {
        if (activeAudioAlbumIndex !== currentIndex - 1) {
            currentTrackIndex = 0;
            activeAudioAlbumIndex =
                (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        }

        const currentAlbum = ASURA_MASTERPIECES[activeAudioAlbumIndex];
        const isSameTrack = audioPlayer.src.includes(
            currentAlbum.tracks[currentTrackIndex].src.substring(2),
        );

        if (isSameTrack) {
            if (audioPlayer.paused) {
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        } else {
            trackTitle.textContent = `${(currentTrackIndex + 1).toString().padStart(2, `0`)} / ${currentAlbum.tracks.length.toString().padStart(2, `0`)} • ${currentAlbum.tracks[currentTrackIndex].name}`;
            audioPlayer.src = currentAlbum.tracks[currentTrackIndex].src;
            audioPlayer.play();
        }
        isMoving = false;
    }

    function stopAudio() {
        isMoving = false;
        audioPlayer.pause();
    }

    function tryResurrectAutoscroll() {
        if (
            !isAutoScrollOn ||
            !isTabActive ||
            isDragging ||
            isMouseOver ||
            !audioPlayer.src.includes(mainThemeSrc.substring(2))
        )
            return;

        killAutoScroll();
        startAutoScroll();
    }

    function tryKillAutoScroll() {
        if (!isAutoScrollOn) return;
        killAutoScroll();
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

    function startAutoScroll() {
        if (autoScrollId) {
            killAutoScroll();
        }
        autoScrollId = setInterval(() => {
            if (isMoving || !isAutoScrollOn) return;
            isMoving = true;
            ++currentIndex;
            updateSlider();
        }, 3000);
    }

    function stopAutoScroll() {
        isAutoScrollOn = false;
        isMoving = false;
        slider.classList.remove("slider--auto-scroll-on");
        autoscrollPauseTimestamp = Date.now();
        killAutoScroll();
    }

    function killAutoScroll() {
        clearInterval(autoScrollId);
        autoScrollId = null;
    }

    function getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    function openLinkShop() {
        const activeVisualAlbumIndex =
            (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        window.open(
            ASURA_MASTERPIECES[activeVisualAlbumIndex].shopUrl,
            "_blank",
        );
    }
}

initSlider();
