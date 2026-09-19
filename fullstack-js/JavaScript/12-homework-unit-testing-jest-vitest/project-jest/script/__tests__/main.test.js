import * as main from "../main.js";

describe("Module: main", () => {
    describe("Function: ageClassification()", () => {
        test("return null for negative age", () => {
            expect(main.ageClassification(-1)).toBeNull();
        });

        test("return null for zero age", () => {
            expect(main.ageClassification(0)).toBeNull();
        });

        test("return 'Дитинство' for the minimum valid age", () => {
            expect(main.ageClassification(1)).toBe("Дитинство");
        });

        test("return 'Дитинство' for the maximum childhood age boundary", () => {
            expect(main.ageClassification(24)).toBe("Дитинство");
        });

        test("return 'Молодість' for just above the childhood boundary", () => {
            expect(main.ageClassification(24.01)).toBe("Молодість");
        });

        test("return 'Молодість' for the maximum youth age boundary", () => {
            expect(main.ageClassification(44)).toBe("Молодість");
        });

        test("return 'Зрілість' for just above the youth boundary", () => {
            expect(main.ageClassification(44.01)).toBe("Зрілість");
        });

        test("return 'Зрілість' for the maximum maturity age boundary", () => {
            expect(main.ageClassification(65)).toBe("Зрілість");
        });

        test("return 'Старість' for just above the maturity boundary", () => {
            expect(main.ageClassification(65.1)).toBe("Старість");
        });

        test("return 'Старість' for the maximum old age boundary", () => {
            expect(main.ageClassification(75)).toBe("Старість");
        });

        test("return 'Довголіття' for just above the old age boundary", () => {
            expect(main.ageClassification(75.01)).toBe("Довголіття");
        });

        test("return 'Довголіття' for the maximum longevity boundary", () => {
            expect(main.ageClassification(90)).toBe("Довголіття");
        });

        test("return 'Рекорд' for just above the longevity boundary", () => {
            expect(main.ageClassification(90.01)).toBe("Рекорд");
        });

        test("return 'Рекорд' for the maximum possible human age boundary", () => {
            expect(main.ageClassification(122)).toBe("Рекорд");
        });

        test("return null for just above the maximum human age boundary", () => {
            expect(main.ageClassification(122.01)).toBeNull();
        });

        test("return null for extreme age values", () => {
            expect(main.ageClassification(150)).toBeNull();
        });
    });

    describe("Function: weekFn()", () => {
        test("return 'Понеділок' for day 1", () => {
            expect(main.weekFn(1)).toBe("Понеділок");
        });

        test("return 'Вівторок' for day 2", () => {
            expect(main.weekFn(2)).toBe("Вівторок");
        });

        test("return 'Середа' for day 3", () => {
            expect(main.weekFn(3)).toBe("Середа");
        });

        test("return 'Четвер' for day 4", () => {
            expect(main.weekFn(4)).toBe("Четвер");
        });

        test("return 'П'ятниця' for day 5", () => {
            expect(main.weekFn(5)).toBe("П'ятниця");
        });

        test("return 'Субота' for day 6", () => {
            expect(main.weekFn(6)).toBe("Субота");
        });

        test("return 'Неділя' for day 7", () => {
            expect(main.weekFn(7)).toBe("Неділя");
        });

        test("return null for out-of-range integer", () => {
            expect(main.weekFn(9)).toBeNull();
        });

        test("return null for floating-point number", () => {
            expect(main.weekFn(1.5)).toBeNull();
        });

        test("return null for string input due to strict comparison", () => {
            expect(main.weekFn("2")).toBeNull();
        });
    });
});
