import * as more from "../more.js";

describe("Module: more", () => {
    describe("Function: validateAndSubmit()", () => {
        test("trigger onSuccess callback with correct data when text is valid", () => {
            const expectedText = "Hello from Vitest";
            const mockCallback = vi.fn();
            const result = more.validateAndSubmit(expectedText, mockCallback);

            expect(result).toBe(true);
            expect(mockCallback).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledWith(expectedText);
        });

        test("do not trigger onSuccess callback when text is too short", () => {
            const shortText = "hi";
            const mockCallback = vi.fn();
            const result = more.validateAndSubmit(shortText, mockCallback);

            expect(result).toBe(false);
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
