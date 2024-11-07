'use client'

import { register } from '@/app/actions/auth/authenticate'
import Link from "next/link";
import FormInput from '@/components/auth/FormInput';
 

export default function RegisterForm() {
  return (
    <form action={register} className='min-w-32 max-w-52 m-2'>
      <FormInput id="username" name="username" placeholder="username" />
      <FormInput id="email" name="email" type="email" placeholder="email" />
      <FormInput id="password" name="password" type="password" placeholder="password" />
      <div className="w-full pt-1">
        <button type="submit" className='w-full border rounded-full p-2 bg-gray-400 hover:bg-gray-300'>Sign Up</button>
        <Link href='/auth/login' className='text-blue-700 rounded-full text-center flex items-center justify-center p-3 text-sm'>login</Link>
      </div>
    </form>
  );
}