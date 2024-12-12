'use client'

import { useAppDispatch } from "@/lib/redux/hooks";
import { setAllAreas, setAllPlaceTypes } from "@/lib/redux/slices/appStateSlice";
import { useEffect } from "react";
import DoubleInputSearch from "./dropdowns/DoubleInputSearch";
import FilterCategoryDropdown from "./dropdowns/FilterCategoryDropdown";


export default function DataControlsComponent({ className = '' }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        fetch(`/api/data/areas`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => dispatch(setAllAreas(data)));
        fetch(`/api/data/placeTypes`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => dispatch(setAllPlaceTypes(data)));
    }, []);

    return (
        <div className={`${className}`}>
            <DoubleInputSearch className="" />
            <FilterCategoryDropdown className="absolute top-[13vh] left-[1vw] h-[80vh] w-[15vw] border border-red-600" />
        </div>
    )
}