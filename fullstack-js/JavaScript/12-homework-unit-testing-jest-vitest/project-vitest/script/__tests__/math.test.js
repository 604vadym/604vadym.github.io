import * as math from "../math.js";

describe("Module: math", () => {
    describe("Function: sum()", () => {
        test("should correctly add two positive integers", () => {
            expect(math.sum(2, 3)).toBe(5);
        });

        test("should correctly add larger positive integers", () => {
            expect(math.sum(33, 17)).toBe(50);
        });

        test("should return a negative result when adding a larger negative integer", () => {
            expect(math.sum(2, -3)).toBe(-1);
        });

        test("should return a positive result when adding a smaller negative integer", () => {
            expect(math.sum(33, -17)).toBe(16);
        });

        test("should correctly add two negative integers", () => {
            expect(math.sum(-2, -3)).toBe(-5);
        });

        test("should correctly add larger negative integers", () => {
            expect(math.sum(-33, -17)).toBe(-50);
        });

        test("should return the same number when zero is added on the right", () => {
            expect(math.sum(33, 0)).toBe(33);
        });

        test("should return the same number when zero is added on the left", () => {
            expect(math.sum(0, 33)).toBe(33);
        });

        test("should return zero when adding zero to zero", () => {
            expect(math.sum(0, 0)).toBe(0);
        });

        test("should return the negative number when adding zero to it on the left", () => {
            expect(math.sum(0, -5)).toBe(-5);
        });

        test("should return the negative number when adding zero to it on the right", () => {
            expect(math.sum(-5, 0)).toBe(-5);
        });

        test("should return zero when adding opposite numbers starting with negative", () => {
            expect(math.sum(-5, 5)).toBe(0);
        });

        test("should return zero when adding opposite numbers starting with positive", () => {
            expect(math.sum(5, -5)).toBe(0);
        });

        test("should double the negative number when added to itself", () => {
            expect(math.sum(-5, -5)).toBe(-10);
        });

        test("should accurately add two positive floating-point numbers", () => {
            expect(math.sum(2.2, 1.4)).toBeCloseTo(3.6, 8);
        });

        test("should accurately add positive and negative floating-point numbers", () => {
            expect(math.sum(2.2, -1.4)).toBeCloseTo(0.8, 8);
        });

        test("should return zero when adding opposite floating-point numbers", () => {
            expect(math.sum(2.2, -2.2)).toBeCloseTo(0, 8);
        });

        test("should accurately add a float to a large integer", () => {
            expect(math.sum(2.2, 100)).toBeCloseTo(102.2, 8);
        });

        test("should return the same float when adding zero", () => {
            expect(math.sum(2.2, 0)).toBeCloseTo(2.2, 8);
        });

        test("should handle extreme floating-point precision up to 8 decimals", () => {
            expect(math.sum(2.00005, 0.00000007)).toBeCloseTo(2.00005007, 8);
        });
    });
});
