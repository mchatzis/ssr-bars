'use client'

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function UserMenu({ className = '', username }: { className: string, username: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const handleLogout = useCallback(() => {
        fetch('/api/auth/logout', {
            method: 'POST'
        })
            .then(() => {
                router.push('/');
                router.refresh();
            })
    }, [router])


    return (
        <div
            className={`${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className={`absolute right-0 w-fit rounded-full p-2 border border-primary backdrop-blur-[2px] 
                transition-colors hover:bg-primary hover:text-background duration-300 ${className}`}>
                hi {username}
            </p>
            {isHovered &&
                <div className={`absolute top-full right-0 rounded-md
                    border border-primary bg-primary/70 p-1 text-background z-[var(--z-popup)]`}>
                    <ol className="min-w-max list-inside text-start text-base p-2">
                        <li
                            className="cursor-pointer hover:scale-110 duration-200"
                            onClick={handleLogout}>logout
                        </li>
                    </ol>
                </div>
            }
        </div>
    )
}