"use strict";
import * as math from "../math.js";
import { vi } from "vitest";

describe("Module: math", () => {
    describe("Function: sum()", () => {
        test("correctly calculate the sum of two integers", () => {
            expect(math.sum(2, 3)).toBe(5);
        });

        test("accurately add floating-point numbers", () => {
            expect(math.sum(2.2, 1.4)).toBeCloseTo(3.6, 8);
        });
    });

    describe("Function: divide()", () => {
        test("correctly divide two numbers", () => {
            expect(math.divide(50, 2)).toBe(25);
        });

        test("throw an error when dividing by zero", () => {
            expect(() => math.divide(100, 0)).toThrow("Division by zero");
        });
    });
});
