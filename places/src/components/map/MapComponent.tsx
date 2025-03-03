'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, Popup, Source, SymbolLayer } from 'react-map-gl/maplibre';

import { MapRefContext } from '@/lib/context/mapContext';
import { to_geojson } from '@/lib/map/helpers';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectArea, selectCachedCategories, selectPlaceType } from '@/lib/redux/slices/appStateSlice';
import { selectMapActivePlaces, selectMapData, selectSelectedPlace, selectViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectTheme } from '@/lib/redux/slices/styleStateSlice';
import { Place } from '@/lib/redux/types';
import { useContext, useState } from 'react';
import MapPopupContent from './MapPopupContent';
import useMapCategories from './useMapCategories';
import useMapData from './useMapData';
import useMapEvents from './useMapEvents';


const darkMapStyle = "mapStyles/dark-matter-style.json";
const lightMapStyle = "mapStyles/positron-style.json";

const pinLayer: SymbolLayer = {
    id: 'modernLayer',
    type: 'symbol',
    source: 'not important',
    layout: {
        "icon-image": "pin"
    },
};

interface MapComponentProps {
    className?: string;
}
export default function MapComponent({ className = '' }: MapComponentProps) {
    const mapRef = useContext(MapRefContext);

    const viewState = useAppSelector(selectViewState);
    const area = useAppSelector(selectArea);
    const placeType = useAppSelector(selectPlaceType);
    const mapData = useAppSelector(selectMapData);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const cachedCategories = useAppSelector(selectCachedCategories);
    const activePlaces = useAppSelector(selectMapActivePlaces);
    const selectedPlace = useAppSelector(selectSelectedPlace);
    const theme = useAppSelector(selectTheme);
    const isLightTheme = theme === 'light';

    const [popupPlace, setPopupPlace] = useState<Place | null>(null);

    useMapData({ area, placeType });
    useMapCategories({ activeCategories, cachedCategories, selectedPlace, mapData });

    const {
        handleMapMove,
        handleMapLoad,
        handleMapMouseEnter,
        handleMapMouseLeave,
        handleMapClick,
        handleClickPopup
    } = useMapEvents({ mapRef, viewState, theme, popupPlace, setPopupPlace, mapData });

    return (
        <div id="map-container" className={`${className}`}>
            <Map
                ref={mapRef}
                mapLib={import('maplibre-gl')}
                mapStyle={isLightTheme ? lightMapStyle : darkMapStyle}
                {...viewState}
                interactiveLayerIds={[pinLayer.id]}
                onMove={handleMapMove}
                onLoad={handleMapLoad}
                onMouseEnter={handleMapMouseEnter}
                onMouseLeave={handleMapMouseLeave}
                onClick={handleMapClick}
                style={{
                    opacity: 0,
                    animation: 'fadeIn 2s ease-in forwards'
                }}
            >
                <Source id="my-data" type="geojson" data={to_geojson(activePlaces)}>
                    <Layer {...pinLayer} />
                </Source>
                {popupPlace && (
                    <Popup
                        longitude={popupPlace.properties.longitude}
                        latitude={popupPlace.properties.latitude}
                        closeButton={false}
                        maxWidth="none"
                        anchor='bottom'
                        offset={30}
                        closeOnClick={false}
                    >
                        <MapPopupContent
                            handleClick={handleClickPopup}
                            theme={theme}
                            popupPlace={popupPlace}
                            mapData={mapData}
                        />
                    </Popup>
                )}
            </Map>
        </div>
    )
}