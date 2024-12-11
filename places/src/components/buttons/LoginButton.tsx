import Link from "next/link";

export default function LoginButton({ className = '' }) {

    return (
        <Link href='/auth/login' className={`border border-black rounded-full p-2 bg-blue-700 ${className}`}>login</Link>
    )
}