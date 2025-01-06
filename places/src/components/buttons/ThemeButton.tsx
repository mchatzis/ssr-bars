'use client'

import { STATIC_IMG_ICON_PREFIX } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectTheme, setTheme, toggleTheme } from "@/lib/redux/slices/styleStateSlice";
import { useEffect, useState } from "react";

export default function ThemeButton({ className = '' }) {
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);

        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e: MediaQueryListEvent) => {
            const newTheme = e.matches ? 'dark' : 'light';
            dispatch(setTheme(newTheme));
        };

        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [dispatch]);

    if (!hasMounted) {
        // Avoid hydration mismatch
        return null;
    }

    return (
        <div className={`${className} w-[36px] h-[36px] bg-[var(--accent-color)] m-1 flex items-center justify-center`}>
            <img
                id="fullscreen-button"
                className='cursor-pointer clickable-element'
                onClick={() => dispatch(toggleTheme())}
                src={STATIC_IMG_ICON_PREFIX + '/' + (theme === 'light' ? 'night-mode.png' : 'light-mode.png')}
                width={30}
                height={30}
            />
        </div>
    );
}
