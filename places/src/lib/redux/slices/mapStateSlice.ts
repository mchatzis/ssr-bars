import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ViewState } from 'react-map-gl'

interface MapState {
    viewState: ViewState
}

const initialViewState: ViewState = {
    longitude: 16.37,
    latitude: 48.206,
    zoom: 13
} as ViewState

const initialMapState: MapState = {
    viewState: initialViewState
}

export const mapStateSlice = createSlice({
    name: 'map',
    initialState: initialMapState,
    reducers: {
    }
})

export const selectViewState = (state: RootState) => state.map.viewState

export default mapStateSlice
