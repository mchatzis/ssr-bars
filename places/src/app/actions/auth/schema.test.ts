// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { SignupFormSchema } from './schema';

describe('SignupFormSchema', () => {
    it('should pass with valid input', () => {
        const validData = {
            username: 'JaneDoe',
            email: 'janedoe@example.com',
            password: 'Password123'
        };

        const result = SignupFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
    });

    describe('Username validation', () => {
        it('should fail if username is too short', () => {
            const invalidData = {
                username: 'J',
                email: 'janedoe@example.com',
                password: 'Password123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_small',
                        message: 'Username must be at least 2 characters',
                        path: ['username']
                    })
                ])
            );
        });

        it('should fail if username is too long', () => {
            const invalidData = {
                username: 'J'.repeat(51),
                email: 'janedoe@example.com',
                password: 'Password123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_big',
                        message: 'Username must be less than 50 characters',
                        path: ['username']
                    })
                ])
            );
        });
    });

    describe('Email validation', () => {
        it('should fail if email is invalid', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'not-an-email',
                password: 'Password123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'invalid_string',
                        message: 'Please enter a valid email',
                        path: ['email']
                    })
                ])
            );
        });

        it('should fail if email is too long', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'a'.repeat(101) + '@example.com',
                password: 'Password123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_big',
                        message: 'Email is too long',
                        path: ['email']
                    })
                ])
            );
        });
    });

    describe('Password validation', () => {
        it('should fail if password is too short', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'janedoe@example.com',
                password: 'P1a'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_small',
                        message: 'Password must be at least 8 characters',
                        path: ['password']
                    })
                ])
            );
        });

        it('should fail if password is too long', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'janedoe@example.com',
                password: 'P1a'.repeat(34)
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_big',
                        message: 'Password must be less than 100 characters',
                        path: ['password']
                    })
                ])
            );
        });

        it('should fail if password does not contain an uppercase letter', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'janedoe@example.com',
                password: 'password123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'invalid_string',
                        message: 'Password must contain at least one uppercase letter',
                        path: ['password']
                    })
                ])
            );
        });

        it('should fail if password does not contain a lowercase letter', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'janedoe@example.com',
                password: 'PASSWORD123'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'invalid_string',
                        message: 'Password must contain at least one lowercase letter',
                        path: ['password']
                    })
                ])
            );
        });

        it('should fail if password does not contain a number', () => {
            const invalidData = {
                username: 'JaneDoe',
                email: 'janedoe@example.com',
                password: 'Password'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'invalid_string',
                        message: 'Password must contain at least one number',
                        path: ['password']
                    })
                ])
            );
        });
    });

    describe('Combined invalid inputs', () => {
        it('should fail with multiple errors', () => {
            const invalidData = {
                username: '',
                email: 'invalid',
                password: 'short'
            };

            const result = SignupFormSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            expect(result.error.issues).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        code: 'too_small',
                        message: 'Username must be at least 2 characters',
                        path: ['username']
                    }),
                    expect.objectContaining({
                        code: 'invalid_string',
                        message: 'Please enter a valid email',
                        path: ['email']
                    }),
                    expect.objectContaining({
                        code: 'too_small',
                        message: 'Password must be at least 8 characters',
                        path: ['password']
                    })
                ])
            );
        });
    });
});
