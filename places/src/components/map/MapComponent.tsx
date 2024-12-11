'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, Source, SymbolLayer, ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { intersectionByUuid, to_geojson } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectArea, selectPlaceType } from '@/lib/redux/slices/appStateSlice';
import { selectMapActiveFeatures, selectMapData, selectViewState, setActiveFeatures, setData, setViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectTheme } from '@/lib/redux/slices/styleStateSlice';
import { MapLibreEvent } from 'maplibre-gl';
import { useCallback, useEffect } from 'react';

const darkMapStyle = "mapStyles/dark-matter-style.json";
const lightMapStyle = "mapStyles/positron-style.json";

const pinLayer: SymbolLayer = {
    id: 'modernLayer',
    type: 'symbol',
    source: 'not important',
    layout: {
        "icon-image": "pin"
    }
};

interface MapComponentProps {
    className?: string;
}
export default function MapComponent({ className = '' }: MapComponentProps) {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    const viewState = useAppSelector(selectViewState);
    const area = useAppSelector(selectArea);
    const placeType = useAppSelector(selectPlaceType);
    const mapData = useAppSelector(selectMapData);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const activeFeatures = useAppSelector(selectMapActiveFeatures);

    useEffect(() => {
        fetch(`/api/data/places?area=${area}&placeType=${placeType}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => dispatch(setData(data)));
    }, [area, placeType])

    useEffect(() => {
        const featuresByCategory = activeCategories.map((category) => mapData[category]);
        const activeFeatures = intersectionByUuid(...featuresByCategory);

        dispatch(setActiveFeatures(to_geojson(activeFeatures)));
    }, [activeCategories])

    const onMove = useCallback((evt: ViewStateChangeEvent) => {
        dispatch(setViewState(evt.viewState));
    }, []);

    const onMapLoad = useCallback((e: MapLibreEvent) => {
        const pinImage = new Image(30, 30)
        pinImage.src = 'images/pin.png';
        pinImage.onload = () => {
            e.target.addImage('pin', pinImage);
        }
    }, []);

    return (
        <div id="map-container" className={`${className}`}>
            <Map
                mapLib={import('maplibre-gl')}
                mapStyle={(theme === 'light') ? lightMapStyle : darkMapStyle}
                {...viewState}
                onMove={onMove}
                onLoad={onMapLoad}
            >
                <Source id="my-data" type="geojson" data={activeFeatures}>
                    <Layer {...pinLayer} />
                </Source>
            </Map>

        </div>
    )
}