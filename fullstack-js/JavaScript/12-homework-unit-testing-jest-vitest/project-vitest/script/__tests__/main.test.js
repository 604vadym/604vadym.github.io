"use strict";
// @vitest-environment happy-dom
import * as main from "../main.js";
import { vi } from "vitest";

describe("Module: main", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = "";
    });

    describe("Function: handleButtonClick()", () => {
        const buttonId = "testButton";
        const expectedMessage = "Hello from Vitest";

        beforeEach(() => {
            document.body.innerHTML = `<button id='${buttonId}'>Click me</button>`;
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
        const clientX = 888;
        const clientY = 333;
        let result;

        beforeEach(() => {
            document.body.innerHTML = `
            <button id='${runButtonId}'>Run</button>
            <button id='${stopButtonId}'>Stop</button>
            `;
            result = main.initMouseTracking(runButtonId, stopButtonId);
        });

        afterEach(() => {
            main.stopMouseTracking();
        });

        test("return true upon successful DOM elements initialisation", () => {
            expect(result).toBe(true);
        });

        test("log correct mouse coordinates to the console on mousemove event", () => {
            const logSpy = vi.spyOn(console, "log");
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

        test("stop tracking mouse movement and do not log coordinates after the stop button is clicked", () => {
            const logSpy = vi.spyOn(console, "log");
            const removeEventListenerSpy = vi.spyOn(
                document,
                "removeEventListener",
            );

            document.getElementById(runButtonId).click();
            document.getElementById(stopButtonId).click();

            const mouseMoveEvent = new MouseEvent("mousemove", {
                clientX,
                clientY,
                bubbles: true,
            });
            document.dispatchEvent(mouseMoveEvent);

            expect(logSpy).not.toHaveBeenCalledWith(
                expect.stringContaining(
                    `Mouse X: ${clientX}, Mouse Y: ${clientY}`,
                ),
            );
        });

        test("handle multiple clicks on the run button without duplicating event listeners", () => {
            const logSpy = vi.spyOn(console, "log");
            document.getElementById(runButtonId).click();
            document.getElementById(runButtonId).click();

            logSpy.mockClear();
            const mouseMoveEvent = new MouseEvent("mousemove", {
                clientX,
                clientY,
                bubbles: true,
            });
            document.dispatchEvent(mouseMoveEvent);

            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    `Mouse X: ${clientX}, Mouse Y: ${clientY}`,
                ),
            );
        });

        test("not trigger the stop tracking process if tracking is already inactive", () => {
            const stopMouseTrackingSpy = vi.spyOn(main, "stopMouseTracking");

            document.getElementById(runButtonId).click();
            document.getElementById(stopButtonId).click();
            stopMouseTrackingSpy.mockClear();
            document.getElementById(stopButtonId).click();

            expect(stopMouseTrackingSpy).not.toHaveBeenCalled();
        });

        test("return false and log an error if the run button element is missing", () => {
            const errorSpy = vi.spyOn(console, "error");
            const invalidButtonId = "unknown-id";

            const result = main.initMouseTracking(
                invalidButtonId,
                stopButtonId,
            );
            expect(result).toBe(false);
            expect(errorSpy).toHaveBeenCalled();
        });

        test("return false and log an error if the stop button element is missing", () => {
            const errorSpy = vi.spyOn(console, "error");
            const invalidButtonId = "unknown-id";

            const result = main.initMouseTracking(runButtonId, invalidButtonId);
            expect(result).toBe(false);
            expect(errorSpy).toHaveBeenCalled();
        });
    });

    describe("Function: setupEventDelegation()", () => {
        const listId = "testList";

        test("log the correct text when a direct list item element is clicked", () => {
            const expectedElementText = "Item 1";
            const container = document.createElement("div");
            container.innerHTML = `
                <ul id="${listId}">
                  <li>${expectedElementText}</li>
                  <li>Item 2</li>
                  <li>Item 3</li>
                </ul>
                `;
            document.body.appendChild(container);

            const logSpy = vi.spyOn(console, "log");
            main.setupEventDelegation(`#${listId}`);
            const list = document.getElementById(listId);
            list.firstElementChild.click();

            expect(logSpy).toHaveBeenCalledWith(
                `Item clicked: ${expectedElementText}`,
            );
        });

        test("log the correct text even when a nested child element inside the list item is clicked", () => {
            const expectedElementText = "Item 3 with span";
            const container = document.createElement("div");
            container.innerHTML = `
                <ul id="${listId}">
                  <li>Item 1</li>
                  <li>Item 2</li>
                  <li><span>${expectedElementText}</span></li>
                </ul>
                `;
            document.body.appendChild(container);

            const logSpy = vi.spyOn(console, "log");
            main.setupEventDelegation(`#${listId}`);
            const li = document.querySelector(`#${listId} li:nth-child(3)`);
            li.firstElementChild.click();

            expect(logSpy).toHaveBeenCalledWith(
                `Item clicked: ${expectedElementText}`,
            );
        });

        test("log an error if the target list container element does not exist in the DOM", () => {
            const errorSpy = vi.spyOn(console, "error");
            main.setupEventDelegation(`#${listId}`);

            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining(listId),
            );
        });

        test("not log anything when the container itself is clicked without targeting a list item", () => {
            const container = document.createElement("div");
            container.innerHTML = `
                <ul id="${listId}">
                </ul>
                `;
            document.body.appendChild(container);

            const logSpy = vi.spyOn(console, "log");
            main.setupEventDelegation(`#${listId}`);
            const list = document.getElementById(listId);
            list.click();

            expect(logSpy).not.toHaveBeenCalled();
        });
    });
});
