'use client'

import { authenticate } from '@/app/actions/auth/authenticate';
import FormInput from '@/components/auth/FormInput';
import ErrorList from '@/components/list/ErrorList';
import Link from "next/link";
import { useFormState, useFormStatus } from 'react-dom';

export type LoginFormError = {
  email?: string[];
  password?: string[];
  general?: string[];
}
export type LoginFormState = {
  errors?: LoginFormError;
  success?: boolean;
  submittedEmail?: string;
  attempts?: number;
};

export default function LoginForm() {
  const [state, action] = useFormState<LoginFormState, FormData>(authenticate, { attempts: 0 });

  return (
    <div className='flex'>
      <form action={action} className='min-w-32 max-w-52'>
        <FormInput id="email" name="email" type="email" placeholder="email" />
        <FormInput id="password" name="password" type="password" placeholder="password" />
        <div className="w-full pt-1">
          <SubmitButton></SubmitButton>
          <Link href='/auth/register' className='text-blue-700 rounded-full text-center flex items-center justify-center p-3 text-sm transform hover:scale-110 transition-transform duration-150'>sign up</Link>
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
    <button disabled={pending} type="submit" className='w-full border rounded-full p-2 bg-gray-400 hover:bg-gray-300 transition-colors duration-300'>
      Login
    </button>
  )
}