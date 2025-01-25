'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, MapLayerMouseEvent, Popup, Source, SymbolLayer, ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { STATIC_IMG_ICON_PREFIX } from '@/lib/constants';
import { MapRefContext } from '@/lib/context/mapContext';
import { addImagesToPlaces, organizePlacesIntoCategories, to_geojson } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectArea, selectCachedCategories, selectFilterWithUnion, selectPlaceType, setActiveCategories, setAvailableCategories, setCachedCategories } from '@/lib/redux/slices/appStateSlice';
import { Place, selectMapActivePlaces, selectMapData, selectSelectedPlace, selectViewState, setActivePlaces, setMapData, setSelectedPlace, setViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectTheme } from '@/lib/redux/slices/styleStateSlice';
import { MapLibreEvent } from 'maplibre-gl';
import { useCallback, useContext, useEffect, useState } from 'react';
import ImageCarousel from '../display/ImageCarousel';


const PIN_IMAGE_SIDE = 35;
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
    const mapRef = useContext(MapRefContext);

    const viewState = useAppSelector(selectViewState);
    const area = useAppSelector(selectArea);
    const placeType = useAppSelector(selectPlaceType);
    const mapData = useAppSelector(selectMapData);
    const activeCategories = useAppSelector(selectAppActiveCategories);
    const cachedCategories = useAppSelector(selectCachedCategories);
    const activePlaces = useAppSelector(selectMapActivePlaces);
    const selectedPlace = useAppSelector(selectSelectedPlace);
    const filterWithUnion = useAppSelector(selectFilterWithUnion);
    const theme = useAppSelector(selectTheme);

    const [popupPlace, setPopupPlace] = useState<Place | null>(null);

    const isLightTheme = theme === 'light';
    const shadowClass = isLightTheme ? 'shadow-light' : 'shadow-dark';

    useEffect(() => {
        dispatch(setActivePlaces([]));
        dispatch(setActiveCategories([]));
        dispatch(setCachedCategories([]));

        fetch(`/api/data/places?area=${area.name}&placeType=${placeType.name}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => organizePlacesIntoCategories(data))
            .then(placesByCategory => {
                dispatch(setMapData(placesByCategory))
                dispatch(setAvailableCategories(Object.keys(placesByCategory)))
            })
            .catch((error) => {
                console.log(error);
                dispatch(setMapData({}));
            })
    }, [area, placeType])

    useEffect(() => {
        if (activeCategories.length === 0) {
            dispatch(setSelectedPlace(null));
            dispatch(setActivePlaces([]));
            return
        }
        let activePlaces: Place[] = [];
        if (filterWithUnion) {
            activeCategories.forEach((category) => activePlaces.push(...Object.values(mapData[category])))
        } else {
            const placesByCategory = activeCategories.map((category) => mapData[category]);
            const uuidsIntersection = placesByCategory
                .map(Object.keys)
                .reduce((acc, keys) => acc.filter(key => keys.includes(key)));
            activePlaces = uuidsIntersection.map((uuid) => placesByCategory[0][uuid])
        }

        if (!activePlaces.some((place) => place.properties.uuid === selectedPlace?.properties.uuid)) {
            dispatch(setSelectedPlace(null));
        }

        dispatch(setActivePlaces(activePlaces));
    }, [activeCategories, filterWithUnion])

    useEffect(() => {
        if (cachedCategories.length === 0) { return }
        const lastAddedCategory = cachedCategories[cachedCategories.length - 1];

        //TODO: Why not use activePlaces instead and maybe cache already fetched places?
        //TODO: Refactor (DRY issues)
        const addedPlaces = Object.values(mapData[lastAddedCategory])
        addImagesToPlaces(addedPlaces, 'medium')
            .then((updatedPlacesMedium) => {
                const updatedRecords: Record<string, Place> = {}
                updatedPlacesMedium.forEach((place) => {
                    updatedRecords[place.properties.uuid] = place
                })
                dispatch(setMapData((prevData) => ({
                    ...prevData,
                    [lastAddedCategory]: updatedRecords
                })))

                return updatedPlacesMedium
            })
            .then((updatedPlacesMedium) => {
                addImagesToPlaces(updatedPlacesMedium, 'large')
                    .then((updatedPlacesLarge) => {
                        const updatedRecords: Record<string, Place> = {}
                        updatedPlacesLarge.forEach((place) => {
                            updatedRecords[place.properties.uuid] = place
                        })
                        dispatch(setMapData((prevData) => ({
                            ...prevData,
                            [lastAddedCategory]: updatedRecords
                        })))
                    })
            })
    }, [cachedCategories])

    useEffect(() => {
        if (!mapRef || !mapRef.current) { return };
        const map = mapRef.current;

        const pinImage = new Image(PIN_IMAGE_SIDE, PIN_IMAGE_SIDE);
        pinImage.src = STATIC_IMG_ICON_PREFIX + '/' + (isLightTheme ? 'pin-light.png' : 'pin-dark.png');
        pinImage.onload = () => {
            if (map.hasImage('pin')) {
                map.removeImage('pin');
            }
            map.addImage('pin', pinImage);
        };
    }, [theme]);

    const handleMapMove = useCallback((evt: ViewStateChangeEvent) => {
        dispatch(setSelectedPlace(null));
        dispatch(setViewState(evt.viewState));
    }, []);

    const handleMapLoad = useCallback((e: MapLibreEvent) => {
        const map = e.target;

        const pinImage = new Image(PIN_IMAGE_SIDE, PIN_IMAGE_SIDE)
        pinImage.src = STATIC_IMG_ICON_PREFIX + '/' + (isLightTheme ? 'pin-light.png' : 'pin-dark.png');
        pinImage.onload = () => map.addImage('pin', pinImage);
    }, [theme]);

    const handleMapMouseEnter = useCallback((e: MapLayerMouseEvent) => {
        if (!e.features || e.features?.length === 0) {
            console.error("onMouseEnter triggered with undefined features");
            return
        }
        e.target.getCanvas().style.cursor = 'pointer';

        const feature = e.features[0];
        const hoveredPlace = mapData[feature.properties.category][feature.properties.uuid];
        setPopupPlace(hoveredPlace);
    }, [mapData])

    const handleMapMouseLeave = useCallback((e: MapLayerMouseEvent) => {
        e.target.getCanvas().style.cursor = '';

        const box = document.getElementById('myPopup');
        box?.classList.add('fade-out');


        setPopupPlace(null);
    }, [])

    const setSelectedPlaceWithAnimation = useCallback((place: Place) => {
        mapRef?.current?.flyTo({
            center: [place.properties.longitude, place.properties.latitude],
            zoom: viewState.zoom,
            duration: 500,
            easing: (t: number) => t * (2 - t)
        })

        setTimeout(() => {
            dispatch(setSelectedPlace(place));
            setPopupPlace(null);
        }, 550)
        setTimeout(() => {
            const box = document.getElementById('myPopup');
            box?.classList.add('popup-active');
        }, 400);
    }, [viewState]);

    const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
        if (!e.features || e.features?.length === 0) {
            console.error("onClick triggered with undefined features");
            return
        }

        const feature = e.features[0];
        const clickedPlace = mapData[feature.properties.category][feature.properties.uuid];

        setSelectedPlaceWithAnimation(clickedPlace);
    }, [mapData, setSelectedPlaceWithAnimation])

    const handleClickPopup = useCallback(() => {
        if (!popupPlace) {
            console.error("PopupPlace was null when popup clicked");
            return
        }

        setSelectedPlaceWithAnimation(popupPlace);
    }, [popupPlace, setSelectedPlaceWithAnimation]);

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
                    animation: 'fadeIn 1.2s ease-in forwards'
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
                        <div id="myPopup"
                            className={`w-64 h-48 fade-in-fast-full`}
                            onClick={handleClickPopup}
                        >
                            <div className={`flex flex-col overflow-clip rounded-xl ${shadowClass}`}>
                                <ImageCarousel
                                    images={mapData[popupPlace.properties.category][popupPlace.properties.uuid].imagesUrls.medium}
                                    className={`relative w-64 h-32 ${!isLightTheme && 'opacity-90'}`}
                                    hasArrows={false}
                                />
                                <div className='w-64 h-16 bg-bgColor'>
                                    <p className="text-left text-lg text-accent px-3 m-0 cursor-pointer">{popupPlace.properties.name}</p>
                                    <p className='text-left text-base px-3 py-1'>☆☆☆☆☆ {'(0)'}</p>
                                </div>
                            </div>
                            {/* The following should be a transparent buffer that breaches the gap 
                            between the popup and its anchor for mouseEnter and mouseLeave to work */}
                            <div className='relative left-1/4 w-32 h-5'></div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    )
}