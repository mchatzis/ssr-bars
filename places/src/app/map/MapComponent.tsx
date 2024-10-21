'use client'

import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css';

import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { toggleTheme, selectViewState, selectLightTheme } from '../../lib/slices/mapStateSlice';

const darkMapStyle = "/dark-matter-style.json";
const lightMapStyle = "/positron-style.json"

export default function MapComponent() {
    const viewState = useAppSelector(selectViewState)
    const lightTheme = useAppSelector(selectLightTheme)
    const dispatch = useAppDispatch()

    return <Map
        mapLib={import('maplibre-gl')}
        initialViewState={viewState}
        mapStyle={lightTheme ? lightMapStyle : darkMapStyle}
        onClick={() => dispatch(toggleTheme())}
    />
}