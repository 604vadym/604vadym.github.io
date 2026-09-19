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
});
