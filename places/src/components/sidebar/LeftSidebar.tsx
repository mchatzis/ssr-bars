'use client'

import MapControlsComponent from "@/components/controls/MapControlsComponent"
import DoubleInputSearch from "@/components/dropdowns/DoubleInputSearch"
import FilterCategoryDropdown from "@/components/dropdowns/FilterCategoryDropdown"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setAllAreas, setAllPlaceTypes } from "@/lib/redux/slices/appStateSlice"
import { useEffect } from "react"

export default function LeftSidebar({ className = '' }) {
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
        <div className={`${className} flex flex-col gap-[5vh] justify-between`}>
            <DoubleInputSearch className="" />
            <FilterCategoryDropdown className="h-[50vh] w-[10vw] border border-[var(--accent-color)] overflow-clip" />
            <MapControlsComponent className="w-fit" />
        </div>
    )
}