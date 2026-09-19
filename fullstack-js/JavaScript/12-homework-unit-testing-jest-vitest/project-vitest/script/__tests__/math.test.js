import * as math from "../math.js";

describe("Module: math", () => {
    describe("Function: sum()", () => {
        describe("with positive integers", () => {
            test("correctly add two positive integers", () => {
                expect(math.sum(2, 3)).toBe(5);
            });

            test("correctly add larger positive integers", () => {
                expect(math.sum(33, 17)).toBe(50);
            });
        });

        describe("with negative integers", () => {
            test("return a negative result when adding a larger negative integer", () => {
                expect(math.sum(2, -3)).toBe(-1);
            });

            test("return a positive result when adding a smaller negative integer", () => {
                expect(math.sum(33, -17)).toBe(16);
            });

            test("correctly add two negative integers", () => {
                expect(math.sum(-2, -3)).toBe(-5);
            });

            test("correctly add larger negative integers", () => {
                expect(math.sum(-33, -17)).toBe(-50);
            });

            test("double the negative number when added to itself", () => {
                expect(math.sum(-5, -5)).toBe(-10);
            });
        });

        describe("with zero operations", () => {
            test("return the same number when zero is added on the right", () => {
                expect(math.sum(33, 0)).toBe(33);
            });

            test("return the same number when zero is added on the left", () => {
                expect(math.sum(0, 33)).toBe(33);
            });

            test("return zero when adding zero to zero", () => {
                expect(math.sum(0, 0)).toBe(0);
            });

            test("return the negative number when adding zero to it on the left", () => {
                expect(math.sum(0, -5)).toBe(-5);
            });

            test("return the negative number when adding zero to it on the right", () => {
                expect(math.sum(-5, 0)).toBe(-5);
            });

            test("return zero when adding opposite numbers starting with negative", () => {
                expect(math.sum(-5, 5)).toBe(0);
            });

            test("return zero when adding opposite numbers starting with positive", () => {
                expect(math.sum(5, -5)).toBe(0);
            });
        });

        describe("with floating-point numbers", () => {
            test("accurately add two positive floating-point numbers", () => {
                expect(math.sum(2.2, 1.4)).toBeCloseTo(3.6, 8);
            });

            test("accurately add positive and negative floating-point numbers", () => {
                expect(math.sum(2.2, -1.4)).toBeCloseTo(0.8, 8);
            });

            test("return zero when adding opposite floating-point numbers", () => {
                expect(math.sum(2.2, -2.2)).toBeCloseTo(0, 8);
            });

            test("accurately add a float to a large integer", () => {
                expect(math.sum(2.2, 100)).toBeCloseTo(102.2, 8);
            });

            test("return the same float when adding zero", () => {
                expect(math.sum(2.2, 0)).toBeCloseTo(2.2, 8);
            });

            test("handle extreme floating-point precision up to 8 decimals", () => {
                expect(math.sum(2.00005, 0.00000007)).toBeCloseTo(
                    2.00005007,
                    8,
                );
            });
        });
    });

    describe("Function: divide()", () => {
        test("throw an error when dividing by zero", () => {
            expect(() => math.divide(100, 0)).toThrow("Division by zero");
        });
    });
});
