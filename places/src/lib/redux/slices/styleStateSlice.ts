import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type Theme = 'light' | 'dark';
const defaultTheme: Theme = 'light';

function isValidTheme(theme: string): theme is Theme {
    return theme === 'light' || theme === 'dark';
}

function getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && isValidTheme(savedTheme)) {
        return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark';
}

interface StyleState {
    lightTheme: Theme
}

const getInitialState = (): StyleState => {
    if (typeof window === 'undefined') {
        return {
            lightTheme: 'light'
        };
    }

    const theme = getInitialTheme();
    document.body.className = theme + '-theme';
    return {
        lightTheme: theme
    }
}

export const styleStateSlice = createSlice({
    name: 'style',
    initialState: getInitialState,
    reducers: {
        toggleTheme: (state) => {
            state.lightTheme = state.lightTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.lightTheme);
        }
    }
})

export const { toggleTheme } = styleStateSlice.actions

export const selectLightTheme = (state: RootState) => state.style.lightTheme

export default styleStateSlice
