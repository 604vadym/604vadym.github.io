// @vitest-environment happy-dom
import * as main from "../main.js";

describe("Module: main", () => {
    describe("Function: handleButtonClick()", () => {
        const buttonId = "testButton";
        const expectedMessage = "Hello from Vitest";

        beforeEach(() => {
            document.body.innerHTML = `<button id='${buttonId}'>Click me</button>`;
        });

        afterEach(() => {
            document.body.innerHTML = "";
            vi.restoreAllMocks();
        });

        test("logs the message to the console on button click", () => {
            const logSpy = vi.spyOn(console, "log");
            main.handleButtonClick("testButton", expectedMessage);
            document.getElementById(buttonId).click();
            expect(logSpy).toHaveBeenCalledWith(expectedMessage);
        });

        test("log an error to the console when the button is not found", () => {
            const errorSpy = vi.spyOn(console, "error");
            const invalidButtonId = "unknown-id";
            main.handleButtonClick(invalidButtonId, expectedMessage);
            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining(invalidButtonId),
            );
        });
    });

    describe("Function: initMouseTracking()", () => {
        const runButtonId = "buttonRunMouseTrack";
        const stopButtonId = "buttonStopMouseTrack";

        beforeEach(() => {
            document.body.innerHTML = `
            <button id='${runButtonId}'>Run</button>
            <button id='${stopButtonId}'>Stop</button>
            `;
        });

        afterEach(() => {
            main.stopMouseTracking();
            document.body.innerHTML = "";
            vi.restoreAllMocks();
        });

        test("return true upon successful DOM elements initialisation", () => {
            const result = main.initMouseTracking(runButtonId, stopButtonId);
            expect(result).toBe(true);
        });

        test("log correct mouse coordinates to the console on mousemove event", () => {
            const logSpy = vi.spyOn(console, "log");
            const clientX = 888;
            const clientY = 333;

            document.getElementById(runButtonId).click();

            const mouseMoveEvent = new MouseEvent("mousemove", {
                clientX,
                clientY,
                bubbles: true,
            });
            document.dispatchEvent(mouseMoveEvent);

            expect(logSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    `Mouse X: ${clientX}, Mouse Y: ${clientY}`,
                ),
            );
        });
    });
});
