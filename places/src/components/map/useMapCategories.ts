'use client'

import 'maplibre-gl/dist/maplibre-gl.css';

import { addImagesToPlaces, getCommonValues } from '@/lib/map/helpers';
import { useAppDispatch } from '@/redux/hooks';
import { setActivePlaces, setSelectedPlace, updateMapData } from '@/redux/slices/mapStateSlice';
import { ActiveCategory, Place, PlacesApiData, } from '@/redux/types';
import { useEffect } from 'react';

interface useMapCategoriesProps {
    activeCategories: ActiveCategory[];
    cachedCategories: string[];
    selectedPlace: Place | null;
    mapData: PlacesApiData;
}
export default function useMapCategories({ activeCategories, cachedCategories, selectedPlace, mapData }: useMapCategoriesProps) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (activeCategories.length === 0) {
            dispatch(setSelectedPlace(null));
            dispatch(setActivePlaces([]));
            return
        }

        const unionCategories = activeCategories.filter((category) => category.operation === 'or');
        const unionedPlacesWithUuids = unionCategories.reduce((acc, category) =>
            Object.assign(acc, mapData[category.name])
            , {} as { [uuid: string]: Place });

        const intersectionCategories = activeCategories.filter((category) => category.operation === 'and');
        const placesByCategory = intersectionCategories.map((category) => mapData[category.name]);
        const intersectedPlacesWithUuids = placesByCategory.reduce((acc, placesWithUuids, index) => {
            if (index === 0) return placesWithUuids;

            const newAcc: { [uuid: string]: Place } = {};
            Object.keys(placesWithUuids).forEach((uuid) => {
                if (uuid in acc) {
                    newAcc[uuid] = acc[uuid];
                }
            })
            return newAcc
        }, {});

        let newActivePlaces: Place[];
        const emptyUnion = Object.keys(unionedPlacesWithUuids).length === 0;
        const emptyIntersection = Object.keys(intersectedPlacesWithUuids).length === 0
        if (emptyUnion) {
            if (emptyIntersection) {
                newActivePlaces = [];
            } else {
                newActivePlaces = Object.values(intersectedPlacesWithUuids);
            }
        } else {
            if (emptyIntersection) {
                newActivePlaces = Object.values(unionedPlacesWithUuids);
            } else {
                newActivePlaces = getCommonValues(unionedPlacesWithUuids, intersectedPlacesWithUuids)
            }
        }

        if (!newActivePlaces.some((place) => place.properties.uuid === selectedPlace?.properties.uuid)) {
            dispatch(setSelectedPlace(null));
        }
        dispatch(setActivePlaces(newActivePlaces));
    }, [activeCategories])

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
                dispatch(updateMapData({ category: lastAddedCategory, records: updatedRecords }))

                return updatedPlacesMedium
            })
            .then((updatedPlacesMedium) => {
                addImagesToPlaces(updatedPlacesMedium, 'large')
                    .then((updatedPlacesLarge) => {
                        const updatedRecords: Record<string, Place> = {}
                        updatedPlacesLarge.forEach((place) => {
                            updatedRecords[place.properties.uuid] = place
                        })
                        dispatch(updateMapData({ category: lastAddedCategory, records: updatedRecords }))
                    })
            })
    }, [cachedCategories])
}