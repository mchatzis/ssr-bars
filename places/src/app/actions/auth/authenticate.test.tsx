// @vitest-environment node

import { LoginFormSchema, SignupFormSchema } from "@/app/actions/auth/schema";
import { LoginFormState } from "@/components/auth/LoginForm";
import { RegisterFormState } from "@/components/auth/RegisterForm";
import { createUser, EmailDoesNotExistError, EmailExistsError, getUserByCredentials, UsernameExistsError, WrongPasswordError } from "@/lib/db/models/user/user";
import { createSession } from "@/lib/session/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { authenticate, register } from './authenticate';

vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => {
        throw new Error('NEXT_REDIRECT');

    }),
}));
vi.mock('@/app/actions/auth/schema', () => ({
    SignupFormSchema: {
        safeParse: vi.fn()
    },
    LoginFormSchema: {
        safeParse: vi.fn()
    }
}));
vi.mock(import("@/lib/db/models/user/user"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        createUser: vi.fn(),
        getUserByCredentials: vi.fn()
    }
});
vi.mock("@/lib/session/session", () => ({
    createSession: vi.fn(),
}));
vi.mock('next/headers');


const mockSafeParseSignupForm = SignupFormSchema.safeParse as Mock;
const mockCreateUser = vi.mocked(createUser);

describe('register function', () => {
    beforeEach(() => {
        mockSafeParseSignupForm.mockReset();
        mockCreateUser.mockReset();
    });

    it('should return errors when form data is invalid', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParseSignupForm.mockReturnValue({
            success: false,
            error: {
                flatten: () => ({
                    fieldErrors: {
                        username: ['Required'],
                        email: ['Required'],
                        password: ['Required'],
                    },
                }),
            },
        });

        const result = await register(state, formData);

        expect(result).toEqual({
            errors: {
                username: ['Required'],
                email: ['Required'],
                password: ['Required'],
            },
            attempts: 1,
        });
    });

    it('should redirect when registration is successful', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParseSignupForm.mockReturnValue({
            success: true,
            data: { username: 'testuser', email: 'test@example.com', password: 'password123' },
        });
        mockCreateUser.mockResolvedValue('user-123');

        await expect(register(state, formData)).rejects.toThrow('NEXT_REDIRECT');
        expect(redirect).toHaveBeenCalledWith("/auth/login");
    });

    it('should return error when username already exists', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParseSignupForm.mockReturnValue({
            success: true,
            data: { username: 'existinguser', email: 'existing@example.com', password: 'password123' },
        });
        mockCreateUser.mockRejectedValue(new UsernameExistsError('Username already exists'));

        const result = await register(state, formData);

        expect(result).toEqual({
            errors: {
                username: ['Username already exists'],
                email: undefined,
                general: undefined,
            },
            attempts: 1,
        });
    });

    it('should return error when email already exists', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParseSignupForm.mockReturnValue({
            success: true,
            data: { username: 'newuser', email: 'existing@example.com', password: 'password123' },
        });
        mockCreateUser.mockRejectedValue(new EmailExistsError('Email already exists'));

        const result = await register(state, formData);

        expect(result).toEqual({
            errors: {
                email: ['Email already exists'],
                username: undefined,
                general: undefined,
            },
            attempts: 1,
        });
    });

    it('should return error when createUser fails with uncaught error', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParseSignupForm.mockReturnValue({
            success: true,
            data: { username: 'testuser', email: 'test@example.com', password: 'password123' },
        });
        mockCreateUser.mockRejectedValue(new Error('Database error'));

        const result = await register(state, formData);

        expect(result).toEqual({
            errors: {
                general: ['An unexpected error occurred.'],
                username: undefined,
                email: undefined,
            },
            attempts: 1,
        });
    });
});

const mockSafeParseLoginForm = LoginFormSchema.safeParse as Mock;
const mockGetUserByCredentials = vi.mocked(getUserByCredentials);
const mockCreateSession = vi.mocked(createSession);
const mockSet = vi.fn();
(vi.mocked(cookies) as Mock).mockReturnValue({
    set: mockSet
});

describe("authenticate function", () => {
    beforeEach(() => {
        mockSafeParseLoginForm.mockReset();
        mockGetUserByCredentials.mockReset();
        mockCreateSession.mockReset();
    });

    it("should return errors when form data is invalid", async () => {
        const state: LoginFormState = {};
        const formData = new FormData();

        mockSafeParseLoginForm.mockReturnValue({
            success: false,
            error: {
                flatten: () => ({
                    fieldErrors: {
                        email: ["Required"],
                        password: ["Required"],
                    },
                }),
            },
        });

        const result = await authenticate(state, formData);

        expect(result).toEqual({
            errors: {
                email: ["Required"],
                password: ["Required"],
            },
            attempts: 1,
        });
    });

    it("should redirect when authentication is successful", async () => {
        const state: LoginFormState = {};
        const formData = new FormData();
        const userIdentity = {
            userId: "user-123",
            username: "testuser"
        }
        const validatedData = {
            email: "test@example.com",
            password: "password123"
        }

        mockSafeParseLoginForm.mockReturnValue({
            success: true,
            data: validatedData,
        });
        mockGetUserByCredentials.mockResolvedValue(userIdentity);

        await expect(authenticate(state, formData)).rejects.toThrow("NEXT_REDIRECT");

        expect(mockGetUserByCredentials).toHaveBeenCalledWith(validatedData);
        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should return error when email does not exist", async () => {
        const state: LoginFormState = {};
        const formData = new FormData();

        mockSafeParseLoginForm.mockReturnValue({
            success: true,
            data: { email: "nonexistent@example.com", password: "password123" },
        });
        mockGetUserByCredentials.mockRejectedValue(new EmailDoesNotExistError("Email does not exist"));

        const result = await authenticate(state, formData);

        expect(result).toEqual({
            errors: {
                email: ["Email does not exist"],
                password: undefined,
                general: undefined,
            },
            attempts: 1,
        });
    });

    it("should return error when password is wrong", async () => {
        const state: LoginFormState = {};
        const formData = new FormData();

        mockSafeParseLoginForm.mockReturnValue({
            success: true,
            data: { email: "test@example.com", password: "wrongpassword" },
        });
        mockGetUserByCredentials.mockRejectedValue(new WrongPasswordError("Wrong password"));

        const result = await authenticate(state, formData);

        expect(result).toEqual({
            errors: {
                password: ["Wrong password"],
                email: undefined,
                general: undefined,
            },
            attempts: 1,
        });
    });

    it("should return error for unexpected failures", async () => {
        const state: LoginFormState = {};
        const formData = new FormData();

        mockSafeParseLoginForm.mockReturnValue({
            success: true,
            data: { email: "test@example.com", password: "password123" },
        });
        mockGetUserByCredentials.mockRejectedValue(new Error("Unexpected mock error"));

        const result = await authenticate(state, formData);

        expect(result).toEqual({
            errors: {
                general: ["An unexpected error occurred."],
                email: undefined,
                password: undefined,
            },
            attempts: 1,
        });
    });
});