import { z } from 'zod';

export const SignupFormSchema = z.object({
    username: z.string()
        .min(2, 'Username must be at least 2 characters')
        .max(50, 'Username must be less than 50 characters'),
    email: z.string()
        .email('Please enter a valid email')
        .max(100, 'Email is too long'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});

export const LoginFormSchema = z.object({
    email: z.string()
        .email('Please enter a valid email')
        .max(100, 'Email is too long'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
});