import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FeatureCollection } from 'geojson';
import type { RootState } from '../store';

export type Place = {
    uuid: string;
    properties: {
        longitude: number,
        latitude: number,
        title: string,
        description: string
    };
}

export function isPlace(obj: any): obj is Place {
    return (
        typeof obj === 'object' && obj !== null &&
        typeof obj.uuid === 'string' &&
        typeof obj.properties === 'object' &&
        obj.properties !== null &&
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
interface MapState {
    viewState: ViewState;
    data: Record<string, Place[]>;
    activeFeatures: FeatureCollection;
}

const initialViewState: ViewState = {
    longitude: 16.37,
    latitude: 48.206,
    zoom: 13
} as ViewState
const initialData = {};
const initialActiveFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: []
}

const initialMapState: MapState = {
    viewState: initialViewState,
    data: initialData,
    activeFeatures: initialActiveFeatures
}

const mapStateSlice = createSlice({
    name: 'map',
    initialState: initialMapState,
    reducers: {
        setViewState: (state, action: PayloadAction<ViewState>) => {
            state.viewState = action.payload;
        },
        setData: (state, action: PayloadAction<Record<string, Place[]>>) => {
            state.data = action.payload;
        },
        setActiveFeatures: (state, action: PayloadAction<FeatureCollection>) => {
            state.activeFeatures = action.payload;
        }
    }
})

export const selectViewState = (state: RootState) => state.map.viewState

export const { setData, setActiveFeatures, setViewState } = mapStateSlice.actions;
export const selectMapData = (state: RootState) => state.map.data;
export const selectMapActiveFeatures = (state: RootState) => state.map.activeFeatures;

export default mapStateSlice
