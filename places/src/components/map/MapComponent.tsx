'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map from 'react-map-gl/maplibre';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectLightTheme } from '@/lib/redux/slices/styleStateSlice';

const darkMapStyle = "/dark-matter-style.json";
const lightMapStyle = "/positron-style.json"

export default function MapComponent({ className = '' }) {
    const viewState = useAppSelector(selectViewState)
    const theme = useAppSelector(selectLightTheme)

    return (
        <div id="map-container" className={className}>
            <Map
                mapLib={import('maplibre-gl')}
                initialViewState={viewState}
                mapStyle={(theme === 'light') ? lightMapStyle : darkMapStyle}
            />
        </div>
    )
}