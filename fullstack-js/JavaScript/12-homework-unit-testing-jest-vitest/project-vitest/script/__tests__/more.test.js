// @vitest-environment happy-dom
import * as more from "../more.js";

describe("Module: more", () => {
    describe("Function: validateAndSubmit()", () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

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

    describe("Function: confirmAndSend()", () => {
        const correctBtnId = "correct-id";
        let button = null;

        beforeEach(() => {
            button = document.createElement("button");
            button.id = correctBtnId;
            document.body.appendChild(button);
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
            vi.restoreAllMocks();
            document.body.innerHTML = "";
        });

        test("trigger onConfirm callback with accurate structured event data and timestamp on click", () => {
            const mockCallback = vi.fn();
            const mockDate = new Date(2026, 2, 23);
            vi.setSystemTime(mockDate);

            const expectedData = {
                event: "user_clicked",
                timestamp: mockDate.valueOf(),
            };

            const result = more.confirmAndSend(correctBtnId, mockCallback);
            expect(result).toBe(true);

            button.click();
            expect(mockCallback).toHaveBeenCalledTimes(1);
            expect(mockCallback).toHaveBeenCalledWith(expectedData);
        });

        test("return false and do not attach listener if button ID does not match", () => {
            const wrongBtnId = "wrong-id";
            const mockCallback = vi.fn();

            const result = more.confirmAndSend(wrongBtnId, mockCallback);
            expect(result).toBe(false);

            button.click();
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
