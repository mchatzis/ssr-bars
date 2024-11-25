import { SignupFormSchema } from "@/app/actions/auth/schema";
import { RegisterFormState } from "@/components/auth/RegisterForm";
import { createUser, EmailExistsError, UsernameExistsError } from "@/lib/db/models/user";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { register } from './authenticate';

vi.mock('@/app/actions/auth/schema', () => ({
    SignupFormSchema: {
        safeParse: vi.fn()
    }
}));
vi.mock(import("@/lib/db/models/user"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        createUser: vi.fn()
    }
});
vi.mock('next/navigation', () => ({
    redirect: vi.fn(() => {
        throw new Error('NEXT_REDIRECT');
    }),
}));

const mockSafeParse = SignupFormSchema.safeParse as Mock;
const mockCreateUser = vi.mocked(createUser);

describe('register function', () => {
    beforeEach(() => {
        mockSafeParse.mockReset();
        mockCreateUser.mockReset();
    });

    it('should return errors when form data is invalid', async () => {
        const state: RegisterFormState = {};
        const formData = new FormData();

        mockSafeParse.mockReturnValue({
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

        mockSafeParse.mockReturnValue({
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

        mockSafeParse.mockReturnValue({
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

        mockSafeParse.mockReturnValue({
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

        mockSafeParse.mockReturnValue({
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