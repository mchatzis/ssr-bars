'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectTheme, setTheme, toggleTheme } from "@/lib/redux/slices/styleStateSlice";
import { useEffect } from "react";

export default function ThemeButton({ className = '' }) {
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();

    useEffect(() => {
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

    return (
        <div className={`${className} w-[30px] h-[30px] bg-[var(--accent-color)] m-1`}>
            <img
                id="fullscreen-button"
                className='relative cursor-pointer'
                onClick={() => dispatch(toggleTheme())}
                src={theme === 'light' ? 'images/night-mode.png' : 'images/light-mode.png'}
                width={30}
                height={30}
            />
        </div>
    )
}