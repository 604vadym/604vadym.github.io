"use strict";

console.log(
    "JS #7. JavaScript в дії: Обчислення, трансформація та управління даними",
);

/*
 * #1
 *
 * Розробити функцію, яка використовує метод reduce масиву для обчислення суми усіх елементів масиву чисел.
 Функція повинна приймати масив чисел та повертати їх суму.
*/

console.log(
    "******************************\n" +
        "Task 1\n" +
        "******************************",
);

function sumArray(numbers) {
    return numbers.reduce((accum, value) => accum + value, 0);
}

// Використання функції
const exampleArray = [1, 2, 3, 4, 5];
const sum = sumArray(exampleArray);
console.log(exampleArray);
console.log("Сума елементів масиву:", sum); // Виведення суми

/*
 * #2
 *
 * Розробити функцію, яка використовує метод map масиву для створення нового масиву, в якому кожен елемент буде вдвічі більшим за елементи вхідного масиву чисел.
 */

console.log(
    "******************************\n" +
        "Task 2\n" +
        "******************************",
);

function doubleArrayElements(numbers) {
    return numbers.map((value) => value * 2);
}

// Використання функції
const exampleArray2 = [1, 2, 3, 4, 5];
const doubledArray = doubleArrayElements(exampleArray2);
console.log(exampleArray2);
console.log("Подвоєні елементи масиву:", doubledArray); // Виведення подвоєних елементів

/*
 * #3
 *
 * Розробити клас `SkillsManager`, що відповідає за управління списком навичок. Клас повинен включати:
 * 1. Конструктор:
 * - Ініціалізує порожній масив `skills`, який буде використовуватися для зберігання навичок.
 * 2. Метод `addSkill(skill)`:
 * - Приймає один аргумент `skill` (рядок).
 * - Перевіряє, чи аргумент є рядком і має мінімум два символи.
 * - Якщо умови виконані, додає `skill` до масиву `skills` і повертає додану навичку.
 * - Якщо умови не виконані (навичка не є рядком або має менше двох символів), повертає `null`.
 * 3. Метод `getAllSkills()`:
 *   - Повертає поточний масив усіх навичок, збережених у класі.
 *
 * Загальні вимоги:
 * - Клас має забезпечувати легке управління навичками, включаючи додавання нових навичок та отримання списку всіх наявних навичок.
 * - Код має бути написаний з урахуванням принципів чистого коду, забезпечуючи читабельність та легкість підтримки.
 */

console.log(
    "******************************\n" +
        "Task 3\n" +
        "******************************",
);

/*export*/ class SkillsManager {
    #skills;

    constructor() {
        this.#skills = [];
    }

    addSkill(skill) {
        if (typeof skill !== "string" || skill.length < 2) {
            return null;
        }
        this.#skills.push(skill);
        return skill;
    }

    getAllSkills() {
        return this.#skills.slice(); // make copy to protect private property
    }
}

const skillsManager = new SkillsManager();

console.log(skillsManager.addSkill("JavaScript"));
console.log(skillsManager.addSkill("CSS"));
console.log(skillsManager.getAllSkills());

/*
 * #4
 * Задача: Калькулятор дат.
 * Завдання: Створити модуль на JavaScript, який імплементує функцію-конструктор DateCalculator для створення об'єктів, здатних керувати датами. Калькулятор дат має надавати такі можливості:
 * Додавання днів: Метод addDays приймає кількість днів як аргумент і додає цю кількість до поточної дати об'єкта.
 * Віднімання днів: Метод subtractDays приймає кількість днів як аргумент і віднімає цю кількість від поточної дати об'єкта.
 * Отримання результату: Метод getResult повертає поточну дату об'єкта у форматі "YYYY-MM-DD".
 *
 * Критерії перевірки:
 * В модулі має бути визначена функція-конструктор DateCalculator, яка ініціалізує об'єкт з початковою датою.
 * Мають бути реалізовані та доступні методи addDays, subtractDays, та getResult для екземплярів DateCalculator.
 * Об'єкти DateCalculator мають створюватися за допомогою ключового слова new і використання функції-конструктора.
 */

console.log(
    "******************************\n" +
        "Task 4\n" +
        "******************************",
);

