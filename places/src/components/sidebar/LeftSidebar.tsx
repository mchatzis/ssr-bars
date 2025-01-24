import MapControlsComponent from "@/components/controls/MapControlsComponent";
import DoubleInputSearch from "@/components/dropdowns/DoubleInputSearch";
import FilterCategoryDropdown from "@/components/dropdowns/FilterCategoryDropdown";
import { getAllAreas } from "@/lib/db/models/area/area";
import { getAllPlaceTypes } from "@/lib/db/models/place-type/place-type";
import { Area, PlaceType } from "@/lib/redux/slices/appStateSlice";


export default async function LeftSidebar({ className = '' }: { className: string }) {
    const areas: Area[] = await getAllAreas();
    const placeTypes: PlaceType[] = await getAllPlaceTypes();

    return (
        <div className={`${className} relative`}>
            <DoubleInputSearch className=""
                allAreas={areas}
                allPlaceTypes={placeTypes}
            />
            <FilterCategoryDropdown className="relative top-[13vh] h-fit w-fit border border-primary/50 
                rounded-2xl overflow-clip backdrop-blur-[2px]" />
            <MapControlsComponent className="absolute bottom-0 w-fit" />
        </div>
    )
}