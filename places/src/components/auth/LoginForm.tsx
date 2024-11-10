import { authenticate } from '@/app/actions/auth/authenticate';
import FormInput from '@/components/auth/FormInput';
import Link from "next/link";

export default function LoginForm() {
  return (
    <form action={authenticate} className='min-w-32 max-w-52 m-2'>
      <FormInput id="email" name="email" type="email" placeholder="email" />
      <FormInput id="password" name="password" type="password" placeholder="password" />
      <div className="w-full pt-1">
        <button type="submit" className='w-full border rounded-full p-2 bg-gray-400 hover:bg-gray-300 transition-colors duration-300'>Login</button>
        <Link href='/auth/register' className='text-blue-700 rounded-full text-center flex items-center justify-center p-3 text-sm transform hover:scale-110 transition-transform duration-150'>sign up</Link>
      </div>
    </form>
  );
}