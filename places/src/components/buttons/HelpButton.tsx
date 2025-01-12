'use client'

import { useState } from "react";

export default function HelpButton({ className = '' }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <p className={`absolute right-0 rounded-full w-fit px-3 py-1 mt-1 border border-accent
                    transition-colors hover:bg-accent hover:text-bgColor duration-300 backdrop-blur-[2px]`}
            >?</p>
            {isHovered &&
                <div className="relative top-10 right-12 h-fit w-fit border rounded-xl p-1 bg-accent text-bgColor z-[var(--z-popup)]">
                    <ol className="list-decimal list-inside text-start text-base">
                        <li>Multiple active categories are supported</li>
                        <li>Scroll to change image when on top of it</li>
                        <li>Rotate map with right click</li>
                    </ol>
                </div>
            }
        </div>
    )
}