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
            <p className={`absolute right-0 rounded-full w-fit px-3 py-1 mt-1 border border-primary
                    transition-colors hover:bg-primary hover:text-background duration-300 backdrop-blur-[2px]`}
            >?</p>
            {isHovered &&
                <div className={`absolute top-full right-0 translate-x-[-20px]
                    border rounded-xl p-1 bg-primary text-background z-[var(--z-popup)]`}>
                    <ol className="min-w-max list-decimal list-inside text-start text-base p-2">
                        <li>Multiple active categories are supported</li>
                        <li>Scroll to change image when on top of it</li>
                        <li>Click on AND-OR to switch</li>
                        <li>Rotate map with right click</li>
                    </ol>
                </div>
            }
        </div>
    )
}