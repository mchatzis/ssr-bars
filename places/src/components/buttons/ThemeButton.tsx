'use client'

import { STATIC_IMG_ICON_PREFIX } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectTheme, setTheme, toggleTheme } from "@/lib/redux/slices/styleStateSlice";
import { useEffect } from "react";

export default function ThemeButton({ className = '', hasMounted }: { className: string, hasMounted: boolean }) {
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
        <div className={`w-[36px] h-[36px] bg-primary/90 m-1 flex items-center justify-center ${className}`}>
            {hasMounted ?
                <img
                    id="fullscreen-button"
                    className='cursor-pointer animate-[fadeInHalf_1s_ease-out_none] clickable-element'
                    onClick={() => dispatch(toggleTheme())}
                    src={STATIC_IMG_ICON_PREFIX + '/' + (theme === 'light' ? 'night-mode.png' : 'light-mode.png')}
                    width={30}
                    height={30}
                /> : null
            }

        </div>
    );
}
