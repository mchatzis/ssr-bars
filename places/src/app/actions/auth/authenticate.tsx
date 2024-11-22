'use server'

import { SignupFormSchema } from "@/app/actions/auth/schema";
import { RegisterFormState } from "@/components/auth/RegisterForm";
import { Database } from "@/lib/db/Database";
import { createUser, CreateUserInput, EmailExistsError, UsernameExistsError } from "@/lib/db/models/user";
import { redirect } from "next/navigation";

export async function register(state: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    const attempts = (state?.attempts ?? 0) + 1;
    console.log(Database.getInstance())

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
        console.log("Passing data to createUser")
        const userId = await createUser(validatedData);
        console.log("Successful registration of user: ", userId)

        redirect('/auth/login')

    } catch (error) {
        let usernameError = error instanceof UsernameExistsError ? [error.message] : undefined;
        let emailError = error instanceof EmailExistsError ? [error.message] : undefined;
        let generalError = (!usernameError && !emailError) ? ['An unexpected error occurred.'] : undefined;
        console.log(error)
        return {
            errors: {
                username: usernameError,
                email: emailError,
                general: generalError
            },
            attempts,
        };
    }
}

export async function authenticate(formData: FormData) {
    console.log(formData)
    redirect('/')
}