'use client'

import { register } from '@/app/actions/auth/authenticate';
import FormInput from '@/components/auth/FormInput';
import Link from "next/link";
import { useFormState, useFormStatus } from 'react-dom';

export type RegisterFormError = {
  username?: string[];
  email?: string[];
  password?: string[];
  general?: string[];
}
export type RegisterFormState = {
  errors?: RegisterFormError;
  success?: boolean;
  submittedEmail?: string;
  attempts?: number;
};

export default function RegisterForm() {
  const [state, action] = useFormState<RegisterFormState, FormData>(register, { attempts: 0 })

  return (
    <form action={action} className='min-w-32 max-w-52 m-2'>
      <FormInput id="username" name="username" placeholder="username" />
      {state?.errors?.username && <p>{state.errors.username}</p>}

      <FormInput id="email" name="email" type="email" placeholder="email" />
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <FormInput id="password" name="password" type="password" placeholder="password" />
      {state?.errors?.password && (
        <div>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      {state?.errors?.general && <p>{state.errors.general}</p>}

      <div className="w-full pt-1">
        <SubmitButton />
        <Link href='/auth/login' className='text-blue-700 rounded-full text-center flex items-center justify-center p-3 text-sm transform hover:scale-110 transition-transform duration-150'>login</Link>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit" className='w-full border rounded-full p-2 bg-gray-400 hover:bg-gray-300 transition-colors duration-300'>
      Sign Up
    </button>
  )
}