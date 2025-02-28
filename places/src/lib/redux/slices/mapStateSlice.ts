import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { defaultAppState, getInitialAppState } from './appStateSlice';

type Size = 'small' | 'medium' | 'large';
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

export type Place = {
    properties: {
        uuid: string,
        name: string,
        longitude: number,
        latitude: number,
        category: string,
        categories: string[],
        area: string,
        description: string,
        primaryImage: string,
        images: string[]
    };
    imagesUrls: {
        small: string[],
        medium: string[],
        large: string[],
    }
}

export function isPlace(obj: any): obj is Place {
    return (
        typeof obj === 'object' && obj !== null &&
        typeof obj.properties === 'object' &&
        obj.properties !== null &&
        typeof obj.properties.uuid === 'string' &&
        typeof obj.properties.category === 'string' &&
        typeof obj.properties.longitude === 'number' &&
        typeof obj.properties.latitude === 'number' &&
        typeof obj.properties.name === 'string' &&
        typeof obj.properties.area === 'string' &&
        typeof obj.properties.description === 'string' &&
        typeof obj.properties.primaryImage === 'string' &&
        Array.isArray(obj.properties.images) &&
        obj.properties.images.every((image: any) => typeof image === 'string') &&
        typeof obj.imagesUrls === 'object' &&
        obj.imagesUrls !== null &&
        Array.isArray(obj.imagesUrls.small) &&
        obj.imagesUrls.small.every((url: any) => typeof url === 'string') &&
        Array.isArray(obj.imagesUrls.medium) &&
        obj.imagesUrls.medium.every((url: any) => typeof url === 'string') &&
        Array.isArray(obj.imagesUrls.large) &&
        obj.imagesUrls.large.every((url: any) => typeof url === 'string')
    );
}

interface ViewState {
    longitude: number,
    latitude: number,
    zoom: number
}
export function isViewState(obj: any): obj is ViewState {
    return (
        typeof obj === "object" && obj !== null &&
        typeof obj.longitude === "number" &&
        typeof obj.latitude === "number" &&
        typeof obj.zoom === "number"
    );
}

export type PlacesApiData = {
    [category: string]: {
        [uuid: string]: Place
    }
}

interface MapState {
    viewState: ViewState;
    data: PlacesApiData;
    activePlaces: Place[];
    selectedPlace: Place | null;
}

// Vienna coordinates
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

const getInitialMapState = (): MapState => {
    if (typeof window === 'undefined') {
        return defaultMapState;
    }

    const initialAppState = getInitialAppState();

    return {
        ...defaultMapState,
        viewState: {
            longitude: initialAppState.area.longitude,
            latitude: initialAppState.area.latitude,
            zoom: initialAppState.area.initialZoom
        }
    }
}

type Updater<T> = T | ((prev: T) => T);

const mapStateSlice = createSlice({
    name: 'map',
    initialState: getInitialMapState,
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
