import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ViewState } from 'react-map-gl'

interface MapState {
    viewState: ViewState,
    lightTheme: boolean
}

const initialViewState: ViewState = {
    longitude: 16.37,
    latitude: 48.206,
    zoom: 13
} as ViewState

const initialMapState: MapState = {
    viewState: initialViewState,
    lightTheme: false
}

export const mapStateSlice = createSlice({
    name: 'map',
    initialState: initialMapState,
    reducers: {
        toggleTheme: (state) => {
            state.lightTheme = !state.lightTheme
        }
    }
})

export const { toggleTheme } = mapStateSlice.actions

export const selectViewState = (state: RootState) => state.map.viewState
export const selectLightTheme = (state: RootState) => state.map.lightTheme

export default mapStateSlice
