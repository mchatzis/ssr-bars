'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLayerMouseEvent, MapRef, ViewState, ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { STATIC_IMG_ICON_PREFIX } from '@/lib/constants';
import { useAppDispatch } from '@/lib/redux/hooks';
import { Place, PlacesApiData, setSelectedPlace, setViewState } from '@/lib/redux/slices/mapStateSlice';
import { Theme } from '@/lib/redux/slices/styleStateSlice';
import { MapLibreEvent } from 'maplibre-gl';
import { Dispatch, RefObject, SetStateAction, useCallback, useEffect } from 'react';

const PIN_IMAGE_SIDE = 35;

interface useMapEventsProps {
    mapRef: RefObject<MapRef> | null;
    viewState: Omit<ViewState, 'bearing' | 'pitch' | 'padding'>;
    theme: Theme;
    popupPlace: Place | null;
    setPopupPlace: Dispatch<SetStateAction<Place | null>>;
    mapData: PlacesApiData;
}
export default function useMapEvents({ mapRef, viewState, theme, popupPlace, setPopupPlace, mapData }: useMapEventsProps) {
    const dispatch = useAppDispatch();

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

    const isLightTheme = theme === 'light';
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
            const popupElement = document.getElementById('myPopup');
            popupElement?.classList.add('popup-slide-away');
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

    return {
        handleMapMove,
        handleMapLoad,
        handleMapMouseEnter,
        handleMapMouseLeave,
        handleMapClick,
        handleClickPopup
    }
}