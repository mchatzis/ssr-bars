import Link from "next/link";

export default function LoginButton({ className = '' }) {

    return (
        <Link
            href='/auth/login'
            className={`${className} rounded-full p-2 border border-[var(--accent-color)]
                transform transition-transform hover:scale-125 duration-300`}
        >login</Link>
    )
}