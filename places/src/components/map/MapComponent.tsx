'use client'

import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css';

import { useAppSelector, useAppDispatch } from '../../lib/redux/hooks';
import { toggleTheme, selectViewState, selectLightTheme } from '../../lib/redux/slices/mapStateSlice';

const darkMapStyle = "/dark-matter-style.json";
const lightMapStyle = "/positron-style.json"

export default function MapComponent({ className='' }) {
    const viewState = useAppSelector(selectViewState)
    const lightTheme = useAppSelector(selectLightTheme)
    const dispatch = useAppDispatch()

    return (
        <div id="map-container" className={className}>
            <Map
                mapLib={import('maplibre-gl')}
                initialViewState={viewState}
                mapStyle={lightTheme ? lightMapStyle : darkMapStyle}
                onClick={() => dispatch(toggleTheme())}
            />
        </div>
    )
}