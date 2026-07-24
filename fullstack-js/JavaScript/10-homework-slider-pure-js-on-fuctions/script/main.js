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
            },
            collections: { slides },
        })
    )
        return;

    const SLIDES_COUNT = slides.length;
    const TRACK_TRANSITION = track.style.transition;
    const teleportMap = { 0: SLIDES_COUNT, [SLIDES_COUNT + 1]: 1 };
    let currentIndex = 1;
    let pointerStartX = 0;
    let isDragging = false;
    let isDraggingInterrupted = false;
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
            killAutoscroll();
            track.style.transition = "none";
            currentIndex = 1;
            updateSlider();
        } else {
            isTabActive = true;
            // track.style.transition = TRACK_TRANSITION; <-- uncomment if remove code below

            track.style.transition = "none"; //
            currentIndex = 1; // Optional code, marked by //
            updateSlider(); // May be removed in future in case of uselessness
            track.offsetHeight; // Need to think about necessity
            track.style.transition = TRACK_TRANSITION; //

            tryResurrectAutoscroll();
        }
    }

    slider.addEventListener("click", handleClick);
    slider.addEventListener("mouseleave", tryResurrectAutoscroll);
    slider.addEventListener("mouseenter", tryKillAutoScroll);
    slider.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    track.addEventListener("transitionend", tryTeleportation);
    document.addEventListener("keydown", handleKeyboard);
    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);
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

    function getClientX(e) {
        return e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    }

    function startDragging(e) {
        isDragging = true;
        pointerStartX = getClientX(e);
        killAutoscroll();
        track.style.transition = "none";
    }

    function moveConveyor(currentPointerX) {
        const slideWidth = slides[0].clientWidth;
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
        const slideWidth = slides[0].clientWidth;
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
            isMoving = false;
        }
        tryResurrectAutoscroll();
    }

    function updateSlider() {
        const slideWidth = slides[0].clientWidth;
        const offset = currentIndex * slideWidth;
        track.style.transform = `translateX(-${offset}px)`;

        const activeDot = document.querySelector(".pagination__dot--active");
        activeDot.classList.remove("pagination__dot--active");
        let dotIndex = (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        paginationDots[dotIndex].classList.add("pagination__dot--active");
    }

    function tryResurrectAutoscroll() {
        if (!isPlayBtnOn || isDragging || !isTabActive) return;
        killAutoscroll();
        startAutoScroll();
    }

    function tryKillAutoScroll() {
        if (!isPlayBtnOn) return;
        killAutoscroll();
    }

    function tryTeleportation() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        } else {
            isMoving = false;
        }
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
            isMoving = true;
            ++currentIndex;
            updateSlider();
        }, 3000);
    }

    function stopAutoScroll() {
        killAutoscroll();
        tryTeleportation();
    }

    function killAutoscroll() {
        clearInterval(autoScrollId);
        autoScrollId = null;
    }
}

initSlider();
