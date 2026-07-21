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
    const slides = document.querySelectorAll(".slider__slide");
    const pagination = document.querySelector(".slider__pagination");
    const btnPrev = document.querySelector(".slider__btn--prev");
    const btnNext = document.querySelector(".slider__btn--next");

    if (
        !isDOMElementsFound({
            elements: { pagination, btnPrev, btnNext },
            collections: { slides },
        })
    )
        return;

    startSlider(slides, pagination, btnPrev, btnNext);
}

function startSlider(slides, pagination, btnPrev, btnNext) {
    const SLIDES_COUNT = slides.length;
    const paginationDots = [];

    for (let i = 0; i < SLIDES_COUNT; i++) {
        const paginationDot = document.createElement("button");
        paginationDot.classList.add("button");
        paginationDot.classList.add("pagination__dot");
        paginationDots.push(pagination.appendChild(paginationDot));
        paginationDots[i].addEventListener("click", () =>
            console.log(`clickDot${i}`),
        );
    }
    paginationDots[0].classList.add("pagination__dot--active");

    btnPrev.addEventListener("click", () => console.log("clickPrev"));
    btnNext.addEventListener("click", () => console.log("clickNext"));
}

initSlider();
