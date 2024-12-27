'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, MapLayerMouseEvent, Popup, Source, SymbolLayer, ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { addImagesToPlaces, to_geojson } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectArea, selectCachedCategories, selectPlaceType, setActiveCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { Place, selectMapActivePlaces, selectMapData, selectViewState, setActivePlaces, setMapData, setViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectTheme } from '@/lib/redux/slices/styleStateSlice';
import { MapLibreEvent } from 'maplibre-gl';
import { useCallback, useEffect, useState } from 'react';


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
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    const viewState = useAppSelector(selectViewState);
    const area = useAppSelector(selectArea);
    const placeType = useAppSelector(selectPlaceType);
    const mapData = useAppSelector(selectMapData);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const activePlaces = useAppSelector(selectMapActivePlaces);
    const cachedCategories = useAppSelector(selectCachedCategories);

    const [popupPlace, setPopupPlace] = useState<Place | null>(null);

    useEffect(() => {
        fetch(`/api/data/places?area=${area.name}&placeType=${placeType.name}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                dispatch(setActiveCategories([]));
                dispatch(setCachedCategories([]));
                dispatch(setMapData(data));
            }
            );
    }, [area, placeType])

    useEffect(() => {
        if (activeCategories.length === 0) {
            dispatch(setActivePlaces([]));
            return
        }
        const placesByCategory = activeCategories.map((category) => mapData[category]);

        const uuidsIntersection = placesByCategory
            .map(Object.keys)
            .reduce((acc, keys) => acc.filter(key => keys.includes(key)));
        const activePlaces = uuidsIntersection.map((uuid) => placesByCategory[0][uuid])

        dispatch(setActivePlaces(activePlaces));
    }, [activeCategories, mapData])

    useEffect(() => {
        if (cachedCategories.length === 0) { return }
        const lastAddedCategory = cachedCategories[cachedCategories.length - 1];

        //TODO: Why not use activePlaces somehow instead and maybe cache already fetched places?
        const addedPlaces = Object.values(mapData[lastAddedCategory])
        addImagesToPlaces(addedPlaces, 'small')
            .then((updatedPlaces) => {
                const updatedRecords: Record<string, Place> = {}
                updatedPlaces.forEach((place) => {
                    updatedRecords[place.properties.uuid] = place
                })
                dispatch(setMapData({
                    ...mapData,
                    [lastAddedCategory]: updatedRecords
                }))
            })
    }, [cachedCategories])

    const handleMapMove = useCallback((evt: ViewStateChangeEvent) => {
        dispatch(setViewState(evt.viewState));
    }, []);

    const handleMapLoad = useCallback((e: MapLibreEvent) => {
        const map = e.target;

        const pinImage = new Image(30, 30)
        pinImage.src = 'images/pin.png';
        pinImage.onload = () => {
            map.addImage('pin', pinImage);
        }
    }, []);

    const handleMouseEnterFeature = useCallback((e: MapLayerMouseEvent) => {
        if (!e.features) {
            console.error("onMouseEnter triggered with undefined features");
            return
        }

        const feature = e.features[0];
        const hoveredPlace = mapData[feature.properties.category][feature.properties.uuid];
        setPopupPlace(hoveredPlace);
    }, [mapData])

    return (
        <div id="map-container" className={`${className}`}>
            <Map
                mapLib={import('maplibre-gl')}
                mapStyle={(theme === 'light') ? lightMapStyle : darkMapStyle}
                {...viewState}
                interactiveLayerIds={[pinLayer.id]}
                onMove={handleMapMove}
                onLoad={handleMapLoad}
                onMouseEnter={handleMouseEnterFeature}
                onMouseLeave={() => setPopupPlace(null)}
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
                        className=""
                        anchor='bottom'
                        offset={7}
                    >
                        <div className='w-64 h-52'>
                            <div className="flex flex-col overflow-clip rounded-xl">
                                <img
                                    src={popupPlace.imagesUrls.small[0]}
                                    className="w-64 h-32"
                                />
                                <div className='w-64 h-16 bg-[var(--background-color)]'>
                                    <p className="text-red-600 text-left pl-3">Other stuff</p>
                                </div>
                            </div>
                            {/* The following should be a transparent buffer that breaches the gap 
                            between the popup and its anchor for mouseEnter and mouseLeave to work */}
                            <div className='w-64 h-5'></div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    )
}