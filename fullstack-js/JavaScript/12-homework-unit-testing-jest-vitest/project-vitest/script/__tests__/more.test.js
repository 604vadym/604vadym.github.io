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

    describe("Function: loadUserProfile()", () => {
        const expectedToken = "validToken";

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
            const fetchOptions = fetchSpy.mock.calls[0][1];

            expect(fetchOptions.headers.Authorization).toMatch(
                new RegExp(`${expectedToken}$`),
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
});
