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

interface AppState {
    allAreas: Area[],
    area: Area,
    allPlaceTypes: PlaceType[],
    placeType: PlaceType,
    availableCategories: string[];
    activeCategories: string[];
    cachedCategories: string[];
}

export const defaultAppState: AppState = {
    allAreas: [],
    area: {
        name: "Vienna",
        longitude: 16.37,
        latitude: 48.206,
        initialZoom: 13
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

const appStateSlice = createSlice({
    name: 'app',
    initialState: getInitialAppState,
    reducers: {
        setAllAreas: (state, action: PayloadAction<Area[]>) => {
            state.allAreas = action.payload;
        },
        setArea: (state, action: PayloadAction<Area>) => {
            state.area = action.payload;
            sessionStorage.setItem('area', JSON.stringify(action.payload));
        },
        setAllPlaceTypes: (state, action: PayloadAction<PlaceType[]>) => {
            state.allPlaceTypes = action.payload;
        },
        setPlaceType: (state, action: PayloadAction<PlaceType>) => {
            state.placeType = action.payload;
            sessionStorage.setItem('placeType', JSON.stringify(action.payload));
        },
        setAvailableCategories: (state, action: PayloadAction<string[]>) => {
            state.availableCategories = action.payload;
        },
        setActiveCategories: (state, action: PayloadAction<string[]>) => {
            state.activeCategories = action.payload;
        },
        setCachedCategories: (state, action: PayloadAction<string[]>) => {
            state.cachedCategories = action.payload;
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
    setCachedCategories
} = appStateSlice.actions;

export default appStateSlice;