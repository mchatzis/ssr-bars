import { Theme } from './styleState.types';

export function isValidTheme(theme: string): theme is Theme {
    return theme === 'light' || theme === 'dark';
} 