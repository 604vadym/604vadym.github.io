// @vitest-environment happy-dom
import * as main from "../main.js";

describe("Module: main", () => {
    describe("Function: handleButtonClick()", () => {
        const buttonId = "testButton";
        const msgAssert = "Hello from Vitest";

        beforeEach(() => {
            document.body.innerHTML = `<button id='${buttonId}'>Click me</button>`;
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test("logs the message to the console on button click", () => {
            const logSpy = vi.spyOn(console, "log");
            main.handleButtonClick("testButton", msgAssert);
            document.getElementById(buttonId).click();
            expect(logSpy).toHaveBeenCalledWith(msgAssert);
        });

        test("log an error to the console when the button is not found", () => {
            const errorSpy = vi.spyOn(console, "error");
            const nonexistentBtnId = "nonexistent";
            main.handleButtonClick(nonexistentBtnId, msgAssert);
            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining(nonexistentBtnId),
            );
        });
    });
});
