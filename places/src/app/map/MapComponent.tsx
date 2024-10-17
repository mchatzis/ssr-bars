'use client'

import Map from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css';

const mapStyle = "/dark-matter-style.json";
const initialViewState = {
    longitude: 16.37,
    latitude: 48.206,
    zoom: 13
}

export default function MapComponent() {
    return <Map
        mapLib={import('maplibre-gl')}
        initialViewState={{...initialViewState}}
        mapStyle={mapStyle}
    />
}