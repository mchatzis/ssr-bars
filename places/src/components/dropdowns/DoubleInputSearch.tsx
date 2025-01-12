'use client'

import { MapRefContext } from "@/lib/context/mapContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Area, PlaceType, selectArea, selectPlaceType, setArea, setPlaceType } from "@/lib/redux/slices/appStateSlice";
import { useCallback, useContext, useRef, useState } from "react";
import useClickAway from "react-use/lib/useClickAway";
import InputWithOptionsDropdown from "./InputWithOptionsDropdown";


export default function DoubleInputSearch({ className = '', allAreas, allPlaceTypes }: { className: string, allAreas: Area[], allPlaceTypes: PlaceType[] }) {
    const enclosingDivRef = useRef<HTMLDivElement>(null);
    const mapRef = useContext(MapRefContext);

    const allAreaNames: string[] = allAreas.map(area => area.name);
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

    const handleSearchClick = useCallback(() => {
        const cleanedAreaFieldValue = areaFieldValue.trim();
        const cleanedPlaceTypeFieldValue = placeTypeFieldValue.trim();

        let chosenArea: Area | undefined;
        if (cleanedAreaFieldValue === '') {
            chosenArea = currentArea;
        } else {
            chosenArea = allAreas.find((area) => area.name === cleanedAreaFieldValue);
            if (!chosenArea) {
                alert(`${cleanedAreaFieldValue} is not a valid option`)
                return
            }
        }

        let chosenPlaceType: PlaceType | undefined;
        if (cleanedPlaceTypeFieldValue === '') {
            chosenPlaceType = currentPlaceType;
        } else {
            chosenPlaceType = allPlaceTypes.find((placeType) => placeType.name === cleanedPlaceTypeFieldValue);
            if (!chosenPlaceType) {
                alert(`${cleanedPlaceTypeFieldValue} is not a valid option`)
                return
            }
        }

        dispatch(setArea(chosenArea));
        setAreaFieldValue('');
        dispatch(setPlaceType(chosenPlaceType));
        setPlaceTypeFieldValue('');

        let flyTime = 4000;
        if (chosenArea.name === currentArea.name) {
            flyTime = 2000;
        }
        mapRef?.current?.flyTo({
            center: [chosenArea.longitude, chosenArea.latitude],
            zoom: chosenArea.initialZoom,
            duration: flyTime,
            easing: (t: number) => t * (2 - t)
        })
    }, [areaFieldValue, placeTypeFieldValue, allAreas, allPlaceTypes])

    return (
        <div ref={enclosingDivRef} className={`${className} flex w-fit`}>
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
            <button className="ml-1 text-primary" onClick={handleSearchClick}>Search</button>
        </div>
    )
}