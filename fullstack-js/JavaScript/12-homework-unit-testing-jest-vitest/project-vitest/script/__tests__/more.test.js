"use strict";
// @vitest-environment happy-dom
import * as more from "../more.js";
import { vi } from "vitest";

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

    describe("Function: loadUserProfile()", () => {
        const expectedToken = "validToken";

        beforeEach(() => {
            vi.spyOn(console, "warn").mockImplementation(() => {});
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test("return user profile data and attach correct Authorization bearer token to fetch headers when a valid token is present", async () => {
            const expectedObj = { msg: "Hello from fetch" };

            const localStorageSpy = vi
                .spyOn(localStorage, "getItem")
                .mockReturnValue(expectedToken);
            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(expectedObj),
            });

            const result = await more.loadUserProfile();
            const fetchUrl = fetchSpy.mock.calls[0][0];
            const fetchOptions = fetchSpy.mock.calls[0][1];

            expect(fetchUrl).toBe("https://example.com");
            expect(fetchOptions.headers.Authorization).toBe(
                `Bearer ${expectedToken}`,
            );
            expect(result).toEqual(expectedObj);
        });

        test("return false and prevent fetch request when auth token is missing in localStorage", async () => {
            const localStorageSpy = vi
                .spyOn(localStorage, "getItem")
                .mockReturnValue(null);
            const fetchSpy = vi.spyOn(globalThis, "fetch");

            const result = await more.loadUserProfile();
            expect(fetchSpy).not.toHaveBeenCalled();
            expect(result).toEqual(false);
        });

        test("return false when network request fails with a non-ok response status", async () => {
            vi.spyOn(localStorage, "getItem").mockReturnValue(expectedToken);
            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: false,
            });

            const result = await more.loadUserProfile();
            expect(fetchSpy).toHaveBeenCalled();
            expect(result).toEqual(false);
        });

        test("return false and handle network exceptions when fetch throws a TypeError", async () => {
            vi.spyOn(localStorage, "getItem").mockReturnValue(expectedToken);
            const fetchSpy = vi
                .spyOn(globalThis, "fetch")
                .mockRejectedValue(new TypeError("Failed to fetch"));

            const result = await more.loadUserProfile();
            expect(fetchSpy).toHaveBeenCalled();
            expect(result).toEqual(false);
        });
    });

    describe("Function: fetchData() with async/await", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        test("return filtered users array when role matches existing records", async () => {
            const promise = more.fetchData("user");
            vi.advanceTimersByTime(1000);
            const result = await promise;
            expect(result).toEqual([
                { id: 2, name: "Bob", role: "user" },
                { id: 3, name: "Charlie", role: "user" },
            ]);
        });

        test("return an empty array when the provided role does not exist in the database", async () => {
            const promise = more.fetchData("hacker");
            vi.advanceTimersByTime(1000);
            const result = await promise;
            expect(result).toEqual([]);
        });

        test("reject with a validation error when no role argument is provided", async () => {
            const promise = more.fetchData();
            vi.advanceTimersByTime(1000);
            await expect(promise).rejects.toThrow(
                "Role is required for filtering",
            );
        });
    });

    describe("Function: fetchData() with promise & then", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        test("return filtered users array when role matches existing records", () => {
            const promise = more.fetchData("admin");
            vi.advanceTimersByTime(1000);
            return promise.then((result) => {
                expect(result).toEqual([
                    { id: 1, name: "Alice", role: "admin" },
                ]);
            });
        });

        test("return an empty array when the provided role does not exist in the database", async () => {
            const promise = more.fetchData("banned");
            vi.advanceTimersByTime(1000);
            return promise.then((result) => {
                expect(result).toEqual([]);
            });
        });

        test("reject with a validation error when no role argument is provided", async () => {
            const promise = more.fetchData();
            vi.advanceTimersByTime(1000);
            return promise.catch((error) => {
                expect(error.message).toBe("Role is required for filtering");
            });
        });
    });

    describe("Function: getUser()", () => {
        const expectedId = 11;

        afterEach(() => {
            vi.restoreAllMocks();
        });

        test("return user data and call the correct endpoint URL when a valid numeric ID is provided", async () => {
            const expectedObj = { userName: "John" };

            const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: true,
                status: 200,
                json: vi.fn().mockResolvedValue(expectedObj),
            });

            const result = await more.getUser(expectedId);
            const fetchOptions = fetchSpy.mock.calls[0][0];

            expect(fetchOptions).toBe(
                `https://example.com/users/${expectedId}`,
            );
            expect(result).toEqual(expectedObj);
        });

        test("return null when the server responds with a 404 Not Found status", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: false,
                status: 404,
            });

            const result = await more.getUser(expectedId);
            expect(result).toBeNull();
        });

        test("return null when the network request completes with any other non-ok status", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue({
                ok: false,
                status: 500,
            });

            const result = await more.getUser(expectedId);
            expect(result).toBeNull();
        });

        test("return null and catch critical exceptions when fetch throws a TypeError", async () => {
            vi.spyOn(globalThis, "fetch").mockRejectedValue(
                new TypeError("Failed to fetch"),
            );

            const result = await more.getUser(expectedId);
            expect(result).toBeNull();
        });

        test("throw a validation error when the provided user ID is not a numeric type", async () => {
            const fetchSpy = vi.spyOn(globalThis, "fetch");

            await expect(more.getUser("11")).rejects.toThrow("Invalid User ID");
            expect(fetchSpy).not.toHaveBeenCalled();
        });

        test("throw a validation error when the provided user ID is exactly zero", async () => {
            const fetchSpy = vi.spyOn(globalThis, "fetch");

            await expect(more.getUser(0)).rejects.toThrow("Invalid User ID");
            expect(fetchSpy).not.toHaveBeenCalled();
        });

        test("throw a validation error when the provided user ID is a negative value", async () => {
            const fetchSpy = vi.spyOn(globalThis, "fetch");

            await expect(more.getUser(-1)).rejects.toThrow("Invalid User ID");
            expect(fetchSpy).not.toHaveBeenCalled();
        });
    });
});
