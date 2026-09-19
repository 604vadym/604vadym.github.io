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
});
