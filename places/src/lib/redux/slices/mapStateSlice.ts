import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

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
        category: string,
        longitude: number,
        latitude: number,
        title: string,
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
        typeof obj.properties.longitude === 'number' &&
        typeof obj.properties.latitude === 'number' &&
        typeof obj.properties.title === 'string' &&
        typeof obj.properties.description === 'string'
    );
}

interface ViewState {
    longitude: number,
    latitude: number,
    zoom: number
}
type ApiData = {
    [category: string]: {
        [uuid: string]: Place
    }
}
interface MapState {
    viewState: ViewState;
    data: ApiData;
    activePlaces: Place[];
    selectedPlace: Place | null;
}

const initialViewState: ViewState = {
    longitude: 16.37,
    latitude: 48.206,
    zoom: 13.3
} as ViewState
const initialData = {};
const initialActivePlaces: Place[] = []

const initialMapState: MapState = {
    viewState: initialViewState,
    data: initialData,
    activePlaces: initialActivePlaces,
    selectedPlace: null
}

const mapStateSlice = createSlice({
    name: 'map',
    initialState: initialMapState,
    reducers: {
        setViewState: (state, action: PayloadAction<ViewState>) => {
            state.viewState = action.payload;
        },
        setMapData: (state, action: PayloadAction<ApiData>) => {
            state.data = action.payload;
        },
        setActivePlaces: (state, action: PayloadAction<Place[]>) => {
            state.activePlaces = action.payload;
        },
        setSelectedPlace: (state, action: PayloadAction<Place | null>) => {
            state.selectedPlace = action.payload;
        }
    }
})

export const { setMapData, setActivePlaces, setViewState, setSelectedPlace } = mapStateSlice.actions;
export const selectMapData = (state: RootState) => state.map.data;
export const selectMapActivePlaces = (state: RootState) => state.map.activePlaces;
export const selectViewState = (state: RootState) => state.map.viewState
export const selectSelectedPlace = (state: RootState) => state.map.selectedPlace;

export default mapStateSlice
