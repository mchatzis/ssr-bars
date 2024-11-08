'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectLightTheme, toggleTheme } from "@/lib/redux/slices/styleStateSlice";
import { useEffect } from "react";

export default function ThemeButton({ className = '' }) {
    const lightTheme = useAppSelector(selectLightTheme)
    const dispatch = useAppDispatch()

    useEffect(() => {
        document.body.className = lightTheme + '-theme';
    }, [lightTheme]);

    return (
        <button className={className} onClick={() => dispatch(toggleTheme())}>Toggle theme</button>
    )
}