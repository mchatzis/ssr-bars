import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ActiveCategory, AppState, Area, CategoryGroups, PlaceType } from '../types';

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
    cachedCategories: [],
    cachedCategories: []
}

const appStateSlice = createSlice({
    name: 'app',
    initialState: defaultAppState,
    reducers: {
        setArea(state, action: PayloadAction<Area>) {
            state.area = action.payload;
            localStorage.setItem('area', JSON.stringify(action.payload));
        },
        setPlaceType(state, action: PayloadAction<PlaceType>) {
            state.placeType = action.payload;
            localStorage.setItem('placeType', JSON.stringify(action.payload));
        },
        setAvailableCategories(state, action: PayloadAction<string[]>) {
            state.availableCategories = action.payload;
        },
        setActiveCategories(state, action: PayloadAction<ActiveCategory[]>) {
            state.activeCategories = action.payload;
        },
        addActiveCategory(state, action: PayloadAction<ActiveCategory>) {
            state.activeCategories.push(action.payload);
        },
        removeActiveCategory(state, action: PayloadAction<string>) {
            state.activeCategories = state.activeCategories.filter(
                category => category.name !== action.payload
            );
        },
        setCachedCategories(state, action: PayloadAction<string[]>) {
            state.cachedCategories = action.payload;
        },
        addCachedCategory(state, action: PayloadAction<string>) {
            state.cachedCategories.push(action.payload);
        },
        removeCachedCategory(state, action: PayloadAction<string>) {
            state.cachedCategories = state.cachedCategories.filter(
                category => category !== action.payload
            );
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
    setActiveCategories,
    addActiveCategory,
    removeActiveCategory,
    setCachedCategories,
    addCachedCategory,
    removeCachedCategory
} = appStateSlice.actions;

export default appStateSlice;
