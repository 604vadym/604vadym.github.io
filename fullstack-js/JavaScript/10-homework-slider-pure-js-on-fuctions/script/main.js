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
    const btnPlay = document.querySelector(".slider__btn--play");
    const btnPause = document.querySelector(".slider__btn--pause");
    const pagination = document.querySelector(".slider__pagination");
    const btnAudioPlay = document.querySelector(".slider__btn-audio--play");
    const btnAudioPause = document.querySelector(".slider__btn-audio--pause");
    const btnAudioNext = document.querySelector(".slider__btn-audio--next");
    const btnAudioPrev = document.querySelector(".slider__btn-audio--prev");

    if (
        !isDOMElementsFound({
            elements: {
                slider,
                track,
                btnNext,
                btnPrev,
                btnPlay,
                btnPause,
                pagination,
                btnAudioPlay,
                btnAudioPause,
                btnAudioNext,
                btnAudioPrev,
            },
            collections: { slides },
        })
    )
        return;

    const audioPlayer = new Audio();
    let currentTrackIndex = 0;
    let activeAudioAlbumIndex = 0;
    const ASURA_MASTERPIECES = [
        {
            title: "Code Eternity",
            year: 2000,
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
    let isPlayBtnOn = false;
    let isTabActive = true;
    let autoScrollId = null;

    const paginationDots = initPagination(pagination, SLIDES_COUNT);
    slides = initInfiniteLoop(track, slides, SLIDES_COUNT);
    teleportSlides();
    updateSlider();

    function handleVisibilitychange() {
        if (!isPlayBtnOn) return;
        if (document.hidden === true) {
            isTabActive = false;
            killAutoScroll();
            track.style.transition = "none";
            if (audioPlayer.paused) {
                currentIndex = 1;
            }
            updateSlider();
        } else {
            isTabActive = true;
            track.style.transition = "none";
            if (audioPlayer.paused) {
                currentIndex = 1;
            }
            updateSlider();
            track.offsetHeight;
            track.style.transition = TRACK_TRANSITION;
            tryResurrectAutoscroll();
        }
    }

    slider.addEventListener("click", handleClick);
    slider.addEventListener("mouseover", handleMouseOver);
    slider.addEventListener("mouseout", handleMouseOut);
    slider.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    track.addEventListener("transitionend", handleTransitionEnd);
    document.addEventListener("keydown", handleKeyboard);
    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);
    audioPlayer.addEventListener("play", killAutoScroll);
    audioPlayer.addEventListener("pause", tryResurrectAutoscroll);
    audioPlayer.addEventListener("ended", handleEnded);
    document.addEventListener("visibilitychange", handleVisibilitychange);

    function handleClick(e) {
        const button = e.target.closest("button");
        if (!button || isMoving) return;

        isMoving = true;
        let oldIndex = currentIndex;

        if (button.classList.contains("slider__btn--next")) {
            ++currentIndex;
        } else if (button.classList.contains("slider__btn--prev")) {
            --currentIndex;
        } else if (button.classList.contains("pagination__dot")) {
            currentIndex = paginationDots.indexOf(button) + 1;
        } else if (button.classList.contains("slider__btn--play")) {
            isPlayBtnOn = true;
            slider.classList.add("slider--autoplay");
            isMoving = true;
            ++currentIndex;
            updateSlider();
            startAutoScroll();
        } else if (button.classList.contains("slider__btn--pause")) {
            isPlayBtnOn = false;
            slider.classList.remove("slider--autoplay");
            stopAutoScroll();
        } else if (button.classList.contains("slider__btn-audio--play")) {
            slider.classList.add("slider--audio-play");
            startAudio();
        } else if (button.classList.contains("slider__btn-audio--pause")) {
            slider.classList.remove("slider--audio-play");
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
        }
    }

    function handleKeyboard(e) {
        if (isMoving) return;

        if (e.key === "ArrowRight") {
            tryKillAutoScroll();
            isMoving = true;
            ++currentIndex;
        } else if (e.key === "ArrowLeft") {
            tryKillAutoScroll();
            isMoving = true;
            --currentIndex;
        } else if (e.key === "Enter") {
            if (e.target.closest("button")) {
                return;
            } else {
                e.preventDefault();
                return;
            }
        } else if (e.key === " ") {
            if (e.target.closest("button")) {
                return;
            } else {
                e.preventDefault();
                return;
            }
        } else {
            return;
        }

        updateSlider();
        tryResurrectAutoscroll();
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
            e.target.closest(".pagination__dot");

        const isAudioNavBtn =
            e.target.closest(".slider__btn-audio--next") ||
            e.target.closest(".slider__btn-audio--prev");

        if (isTargetValid && !isAudioNavBtn) {
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

    function handleEnded() {
        activeAudioAlbumIndex =
            (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        let currentAlbum = ASURA_MASTERPIECES[activeAudioAlbumIndex];
        const totalTracks = currentAlbum.tracks.length;

        if (currentTrackIndex === totalTracks - 1) {
            ++currentIndex;
            activeAudioAlbumIndex =
                (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
            currentAlbum = ASURA_MASTERPIECES[activeAudioAlbumIndex];
            isMoving = true;
            updateSlider();
            currentTrackIndex = 0;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % totalTracks;
        }

        audioPlayer.src = currentAlbum.tracks[currentTrackIndex].src;
        audioPlayer.play();
    }

    function handleTransitionEnd() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        } else {
            isMoving = false;
        }

        if (!audioPlayer.paused && activeAudioAlbumIndex !== currentIndex - 1) {
            currentTrackIndex = 0;
            startAudio();
        }
    }

    function getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
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
        activeAudioAlbumIndex =
            (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
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
            !isPlayBtnOn ||
            !isTabActive ||
            isDragging ||
            isMouseOver ||
            !audioPlayer.paused
        )
            return;
        killAutoScroll();
        startAutoScroll();
    }

    function tryKillAutoScroll() {
        if (!isPlayBtnOn) return;
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
            stopAutoScroll();
        }
        autoScrollId = setInterval(() => {
            if (isMoving || !isPlayBtnOn) return;
            if (currentIndex === SLIDES_COUNT) {
                currentIndex = 0;
                track.style.transition = "none";
                updateSlider();
                track.offsetHeight;
                track.style.transition = TRACK_TRANSITION;
            }
            isMoving = true;
            ++currentIndex;
            updateSlider();
        }, 3000);
    }

    function stopAutoScroll() {
        killAutoScroll();
        isMoving = false;
    }

    function killAutoScroll() {
        clearInterval(autoScrollId);
        autoScrollId = null;
    }
}

initSlider();
