import { describe, expect, it, vi } from "vitest";
import { validateExpireVariable } from "./constants";

describe("validateExpireVariable", () => {
    const DEFAULT_SESSION_EXPIRE_IN_SECONDS = 60 * 60 * 24;

    it("should return the default value if SESSION_EXPIRE_IN_SECONDS is not set", () => {
        vi.stubEnv("SESSION_EXPIRE_IN_SECONDS", undefined);
        expect(validateExpireVariable()).toBe(DEFAULT_SESSION_EXPIRE_IN_SECONDS);
    });

    it("should return the parsed integer value if SESSION_EXPIRE_IN_SECONDS is a valid integer", () => {
        vi.stubEnv("SESSION_EXPIRE_IN_SECONDS", "7200"); // 2 hours
        expect(validateExpireVariable()).toBe(7200);
    });

    it("should return the default value if SESSION_EXPIRE_IN_SECONDS is not a valid number", () => {
        vi.stubEnv("SESSION_EXPIRE_IN_SECONDS", "invalid_number");
        expect(validateExpireVariable()).toBe(DEFAULT_SESSION_EXPIRE_IN_SECONDS);
    });

    it("should return the default value if SESSION_EXPIRE_IN_SECONDS is a negative number", () => {
        vi.stubEnv("SESSION_EXPIRE_IN_SECONDS", "-3600");
        expect(validateExpireVariable()).toBe(DEFAULT_SESSION_EXPIRE_IN_SECONDS);
    });
});
