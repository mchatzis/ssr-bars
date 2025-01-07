'use server'

import { LoginFormSchema, SignupFormSchema } from "@/app/actions/auth/schema";
import { LoginFormState } from "@/components/auth/LoginForm";
import { RegisterFormState } from "@/components/auth/RegisterForm";
import { createUser, CreateUserInput, EmailDoesNotExistError, EmailExistsError, getUserIdentity, GetUserInput, UsernameExistsError, WrongPasswordError } from "@/lib/db/models/user/user";
import { createSession } from "@/lib/session/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    const attempts = (state?.attempts ?? 0) + 1;

    try {
        const validatedFields = SignupFormSchema.safeParse({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                attempts,
            };
        }

        const validatedData: CreateUserInput = validatedFields.data;
        const userId = await createUser(validatedData);
        console.log("Successful registration of user: ", userId)

    } catch (error) {
        const usernameError = error instanceof UsernameExistsError ? [error.message] : undefined;
        const emailError = error instanceof EmailExistsError ? [error.message] : undefined;
        const generalError = (!usernameError && !emailError) ? ['An unexpected error occurred.'] : undefined;

        return {
            errors: {
                username: usernameError,
                email: emailError,
                general: generalError
            },
            attempts,
        };
    }

    redirect('/auth/login')
}

export async function authenticate(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
    const attempts = (state?.attempts ?? 0) + 1;

    try {
        const validatedFields = LoginFormSchema.safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                attempts,
            };
        }

        const validatedData: GetUserInput = validatedFields.data;
        const { userId, username } = await getUserIdentity(validatedData);
        console.log("Successful login of user: ", userId);

        await createSession({
            sub: userId,
            username: username
        });

        cookies().set('username', username);

    } catch (error) {
        const passwordError = error instanceof WrongPasswordError ? [error.message] : undefined;
        const emailError = error instanceof EmailDoesNotExistError ? [error.message] : undefined;
        const otherError = (!passwordError && !emailError) ? ['An unexpected error occurred.'] : undefined;

        if (otherError) {
            console.error("Error while trying to authenticate user with error: ", error)
        }

        return {
            errors: {
                password: passwordError,
                email: emailError,
                general: otherError
            },
            attempts,
        };
    }

    redirect('/')
}