/*export*/ function DateCalculator(initialDate) {
    // use variable (instead of this.date) for closure to protect internal state of object
    let date = initialDate === undefined ? new Date() : new Date(initialDate);

    if (isNaN(date)) {
        throw new TypeError(
            `Invalid date format provided to DateCalculator. Received: "${initialDate}"`,
        );
    }

    function formatDate(rawDate) {
        const year = rawDate.getFullYear();
        const month = ("0" + (rawDate.getMonth() + 1)).slice(-2);
        const day = ("0" + rawDate.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function checkArgument(value, name) {
        if (!Number.isFinite(value)) {
            throw new TypeError(
                `Argument ${name} must be a finite number. Received: "${value}" (type: ${typeof value})`,
            );
        }
    }

    this.addDays = function (days) {
        checkArgument(days, "days");
        date.setDate(date.getDate() + days);
    };

    this.subtractDays = function (days) {
        checkArgument(days, "days");
        date.setDate(date.getDate() - days);
    };

    // Optimal variant
    this.getResult = function () {
        return date.toLocaleDateString("sv-SE");
    };

    // Variant to have more practice with Date and String methods. Date formatted manually in inner function formatDate()
    this.getResultV2 = function () {
        return formatDate(date);
    };
}

// Демонстрація використання
try {
    const dateCalculator = new DateCalculator("2023-01-01");
    dateCalculator.addDays(5);
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays(3);
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після віднімання днів

    console.log("Test 1: Correct date format -> OK");
} catch (error) {
    console.error("Test 1 Failed:", error.message);
} finally {
    console.log("******************************");
}

try {
    const dateCalculator = new DateCalculator();
    dateCalculator.addDays(5);
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays(3);
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після віднімання днів

    console.log("Test 2: Empty constructor -> use current date");
} catch (error) {
    console.error("Test 2 Failed:", error.message);
} finally {
    console.log("******************************");
}

try {
    const dateCalculator = new DateCalculator("hello");
    dateCalculator.addDays(5);
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays(3);
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після віднімання днів

    console.log("Test 3 Failed: Exception was not thrown for invalid date");
} catch (error) {
    console.log(
        "Test 3: Incorrect date format -> successfully caught exception:",
        error.message,
    );
} finally {
    console.log("******************************");
}

try {
    const dateCalculator = new DateCalculator("2023-01-01");
    dateCalculator.addDays("hello");
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays(3);
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після віднімання днів

    console.log("Test 4 Failed: Exception was not thrown for invalid argument");
} catch (error) {
    console.log(
        "Test 4: Incorrect method argument -> successfully caught exception:",
        error.message,
    );
} finally {
    console.log("******************************");
}

try {
    const dateCalculator = new DateCalculator("2023-01-01");
    dateCalculator.addDays(5);
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays("hi");
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів
    console.log(dateCalculator.getResultV2()); // Виводить нову дату після віднімання днів

    console.log("Test 5 Failed: Exception was not thrown for invalid argument");
} catch (error) {
    console.log(
        "Test 5: Incorrect method argument -> successfully caught exception:",
        error.message,
    );
}

console.log(
    "******************************\n" +
        "Task 4 - Optimised Variant (memory-efficient)\n" +
        "******************************",
);
/*export*/ function DateCalculatorOldSchoolOptimised(initialDate) {
    this._date = initialDate === undefined ? new Date() : new Date(initialDate);

    if (isNaN(this._date)) {
        throw new TypeError(
            `Invalid date format provided to DateCalculator. Received: "${initialDate}"`,
        );
    }
}

DateCalculatorOldSchoolOptimised.prototype.addDays = function (days) {
    checkArgument(days, "days");
    this._date.setDate(this._date.getDate() + days);
};

DateCalculatorOldSchoolOptimised.prototype.subtractDays = function (days) {
    checkArgument(days, "days");
    this._date.setDate(this._date.getDate() - days);
};

DateCalculatorOldSchoolOptimised.prototype.getResult = function () {
    return this._date.toLocaleDateString("sv-SE");
};

function checkArgument(value, name) {
    if (!Number.isFinite(value)) {
        throw new TypeError(
            `Argument ${name} must be a finite number. Received: "${value}" (type: ${typeof value})`,
        );
    }
}

try {
    const dateCalculator = new DateCalculatorOldSchoolOptimised("2023-01-01");
    dateCalculator.addDays(5);
    console.log(dateCalculator.getResult()); // Виводить нову дату після додавання днів

    dateCalculator.subtractDays(3);
    console.log(dateCalculator.getResult()); // Виводить нову дату після віднімання днів

    console.log("Correct date format -> OK");
} catch (error) {
    console.error(error.message);
}

// export { doubleArrayElements, sumArray, SkillsManager, DateCalculator }
