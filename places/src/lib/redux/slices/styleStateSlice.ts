import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type Theme = 'light' | 'dark';
const defaultTheme = 'light';
function isValidTheme(theme: string): theme is Theme {
    return theme === 'light' || theme === 'dark';
}

interface StyleState {
    theme: Theme
}

function getInitialTheme(): Theme {
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme && isValidTheme(savedTheme)) {
        return savedTheme;
    }
    else {
        console.warn("None or invalid theme found in sessionStorage, defaulting to: ", defaultTheme)
        return defaultTheme;
    }
}

const getInitialState = (): StyleState => {
    if (typeof window === 'undefined') {
        return {
            theme: defaultTheme
        };
    }
    return {
        theme: getInitialTheme()
    }
}

const styleStateSlice = createSlice({
    name: 'style',
    initialState: getInitialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', state.theme);
            sessionStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            if (isValidTheme(action.payload)) {
                state.theme = action.payload;
                document.documentElement.setAttribute('data-theme', state.theme);
                sessionStorage.setItem('theme', state.theme);
            } else {
                console.warn("Invalid theme passed to setTheme action:", action.payload);
            }
        }
    }
})

export const { toggleTheme, setTheme } = styleStateSlice.actions;
export const selectTheme = (state: RootState) => state.style.theme

export default styleStateSlice
