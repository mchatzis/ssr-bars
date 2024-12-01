'use client'

import { register } from '@/app/actions/auth/authenticate';
import FormInput from '@/components/auth/FormInput';
import Link from "next/link";
import { useFormState, useFormStatus } from 'react-dom';

export type RegisterFormErrors = {
  username?: string[];
  email?: string[];
  password?: string[];
  general?: string[];
}
export type RegisterFormState = {
  errors?: RegisterFormErrors;
  success?: boolean;
  submittedEmail?: string;
  attempts?: number;
};

export default function RegisterForm() {
  const [state, action] = useFormState<RegisterFormState, FormData>(register, { attempts: 0 })

  return (
    <div className="flex absolute">
      <form action={action} className='min-w-32 max-w-52'>
        <FormInput id="username" name="username" placeholder="username" />
        <FormInput id="email" name="email" type="email" placeholder="email" />
        <FormInput id="password" name="password" type="password" placeholder="password" />

        <div className="w-full pt-1">
          <SubmitButton />
          <Link href='/auth/login' className='text-blue-700 rounded-full text-center flex items-center justify-center p-3 text-sm transform hover:scale-110 transition-transform duration-150'>login</Link>
        </div>
      </form>
      <div className='relative right-0 ml-4 w-[20vw]'>
        {state.errors ?
          <ErrorList
            errors={state.errors}
            className="">
          </ErrorList>
          : null}
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit" className='w-full border rounded-full p-2 bg-gray-400 hover:bg-gray-300 transition-colors duration-300 mt-1'>
      Sign Up
    </button>
  )
}

function ErrorList({ errors, className }: { errors: RegisterFormErrors, className: string }) {
  const errorList: JSX.Element[] = [];
  Object.entries(errors).forEach(([, value]) => {
    value.forEach((error) => (
      errorList.push(<li key={error}>- {error}</li>)
    ));
  })

  return (
    <div className={className}>
      <ul>
        {errorList}
      </ul>
    </div>
  )
}