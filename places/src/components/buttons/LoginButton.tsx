import Link from "next/link";

export default function LoginButton({ className='' }){
   
    return(
            <Link href='/auth/login' className={className}>login</Link>
    )
}