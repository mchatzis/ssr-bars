'use client'

import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, MapLayerMouseEvent, Popup, Source, SymbolLayer, ViewStateChangeEvent } from 'react-map-gl/maplibre';

import { intersectionByUuid, to_geojson } from '@/lib/map/helpers';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAppActiveCategories, selectArea, selectCachedCategories, selectPlaceType } from '@/lib/redux/slices/appStateSlice';
import { selectMapActivePlaces, selectMapData, selectViewState, setActivePlaces, setData, setViewState } from '@/lib/redux/slices/mapStateSlice';
import { selectTheme } from '@/lib/redux/slices/styleStateSlice';
import { MapLibreEvent } from 'maplibre-gl';
import { getImageProps } from 'next/image';
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

interface PopUpInfo {
    longitude: number;
    latitude: number;
    name: string;
    icon: string;
    imgSrc: string;
}

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

    const [popupInfo, setPopupInfo] = useState<PopUpInfo | null>(null);
    const [url, setUrl] = useState('');

    useEffect(() => {
        fetch(`/api/data/places?area=${area.name}&placeType=${placeType.name}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => dispatch(setData(data)));
    }, [area, placeType])

    useEffect(() => {
        const placesByCategory = activeCategories.map((category) => mapData[category]);
        const activePlaces = intersectionByUuid(...placesByCategory);

        dispatch(setActivePlaces(activePlaces));
    }, [activeCategories, mapData])

    useEffect(() => {
        // const placesByCategory = activeCategories.map((category) => mapData[category]);
        console.log(cachedCategories);
    }, [cachedCategories])

    const onMove = useCallback((evt: ViewStateChangeEvent) => {
        dispatch(setViewState(evt.viewState));
    }, []);

    const onMapLoad = useCallback((e: MapLibreEvent) => {
        const map = e.target;

        const pinImage = new Image(30, 30)
        pinImage.src = 'images/pin.png';
        pinImage.onload = () => {
            map.addImage('pin', pinImage);
        }
    }, []);

    const onMouseEnterFeature = useCallback((e: MapLayerMouseEvent) => {
        if (!e.features) {
            console.error("onMouseEnter triggered with no features");
            return
        }

        const enteredFeature = e.features[0];
        setPopupInfo({
            longitude: e.lngLat.lng,
            latitude: e.lngLat.lat,
            name: enteredFeature.properties.name,
            icon: enteredFeature.properties.icon,
            imgSrc: 'https://assets.vercel.com/image/upload/v1538361091/repositories/next-js/next-js-bg.png'
        });
    }, [])

    const onMouseLeaveFeature = useCallback((e: MapLayerMouseEvent) => {
        // setPopupInfo(null);
    }, [])

    const { props } = getImageProps({
        src: 'https://assets.vercel.com/image/upload/v1538361091/repositories/next-js/next-js-bg.png',
        alt: 'popupInfo.name',
        width: 100,
        height: 100,
        loading: 'eager',
    })

    useEffect(() => {
        console.log(props.src)
        fetch(props.src)
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                const objectUrl = URL.createObjectURL(blob);
                console.log('Created object URL:', objectUrl);

                setUrl(objectUrl);
            });
    }, []);

    return (
        <div id="map-container" className={`${className}`}>
            <Map
                mapLib={import('maplibre-gl')}
                mapStyle={(theme === 'light') ? lightMapStyle : darkMapStyle}
                {...viewState}
                interactiveLayerIds={[pinLayer.id]}
                onMove={onMove}
                onLoad={onMapLoad}
                onMouseEnter={onMouseEnterFeature}
                onMouseLeave={onMouseLeaveFeature}
            >
                <Source id="my-data" type="geojson" data={to_geojson(activePlaces)}>
                    <Layer {...pinLayer} />
                </Source>
                {popupInfo &&
                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}
                        anchor='bottom'
                    >
                        <img src={url} width={props.width} height={props.height}></img>
                    </Popup>
                }
            </Map>
        </div>
    )
}