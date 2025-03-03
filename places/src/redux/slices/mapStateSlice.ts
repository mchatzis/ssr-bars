import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { MapState, Place, PlacesApiData, Size, Updater, ViewState } from '../types';
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


const initialData = {};
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
}

const mapStateSlice = createSlice({
    name: 'map',
    initialState: defaultMapState,
    reducers: {
        setViewState: (state, action: PayloadAction<Updater<ViewState>>) => {
            state.viewState = typeof action.payload === 'function'
                ? (action.payload as (prev: ViewState) => ViewState)(state.viewState)
                : action.payload;
        },
        setMapData: (state, action: PayloadAction<Updater<PlacesApiData>>) => {
            state.data = typeof action.payload === 'function'
                ? (action.payload as (prev: PlacesApiData) => PlacesApiData)(state.data)
                : action.payload;
        },
        setActivePlaces: (state, action: PayloadAction<Updater<Place[]>>) => {
            state.activePlaces = typeof action.payload === 'function'
                ? (action.payload as (prev: Place[]) => Place[])(state.activePlaces)
                : action.payload;
        },
        setSelectedPlace: (state, action: PayloadAction<Updater<Place | null>>) => {
            state.selectedPlace = typeof action.payload === 'function'
                ? (action.payload as (prev: Place | null) => Place | null)(state.selectedPlace)
                : action.payload;
        }
    }
});

export const { setMapData, setActivePlaces, setViewState, setSelectedPlace } = mapStateSlice.actions;
export const selectMapData = (state: RootState) => state.map.data;
export const selectMapActivePlaces = (state: RootState) => state.map.activePlaces;
export const selectViewState = (state: RootState) => state.map.viewState;
export const selectSelectedPlace = (state: RootState) => state.map.selectedPlace;

export default mapStateSlice;
