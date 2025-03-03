import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ActiveCategory, AppState, Area, PlaceType, Updater } from '../types';

export const defaultAppState: AppState = {
    area: {
        name: "Vienna",
        longitude: 16.37,
        latitude: 48.206,
        initialZoom: 13.2
    },
    placeType: {
        name: "bar"
    },
    availableCategories: [],
    activeCategories: [],
    cachedCategories: []
}

const appStateSlice = createSlice({
    name: 'app',
    initialState: defaultAppState,
    reducers: {
        setArea: (state, action: PayloadAction<Updater<Area>>) => {
            const newArea = typeof action.payload === 'function'
                ? (action.payload as (prev: Area) => Area)(state.area)
                : action.payload;
            state.area = newArea;
            localStorage.setItem('area', JSON.stringify(newArea));
        },
        setPlaceType: (state, action: PayloadAction<Updater<PlaceType>>) => {
            const newPlaceType = typeof action.payload === 'function'
                ? (action.payload as (prev: PlaceType) => PlaceType)(state.placeType)
                : action.payload;
            state.placeType = newPlaceType;
            localStorage.setItem('placeType', JSON.stringify(newPlaceType));
        },
        setAvailableCategories: (state, action: PayloadAction<Updater<string[]>>) => {
            if (typeof action.payload === 'function') {
                state.availableCategories = (action.payload as (prev: string[]) => string[])(state.availableCategories);
            } else {
                state.availableCategories = action.payload;
            }
        },
        setActiveCategories: (state, action: PayloadAction<Updater<ActiveCategory[]>>) => {
            if (typeof action.payload === 'function') {
                state.activeCategories = (action.payload as (prev: ActiveCategory[]) => ActiveCategory[])(state.activeCategories);
            } else {
                state.activeCategories = action.payload;
            }
        },
        setCachedCategories: (state, action: PayloadAction<Updater<string[]>>) => {
            if (typeof action.payload === 'function') {
                state.cachedCategories = (action.payload as (prev: string[]) => string[])(state.cachedCategories);
            } else {
                state.cachedCategories = action.payload;
            }
        }
    }
})

export const selectArea = (state: RootState) => state.app.area;
export const selectPlaceType = (state: RootState) => state.app.placeType;
export const selectAppAvailableCategories = (state: RootState) => state.app.availableCategories;
export const selectAppActiveCategories = (state: RootState) => state.app.activeCategories;
export const selectCachedCategories = (state: RootState) => state.app.cachedCategories;

export const {
    setArea,
    setPlaceType,
    setActiveCategories,
    setAvailableCategories,
    setCachedCategories,
} = appStateSlice.actions;

export default appStateSlice;
