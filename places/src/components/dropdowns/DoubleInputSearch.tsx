'use client'

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Area, PlaceType, selectAllAreas, selectAllPlaceTypes, selectArea, selectPlaceType, setArea, setPlaceType } from "@/lib/redux/slices/appStateSlice";
import { setViewState } from "@/lib/redux/slices/mapStateSlice";
import { useCallback, useRef, useState } from "react";
import { useClickAway } from "react-use";
import InputWithOptionsDropdown from "./InputWithOptionsDropdown";


export default function DoubleInputSearch({ className = '' }) {
    const enclosingDivRef = useRef<HTMLDivElement>(null);
    const allAreas: Area[] = useAppSelector(selectAllAreas);
    const allAreaNames: string[] = allAreas.map(area => area.name);
    const allPlaceTypes: PlaceType[] = useAppSelector(selectAllPlaceTypes);
    const allPlaceTypeNames: string[] = allPlaceTypes.map(placeType => placeType.name);

    const [areaFieldValue, setAreaFieldValue] = useState('');
    const [placeTypeFieldValue, setPlaceTypeFieldValue] = useState('');


    const currentArea: Area = useAppSelector(selectArea);
    const currentPlaceType: PlaceType = useAppSelector(selectPlaceType);
    const dispatch = useAppDispatch();

    useClickAway(enclosingDivRef, () => {
        setAreaFieldValue('');
        setPlaceTypeFieldValue('');
    })

    const handleSearchClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const cleanedAreaFieldValue = areaFieldValue.trim();
        const cleanedPlaceTypeFieldValue = placeTypeFieldValue.trim();

        const chosenArea = allAreas.find((area) => area.name === cleanedAreaFieldValue);
        if (!chosenArea) {
            alert(`${cleanedAreaFieldValue} is not a valid option`)
            return
        }
        const chosenPlaceType = allPlaceTypes.find((placeType) => placeType.name === cleanedPlaceTypeFieldValue);
        if (!chosenPlaceType) {
            alert(`${cleanedPlaceTypeFieldValue} is not a valid option`)
            return
        }

        dispatch(setArea(chosenArea));
        dispatch(setViewState({ longitude: chosenArea.longitude, latitude: chosenArea.latitude, zoom: chosenArea.initialZoom }));
        setAreaFieldValue('');
        dispatch(setPlaceType(chosenPlaceType));
        setPlaceTypeFieldValue('');
    }, [areaFieldValue, placeTypeFieldValue, allAreas, allPlaceTypes])

    return (
        <div ref={enclosingDivRef} className={`flex ${className}`}>
            <InputWithOptionsDropdown
                className=""
                allOptions={allAreaNames}
                currentChoice={currentArea.name}
                value={areaFieldValue}
                setValue={setAreaFieldValue}
            />
            <InputWithOptionsDropdown
                className=""
                allOptions={allPlaceTypeNames}
                currentChoice={currentPlaceType.name}
                value={placeTypeFieldValue}
                setValue={setPlaceTypeFieldValue}
            />
            <button className="ml-1" onClick={handleSearchClick}>Search</button>
        </div>
    )
}