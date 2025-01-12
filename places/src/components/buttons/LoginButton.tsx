import Link from "next/link";

export default function LoginButton({ className = '' }) {

    return (
        <Link
            href='/auth/login'
            className={`${className} rounded-full p-2 border border-primary
                transform transition-transform hover:scale-110 duration-300 backdrop-blur-[2px]`}
        >login</Link>
    )
}