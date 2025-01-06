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
        <div className={`${className} flex flex-col gap-[5vh] justify-between`}>
            <DoubleInputSearch className=""
                allAreas={areas}
                allPlaceTypes={placeTypes}
            />
            <FilterCategoryDropdown className="h-[50vh] w-[10vw] border border-[var(--accent-color)] overflow-clip" />
            <MapControlsComponent className="w-fit" />
        </div>
    )
}