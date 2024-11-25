'use server'

import { SignupFormSchema } from "@/app/actions/auth/schema";
import { RegisterFormState } from "@/components/auth/RegisterForm";
import { createUser, CreateUserInput, EmailExistsError, UsernameExistsError } from "@/lib/db/models/user";
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
        let usernameError = error instanceof UsernameExistsError ? [error.message] : undefined;
        let emailError = error instanceof EmailExistsError ? [error.message] : undefined;
        let generalError = (!usernameError && !emailError) ? ['An unexpected error occurred.'] : undefined;
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





export async function authenticate(formData: FormData) {
    console.log(formData)
    redirect('/')
}