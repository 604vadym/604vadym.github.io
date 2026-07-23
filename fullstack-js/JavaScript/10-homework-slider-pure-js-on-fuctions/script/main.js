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
    let mouseX = 0;
    let isDragging = false;
    let isMoving = false;
    let isPlayBtnOn = false;
    let autoScrollId = null;

    const paginationDots = initPagination(pagination, SLIDES_COUNT);
    slides = initInfiniteLoop(track, slides, SLIDES_COUNT);
    teleportSlides();
    updateSlider();

    function handleVisibilitychange() {
        if (!isPlayBtnOn) return;
        if (document.hidden === true) stopAutoScroll();
        else startAutoScroll();
    }

    slider.addEventListener("click", handleClick);
    slider.addEventListener("mouseleave", tryStartAutoScroll);
    slider.addEventListener("mouseenter", tryStopAutoScroll);
    slider.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("dragstart", (e) => e.preventDefault());
    track.addEventListener("transitionend", tryTeleportation);
    document.addEventListener("keydown", handleKeyboard);
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
            tryStopAutoScroll();
            isMoving = true;
            ++currentIndex;
        } else if (e.key === "ArrowLeft") {
            tryStopAutoScroll();
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
        tryStartAutoScroll();
    }

    function handleMouseDown(e) {
        if (isMoving) return;

        if (e.target.closest(".slider__track")) {
            isDragging = true;
            tryStopAutoScroll();
            mouseX = e.clientX;
            track.style.transition = "none";
        }
    }

    function handleMouseMove(e) {
        if (!isDragging) return;

        const slideWidth = slides[0].clientWidth;
        const offset = currentIndex * slideWidth - (e.clientX - mouseX);
        if (Math.abs(e.clientX - mouseX) < slideWidth) {
            track.style.transform = `translateX(-${offset}px)`;
        } else {
            isMoving = true;
            isDragging = false;
            track.style.transition = TRACK_TRANSITION;

            if (e.clientX - mouseX < 0) {
                ++currentIndex;
            } else {
                --currentIndex;
            }
            updateSlider();
        }
    }

    function handleMouseUp(e) {
        if (!isDragging) return;

        isDragging = false;
        track.style.transition = TRACK_TRANSITION;

        const offset = e.clientX - mouseX;
        if (Math.abs(offset) > 100) {
            isMoving = true;
            if (offset < 0) {
                ++currentIndex;
            } else {
                --currentIndex;
            }
        }
        if (offset) {
            updateSlider();
        }
        tryStartAutoScroll();
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

    function tryStartAutoScroll() {
        if (!isPlayBtnOn || isDragging) return;
        startAutoScroll();
    }

    function tryStopAutoScroll() {
        if (!isPlayBtnOn) return;
        stopAutoScroll();
    }

    function tryTeleportation() {
        isMoving = false;
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        }
    }

    function teleportSlides() {
        track.style.transition = "none";
        updateSlider();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                track.style.transition = TRACK_TRANSITION;
            });
        });
    }

    function startAutoScroll() {
        if (autoScrollId) {
            stopAutoScroll();
        }
        autoScrollId = setInterval(() => {
            if (isMoving && !isPlayBtnOn) return;
            isMoving = true;
            ++currentIndex;
            updateSlider();
        }, 3000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollId);
        autoScrollId = null;
        tryTeleportation();
    }
}

initSlider();
