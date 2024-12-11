import { AreaEnum, PlaceTypeEnum } from '@/lib/db/enums';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface AppState {
    area: AreaEnum,
    placeType: PlaceTypeEnum,
    availableCategories: string[];
    activeCategories: string[];
}

const initialAppState: AppState = {
    area: AreaEnum.VIENNA,
    placeType: PlaceTypeEnum.BAR,
    availableCategories: [],
    activeCategories: []
}

const appStateSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setArea: (state, action: PayloadAction<AreaEnum>) => {
            state.area = action.payload;
        },
        setPlaceType: (state, action: PayloadAction<PlaceTypeEnum>) => {
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

export const selectArea = (state: RootState) => state.app.area;
export const selectPlaceType = (state: RootState) => state.app.placeType;
export const selectAppAvailableCategories = (state: RootState) => state.app.availableCategories;
export const selectAppActiveCategories = (state: RootState) => state.app.activeCategories;

export const {
    setArea,
    setPlaceType,
    setActiveCategories,
    setAvailableCategories
} = appStateSlice.actions;

export default appStateSlice;