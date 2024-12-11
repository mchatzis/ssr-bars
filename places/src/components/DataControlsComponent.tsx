'use client'

import DoubleInputSearch from "./dropdowns/DoubleInputSearch";
import FilterCategoryDropdown from "./dropdowns/FilterCategoryDropdown";


export default function DataControlsComponent({ className = '' }) {

    return (
        <div className={`${className}`}>
            <DoubleInputSearch className="" />
            <FilterCategoryDropdown className="absolute top-[13vh] left-[1vw] h-[80vh] w-[15vw] border border-red-600" />
        </div>
    )
}