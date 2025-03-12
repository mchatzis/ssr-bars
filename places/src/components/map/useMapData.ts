'use client'

import 'maplibre-gl/dist/maplibre-gl.css';

import { organizePlacesIntoCategories } from '@/lib/map/helpers';
import { useAppDispatch } from '@/redux/hooks';
import { setActiveCategories, setAvailableCategories, setCachedCategories, setCategoryGroups } from '@/redux/slices/appStateSlice';
import { setActivePlaces, setMapData } from '@/redux/slices/mapStateSlice';
import { Area, PlaceType } from '@/redux/types';
import { useEffect } from 'react';

interface useMapDataProps {
    area: Area;
    placeType: PlaceType;
}
export default function useMapData({ area, placeType }: useMapDataProps) {
    const dispatch = useAppDispatch();

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
            });

        fetch(`/api/data/category/groups?area=${area.name}&placeType=${placeType.name}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => dispatch(setCategoryGroups(data)))
            .catch((error) => console.log(error))
    }, [area, placeType])
}