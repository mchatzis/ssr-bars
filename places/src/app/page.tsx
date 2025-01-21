import PlaceDisplay from "@/components/display/PlaceDisplay";
import MapComponent from "@/components/map/MapComponent";
import LeftSidebar from "@/components/sidebar/LeftSidebar";
import UtilitiesBar from "@/components/sidebar/UtilitiesBar";

export default async function Page() {
    return (
        <div className="fixed inset-0">
            <MapComponent className="absolute inset-0" />
            <UtilitiesBar className="absolute top-4 right-4" />
            <LeftSidebar className="absolute top-[2vh] left-[2vw] h-[95vh] w-0 overflow-visible" />
            <PlaceDisplay className="" />
        </div>
    )
}