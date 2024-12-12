import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type Area = {
    name: string,
    longitude: number,
    latitude: number,
    initialZoom: number
}

export type PlaceType = {
    name: string
}
interface AppState {
    allAreas: Area[],
    area: Area,
    allPlaceTypes: PlaceType[],
    placeType: PlaceType,
    availableCategories: string[];
    activeCategories: string[];
}

const initialAppState: AppState = {
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
    activeCategories: []
}

const appStateSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setAllAreas: (state, action: PayloadAction<Area[]>) => {
            state.allAreas = action.payload;
        },
        setArea: (state, action: PayloadAction<Area>) => {
            state.area = action.payload;
        },
        setAllPlaceTypes: (state, action: PayloadAction<PlaceType[]>) => {
            state.allPlaceTypes = action.payload;
        },
        setPlaceType: (state, action: PayloadAction<PlaceType>) => {
            state.placeType = action.payload;
        },
        setAvailableCategories: (state, action: PayloadAction<string[]>) => {
            state.availableCategories = action.payload;
        },
        setActiveCategories: (state, action: PayloadAction<string[]>) => {
            state.activeCategories = action.payload;
        },
    }
})

export const selectAllAreas = (state: RootState) => state.app.allAreas;
export const selectArea = (state: RootState) => state.app.area;
export const selectAllPlaceTypes = (state: RootState) => state.app.allPlaceTypes;
export const selectPlaceType = (state: RootState) => state.app.placeType;
export const selectAppAvailableCategories = (state: RootState) => state.app.availableCategories;
export const selectAppActiveCategories = (state: RootState) => state.app.activeCategories;

export const {
    setAllAreas,
    setArea,
    setAllPlaceTypes,
    setPlaceType,
    setActiveCategories,
    setAvailableCategories
} = appStateSlice.actions;

export default appStateSlice;