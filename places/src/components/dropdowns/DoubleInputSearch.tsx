'use client'

import { AreaEnum, PlaceTypeEnum } from "@/lib/db/enums";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectArea, selectPlaceType, setArea, setPlaceType } from "@/lib/redux/slices/appStateSlice";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import InputWithOptionsDropdown from "./InputWithOptionsDropdown";

function isValidOption<P extends string>(value: string, options: P[]): value is P {
    return options.includes(value as P);
}

export default function DoubleInputSearch({ className = '' }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [areaValue, setAreaValue] = useState('');
    const allAreas = Object.values(AreaEnum);
    const [placeTypeValue, setPlaceTypeValue] = useState('');
    const allPlaceTypes = Object.values(PlaceTypeEnum);

    const currentArea = useAppSelector(selectArea);
    const currentPlaceType = useAppSelector(selectPlaceType);
    const dispatch = useAppDispatch();

    useClickAway(divRef, () => {
        setAreaValue('');
        setPlaceTypeValue('');
    })

    function handleSearchClick(e: React.MouseEvent<HTMLButtonElement>) {
        const cleanAreaValue = areaValue.trim();
        const cleanPlaceTypeValue = placeTypeValue.trim();

        if (!isValidOption<AreaEnum>(cleanAreaValue, allAreas)) {
            alert(`${cleanAreaValue} is not a valid option`)
            return
        }
        if (!isValidOption<PlaceTypeEnum>(cleanPlaceTypeValue, allPlaceTypes)) {
            alert(`${cleanPlaceTypeValue} is not a valid option`)
            return
        }

        dispatch(setArea(cleanAreaValue));
        setAreaValue('');
        dispatch(setPlaceType(cleanPlaceTypeValue));
        setPlaceTypeValue('');
    }

    return (
        <div ref={divRef} className={`flex ${className}`}>
            <InputWithOptionsDropdown
                className=""
                allOptions={Object.values(AreaEnum)}
                currentChoice={currentArea}
                value={areaValue}
                setValue={setAreaValue}
            />
            <InputWithOptionsDropdown
                className=""
                allOptions={Object.values(PlaceTypeEnum)}
                currentChoice={currentPlaceType}
                value={placeTypeValue}
                setValue={setPlaceTypeValue}
            />
            <button className="ml-1" onClick={handleSearchClick}>Search</button>
        </div>
    )
}