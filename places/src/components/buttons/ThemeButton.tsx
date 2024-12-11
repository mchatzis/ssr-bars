'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectTheme, setTheme, toggleTheme } from "@/lib/redux/slices/styleStateSlice";
import { useEffect } from "react";

export default function ThemeButton({ className = '' }) {
    useAppSelector(selectTheme)
    const dispatch = useAppDispatch()

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
        <button className={`bg-red-400 ${className}`} onClick={() => dispatch(toggleTheme())}>Toggle theme</button>
    )
}