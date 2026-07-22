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
    const pagination = document.querySelector(".slider__pagination");

    if (
        !isDOMElementsFound({
            elements: { slider, track, btnNext, btnPrev, pagination },
            collections: { slides },
        })
    )
        return;

    const SLIDES_COUNT = slides.length;
    const TRACK_TRANSITION = track.style.transition;
    const teleportMap = { 0: SLIDES_COUNT, [SLIDES_COUNT + 1]: 1 };
    let currentIndex = 1;
    let isMoving = false;

    const paginationDots = initPagination(pagination, SLIDES_COUNT);
    slides = initInfiniteLoop(track, slides, SLIDES_COUNT);
    teleportSlides();
    updateSlider();

    slider.addEventListener("click", handleClick);
    track.addEventListener("transitionend", handleTransitionend);

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
        }

        if (currentIndex !== oldIndex) {
            updateSlider();
        }
    }

    function handleTransitionend() {
        if (currentIndex in teleportMap) {
            currentIndex = teleportMap[currentIndex];
            teleportSlides();
        }
        isMoving = false;
    }

    function updateSlider() {
        const slideWidth = slides[0].clientWidth;
        const offset = currentIndex * slideWidth;
        track.style.transform = `translateX(-${offset}px)`;
        updatePagination();
    }

    function updatePagination() {
        const activeDot = document.querySelector(".pagination__dot--active");
        activeDot.classList.remove("pagination__dot--active");
        let dotIndex = (currentIndex - 1 + SLIDES_COUNT) % SLIDES_COUNT;
        paginationDots[dotIndex].classList.add("pagination__dot--active");
    }

    function teleportSlides() {
        track.style.transition = "none";
        updateSlider();
        setTimeout(() => (track.style.transition = TRACK_TRANSITION), 0);
    }
}

initSlider();
