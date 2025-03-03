import MapControlsComponent from "@/components/controls/MapControlsComponent";
import DoubleInputSearch from "@/components/dropdowns/DoubleInputSearch";
import FilterCategoryDropdown from "@/components/dropdowns/FilterCategoryDropdown";
import { Area, PlaceType } from "@/redux/types";
import { getAllAreas } from "@/server/db/models/area/area";
import { getAllPlaceTypes } from "@/server/db/models/place-type/place-type";


export default async function LeftSidebar({ className = '' }: { className: string }) {
    const areas: Area[] = await getAllAreas();
    const placeTypes: PlaceType[] = await getAllPlaceTypes();

    return (
        <div className={`${className} relative`}>
            <DoubleInputSearch className=""
                allAreas={areas}
                allPlaceTypes={placeTypes}
            />
            <FilterCategoryDropdown className="relative top-[13vh] max-h-[65vh] h-fit w-48 overflow-clip
            border border-primary/50 rounded-2xl backdrop-blur-[2px]" />
            <MapControlsComponent className="absolute bottom-0 w-fit" />
        </div>
    )
}