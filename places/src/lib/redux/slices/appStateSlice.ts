import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type Area = {
    name: string,
    longitude: number,
    latitude: number,
    initialZoom: number
}
export function isArea(obj: any): obj is Area {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.name === "string" &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        typeof obj.initialZoom === "number"
    );
}

export type PlaceType = {
    name: string
}
export function isPlaceType(obj: any): obj is PlaceType {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.name === "string"
    );
}

export const Operations = {
    intersection: 'and',
    union: 'or'
} as const;
export type FilterOperation = typeof Operations[keyof typeof Operations];
export type ActiveCategory = {
    name: string,
    operation: FilterOperation
};

interface AppState {
    allAreas: Area[],
    area: Area,
    allPlaceTypes: PlaceType[],
    placeType: PlaceType,
    availableCategories: string[];
    activeCategories: ActiveCategory[];
    cachedCategories: string[];
}

export const defaultAppState: AppState = {
    allAreas: [],
    area: {
        name: "Vienna",
        longitude: 16.37,
        latitude: 48.206,
        initialZoom: 13.2
    },
    allPlaceTypes: [],
    placeType: {
        name: "bar"
    },
    availableCategories: [],
    activeCategories: [],
    cachedCategories: []
}

export const getInitialAppState = (): AppState => {
    if (typeof window === 'undefined') {
        return defaultAppState;
    }

    const storedAreaString = sessionStorage.getItem('area');
    const storedPlaceTypeString = sessionStorage.getItem('placeType');

    if (!storedAreaString || !storedPlaceTypeString) {
        return defaultAppState;
    }

    const storedArea = JSON.parse(storedAreaString);
    const storedPlaceType = JSON.parse(storedPlaceTypeString);

    if (!isArea(storedArea) || !isPlaceType(storedPlaceType)) {
        return defaultAppState;
    }

    return {
        ...defaultAppState,
        area: storedArea,
        placeType: storedPlaceType
    }
}

type Updater<T> = T | ((prev: T) => T);

const appStateSlice = createSlice({
    name: 'app',
    initialState: getInitialAppState,
    reducers: {
        setAllAreas: (state, action: PayloadAction<Updater<Area[]>>) => {
            if (typeof action.payload === 'function') {
                state.allAreas = (action.payload as (prev: Area[]) => Area[])(state.allAreas);
            } else {
                state.allAreas = action.payload;
            }
        },
        setArea: (state, action: PayloadAction<Updater<Area>>) => {
            const newArea = typeof action.payload === 'function'
                ? (action.payload as (prev: Area) => Area)(state.area)
                : action.payload;
            state.area = newArea;
            sessionStorage.setItem('area', JSON.stringify(newArea));
        },
        setAllPlaceTypes: (state, action: PayloadAction<Updater<PlaceType[]>>) => {
            if (typeof action.payload === 'function') {
                state.allPlaceTypes = (action.payload as (prev: PlaceType[]) => PlaceType[])(state.allPlaceTypes);
            } else {
                state.allPlaceTypes = action.payload;
            }
        },
        setPlaceType: (state, action: PayloadAction<Updater<PlaceType>>) => {
            const newPlaceType = typeof action.payload === 'function'
                ? (action.payload as (prev: PlaceType) => PlaceType)(state.placeType)
                : action.payload;
            state.placeType = newPlaceType;
            sessionStorage.setItem('placeType', JSON.stringify(newPlaceType));
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

export const selectAllAreas = (state: RootState) => state.app.allAreas;
export const selectArea = (state: RootState) => state.app.area;
export const selectAllPlaceTypes = (state: RootState) => state.app.allPlaceTypes;
export const selectPlaceType = (state: RootState) => state.app.placeType;
export const selectAppAvailableCategories = (state: RootState) => state.app.availableCategories;
export const selectAppActiveCategories = (state: RootState) => state.app.activeCategories;
export const selectCachedCategories = (state: RootState) => state.app.cachedCategories;

export const {
    setAllAreas,
    setArea,
    setAllPlaceTypes,
    setPlaceType,
    setActiveCategories,
    setAvailableCategories,
    setCachedCategories,
} = appStateSlice.actions;

export default appStateSlice;
