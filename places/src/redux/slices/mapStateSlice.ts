import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { MapState, Place, PlacesApiData, Size, ViewState } from '../types';
import { defaultAppState } from './appStateSlice';

export const ImageSizeOptions: Record<Size, { width: number, height: number }> = {
    small: {
        width: 100,
        height: 100
    },
    medium: {
        width: 256,
        height: 256
    },
    large: {
        width: 1024,
        height: 1024
    }
} as const;

const initialData: PlacesApiData = {};
const initialActivePlaces: Place[] = [];

const defaultMapState: MapState = {
    viewState: {
        longitude: defaultAppState.area.longitude,
        latitude: defaultAppState.area.latitude,
        zoom: defaultAppState.area.initialZoom
    },
    data: initialData,
    activePlaces: initialActivePlaces,
    selectedPlace: null
};

const mapStateSlice = createSlice({
    name: 'map',
    initialState: defaultMapState,
    reducers: {
        setViewState(state, action: PayloadAction<ViewState>) {
            state.viewState = action.payload;
        },

        setMapData(state, action: PayloadAction<PlacesApiData>) {
            state.data = action.payload;
        },
        updateMapData(state, action: PayloadAction<{ category: string; records: Record<string, Place> }>) {
            const { category, records } = action.payload;
            state.data[category] = records;
        },
        setActivePlaces(state, action: PayloadAction<Place[]>) {
            state.activePlaces = action.payload;
        },

        setSelectedPlace(state, action: PayloadAction<Place | null>) {
            state.selectedPlace = action.payload;
        },

    }
});

export const {
    setMapData,
    updateMapData,
    setActivePlaces,
    setViewState,
    setSelectedPlace
} = mapStateSlice.actions;
export const selectMapData = (state: RootState) => state.map.data;
export const selectMapActivePlaces = (state: RootState) => state.map.activePlaces;
export const selectViewState = (state: RootState) => state.map.viewState;
export const selectSelectedPlace = (state: RootState) => state.map.selectedPlace;

export default mapStateSlice;
